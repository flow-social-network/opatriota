import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { Router, type Request } from "express";
import { UserRole } from "@prisma/client";
import { env } from "../config/env.js";
import { prisma } from "../db/prisma.js";
import { asyncHandler, HttpError, readString } from "../lib/http.js";
import { verifyFirebaseIdToken } from "../lib/firebase.js";
import { recordSecurityAudit, syncGoogleIdentity } from "../lib/identitySync.js";
import { rateLimit } from "../lib/rateLimit.js";
import { requireAuth, type AuthUser } from "../middleware/auth.js";

const router = Router();
const scrypt = promisify(scryptCallback);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const credentialLimiter = rateLimit({ windowMs: 5 * 60_000, max: 20, keyPrefix: "auth:credentials" });
const syncLimiter = rateLimit({ windowMs: 5 * 60_000, max: 20, keyPrefix: "auth:sync" });

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, expectedHex] = stored.split(":");
  if (!salt || !expectedHex) return false;
  const expected = Buffer.from(expectedHex, "hex");
  const actual = (await scrypt(password, salt, expected.length)) as Buffer;
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function setSessionCookie(res: import("express").Response, token: string): void {
  const secure = env.nodeEnv === "production" ? "; Secure" : "";
  res.setHeader("Set-Cookie", `${env.sessionCookieName}=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${env.sessionDays * 86400}${secure}`);
}

function clearSessionCookie(res: import("express").Response): void {
  const secure = env.nodeEnv === "production" ? "; Secure" : "";
  res.setHeader("Set-Cookie", `${env.sessionCookieName}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0${secure}`);
}

async function issueSession(userId: string, req: Request): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  await prisma.refreshSession.create({
    data: {
      userId,
      tokenHash,
      expiresAt: new Date(Date.now() + env.sessionDays * 86400_000),
      userAgent: req.get("user-agent")?.slice(0, 500),
    },
  });
  return token;
}

type CurrentUserRow = {
  id: string;
  firebaseUid: string | null;
  email: string;
  displayName: string;
  role: UserRole;
  disabledAt: Date | null;
};

function toCurrentUser(user: CurrentUserRow): AuthUser {
  return {
    id: user.id,
    firebaseUid: user.firebaseUid ?? "",
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    disabled: user.disabledAt !== null,
  };
}

router.post("/register", credentialLimiter, asyncHandler(async (req, res) => {
  const email = readString(req.body?.email, "email", 254).toLowerCase();
  const displayName = readString(req.body?.displayName, "displayName", 100);
  const password = readString(req.body?.password, "password", 200);
  if (!emailPattern.test(email)) throw new HttpError(400, "VALIDATION_ERROR", "Email address is invalid");
  if (password.length < 12) throw new HttpError(400, "WEAK_PASSWORD", "Password must contain at least 12 characters");

  const user = await prisma.user.create({
    data: { email, displayName, passwordHash: await hashPassword(password), role: UserRole.READER },
    select: { id: true, email: true, displayName: true, role: true, createdAt: true },
  });
  res.status(201).json({ data: user });
}));

router.post("/login", credentialLimiter, asyncHandler(async (req, res) => {
  const email = readString(req.body?.email, "email", 254).toLowerCase();
  const password = readString(req.body?.password, "password", 200);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash || user.disabledAt || !(await verifyPassword(password, user.passwordHash))) {
    throw new HttpError(401, "INVALID_CREDENTIALS", "Email or password is incorrect");
  }

  setSessionCookie(res, await issueSession(user.id, req));
  res.json({ data: { id: user.id, email: user.email, displayName: user.displayName, role: user.role } });
}));

router.post("/sync", syncLimiter, asyncHandler(async (req, res) => {
  const header = req.headers.authorization ?? "";
  const match = /^Bearer\s+(\S+)$/i.exec(header);
  if (!match) throw new HttpError(401, "MISSING_TOKEN", "Firebase ID token is required");

  const decoded = await verifyFirebaseIdToken(match[1]);
  const provider = decoded.firebase?.sign_in_provider ?? "unknown";

  // Contract: /api/auth/sync never accepts a role from the client.
  if (req.body && typeof req.body === "object" && "role" in (req.body as Record<string, unknown>)) {
    await recordSecurityAudit("SYNC_ROLE_ATTEMPT_IGNORED", decoded.uid, { provider });
  }

  const user = await syncGoogleIdentity({
    uid: decoded.uid,
    provider,
    email: decoded.email,
    name: decoded.name,
    emailVerified: decoded.email_verified === true,
  });

  setSessionCookie(res, await issueSession(user.id, req));
  res.json({ data: toCurrentUser(user) });
}));

router.get("/me", requireAuth, (req, res) => {
  res.json({ data: res.locals.user as AuthUser });
});

router.post("/logout", asyncHandler(async (req, res) => {
  const cookieHeader = req.headers.cookie ?? "";
  const cookie = cookieHeader.split(";").map((part) => part.trim())
    .find((part) => part.startsWith(`${env.sessionCookieName}=`));
  const token = cookie?.slice(env.sessionCookieName.length + 1);
  if (token) {
    const tokenHash = createHash("sha256").update(decodeURIComponent(token)).digest("hex");
    await prisma.refreshSession.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
  clearSessionCookie(res);
  res.status(204).end();
}));

export default router;
