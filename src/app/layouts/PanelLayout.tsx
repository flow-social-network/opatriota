import React from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Home } from 'lucide-react';

interface PanelLayoutProps {
  title?: string;
  subtitle?: string;
  allowedRoles?: string[];
  accentColor?: string;
  showHeader?: boolean;
}

/**
 * Layout base para painéis internos (admin, redação, cliente).
 * Valida a sessão e papel do usuário.
 */
export function PanelLayout({ 
  title = 'Painel', 
  subtitle, 
  allowedRoles, 
  accentColor = '#0B2345',
  showHeader = false 
}: PanelLayoutProps) {
  const { currentUser, authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const adminModulePaths = new Set([
    '/admin/dashboard', '/admin/articles', '/admin/materias',
    '/admin/categories', '/admin/categorias', '/admin/journalists', '/admin/autores',
    '/admin/sources', '/admin/fontes', '/admin/users', '/admin/usuarios',
    '/admin/permissions', '/admin/permissoes',
  ]);
  const showAdminModuleNavigation = adminModulePaths.has(location.pathname);
  const adminModuleLinks = [
    { to: '/admin/dashboard', label: 'Visão geral' },
    { to: '/admin/articles', label: 'Matérias' },
    { to: '/admin/categories', label: 'Editorias' },
    { to: '/admin/journalists', label: 'Autores' },
    { to: '/admin/sources', label: 'Fontes RSS' },
    { to: '/admin/users', label: 'Usuários' },
    { to: '/admin/permissions', label: 'Permissões' },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA]">
        <div role="status" aria-label="Carregando" className="animate-pulse text-[#0B2345] font-semibold text-sm">
          Verificando credenciais e sessão…
        </div>
      </div>
    );
  }

  // Guard de frontend — o backend continua validando autorização real
  if (allowedRoles && (!currentUser || !allowedRoles.includes(currentUser.role))) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F8FA] gap-4 p-4 text-center">
        <h1 className="text-2xl font-bold text-[#0B2345]">Acesso restrito</h1>
        <p className="text-sm text-[#4A5568] max-w-md">
          Sua conta não tem permissão para acessar esta área interna do portal O Patriota.
        </p>
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-[#0B2345] text-white rounded-lg text-sm hover:bg-[#132D50] transition-colors cursor-pointer"
          >
            <Home size={16} /> Voltar ao Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] font-sans antialiased text-[#17202A]">
      {showHeader && (
        <header
          className="sticky top-0 z-40 border-b border-[#E2E8F0]"
          style={{ backgroundColor: accentColor }}
        >
          <div className="max-w-[1400px] mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-1.5 text-white/80 hover:text-white text-xs transition-colors cursor-pointer"
                aria-label="Voltar ao portal"
              >
                <ArrowLeft size={14} /> Portal
              </button>
              <span className="text-white font-bold text-sm tracking-wide">{title}</span>
              {subtitle && (
                <span className="hidden sm:inline text-white/60 text-xs">— {subtitle}</span>
              )}
            </div>
            <nav className="flex items-center gap-4 text-xs" aria-label="Navegação do painel">
              <Link to="/" className="text-white/70 hover:text-white transition-colors">Início</Link>
              {currentUser && (
                <span className="text-white/50">{currentUser.name}</span>
              )}
            </nav>
          </div>
        </header>
      )}

      {showAdminModuleNavigation && (
        <nav aria-label="Módulos administrativos" className="border-b border-[#D9DEE7] bg-white">
          <div className="mx-auto flex max-w-[1400px] gap-1 overflow-x-auto px-4 py-2">
            {adminModuleLinks.map((item) => {
              const active = location.pathname === item.to ||
                (item.to === '/admin/articles' && location.pathname === '/admin/materias') ||
                (item.to === '/admin/categories' && location.pathname === '/admin/categorias') ||
                (item.to === '/admin/journalists' && location.pathname === '/admin/autores') ||
                (item.to === '/admin/sources' && location.pathname === '/admin/fontes') ||
                (item.to === '/admin/users' && location.pathname === '/admin/usuarios') ||
                (item.to === '/admin/permissions' && location.pathname === '/admin/permissoes');
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={active ? 'page' : undefined}
                  className={`shrink-0 rounded-md px-3 py-2 text-xs font-semibold transition ${active ? 'bg-[#0B2345] text-white' : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0B2345]'}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
