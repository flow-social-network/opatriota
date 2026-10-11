import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Protege rotas que exigem autenticação geral (ex: assinante).
 * Redireciona para /login?next=<rota-atual> se não autenticado.
 */
export function RequireAuth({ 
  loginRedirect = '/login', 
  children 
}: { 
  loginRedirect?: string; 
  children: React.ReactNode 
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
    return <Navigate to={`${loginRedirect}?next=${next}`} replace />;
  }

  return <>{children}</>;
}

/**
 * Protege rotas que exigem um dos papéis listados.
 * Redireciona para login específico caso não esteja logado,
 * ou /acesso-negado caso logado mas sem papel suficiente.
 */
export function RequireRole({
  roles,
  loginRedirect = '/login',
  children,
}: {
  roles: string[];
  loginRedirect?: string;
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
    return <Navigate to={`${loginRedirect}?next=${next}`} replace />;
  }

  if (!roles.includes(currentUser.role)) {
    return <Navigate to="/acesso-negado" replace />;
  }

  return <>{children}</>;
}
