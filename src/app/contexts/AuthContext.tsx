import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import {
  observeAuth,
  signInWithGoogle,
  signInWithEmail,
  registerWithEmail,
  requestPasswordReset,
  signOutFromFirebase,
  refreshUserProfile,
} from '../../services/firebaseAuthService';
import { api } from '../../services/apiClient';
import { useToast } from './ToastContext';
import type { UserSession } from '../../types';

interface AuthContextValue {
  currentUser: UserSession | null;
  authLoading: boolean;
  setCurrentUser: (user: UserSession | null) => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<UserSession>;
  register: (name: string, email: string, password: string) => Promise<UserSession>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<UserSession | null>;
  toggleBookmark: (articleId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const unsubscribe = observeAuth((user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      // Trata retorno do checkout: recarrega perfil e limpa a URL
      if (user && typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('checkout') === 'success') {
          window.history.replaceState({}, '', window.location.pathname);
          void refreshUserProfile().then((fresh) => {
            if (fresh) setCurrentUser(fresh);
          }).catch(() => { /* perfil será atualizado no próximo login */ });
        }
      }
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      showToast(
        error instanceof Error && error.message === 'AUTH_NOT_CONFIGURED'
          ? 'Autenticação Google ainda não configurada neste ambiente.'
          : 'Não foi possível concluir o acesso com Google.'
      );
      throw error;
    }
  }, [showToast]);

  const loginWithEmail = useCallback(async (email: string, password: string) => {
    const user = await signInWithEmail(email, password);
    setCurrentUser(user);
    return user;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const user = await registerWithEmail(name, email, password);
    setCurrentUser(user);
    return user;
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await requestPasswordReset(email);
  }, []);

  const logout = useCallback(async () => {
    await signOutFromFirebase();
    setCurrentUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const fresh = await refreshUserProfile();
    if (fresh) setCurrentUser(fresh);
    return fresh;
  }, []);

  const toggleBookmark = useCallback(async (articleId: string) => {
    if (!currentUser) return;
    const current = currentUser.bookmarks || [];
    const exists = current.includes(articleId);
    const updated = exists ? current.filter(id => id !== articleId) : [...current, articleId];
    try {
      await api.put('/me/bookmarks', { bookmarks: updated });
      setCurrentUser({ ...currentUser, bookmarks: updated });
    } catch {
      showToast('Não foi possível guardar os favoritos no servidor.');
    }
  }, [currentUser, showToast]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        authLoading,
        setCurrentUser,
        loginWithGoogle,
        loginWithEmail,
        register,
        resetPassword,
        logout,
        refreshProfile,
        toggleBookmark,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
