import { createHash } from "node:crypto";
import type { RequestHandler } from "express";
import { UserRole } from "@prisma/client";
import { env } from "../config/env.js";
import { prisma } from "../db/prisma.js";
import { asyncHandler, HttpError } from "../lib/http.js";

export type AuthUser = {
  id: string;
  firebaseUid: string;
  email: string;
  displayName: string;
  role: UserRole;
  disabled: boolean;
};

export const requireAuth: RequestHandler = asyncHandler(async (req, res, next) => {
  const cookieHeader = req.headers.cookie ?? "";
  const cookie = cookieHeader.split(";").map((part) => part.trim())
    .find((part) => part.startsWith(`${env.sessionCookieName}=`));
  const token = cookie?.slice(env.sessionCookieName.length + 1);
  if (!token) throw new HttpError(401, "UNAUTHENTICATED", "Authentication required");

  const tokenHash = createHash("sha256").update(decodeURIComponent(token)).digest("hex");
  const session = await prisma.refreshSession.findUnique({
    where: { tokenHash },
    include: { user: true },
  });
  if (!session || session.revokedAt || session.expiresAt <= new Date() || session.user.disabledAt) {
    throw new HttpError(401, "UNAUTHENTICATED", "Session is invalid or expired");
  }

  res.locals.user = {
    id: session.user.id,
    firebaseUid: session.user.firebaseUid ?? "",
    email: session.user.email,
    displayName: session.user.displayName,
    role: session.user.role,
    disabled: false,
  } satisfies AuthUser;
  next();
});

export function requireRole(...roles: UserRole[]): RequestHandler {
  return (req, res, next) => {
    const user = res.locals.user as AuthUser | undefined;
    if (!user) return next(new HttpError(401, "UNAUTHENTICATED", "Authentication required"));
    if (!roles.includes(user.role)) return next(new HttpError(403, "FORBIDDEN", "Insufficient permissions"));
    next();
  };
}
