import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { opatriotaPrisma?: PrismaClient };

export const prisma =
  globalForPrisma.opatriotaPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.opatriotaPrisma = prisma;
