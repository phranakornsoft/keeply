export type Profile = { name: string; email: string; phone: string; birthday: string; bio: string };
export type LineAccount = { name: string; picture: string | null };
export type Role = "owner" | "editor" | "viewer";
export type InviteRole = Exclude<Role, "owner">;
// Set up on the owner's first sign-in. Budgets are whole baht; usageYears is the default lifetime for an item's daily cost.
export type Goals = { name: string; annualBudget: number; monthlyBudget: number; usageYears: number };
export type Member = { id: number; name: string; picture: string | null; role: Role; joinedAt: string; you: boolean };
export type Invite = { id: number; name: string; role: InviteRole; expiresAt: string };
// role is the signed-in user's own; invites are only listed for the owner.
export type Household = Goals & { role: Role; members: Member[]; invites: Invite[] };
export type InvitePreview = { householdName: string; invitedBy: string; role: InviteRole };
export type Account = { line: LineAccount; profile: Profile; household: Household | null };

// The API is served from the same origin as the app (Vite proxies /api in development),
// so the session travels in an httpOnly cookie that page scripts never see.
const baseUrl = "/api";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// The server sets this marker next to the session cookie, so the app can tell a session exists without reading it.
export const isSignedIn = () => document.cookie.split("; ").includes("keeply_signed_in=1");

async function request<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(response.status, result.error ?? `Request failed with ${response.status}`);
  return result as T;
}

// The server sets the session cookies on success.
export const completeLineLogin = (code: string, nonce: string | null, redirectUri: string) =>
  request<Account>("/line/callback", "POST", { code, nonce, redirectUri });

export const fetchAccount = () => request<Account>("/me");

export async function saveProfile(profile: Profile) {
  const result = await request<{ profile: Profile }>("/profile", "PUT", profile);
  return result.profile;
}

export async function createHousehold(goals: Goals) {
  const result = await request<{ household: Household }>("/household", "POST", goals);
  return result.household;
}

export async function saveGoals(goals: Goals) {
  const result = await request<{ household: Household }>("/household", "PUT", goals);
  return result.household;
}

// The token goes into the invite link; the server only keeps its hash, so it can't be fetched again later.
export const createInvite = (name: string, role: InviteRole) =>
  request<{ token: string; household: Household }>("/household/invites", "POST", { name, role });

export async function deleteInvite(id: number) {
  const result = await request<{ household: Household }>(`/household/invites/${id}`, "DELETE");
  return result.household;
}

export const fetchInvite = (token: string) => request<InvitePreview>(`/invites/${encodeURIComponent(token)}`);

export async function acceptInvite(token: string) {
  const result = await request<{ household: Household }>(`/invites/${encodeURIComponent(token)}/accept`, "POST");
  return result.household;
}

export function signOut() {
  request("/logout", "POST").catch((error) => console.error("Logout request failed:", error));
}
