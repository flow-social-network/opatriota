import "dotenv/config";

function positiveInteger(value: string | undefined, fallback: number): number {
  if (value === undefined || value.trim() === "") return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }
  return parsed;
}

const origins = (process.env.CORS_ORIGINS ?? "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: positiveInteger(process.env.API_PORT ?? process.env.PORT, 8080),
  databaseUrl: process.env.DATABASE_URL ?? "",
  corsOrigins: origins,
  trustProxy: process.env.TRUST_PROXY === "true",
  sessionCookieName: "opatriota_session",
  sessionDays: 30,
};

export function assertRuntimeConfig(): void {
  if (!env.databaseUrl) throw new Error("Missing required environment variable: DATABASE_URL");
  if (env.nodeEnv === "production" && origins.some((origin) => origin.includes("localhost"))) {
    throw new Error("CORS_ORIGINS must not contain localhost in production");
  }
}
