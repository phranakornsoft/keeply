import { createHash, randomBytes } from "node:crypto";
import mysql, { type RowDataPacket } from "mysql2/promise";

export type Profile = { name: string; email: string; phone: string; birthday: string; bio: string };
export type LineUser = { sub: string; name: string; picture: string | null; email: string | null };

export const SESSION_TTL_DAYS = 30;

const pool = mysql.createPool({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Return DATE columns as "YYYY-MM-DD" instead of Date objects shifted by the server's time zone.
  dateStrings: true,
});

// Only a hash of the session token is stored, so reading the sessions table doesn't hand out live sessions.
const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

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
