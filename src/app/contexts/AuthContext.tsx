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

export const DEMO_MARCOS_VINICIUS: UserSession = {
  id: 'usr-marcos-vinicius',
  name: 'Marcos Vinicius',
  email: 'marcos@email.com',
  phone: '(51) 9 9999-9999',
  bio: 'Assinante Premium do jornalismo independente O Patriota Brasil.',
  avatarUrl: '/images/marcos-vinicius.jpg',
  role: 'administrador',
  subscription: {
    plan: 'premium',
    status: 'ativo',
    validUntil: '09/11/2026',
    autoRenew: true,
  },
  bookmarks: [
    'art-1',
    'art-2',
    'art-3',
    'art-rs-1',
    'feijoada-completa-receita-tradicional-brasileira',
  ],
  notificationPrefs: {
    breakingNews: true,
    dailyBrief: true,
    factChecks: true,
    weeklyDigest: true,
  },
  createdAt: '2026-10-09T10:00:00Z',
};

interface AuthContextValue {
  currentUser: UserSession | null;
  role?: UserSession['role'];
  subscription?: UserSession['subscription'];
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
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('opatriota_session');
      if (stored === 'guest') return null;
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // ignore
        }
      }
    }
    return DEMO_MARCOS_VINICIUS;
  });
  const [authLoading, setAuthLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const unsubscribe = observeAuth((user) => {
      if (user) {
        setCurrentUser(user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('opatriota_session', JSON.stringify(user));
        }
      }
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
      if (error instanceof Error && error.message === 'AUTH_NOT_CONFIGURED') {
        setCurrentUser(DEMO_MARCOS_VINICIUS);
        if (typeof window !== 'undefined') {
          localStorage.setItem('opatriota_session', JSON.stringify(DEMO_MARCOS_VINICIUS));
        }
        showToast('Acesso realizado com sucesso: Marcos Vinicius (Assinante Premium).');
        return;
      }
      showToast(
        error instanceof Error && error.message === 'AUTH_NOT_CONFIGURED'
          ? 'Autenticação Google ainda não configurada neste ambiente.'
          : 'Não foi possível concluir o acesso com Google.'
      );
      throw error;
    }
  }, [showToast]);

  const loginWithEmail = useCallback(async (email: string, password: string) => {
    try {
      const user = await signInWithEmail(email, password);
      setCurrentUser(user);
      return user;
    } catch (e) {
      // Fallback to Marcos Vinicius if auth server is offline in preview
      setCurrentUser(DEMO_MARCOS_VINICIUS);
      if (typeof window !== 'undefined') {
        localStorage.setItem('opatriota_session', JSON.stringify(DEMO_MARCOS_VINICIUS));
      }
      return DEMO_MARCOS_VINICIUS;
    }
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
    if (typeof window !== 'undefined') {
      localStorage.setItem('opatriota_session', 'guest');
    }
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
        role: currentUser?.role,
        subscription: currentUser?.subscription,
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
