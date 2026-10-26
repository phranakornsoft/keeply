import { createHash, randomBytes } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import mysql, { type PoolConnection, type ResultSetHeader, type RowDataPacket } from "mysql2/promise";

export type Profile = { name: string; email: string; phone: string; birthday: string; bio: string };
export type LineUser = { sub: string; name: string; picture: string | null; email: string | null };
export type Role = "owner" | "editor" | "viewer";
export type InviteRole = Exclude<Role, "owner">;
export type Goals = { name: string; annualBudget: number; monthlyBudget: number; usageYears: number };

export const SESSION_TTL_DAYS = 30;
export const INVITE_TTL_DAYS = 7;

const config = {
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const pool = mysql.createPool({
  ...config,
  // Return DATE columns as "YYYY-MM-DD" instead of Date objects shifted by the server's time zone.
  dateStrings: true,
});

// Only hashes of session and invite tokens are stored, so reading the tables doesn't hand out live credentials.
const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

// DATETIME columns hold UTC (written with UTC_TIMESTAMP()) and come back as "YYYY-MM-DD HH:MM:SS".
const isoTime = (value: string) => `${value.replace(" ", "T")}Z`;

export const isDuplicateKey = (error: unknown) => (error as { code?: string }).code === "ER_DUP_ENTRY";

async function transaction<T>(work: (connection: PoolConnection) => Promise<T>) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await work(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Apply the files in server/migrations that haven't run yet, in name order. MySQL can't roll back DDL, so a file that
// fails part-way is retried in full on the next start and should be safe to re-run (CREATE TABLE IF NOT EXISTS).
export async function migrate() {
  const folder = new URL("../migrations/", import.meta.url);
  const connection = await mysql.createConnection({ ...config, multipleStatements: true });
  try {
    await connection.query(
      "CREATE TABLE IF NOT EXISTS schema_migrations (name VARCHAR(255) CHARACTER SET ascii NOT NULL PRIMARY KEY, applied_at DATETIME NOT NULL)",
    );
    const [rows] = await connection.query<RowDataPacket[]>("SELECT name FROM schema_migrations");
    const applied = new Set(rows.map((row) => row.name as string));
    for (const name of (await readdir(folder)).filter((file) => file.endsWith(".sql")).sort()) {
      if (applied.has(name)) continue;
      await connection.query(await readFile(new URL(name, folder), "utf8"));
      await connection.execute("INSERT INTO schema_migrations (name, applied_at) VALUES (?, UTC_TIMESTAMP())", [name]);
      console.log(`Applied migration ${name}`);
    }
  } finally {
    await connection.end();
  }
}

export async function ping() {
  await pool.query("SELECT 1");
}

// Create the Keeply user on first LINE sign-in, or refresh the LINE details on later ones.
// The profile is only written on creation, so later sign-ins keep the user's edits.
export async function upsertLineUser(line: LineUser, profile: Profile) {
  await pool.execute(
    `INSERT INTO users (line_sub, line_name, line_picture, line_email, name, email, created_at, last_sign_in_at)
     VALUES (?, ?, ?, ?, ?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP())
     ON DUPLICATE KEY UPDATE line_name = ?, line_picture = ?, line_email = ?, last_sign_in_at = UTC_TIMESTAMP()`,
    [line.sub, line.name, line.picture, line.email, profile.name, profile.email, line.name, line.picture, line.email],
  );
  const [rows] = await pool.execute<RowDataPacket[]>("SELECT id FROM users WHERE line_sub = ?", [line.sub]);
  return rows[0].id as number;
}

export async function readAccount(userId: number) {
  const [rows] = await pool.execute<RowDataPacket[]>(
    "SELECT line_name, line_picture, name, email, phone, birthday, bio FROM users WHERE id = ?",
    [userId],
  );
  const user = rows[0];
  return {
    line: { name: user.line_name as string, picture: user.line_picture as string | null },
    profile: { name: user.name, email: user.email, phone: user.phone, birthday: user.birthday ?? "", bio: user.bio } as Profile,
    household: await readHousehold(userId),
  };
}

export async function saveProfile(userId: number, profile: Profile) {
  await pool.execute("UPDATE users SET name = ?, email = ?, phone = ?, birthday = ?, bio = ? WHERE id = ?", [
    profile.name,
    profile.email,
    profile.phone,
    profile.birthday || null,
    profile.bio,
    userId,
  ]);
}

// Returns the raw token for the cookie; expired sessions are swept here so the table doesn't grow.
export async function createSession(userId: number) {
  const token = randomBytes(32).toString("hex");
  await pool.execute("DELETE FROM sessions WHERE expires_at <= UTC_TIMESTAMP()");
  await pool.execute(
    "INSERT INTO sessions (token_hash, user_id, created_at, expires_at) VALUES (?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP() + INTERVAL ? DAY)",
    [hashToken(token), userId, SESSION_TTL_DAYS],
  );
  return token;
}

export async function findSessionUser(token: string) {
  const [rows] = await pool.execute<RowDataPacket[]>(
    "SELECT user_id FROM sessions WHERE token_hash = ? AND expires_at > UTC_TIMESTAMP()",
    [hashToken(token)],
  );
  return rows.length ? (rows[0].user_id as number) : null;
}

export async function deleteSession(token: string) {
  await pool.execute("DELETE FROM sessions WHERE token_hash = ?", [hashToken(token)]);
}

export async function findMembership(userId: number) {
  const [rows] = await pool.execute<RowDataPacket[]>("SELECT household_id, role FROM household_members WHERE user_id = ?", [userId]);
  return rows.length ? { householdId: rows[0].household_id as number, role: rows[0].role as Role } : null;
}

// The user's household and its members, plus the pending invites when the user owns it. Null until the user sets one
// up or joins one.
export async function readHousehold(userId: number) {
  const membership = await findMembership(userId);
  if (!membership) return null;
  const [households] = await pool.execute<RowDataPacket[]>(
    "SELECT name, annual_budget, monthly_budget, usage_years FROM households WHERE id = ?",
    [membership.householdId],
  );
  const [members] = await pool.execute<RowDataPacket[]>(
    `SELECT u.id, u.name, u.line_name, u.line_picture, m.role, m.joined_at
     FROM household_members m JOIN users u ON u.id = m.user_id
     WHERE m.household_id = ? ORDER BY m.joined_at, u.id`,
    [membership.householdId],
  );
  const [invites] =
    membership.role === "owner"
      ? await pool.execute<RowDataPacket[]>(
          "SELECT id, name, role, expires_at FROM household_invites WHERE household_id = ? AND expires_at > UTC_TIMESTAMP() ORDER BY id",
          [membership.householdId],
        )
      : [[] as RowDataPacket[]];
  const household = households[0];
  return {
    name: household.name as string,
    annualBudget: household.annual_budget as number,
    monthlyBudget: household.monthly_budget as number,
    usageYears: household.usage_years as number,
    role: membership.role,
    members: members.map((member) => ({
      id: member.id as number,
      name: (member.name || member.line_name) as string,
      picture: member.line_picture as string | null,
      role: member.role as Role,
      joinedAt: isoTime(member.joined_at),
      you: member.id === userId,
    })),
    invites: invites.map((invite) => ({
      id: invite.id as number,
      name: invite.name as string,
      role: invite.role as InviteRole,
      expiresAt: isoTime(invite.expires_at),
    })),
  };
}

// The user becomes the owner. Throws a duplicate-key error if they already belong to a household, which rolls the
// new household back too.
export async function createHousehold(userId: number, goals: Goals) {
  await transaction(async (connection) => {
    const [household] = await connection.execute<ResultSetHeader>(
      "INSERT INTO households (name, annual_budget, monthly_budget, usage_years, created_at) VALUES (?, ?, ?, ?, UTC_TIMESTAMP())",
      [goals.name, goals.annualBudget, goals.monthlyBudget, goals.usageYears],
    );
    await connection.execute(
      "INSERT INTO household_members (user_id, household_id, role, joined_at) VALUES (?, ?, 'owner', UTC_TIMESTAMP())",
      [userId, household.insertId],
    );
  });
}

export async function saveGoals(householdId: number, goals: Goals) {
  await pool.execute("UPDATE households SET name = ?, annual_budget = ?, monthly_budget = ?, usage_years = ? WHERE id = ?", [
    goals.name,
    goals.annualBudget,
    goals.monthlyBudget,
    goals.usageYears,
    householdId,
  ]);
}

// Returns the raw token for the invite link; expired invites are swept here so the table doesn't grow.
export async function createInvite(householdId: number, createdBy: number, name: string, role: InviteRole) {
  const token = randomBytes(24).toString("base64url");
  await pool.execute("DELETE FROM household_invites WHERE expires_at <= UTC_TIMESTAMP()");
  await pool.execute(
    `INSERT INTO household_invites (token_hash, household_id, name, role, created_by, created_at, expires_at)
     VALUES (?, ?, ?, ?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP() + INTERVAL ? DAY)`,
    [hashToken(token), householdId, name, role, createdBy, INVITE_TTL_DAYS],
  );
  return token;
}

export async function deleteInvite(householdId: number, inviteId: number) {
  await pool.execute("DELETE FROM household_invites WHERE id = ? AND household_id = ?", [inviteId, householdId]);
}

export async function findInvite(token: string) {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT i.household_id, i.role, h.name AS household_name, u.name, u.line_name
     FROM household_invites i JOIN households h ON h.id = i.household_id JOIN users u ON u.id = i.created_by
     WHERE i.token_hash = ? AND i.expires_at > UTC_TIMESTAMP()`,
    [hashToken(token)],
  );
  if (!rows.length) return null;
  const invite = rows[0];
  return {
    householdId: invite.household_id as number,
    householdName: invite.household_name as string,
    invitedBy: (invite.name || invite.line_name) as string,
    role: invite.role as InviteRole,
  };
}

// Join the household behind an invite link and use the link up. Returns false if the link expired or was used in the
// meantime; throws a duplicate-key error if the user already belongs to a household.
export async function acceptInvite(userId: number, token: string) {
  return transaction(async (connection) => {
    const [rows] = await connection.execute<RowDataPacket[]>(
      "SELECT id, household_id, role FROM household_invites WHERE token_hash = ? AND expires_at > UTC_TIMESTAMP() FOR UPDATE",
      [hashToken(token)],
    );
    if (!rows.length) return false;
    await connection.execute(
      "INSERT INTO household_members (user_id, household_id, role, joined_at) VALUES (?, ?, ?, UTC_TIMESTAMP())",
      [userId, rows[0].household_id, rows[0].role],
    );
    await connection.execute("DELETE FROM household_invites WHERE id = ?", [rows[0].id]);
    return true;
  });
}
