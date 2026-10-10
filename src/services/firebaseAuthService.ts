import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User as FirebaseUser,
  type Unsubscribe,
} from 'firebase/auth';
import type { UserSession } from '../types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean);
const firebaseApp = hasFirebaseConfig
  ? (getApps().length ? getApp() : initializeApp(firebaseConfig))
  : null;
const auth = firebaseApp ? getAuth(firebaseApp) : null;
const googleProvider = new GoogleAuthProvider();
const apiBase = String(import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const sessionRequests = new Map<string, Promise<UserSession>>();

type BackendRole = "READER" | "JOURNALIST" | "REVIEWER" | "EDITOR" | "CHIEF_EDITOR" | "ADMIN";
type BackendSession = { id: string; email: string; displayName: string; role: BackendRole; createdAt?: string };
type BackendError = { error?: { code?: string; message?: string } };

class FirebaseSessionError extends Error {
  constructor(readonly code: string, message: string) {
    super(message);
    this.name = "FirebaseSessionError";
  }
}

export function isFirebaseAuthConfigured() {
  return Boolean(auth);
}

export function observeAuth(callback: (user: UserSession | null) => void): Unsubscribe {
  if (!auth) {
    callback(null);
    return () => undefined;
  }
  return onAuthStateChanged(auth, (user) => {
    if (!user) {
      sessionRequests.clear();
      callback(null);
      return;
    }
    void establishBackendSession(user).then(callback).catch((error) => {
      console.error("Firebase identity could not be synchronized with the backend:", error instanceof FirebaseSessionError ? error.code : "AUTH_SESSION_FAILED");
      if (auth.currentUser?.uid === user.uid) void signOut(auth).catch(() => undefined);
      callback(null);
    });
  });
}

export async function signInWithGoogle() {
  if (!auth) throw new FirebaseSessionError("AUTH_NOT_CONFIGURED", "Firebase Auth is not configured");
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return await establishBackendSession(result.user);
  } catch (error) {
    if (auth.currentUser) await signOut(auth).catch(() => undefined);
    throw error;
  }
}

export async function signOutFromFirebase() {
  sessionRequests.clear();
  let logoutFailed = false;
  try {
    if (!apiBase) throw new Error("API base URL missing");
    const response = await fetch(`${apiBase}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    logoutFailed = !response.ok;
  } catch {
    logoutFailed = true;
  }
  if (auth) await signOut(auth);
  if (logoutFailed) throw new FirebaseSessionError("BACKEND_LOGOUT_FAILED", "The backend did not confirm session revocation");
}

function mapFirebaseUser(user: FirebaseUser): UserSession {
  return {
    id: user.uid,
    name: user.displayName || user.email?.split('@')[0] || 'Leitor',
    email: user.email || '',
    avatarUrl: user.photoURL || undefined,
    role: 'leitor_gratuito',
    subscription: { plan: 'gratuito', status: 'ativo', autoRenew: false },
    bookmarks: [],
    notificationPrefs: { breakingNews: true, dailyBrief: true, factChecks: true, weeklyDigest: true },
    createdAt: user.metadata.creationTime || new Date().toISOString(),
  };
}

function roleFromBackend(role: BackendRole): UserSession["role"] {
  const roles: Record<BackendRole, UserSession["role"]> = {
    READER: "leitor_gratuito",
    JOURNALIST: "jornalista",
    REVIEWER: "revisor",
    EDITOR: "editor",
    CHIEF_EDITOR: "editor_chefe",
    ADMIN: "administrador",
  };
  return roles[role];
}

function mapBackendSession(user: FirebaseUser, session: BackendSession): UserSession {
  const base = mapFirebaseUser(user);
  return {
    ...base,
    id: session.id,
    email: session.email,
    name: session.displayName || base.name,
    role: roleFromBackend(session.role),
    createdAt: session.createdAt || base.createdAt,
    subscription: { plan: "gratuito", status: "inativo", autoRenew: false },
  };
}

function establishBackendSession(user: FirebaseUser): Promise<UserSession> {
  const existingRequest = sessionRequests.get(user.uid);
  if (existingRequest) return existingRequest;

  const request = (async () => {
    if (!apiBase) throw new FirebaseSessionError("API_NOT_CONFIGURED", "VITE_API_BASE_URL is not configured");
    const currentResponse = await fetch(`${apiBase}/api/auth/me`, {
      credentials: "include",
      headers: { Accept: "application/json" },
    }).catch(() => null);
    if (currentResponse?.ok) {
      const currentPayload = await currentResponse.json().catch(() => ({})) as { data?: BackendSession };
      const currentSession = currentPayload.data;
      if (currentSession && currentSession.email.toLowerCase() === user.email?.toLowerCase()) {
        return mapBackendSession(user, currentSession);
      }
    }

    const response = await fetch(`${apiBase}/api/auth/firebase`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ idToken: await user.getIdToken() }),
    });
    const payload = await response.json().catch(() => ({})) as { data?: BackendSession } & BackendError;
    if (!response.ok || !payload.data) {
      throw new FirebaseSessionError(
        payload.error?.code || `AUTH_BACKEND_${response.status}`,
        payload.error?.message || "The backend could not establish an authenticated session",
      );
    }
    return mapBackendSession(user, payload.data);
  })().catch((error) => {
    sessionRequests.delete(user.uid);
    throw error;
  });

  sessionRequests.set(user.uid, request);
  return request;
}

export function getFirebaseAuthErrorMessage(error: unknown): string | null {
  const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
  if (["auth/popup-closed-by-user", "auth/cancelled-popup-request"].includes(code)) return null;
  const messages: Record<string, string> = {
    AUTH_NOT_CONFIGURED: "Login Google indisponível: as variáveis públicas do Firebase não estão configuradas.",
    API_NOT_CONFIGURED: "Login Google indisponível: configure a URL do backend neste ambiente.",
    FIREBASE_AUTH_NOT_CONFIGURED: "O Firebase autenticou, mas o servidor não está configurado para validar tokens.",
    ACCOUNT_DISABLED: "Esta conta está desativada. Contacte a administração.",
    EMAIL_NOT_VERIFIED: "Verifique o e-mail da conta Google antes de entrar.",
    INVALID_FIREBASE_TOKEN: "O servidor não conseguiu validar a sessão Google.",
    INVALID_AUTH_PROVIDER: "Use o provedor Google configurado para entrar.",
    BACKEND_LOGOUT_FAILED: "A sessão local foi encerrada, mas o backend não confirmou a revogação.",
    "auth/unauthorized-domain": "Este domínio não está autorizado no Firebase Authentication.",
    "auth/operation-not-allowed": "O provedor Google não está habilitado no Firebase Authentication.",
    "auth/popup-blocked": "O navegador bloqueou a janela Google. Permita pop-ups para este site.",
    "auth/network-request-failed": "Falha de rede ao contactar o Google. Verifique a ligação.",
    "auth/too-many-requests": "O Google limitou temporariamente as tentativas. Aguarde e tente novamente.",
    "auth/user-disabled": "Esta conta está desativada no Firebase Authentication.",
  };
  return messages[code] || "Não foi possível autenticar com Google. Verifique a configuração do Firebase e do backend.";
}

export async function getFirebaseIdToken() {
  const user = auth?.currentUser;
  return user ? user.getIdToken() : null;
}

export { auth };
const firebaseAuthStatus = isFirebaseAuthConfigured();
export { firebaseAuthStatus };
