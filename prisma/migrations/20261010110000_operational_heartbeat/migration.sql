CREATE TABLE "operational_heartbeats" (
  "id" TEXT NOT NULL,
  "processId" INTEGER,
  "hostname" TEXT,
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastCycleAt" TIMESTAMP(3),
  "lastError" TEXT,
  CONSTRAINT "operational_heartbeats_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "operational_heartbeats_lastSeenAt_idx" ON "operational_heartbeats"("lastSeenAt");
