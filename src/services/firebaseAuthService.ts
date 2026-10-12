type Unsubscribe = () => void;
import type { UserSession } from '../types';
import { api, setApiTokenProvider } from './apiClient';

export function isFirebaseAuthConfigured() {
  return false;
}

export function observeAuth(callback: (user: UserSession | null) => void): Unsubscribe {
  void api.get<{ user: UserSession }>('/auth/me', { auth: false }).then(({ user }) => callback(user)).catch(() => callback(null));
  return () => undefined;
}

export async function signInWithGoogle() {
  throw new Error('AUTH_NOT_CONFIGURED');
}

export async function signInWithEmail(email: string, password: string): Promise<UserSession> {
  const result = await api.post<{ user: UserSession }>('/auth/login', { email: email.trim(), password }, { auth: false });
  return result.user;
}

export async function registerWithEmail(name: string, email: string, password: string): Promise<UserSession> {
  const result = await api.post<{ user: UserSession }>('/auth/register', { name: name.trim(), email: email.trim(), password }, { auth: false });
  return result.user;
}

export async function requestPasswordReset(_email: string): Promise<void> {
  throw new Error('A recuperação de senha será disponibilizada em breve.');
}

export async function confirmPasswordResetCode(_code: string, _newPassword: string): Promise<void> {
  throw new Error('A recuperação de senha será disponibilizada em breve.');
}

export async function signOutFromFirebase() {
  await api.post('/auth/logout', undefined, { auth: false }).catch(() => undefined);
}

export async function getFirebaseIdToken() {
  return null;
}

export async function refreshUserProfile(): Promise<UserSession | null> {
  try {
    const result = await api.get<{ user: UserSession }>('/auth/me', { auth: false });
    return result.user;
  } catch {
    return null;
  }
}

export const firebaseAuthStatus = false;
