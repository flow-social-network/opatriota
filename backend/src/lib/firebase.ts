import { cert, getApps, initializeApp, type App, type Credential } from "firebase-admin/app";
import { getAuth, type Auth, type DecodedIdToken } from "firebase-admin/auth";
import { env, firebaseConfigured } from "../config/env.js";
import { HttpError } from "./http.js";

let authInstance: Auth | undefined;

function buildCredential(): Credential {
  const { serviceAccountJson, projectId, clientEmail, privateKey } = env.firebase;
  if (serviceAccountJson) {
    try {
      return cert(JSON.parse(serviceAccountJson));
    } catch {
      throw new HttpError(503, "AUTH_PROVIDER_UNAVAILABLE", "Authentication provider is misconfigured");
    }
  }
  if (clientEmail && privateKey) {
    return cert({ projectId, clientEmail, privateKey });
  }
  throw new HttpError(503, "AUTH_PROVIDER_UNAVAILABLE", "Authentication provider is not configured");
}

function firebaseAuth(): Auth {
  if (authInstance) return authInstance;
  if (!firebaseConfigured()) {
    throw new HttpError(503, "AUTH_PROVIDER_UNAVAILABLE", "Authentication provider is not configured");
  }
  const credential = buildCredential();
  const app = getApps()[0] ?? initializeApp({ credential, projectId: env.firebase.projectId || undefined });
  authInstance = getAuth(app);
  return authInstance;
}

/**
 * Verifies a Firebase ID token (signature + expiry + optional revocation check).
 * Never trusts claims coming from the browser without this server-side check.
 */
export async function verifyFirebaseIdToken(idToken: string): Promise<DecodedIdToken> {
  try {
    return await firebaseAuth().verifyIdToken(idToken, env.firebase.checkRevoked);
  } catch (error) {
    const code = (error as { code?: string }).code ?? "";
    if (typeof code === "string" && code.startsWith("auth/")) {
      throw new HttpError(401, "INVALID_TOKEN", "Firebase ID token is invalid or expired");
    }
    // Network/revocation-check failures must not silently authenticate anyone.
    throw new HttpError(503, "AUTH_PROVIDER_UNAVAILABLE", "Authentication provider is unavailable");
  }
}
