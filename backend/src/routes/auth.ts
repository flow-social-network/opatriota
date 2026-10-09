import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { Router } from "express";
import { UserRole } from "@prisma/client";
import { env } from "../config/env.js";
import { prisma } from "../db/prisma.js";
import { asyncHandler, HttpError, readString } from "../lib/http.js";
import { requireAuth, type AuthUser } from "../middleware/auth.js";

const router = Router();
const scrypt = promisify(scryptCallback);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

router.post("/register", asyncHandler(async (req, res) => {
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

router.post("/login", asyncHandler(async (req, res) => {
  const email = readString(req.body?.email, "email", 254).toLowerCase();
  const password = readString(req.body?.password, "password", 200);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash || user.disabledAt || !(await verifyPassword(password, user.passwordHash))) {
    throw new HttpError(401, "INVALID_CREDENTIALS", "Email or password is incorrect");
  }

  const token = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  await prisma.refreshSession.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + env.sessionDays * 86400_000),
      userAgent: req.get("user-agent")?.slice(0, 500),
    },
  });
  setSessionCookie(res, token);
  res.json({ data: { id: user.id, email: user.email, displayName: user.displayName, role: user.role } });
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
