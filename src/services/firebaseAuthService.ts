import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
  type User as FirebaseUser,
  type Unsubscribe,
} from 'firebase/auth';
import type { UserSession } from '../types';
import { api, setApiTokenProvider } from './apiClient';

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
      callback(null);
      return;
    }
    void mapAuthenticatedUser(user).then(callback).catch((error) => {
      console.error('Não foi possível carregar o perfil no backend:', error);
      callback(mapFirebaseUser(user));
    });
  });
}

export async function signInWithGoogle() {
  if (!auth) throw new Error('AUTH_NOT_CONFIGURED');
  const result = await signInWithPopup(auth, googleProvider);
  return mapAuthenticatedUser(result.user);
}

export async function signInWithEmail(email: string, password: string): Promise<UserSession> {
  if (!auth) throw new Error('AUTH_NOT_CONFIGURED');
  const result = await signInWithEmailAndPassword(auth, email.trim(), password);
  return mapAuthenticatedUser(result.user);
}

export async function registerWithEmail(name: string, email: string, password: string): Promise<UserSession> {
  if (!auth) throw new Error('AUTH_NOT_CONFIGURED');
  const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
  await updateProfile(result.user, { displayName: name.trim() });
  await result.user.getIdToken(true);
  return mapAuthenticatedUser(result.user);
}

export async function requestPasswordReset(email: string): Promise<void> {
  if (!auth) throw new Error('AUTH_NOT_CONFIGURED');
  await sendPasswordResetEmail(auth, email.trim());
}

export async function signOutFromFirebase() {
  if (auth) await signOut(auth);
}

function mapFirebaseUser(user: FirebaseUser): UserSession {
  return {
    id: user.uid,
    name: user.displayName || user.email?.split('@')[0] || 'Leitor',
    email: user.email || '',
    avatarUrl: user.photoURL || undefined,
    role: 'leitor_gratuito',
    subscription: { plan: 'gratuito', status: 'inativo', autoRenew: false },
    bookmarks: [],
    notificationPrefs: { breakingNews: true, dailyBrief: true, factChecks: true, weeklyDigest: true },
    createdAt: user.metadata.creationTime || new Date().toISOString(),
  };
}

async function mapAuthenticatedUser(user: FirebaseUser): Promise<UserSession> {
  const base = mapFirebaseUser(user);
  const profile = await api.get<{
    role?: UserSession['role'];
    name?: string;
    avatarUrl?: string;
    phone?: string;
    bio?: string;
    subscription?: UserSession['subscription'];
    bookmarks?: string[];
    notificationPrefs?: UserSession['notificationPrefs'];
  }>('/me');
  return {
    ...base,
    name: profile.name || base.name,
    avatarUrl: profile.avatarUrl || base.avatarUrl,
    phone: profile.phone,
    bio: profile.bio,
    role: profile.role || 'leitor_gratuito',
    subscription: profile.subscription || base.subscription,
    bookmarks: profile.bookmarks || base.bookmarks,
    notificationPrefs: profile.notificationPrefs || base.notificationPrefs,
  };
}

export async function getFirebaseIdToken() {
  const user = auth?.currentUser;
  return user ? user.getIdToken() : null;
}

// O cliente centralizado da API recebe apenas o token atual do utilizador autenticado.
setApiTokenProvider(getFirebaseIdToken);

export { auth };
const firebaseAuthStatus = isFirebaseAuthConfigured();
export { firebaseAuthStatus };
