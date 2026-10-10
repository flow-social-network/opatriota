-- Firebase UID association for the Google login bridge (POST /api/auth/sync).
-- The backend never trusts a role sent by the browser; the UID only links
-- the verified Firebase identity to the internal user row.
ALTER TABLE "users" ADD COLUMN "firebaseUid" TEXT;

CREATE UNIQUE INDEX "users_firebaseUid_key" ON "users"("firebaseUid");
