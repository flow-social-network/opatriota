import assert from "node:assert/strict";
import test from "node:test";
import { HttpError } from "../src/lib/http.js";
import { verifyGoogleIdToken } from "../src/lib/firebase-auth.js";

test("Firebase ID token validation fails closed when configuration is absent", async () => {
  const names = ["FIREBASE_PROJECT_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY"] as const;
  const original = new Map(names.map((name) => [name, process.env[name]]));
  for (const name of names) delete process.env[name];

  try {
    await assert.rejects(
      verifyGoogleIdToken(""),
      (error: unknown) => error instanceof HttpError && error.status === 400 && error.code === "INVALID_FIREBASE_TOKEN",
    );
    await assert.rejects(
      verifyGoogleIdToken("not-a-real-token"),
      (error: unknown) => error instanceof HttpError && error.status === 503 && error.code === "FIREBASE_AUTH_NOT_CONFIGURED",
    );
  } finally {
    for (const name of names) {
      const value = original.get(name);
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  }
});