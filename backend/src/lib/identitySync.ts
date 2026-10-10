import { UserRole, type User } from "@prisma/client";
import { prisma } from "../db/prisma.js";
import { HttpError } from "./http.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isUniqueViolation(error: unknown): boolean {
  return Boolean(error && typeof error === "object" && (error as { code?: string }).code === "P2002");
}

export async function recordSecurityAudit(action: string, entityId: string, metadata: Record<string, string>): Promise<void> {
  await prisma.auditEvent.create({
    data: { actorId: null, action, entityType: "Auth", entityId, metadata },
  });
}

export type SyncedIdentity = {
  uid: string;
  provider: string;
  email?: string | null;
  name?: string | null;
  emailVerified: boolean;
};

/**
 * Maps a verified Firebase identity to the internal user record.
 * The role is ALWAYS assigned server-side (READER); a role from the
 * client payload is never read here, per the /api/auth/sync contract.
 */
export async function syncGoogleIdentity(identity: SyncedIdentity): Promise<User> {
  const { uid, provider } = identity;

  if (provider !== "google.com") {
    await recordSecurityAudit("SYNC_PROVIDER_REJECTED", uid, { provider });
    throw new HttpError(403, "LOGIN_PROVIDER_NOT_ALLOWED", "Only Google sign-in is allowed");
  }

  const email = (identity.email ?? "").trim().toLowerCase();
  if (!email || !emailPattern.test(email)) {
    throw new HttpError(403, "EMAIL_REQUIRED", "Google account does not provide a valid email");
  }
  if (!identity.emailVerified) {
    await recordSecurityAudit("SYNC_EMAIL_UNVERIFIED", uid, { provider });
    throw new HttpError(403, "EMAIL_NOT_VERIFIED", "Google account email is not verified");
  }

  let user = await prisma.user.findUnique({ where: { firebaseUid: uid } });
  if (user && user.disabledAt) {
    await recordSecurityAudit("SYNC_DISABLED_REJECTED", user.id, { provider });
    throw new HttpError(403, "ACCOUNT_DISABLED", "Account is disabled");
  }

  if (!user) {
    const byEmail = await prisma.user.findUnique({ where: { email } });
    if (byEmail) {
      if (byEmail.disabledAt) {
        await recordSecurityAudit("SYNC_DISABLED_REJECTED", byEmail.id, { provider });
        throw new HttpError(403, "ACCOUNT_DISABLED", "Account is disabled");
      }
      // Only merge identities when the backend already verified the email;
      // password registration does not verify emails, so a silent merge
      // would allow account takeover via Google email ownership alone.
      if (!byEmail.emailVerifiedAt) {
        await recordSecurityAudit("SYNC_LINK_REJECTED", byEmail.id, { provider });
        throw new HttpError(409, "EMAIL_ALREADY_REGISTERED", "Email already registered; sign in with your password");
      }
      user = await prisma.user.update({
        where: { id: byEmail.id },
        data: { firebaseUid: uid },
      });
      await recordSecurityAudit("AUTH_IDENTITY_LINKED", user.id, { provider });
    } else {
      try {
        user = await prisma.user.create({
          data: {
            email,
            firebaseUid: uid,
            displayName: (identity.name ?? email.split("@")[0] ?? "Leitor").slice(0, 100),
            role: UserRole.READER, // server-assigned; request payload is never consulted
            emailVerifiedAt: new Date(),
          },
        });
        await recordSecurityAudit("AUTH_PROFILE_CREATED", user.id, { provider, role: UserRole.READER });
      } catch (error) {
        if (!isUniqueViolation(error)) throw error;
        user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw error;
        if (user.disabledAt) {
          await recordSecurityAudit("SYNC_DISABLED_REJECTED", user.id, { provider });
          throw new HttpError(403, "ACCOUNT_DISABLED", "Account is disabled");
        }
      }
    }
  }

  return user;
}
