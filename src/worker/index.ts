import { Hono } from "hono";
import { cors } from "hono/cors";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";
import { getCookie, setCookie } from "hono/cookie";

const app = new Hono<{ Bindings: Env }>();

app.use("/*", cors());

// Authentication endpoints
app.get('/api/oauth/google/redirect_url', async (c) => {
  const redirectUrl = await getOAuthRedirectUrl('google', {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60, // 60 days
  });

  return c.json({ success: true }, 200);
});

app.get("/api/users/me", authMiddleware, async (c) => {
  const user = c.get("user");
  
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }
  
  // Check if user has admin role
  const adminResult = await c.env.DB.prepare(
    "SELECT role FROM user_roles WHERE user_id = ? AND role = 'admin'"
  ).bind(user.id).first();
  
  return c.json({
    ...user,
    isAdmin: !!adminResult
  });
});



app.get('/api/logout', async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === 'string') {
    await deleteSession(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, '', {
    httpOnly: true,
    path: '/',
    sameSite: 'none',
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// Regiment endpoints
app.get("/api/regiments", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM regiments ORDER BY name"
  ).all();

  return c.json(results);
});

// Application endpoints
const ApplicationSchema = z.object({
  roblox_username: z.string().min(1, "Roblox username is required"),
  discord_username: z.string().optional(),
  age: z.number().min(13, "Must be at least 13 years old").max(100),
  experience: z.string().min(1, "Military experience description is required"),
  why_join: z.string().min(1, "Please explain why you want to join"),
  availability: z.string().min(1, "Availability information is required"),
  previous_military: z.string().optional(),
});

app.post("/api/applications", authMiddleware, zValidator("json", ApplicationSchema), async (c) => {
  const user = c.get("user");
  const data = c.req.valid("json");

  if (!user) {
    return c.json({ error: "User not authenticated" }, 401);
  }

  // Check if user already has a pending application
  const existingApp = await c.env.DB.prepare(
    "SELECT id FROM applications WHERE user_id = ? AND status = 'pending'"
  ).bind(user.id).first();

  if (existingApp) {
    return c.json({ error: "You already have a pending application" }, 400);
  }

  const result = await c.env.DB.prepare(
    `INSERT INTO applications (user_id, roblox_username, discord_username, age, experience, why_join, availability, previous_military) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    user.id,
    data.roblox_username,
    data.discord_username || null,
    data.age,
    data.experience,
    data.why_join,
    data.availability,
    data.previous_military || null
  ).run();

  return c.json({ id: result.meta.last_row_id, success: true }, 201);
});

app.get("/api/applications", authMiddleware, async (c) => {
  const user = c.get("user");
  
  if (!user) {
    return c.json({ error: "User not authenticated" }, 401);
  }
  
  // Check if user is admin
  const adminResult = await c.env.DB.prepare(
    "SELECT role FROM user_roles WHERE user_id = ? AND role = 'admin'"
  ).bind(user.id).first();

  if (!adminResult) {
    return c.json({ error: "Unauthorized" }, 403);
  }

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM applications ORDER BY created_at DESC"
  ).all();

  return c.json(results);
});

app.patch("/api/applications/:id", authMiddleware, zValidator("json", z.object({
  status: z.enum(["pending", "approved", "rejected"]),
  admin_notes: z.string().optional(),
})), async (c) => {
  const user = c.get("user");
  const applicationId = c.req.param("id");
  const data = c.req.valid("json");
  
  if (!user) {
    return c.json({ error: "User not authenticated" }, 401);
  }
  
  // Check if user is admin
  const adminResult = await c.env.DB.prepare(
    "SELECT role FROM user_roles WHERE user_id = ? AND role = 'admin'"
  ).bind(user.id).first();

  if (!adminResult) {
    return c.json({ error: "Unauthorized" }, 403);
  }

  await c.env.DB.prepare(
    "UPDATE applications SET status = ?, admin_notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(data.status, data.admin_notes || null, applicationId).run();

  return c.json({ success: true });
});

export default app;
