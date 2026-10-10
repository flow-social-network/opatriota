import { Router } from "express";
import { UserRole } from "@prisma/client";
import { prisma } from "../db/prisma.js";
import { firebaseConfigured } from "../config/env.js";
import { asyncHandler, HttpError } from "../lib/http.js";
import { requireAuth, requireRole, type AuthUser } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

const readerRoles: UserRole[] = [UserRole.ADMIN, UserRole.CHIEF_EDITOR];
const readOnly = requireRole(...readerRoles);
const adminOnly = requireRole(UserRole.ADMIN);

const validRoles = new Set<string>(Object.values(UserRole));

function actor(res: import("express").Response): AuthUser {
  return res.locals.user as AuthUser;
}

function pagination(req: import("express").Request): { page: number; pageSize: number; skip: number; take: number } {
  const page = Math.max(1, Number.parseInt(String(req.query.page ?? "1"), 10) || 1);
  const pageSize = Math.max(1, Math.min(100, Number.parseInt(String(req.query.pageSize ?? "20"), 10) || 20));
  return { page, pageSize, skip: (page - 1) * pageSize, take: pageSize };
}

router.get("/overview", readOnly, asyncHandler(async (_req, res) => {
  const [
    dbOk,
    usersByRole,
    disabledUsers,
    articlesByStatus,
    subscriptionsByStatus,
    paidPayments,
    activePush,
    pendingNotifications,
    appliedMigrations,
    tasksByStatus,
  ] = await Promise.all([
    prisma.$queryRaw`SELECT 1`.then(() => true).catch(() => false),
    prisma.user.groupBy({ by: ["role"], _count: { _all: true } }),
    prisma.user.count({ where: { disabledAt: { not: null } } }),
    prisma.article.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.subscription.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.payment.aggregate({ where: { status: "PAID" }, _sum: { amountCents: true }, _count: { _all: true } }),
    prisma.pushSubscription.count({ where: { active: true } }),
    prisma.notification.count({ where: { readAt: null } }),
    prisma.$queryRaw<{ count: number }[]>`SELECT count(*)::int AS count FROM _prisma_migrations WHERE finished_at IS NOT NULL`.then((rows) => rows[0]?.count ?? 0).catch(() => 0),
    prisma.operationalTask.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  const byRole: Record<string, number> = {};
  for (const row of usersByRole) byRole[row.role] = row._count._all;

  res.json({
    data: {
      health: {
        api: "ok",
        postgres: dbOk ? "ok" : "unavailable",
        authProvider: firebaseConfigured() ? "configured" : "not_configured",
        authProviderName: "google",
        facebookLoginEnabled: false,
        uptimeSeconds: Math.round(process.uptime()),
      },
      migrations: { applied: appliedMigrations },
      users: { byRole, disabled: disabledUsers },
      articles: { byStatus: Object.fromEntries(articlesByStatus.map((row) => [row.status, row._count._all])) },
      subscriptions: { byStatus: Object.fromEntries(subscriptionsByStatus.map((row) => [row.status, row._count._all])) },
      revenue: { paidCents: paidPayments._sum.amountCents ?? 0, paidCount: paidPayments._count._all },
      push: { activeSubscriptions: activePush },
      notifications: { unread: pendingNotifications },
      operationalTasks: { byStatus: Object.fromEntries(tasksByStatus.map((row) => [row.status, row._count._all])) },
    },
  });
}));

router.get("/users", readOnly, asyncHandler(async (req, res) => {
  const { page, pageSize, skip, take } = pagination(req);
  const query = typeof req.query.query === "string" ? req.query.query.trim().toLowerCase() : "";
  const roleFilter = typeof req.query.role === "string" && validRoles.has(req.query.role) ? (req.query.role as UserRole) : undefined;
  const disabledFilter = req.query.disabled === "true" ? true : req.query.disabled === "false" ? false : undefined;

  const where = {
    ...(roleFilter ? { role: roleFilter } : {}),
    ...(disabledFilter === undefined ? {} : disabledFilter ? { disabledAt: { not: null } } : { disabledAt: null }),
    ...(query
      ? { OR: [{ email: { contains: query, mode: "insensitive" as const } }, { displayName: { contains: query, mode: "insensitive" as const } }] }
      : {}),
  };

  const [total, items] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        displayName: true,
        role: true,
        disabledAt: true,
        firebaseUid: true,
        createdAt: true,
        emailVerifiedAt: true,
        _count: { select: { sessions: { where: { revokedAt: null, expiresAt: { gt: new Date() } } } } },
      },
    }),
  ]);

  res.json({
    data: items.map((user) => ({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      disabled: user.disabledAt !== null,
      googleLinked: user.firebaseUid !== null,
      emailVerified: user.emailVerifiedAt !== null,
      activeSessions: user._count.sessions,
      createdAt: user.createdAt,
    })),
    pagination: { page, pageSize, total, pages: Math.ceil(total / pageSize) },
  });
}));

