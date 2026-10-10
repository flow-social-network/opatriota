
import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { BrandPillarsFooter } from '../../components/BrandPillarsFooter';
import { SupportModal } from '../../components/SupportModal';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import type { CategorySlug } from '../../types';

/**
 * Layout principal do portal público.
 * Header + conteúdo + rodapé, com navegação via react-router.
 */
export function PublicLayout() {
  const { currentUser, loginWithGoogle, logout } = useAuth();
  const { categories, pages, menuConfig, portalSettings } = useData();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [supportOpen, setSupportOpen] = React.useState(false);

  const handleSelectCategory = (cat: CategorySlug) => {
    if (cat === 'checagem') navigate('/verificacao');
    else if (cat === 'todos') navigate('/');
    else navigate(`/categoria/${cat}`);
  };

  const handleNavigatePage = (rawSlug: string) => {
    const slug = rawSlug.replace(/^\/|\/$/g, '');
    switch (slug) {
      case 'minha-conta': return navigate('/minha-conta');
      case 'redacao': return navigate('/redacao');
      case 'planos': case 'apoie-o-jornal': return navigate('/planos');
      case 'contato': return navigate('/contato');
      case 'gestao-de-dados': return navigate('/gestao-de-dados');
      case 'arquivo': return navigate('/arquivo');
      case 'busca': return navigate('/busca');
      case 'checagem': return navigate('/verificacao');
      default: break;
    }
    if (slug.startsWith('categoria/')) return navigate(`/categoria/${slug.replace('categoria/', '')}`);
    if (categories.some(c => c.slug === slug)) return navigate(`/categoria/${slug}`);
    if (pages.some(p => p.slug === slug)) return navigate(`/${slug}`);
    navigate('/404');
  };

  const handleGoogleLogin = async () => {
    try { await loginWithGoogle(); } catch { /* toast já exibido pelo context */ }
  };

  const handleGoogleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] font-sans antialiased text-[#17202A]">
      <Header
        currentCategory={(location.pathname.match(/^\/categoria\/([^/]+)/)?.[1] as CategorySlug) || 'todos'}
        onSelectCategory={handleSelectCategory}
        onOpenSupport={() => setSupportOpen(true)}
        onOpenAdmin={() => navigate('/admin')}
        onOpenSubscriberArea={(sub) => navigate(sub === 'entrar' ? '/minha-conta?tab=entrar' : '/minha-conta')}
        onOpenNewsroom={() => navigate('/redacao')}
        onGoogleLogin={handleGoogleLogin}
        onGoogleLogout={handleGoogleLogout}
        onNavigatePage={handleNavigatePage}
        currentUser={currentUser}
        searchQuery={new URLSearchParams(location.search).get('q') || ''}
        onSearchChange={() => { /* controlado pelo SearchPage */ }}
        onSearchSubmit={() => navigate('/busca')}
        portalSettings={portalSettings}
      />

      <main className="flex-1">
        <Outlet />
      </main>

      <BrandPillarsFooter />
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenSupport={() => setSupportOpen(true)}
        onNavigatePage={handleNavigatePage}
        menuConfig={menuConfig}
      />
      <SupportModal isOpen={supportOpen} onClose={() => setSupportOpen(false)} />
    </div>
  );
}
