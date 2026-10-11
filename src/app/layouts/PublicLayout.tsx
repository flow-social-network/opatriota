
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { SupportModal } from '../../components/SupportModal';
import { SubscriberModalsContainer, SubscriberModalType } from '../../components/subscriber/SubscriberModalsContainer';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import type { CategorySlug } from '../../types';

/**
 * Layout principal do portal público.
 * Header + conteúdo + rodapé, com navegação via react-router e popups fecháveis do assinante.
 */
export function PublicLayout() {
  const { currentUser, loginWithGoogle, logout } = useAuth();
  const { articles, categories, pages, menuConfig, portalSettings } = useData();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [supportOpen, setSupportOpen] = useState(false);
  const [subscriberModal, setSubscriberModal] = useState<SubscriberModalType>(null);

  const handleSelectCategory = (cat: CategorySlug | string) => {
    if (cat === 'checagem') navigate('/verificacao');
    else if (cat === 'todos') navigate('/');
    else navigate(`/categoria/${cat}`);
  };

  const handleNavigatePage = (rawSlug: string) => {
    const slug = rawSlug.replace(/^\/|\/$/g, '');
    switch (slug) {
      case 'minha-conta': 
        setSubscriberModal('area-assinante');
        return;
      case 'login': return navigate('/login');
      case 'cadastro': return navigate('/cadastro');
      case 'esqueci-a-senha': return navigate('/esqueci-a-senha');
      case 'redefinir-senha': return navigate('/redefinir-senha');
      case 'admin': return navigate('/admin');
      case 'admin/login': return navigate('/admin/login');
      case 'redacao': return navigate('/redacao');
      case 'redacao/login': return navigate('/redacao/login');
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
    if (pages.some(p => p.slug === slug) || [
      'sobre-o-patriota', 'principios-editoriais', 'expediente', 'fontes-e-metodologia',
      'politica-de-correcoes', 'politica-de-privacidade', 'termos-de-uso', 'seguranca-da-informacao',
      'mapa-do-site', 'contato', 'trabalhe-conosco', 'central-de-ajuda', 'perguntas-frequentes',
      'anuncie-conosco', 'fale-com-a-redacao', 'fale-com-o-comercial', 'cookies', 'newsletter'
    ].includes(slug)) {
      return navigate(`/${slug}`);
    }
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
        onOpenSubscriberArea={(sub) => {
          if (sub === 'entrar') handleGoogleLogin();
          else setSubscriberModal('area-assinante');
        }}
        onOpenSubscriberModal={(modalType) => setSubscriberModal(modalType)}
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

      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenSupport={() => setSupportOpen(true)}
        onNavigatePage={handleNavigatePage}
        onOpenSubscriberModal={(modalType) => setSubscriberModal(modalType)}
        menuConfig={menuConfig}
      />
      <SupportModal isOpen={supportOpen} onClose={() => setSupportOpen(false)} />
      <SubscriberModalsContainer
        modalType={subscriberModal}
        onClose={() => setSubscriberModal(null)}
        onSwitchModal={(type) => setSubscriberModal(type)}
        currentUser={currentUser}
        articles={articles}
        onSelectArticle={(art) => navigate(`/noticia/${art.slug}`)}
      />
    </div>
  );
}

