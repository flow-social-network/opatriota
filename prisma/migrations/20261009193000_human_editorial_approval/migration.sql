-- Human editorial approval and risk assessment.
-- Apply only after backup and validation against a disposable Neon branch.
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'REVIEWER';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'CHIEF_EDITOR';

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
