-- Human editorial approval and risk assessment.
-- Apply only after backup and validation against a disposable Neon branch.
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'REVIEWER';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'CHIEF_EDITOR';
ALTER TYPE "ArticleStatus" ADD VALUE IF NOT EXISTS 'CHANGES_REQUESTED';
ALTER TYPE "ArticleStatus" ADD VALUE IF NOT EXISTS 'REJECTED';

CREATE TYPE "EditorialRiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

ALTER TABLE "articles"
  ADD COLUMN "riskLevel" "EditorialRiskLevel" NOT NULL DEFAULT 'MEDIUM',
  ADD COLUMN "riskAssessment" JSONB,
  ADD COLUMN "humanApprovedAt" TIMESTAMP(3),
  ADD COLUMN "humanApprovedById" TEXT;

ALTER TABLE "articles"
  ADD CONSTRAINT "articles_humanApprovedById_fkey"
  FOREIGN KEY ("humanApprovedById") REFERENCES "users"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "articles_humanApprovedById_idx" ON "articles"("humanApprovedById");

ALTER TABLE "article_reviews"
  ADD COLUMN "riskLevel" "EditorialRiskLevel",
  ADD COLUMN "riskNotes" TEXT,
  ADD COLUMN "isSelfApproval" BOOLEAN NOT NULL DEFAULT false;

-- Existing records are not automatically marked as human-approved.
-- Historical published articles remain published, but all new submissions
-- must pass the explicit approval workflow before publication.

CREATE TABLE "notifications" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "entityType" TEXT,
  "entityId" TEXT,
  "readAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "notifications_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "notifications_userId_readAt_createdAt_idx" ON "notifications"("userId", "readAt", "createdAt" DESC);
CREATE INDEX "notifications_entityType_entityId_idx" ON "notifications"("entityType", "entityId");
