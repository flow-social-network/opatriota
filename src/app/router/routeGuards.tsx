import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Protege rotas que exigem autenticação.
 * Redireciona para /minha-conta?next=<rota-atual> se não autenticado.
 * A autorização real é sempre validada no backend.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { currentUser, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA]">
        <div role="status" aria-label="Carregando sessão" className="text-[#0B2345] font-semibold animate-pulse">
          Verificando sessão…
        </div>
      </div>
    );
  }

  if (!currentUser) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/minha-conta?next=${next}`} replace />;
  }

  return <>{children}</>;
}

/**
 * Protege rotas que exigem um dos papéis listados.
 * Redireciona para /acesso-negado se o papel não for permitido.
 */
export function RequireRole({
  roles,
  children,
}: {
  roles: string[];
  children: React.ReactNode;
}) {
  const { currentUser, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA]">
        <div role="status" aria-label="Carregando sessão" className="text-[#0B2345] font-semibold animate-pulse">
          Verificando sessão…
        </div>
      </div>
    );
  }

  if (!currentUser) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/minha-conta?next=${next}`} replace />;
  }

  if (!roles.includes(currentUser.role)) {
    return <Navigate to="/acesso-negado" replace />;
  }

  return <>{children}</>;
}
