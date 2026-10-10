import { PrismaClient } from "@prisma/client";

// Vercel/Neon exposes POSTGRES_URL; the Prisma schema expects DATABASE_URL.
if (!process.env.DATABASE_URL && process.env.POSTGRES_URL) {
  process.env.DATABASE_URL = process.env.POSTGRES_URL;
}

const globalForPrisma = globalThis as unknown as { opatriotaPrisma?: PrismaClient };

export const prisma =
  globalForPrisma.opatriotaPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.opatriotaPrisma = prisma;
