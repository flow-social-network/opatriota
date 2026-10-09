import { Router } from "express";
import { prisma } from "../db/prisma.js";
import { asyncHandler, HttpError } from "../lib/http.js";
import { requireAuth, type AuthUser } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, asyncHandler(async (_req, res) => {
  const user = res.locals.user as AuthUser;
  const items = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, type: true, title: true, message: true, entityType: true, entityId: true, readAt: true, createdAt: true },
  });
  const unread = items.filter((item) => item.readAt === null).length;
  res.json({ data: items, unreadCount: unread });
}));

router.patch("/:id/read", requireAuth, asyncHandler(async (req, res) => {
  const user = res.locals.user as AuthUser;
  const result = await prisma.notification.updateMany({
    where: { id: req.params.id, userId: user.id, readAt: null },
    data: { readAt: new Date() },
  });
  if (result.count === 0) {
    const existing = await prisma.notification.findFirst({
      where: { id: req.params.id, userId: user.id },
      select: { id: true, readAt: true },
    });
    if (!existing) throw new HttpError(404, "NOTIFICATION_NOT_FOUND", "Notification not found");
  }
  res.status(200).json({ data: { id: req.params.id, read: true } });
}));

router.post("/read-all", requireAuth, asyncHandler(async (_req, res) => {
  const user = res.locals.user as AuthUser;
  const result = await prisma.notification.updateMany({
    where: { userId: user.id, readAt: null },
    data: { readAt: new Date() },
  });
  res.status(200).json({ data: { updated: result.count } });
}));

export default router;
