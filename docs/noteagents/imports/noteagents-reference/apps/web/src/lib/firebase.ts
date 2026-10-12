import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, GithubAuthProvider, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? 'noteagents.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'noteagents',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function getFirebaseAuth(): Auth {
  if (typeof window === 'undefined') throw new Error('Firebase Authentication só pode ser acessado no navegador.');
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return getAuth(app);
}

export function getGithubProvider() {
  const provider = new GithubAuthProvider();
  provider.addScope('repo');
  return provider;
}
