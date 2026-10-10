-- Push subscriptions for web push delivery (VAPID tokens).
CREATE TABLE "push_subscriptions" (
  "id" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "deviceType" TEXT NOT NULL,
  "userAgent" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "push_subscriptions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "push_subscriptions_token_key" ON "push_subscriptions"("token");
CREATE INDEX "push_subscriptions_active_lastSeenAt_idx" ON "push_subscriptions"("active", "lastSeenAt");
