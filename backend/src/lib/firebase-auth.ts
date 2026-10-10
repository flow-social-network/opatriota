import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth, type DecodedIdToken } from "firebase-admin/auth";
import { HttpError } from "./http.js";

function getFirebaseAdminAuth() {
  const existing = getApps().find((app) => app.name === "opatriota-auth");
  if (existing) return getAuth(existing);

  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) {
    throw new HttpError(503, "FIREBASE_AUTH_NOT_CONFIGURED", "Google sign-in is not configured on the server");
  }

  try {
    const app = initializeApp({ credential: cert({ projectId, clientEmail, privateKey }), projectId }, "opatriota-auth");
    return getAuth(app);
  } catch {
    throw new HttpError(503, "FIREBASE_AUTH_NOT_CONFIGURED", "Google sign-in is not configured on the server");
  }
}

export async function verifyGoogleIdToken(idToken: string): Promise<{ email: string; displayName: string }> {
  if (!idToken || idToken.length > 8192) {
    throw new HttpError(400, "INVALID_FIREBASE_TOKEN", "Firebase ID token is invalid");
  }

  let decoded: DecodedIdToken;
  try {
    decoded = await getFirebaseAdminAuth().verifyIdToken(idToken, true);
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(401, "INVALID_FIREBASE_TOKEN", "Google sign-in could not be verified");
  }

  if (decoded.firebase?.sign_in_provider !== "google.com") {
    throw new HttpError(401, "INVALID_AUTH_PROVIDER", "Sign in with Google to continue");
  }
  if (!decoded.email || decoded.email_verified !== true) {
    throw new HttpError(403, "EMAIL_NOT_VERIFIED", "Verify your Google account email before continuing");
  }

  return {
    email: decoded.email.trim().toLowerCase(),
    displayName: (decoded.name || decoded.email.split("@")[0]).trim().slice(0, 100),
  };
}