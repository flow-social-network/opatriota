import { Router } from "express";
import { prisma } from "../db/prisma.js";
import { asyncHandler, HttpError } from "../lib/http.js";

const router = Router();

router.post("/subscriptions", asyncHandler(async (req, res) => {
  const token = typeof req.body?.token === "string" ? req.body.token.trim() : "";
  const deviceType = typeof req.body?.deviceType === "string" ? req.body.deviceType : "";
  const userAgent = typeof req.body?.userAgent === "string" ? req.body.userAgent.slice(0, 150) : null;

  if (token.length < 40 || token.length > 4096) {
    throw new HttpError(400, "INVALID_PUSH_TOKEN", "Token de notificação inválido");
  }
  if (!["desktop", "mobile", "tablet"].includes(deviceType)) {
    throw new HttpError(400, "INVALID_DEVICE_TYPE", "Tipo de dispositivo inválido");
  }

  const subscription = await prisma.pushSubscription.upsert({
    where: { token },
    create: { token, deviceType, userAgent, active: true, lastSeenAt: new Date() },
    update: { deviceType, userAgent, active: true, lastSeenAt: new Date() },
    select: { id: true, active: true, deviceType: true, createdAt: true },
  });

  res.status(200).json({ data: subscription });
}));

export default router;