router.patch("/users/:id/role", adminOnly, asyncHandler(async (req, res) => {
  const targetId = String(req.params.id);
  const role = req.body?.role;
  if (typeof role !== "string" || !validRoles.has(role)) {
    throw new HttpError(400, "VALIDATION_ERROR", "role must be a valid role");
  }
  const actorUser = actor(res);
  if (actorUser.id === targetId) {
    throw new HttpError(403, "FORBIDDEN", "Cannot change your own role");
  }

  const target = await prisma.user.findUnique({ where: { id: targetId } });
  if (!target) throw new HttpError(404, "NOT_FOUND", "User not found");

  const nextRole = role as UserRole;
  if (target.role === UserRole.ADMIN && nextRole !== UserRole.ADMIN) {
    const remainingAdmins = await prisma.user.count({
      where: { role: UserRole.ADMIN, disabledAt: null, id: { not: targetId } },
    });
    if (remainingAdmins === 0) throw new HttpError(409, "LAST_ADMIN", "Cannot demote the last active administrator");
  }

  const updated = await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id: targetId },
      data: { role: nextRole },
      select: { id: true, email: true, role: true },
    });
    await tx.auditEvent.create({
      data: {
        actorId: actorUser.id,
        action: "USER_ROLE_CHANGED",
        entityType: "User",
        entityId: targetId,
        metadata: { from: target.role, to: nextRole },
      },
    });
    return user;
  });

  res.json({ data: { id: updated.id, email: updated.email, role: updated.role } });
}));

router.patch("/users/:id/disabled", adminOnly, asyncHandler(async (req, res) => {
  const targetId = String(req.params.id);
  const disabled = req.body?.disabled;
  if (typeof disabled !== "boolean") {
    throw new HttpError(400, "VALIDATION_ERROR", "disabled must be a boolean");
  }
  const actorUser = actor(res);
  if (disabled && actorUser.id === targetId) {
    throw new HttpError(403, "FORBIDDEN", "Cannot disable your own account");
  }

  const target = await prisma.user.findUnique({ where: { id: targetId } });
  if (!target) throw new HttpError(404, "NOT_FOUND", "User not found");
  if (disabled && target.role === UserRole.ADMIN) {
    const remainingAdmins = await prisma.user.count({
      where: { role: UserRole.ADMIN, disabledAt: null, id: { not: targetId } },
    });
    if (remainingAdmins === 0) throw new HttpError(409, "LAST_ADMIN", "Cannot disable the last active administrator");
  }

  const updated = await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id: targetId },
      data: { disabledAt: disabled ? new Date() : null },
      select: { id: true, email: true, disabledAt: true },
    });
    let revokedSessions = 0;
    if (disabled) {
      const revoked = await tx.refreshSession.updateMany({
        where: { userId: targetId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      revokedSessions = revoked.count;
    }
    await tx.auditEvent.create({
      data: {
        actorId: actorUser.id,
        action: disabled ? "USER_DISABLED" : "USER_ENABLED",
        entityType: "User",
        entityId: targetId,
        metadata: { revokedSessions },
      },
    });
    return user;
  });

  res.json({ data: { id: updated.id, email: updated.email, disabled: updated.disabledAt !== null } });
}));

router.post("/users/:id/revoke-sessions", adminOnly, asyncHandler(async (req, res) => {
  const targetId = String(req.params.id);
  const actorUser = actor(res);
  const target = await prisma.user.findUnique({ where: { id: targetId } });
  if (!target) throw new HttpError(404, "NOT_FOUND", "User not found");

  const revoked = await prisma.$transaction(async (tx) => {
    const result = await tx.refreshSession.updateMany({
      where: { userId: targetId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    await tx.auditEvent.create({
      data: {
        actorId: actorUser.id,
        action: "USER_SESSIONS_REVOKED",
        entityType: "User",
        entityId: targetId,
        metadata: { revokedSessions: result.count },
      },
    });
    return result.count;
  });

  res.json({ data: { id: targetId, revokedSessions: revoked } });
}));

router.get("/audit", readOnly, asyncHandler(async (req, res) => {
  const { page, pageSize, skip, take } = pagination(req);
  const action = typeof req.query.action === "string" ? req.query.action.trim() : "";
  const entityType = typeof req.query.entityType === "string" ? req.query.entityType.trim() : "";
  const where = {
    ...(action ? { action } : {}),
    ...(entityType ? { entityType } : {}),
  };

  const [total, items] = await Promise.all([
    prisma.auditEvent.count({ where }),
    prisma.auditEvent.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: { actor: { select: { id: true, email: true, displayName: true } } },
    }),
  ]);

  res.json({
    data: items,
    pagination: { page, pageSize, total, pages: Math.ceil(total / pageSize) },
  });
}));

export default router;
