import "dotenv/config";
function required(name: string): string { const v = process.env[name]?.trim(); if (!v) throw new Error(`Missing required environment variable: ${name}`); return v; }
export const env = { nodeEnv: process.env.NODE_ENV ?? "development", port: Number(process.env.PORT ?? 8080), databaseUrl: required("DATABASE_URL"), corsOrigins: (process.env.CORS_ORIGINS ?? "http://localhost:3000").split(",").map(v => v.trim()).filter(Boolean), trustProxy: process.env.TRUST_PROXY === "true" };
