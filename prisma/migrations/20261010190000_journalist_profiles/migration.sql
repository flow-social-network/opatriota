-- Public journalist profile and newsroom-affiliation verification.
CREATE TYPE "JournalistVerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'SUSPENDED', 'REVOKED');
CREATE TABLE "journalist_profiles" (
 "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "slug" TEXT NOT NULL,
 "professionalTitle" TEXT, "bio" TEXT, "photoUrl" TEXT, "publicContactUrl" TEXT,
 "credentialCode" TEXT NOT NULL, "status" "JournalistVerificationStatus" NOT NULL DEFAULT 'PENDING',
 "verifiedAt" TIMESTAMP(3), "verifiedById" TEXT, "expiresAt" TIMESTAMP(3),
 "evidenceReference" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "journalist_profiles_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "journalist_profiles_userId_key" ON "journalist_profiles"("userId");
CREATE UNIQUE INDEX "journalist_profiles_slug_key" ON "journalist_profiles"("slug");
CREATE UNIQUE INDEX "journalist_profiles_credentialCode_key" ON "journalist_profiles"("credentialCode");
CREATE INDEX "journalist_profiles_status_expiresAt_idx" ON "journalist_profiles"("status", "expiresAt");
ALTER TABLE "journalist_profiles" ADD CONSTRAINT "journalist_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "journalist_profiles" ADD CONSTRAINT "journalist_profiles_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
