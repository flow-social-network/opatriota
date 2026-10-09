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

export function isFirebaseAuthConfigured() {
  return Boolean(auth);
}

export function observeAuth(callback: (user: UserSession | null) => void): Unsubscribe {
  if (!auth) {
    callback(null);
    return () => undefined;
  }
  return onAuthStateChanged(auth, (user) => callback(user ? mapFirebaseUser(user) : null));
}

export async function signInWithGoogle() {
  if (!auth) throw new Error('AUTH_NOT_CONFIGURED');
  const result = await signInWithPopup(auth, googleProvider);
  return mapFirebaseUser(result.user);
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

export async function getFirebaseIdToken() {
  const user = auth?.currentUser;
  return user ? user.getIdToken() : null;
}

export { auth };
const firebaseAuthStatus = isFirebaseAuthConfigured();
export { firebaseAuthStatus };
