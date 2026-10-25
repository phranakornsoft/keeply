export type Profile = { name: string; email: string; phone: string; birthday: string; bio: string };
export type LineAccount = { name: string; picture: string | null };
type Account = { line: LineAccount; profile: Profile };

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

export function signOut() {
  request("/logout", "POST").catch((error) => console.error("Logout request failed:", error));
}
