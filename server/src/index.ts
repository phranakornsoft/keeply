import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono, type Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { csrf } from "hono/csrf";
import { logger } from "hono/logger";
import * as db from "./db.ts";

// The public origin the app is served from, e.g. https://keeeply.ai. The API lives under /api on the same origin,
// which is what lets the session ride in an httpOnly cookie instead of being readable by page scripts.
const APP_ORIGIN = process.env.APP_ORIGIN ?? "http://localhost:3000";
const PORT = Number(process.env.PORT ?? 3000);

// Over HTTPS the session cookie gets Secure and the __Host- prefix, which also forbids a Domain attribute.
const secure = APP_ORIGIN.startsWith("https://");
const SESSION_COOKIE = secure ? "__Host-keeply_session" : "keeply_session";
// Readable by the app so it knows a session exists before calling /api/me; it carries no credential.
const SIGNED_IN_COOKIE = "keeply_signed_in";
const cookieOptions = { path: "/", secure, sameSite: "Lax" } as const;

type Profile = db.Profile;

const text = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

// A YYYY-MM-DD string that is also a real calendar date, since the column is DATE.
const isDate = (value: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().startsWith(value);

function cleanProfile(input: Record<string, unknown>): Profile {
  const birthday = text(input.birthday, 10);
  return {
    name: text(input.name, 50),
    email: text(input.email, 100),
    phone: text(input.phone, 20),
    birthday: isDate(birthday) ? birthday : "",
    bio: text(input.bio, 80),
  };
}

const readJson = (c: Context): Promise<Record<string, unknown>> => c.req.json().catch(() => ({}));

function setSessionCookies(c: Context, token: string) {
  const maxAge = db.SESSION_TTL_DAYS * 24 * 60 * 60;
  setCookie(c, SESSION_COOKIE, token, { ...cookieOptions, httpOnly: true, maxAge });
  setCookie(c, SIGNED_IN_COOKIE, "1", { ...cookieOptions, maxAge });
}

function clearSessionCookies(c: Context) {
  deleteCookie(c, SESSION_COOKIE, cookieOptions);
  deleteCookie(c, SIGNED_IN_COOKIE, cookieOptions);
}

// Resolve the session cookie to a user ID. A missing, unknown or expired session also clears both cookies.
async function sessionUser(c: Context) {
  const token = getCookie(c, SESSION_COOKIE);
  const userId = token ? await db.findSessionUser(token) : null;
  if (!userId) clearSessionCookies(c);
  return userId;
}

const app = new Hono();

app.use("*", logger());
// Same-origin fetches pass on Sec-Fetch-Site; this blocks form posts from other sites, including sibling subdomains.
app.use("/api/*", csrf({ origin: APP_ORIGIN }));

app.get("/api/health", async (c) => {
  try {
    await db.ping();
    return c.json({ status: "ok" });
  } catch (error) {
    console.error("Database ping failed:", error);
    return c.json({ status: "database unavailable" }, 503);
  }
});

// Exchange a LINE Login code for the user's profile and start a Keeply session.
app.post("/api/line/callback", async (c) => {
  const channelId = process.env.LINE_CHANNEL_ID;
  const channelSecret = process.env.LINE_CHANNEL_SECRET;
  if (!channelId || !channelSecret) {
    return c.json({ error: "LINE_CHANNEL_ID and LINE_CHANNEL_SECRET are not set" }, 500);
  }

  const { code, redirectUri, nonce } = await readJson(c);
  if (typeof code !== "string" || typeof redirectUri !== "string" || !code || !redirectUri) {
    return c.json({ error: "code and redirectUri are required" }, 400);
  }

  const tokenResponse = await fetch("https://api.line.me/oauth2/v2.1/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: channelId,
      client_secret: channelSecret,
    }),
  });
  const token = await tokenResponse.json();
  if (!tokenResponse.ok) {
    console.log("LINE token exchange failed:", token);
    return c.json({ error: token.error_description ?? "LINE token exchange failed" }, 400);
  }

  // LINE checks the signature, audience, expiry and nonce, then returns the claims.
  const verifyResponse = await fetch("https://api.line.me/oauth2/v2.1/verify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      id_token: token.id_token,
      client_id: channelId,
      ...(typeof nonce === "string" && nonce ? { nonce } : {}),
    }),
  });
  const claims = await verifyResponse.json();
  if (!verifyResponse.ok) {
    console.log("LINE id_token verification failed:", claims);
    return c.json({ error: claims.error_description ?? "LINE id_token verification failed" }, 400);
  }

  const userId = await db.upsertLineUser(
    {
      sub: claims.sub,
      name: text(claims.name, 100),
      picture: text(claims.picture, 1024) || null,
      email: text(claims.email, 255) || null,
    },
    cleanProfile({ name: claims.name, email: claims.email }),
  );

  // Signing in again replaces whatever session this browser had before.
  const previousSession = getCookie(c, SESSION_COOKIE);
  if (previousSession) await db.deleteSession(previousSession);
  setSessionCookies(c, await db.createSession(userId));

  return c.json(await db.readAccount(userId));
});

// Restore the signed-in user's LINE link and profile when the app loads.
app.get("/api/me", async (c) => {
  const userId = await sessionUser(c);
  if (!userId) return c.json({ error: "Not signed in" }, 401);
  return c.json(await db.readAccount(userId));
});

app.put("/api/profile", async (c) => {
  const userId = await sessionUser(c);
  if (!userId) return c.json({ error: "Not signed in" }, 401);
  const profile = cleanProfile(await readJson(c));
  if (!profile.name || !profile.email) {
    return c.json({ error: "name and email are required" }, 400);
  }
  await db.saveProfile(userId, profile);
  return c.json({ profile });
});

app.post("/api/logout", async (c) => {
  const token = getCookie(c, SESSION_COOKIE);
  if (token) await db.deleteSession(token);
  clearSessionCookies(c);
  return c.json({ status: "ok" });
});

app.all("/api/*", (c) => c.json({ error: "Not found" }, 404));

// The built web app, copied to ./public in the Docker image. Vite's hashed assets can be cached for good.
app.use(
  "*",
  serveStatic({
    root: "./public",
    onFound: (path, c) => {
      c.header("Cache-Control", path.includes("/assets/") ? "public, max-age=31536000, immutable" : "no-cache");
    },
  }),
);

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`Keeply listening on port ${info.port} for ${APP_ORIGIN}`);
});
