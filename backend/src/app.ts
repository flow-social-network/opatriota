import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import helmet from "helmet";
import { randomUUID } from "node:crypto";
import { env } from "./config/env.js";
import { prisma } from "./db/prisma.js";
import { HttpError } from "./lib/http.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import articleRoutes from "./routes/articles.js";
import categoryRoutes from "./routes/categories.js";
import pushRoutes from "./routes/push.js";
import notificationRoutes from "./routes/notifications.js";
import operationalCoreRoutes from "./routes/operational-core.js";

export const app = express();

if (env.trustProxy) app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("x-request-id", req.header("x-request-id")?.slice(0, 128) || randomUUID());
  next();
});
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || env.corsOrigins.includes(origin)) return callback(null, true);
    return callback(new HttpError(403, "CORS_ORIGIN_DENIED", "Origin not allowed"));
  },
  credentials: true,
}));
app.use(express.json({ limit: "1mb", strict: true }));
app.use(express.urlencoded({ extended: false, limit: "32kb" }));

app.get(["/health/live", "/api/health/live"], (_req, res) => res.status(200).json({ status: "ok" }));
app.get(["/health/ready", "/api/health/ready"], async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: "ready", dependencies: { postgres: "ok" } });
  } catch {
    res.status(503).json({ status: "not_ready", dependencies: { postgres: "unavailable" } });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/push", pushRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/operational-core", operationalCoreRoutes);

app.use((_req, res) => res.status(404).json({ error: { code: "NOT_FOUND", message: "Route not found" } }));

const errors: ErrorRequestHandler = (error, _req, res, _next) => {
  const requestId = res.getHeader("x-request-id");
  const status = error instanceof HttpError ? error.status : 500;
  const code = error instanceof HttpError ? error.code : "INTERNAL_ERROR";
  const message = error instanceof HttpError ? error.message : "Internal server error";
  console.error(JSON.stringify({ level: "error", requestId, code, status }));
  if (res.headersSent) return;
  res.status(status).json({ error: { code, message, requestId } });
};
app.use(errors);
