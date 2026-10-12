import React, { useState } from 'react';
import { 
  X, 
  User, 
  CreditCard, 
  Star, 
  Bell, 
  Settings, 
  LayoutGrid, 
  Check, 
  ShieldCheck, 
  Clock, 
  FileText, 
  MessageSquare, 
  Mail, 
  CheckCircle2, 
  Calendar,
  Lock,
  Sliders,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Globe,
  Trash2,
  Bookmark
} from 'lucide-react';
import { UserSession, Article } from '../../types';

export type SubscriberModalType = 
  | 'perfil' 
  | 'assinatura' 
  | 'favoritos' 
  | 'notificacoes' 
  | 'configuracoes' 
  | 'area-assinante' 
  | null;

interface SubscriberModalsContainerProps {
  modalType: SubscriberModalType;
  onClose: () => void;
  onSwitchModal: (type: SubscriberModalType) => void;
  currentUser: UserSession | null;
  articles?: Article[];
  onSelectArticle?: (article: Article) => void;
}

export const SubscriberModalsContainer: React.FC<SubscriberModalsContainerProps> = ({
  modalType,
  onClose,
  onSwitchModal,
  currentUser,
  articles = [],
  onSelectArticle,
}) => {
  // Tabs internal states
  const [profileTab, setProfileTab] = useState<'dados' | 'foto' | 'senha' | 'preferencias' | 'privacidade'>('dados');
  const [fullName, setFullName] = useState(currentUser?.name || 'Marcos Vinicius');
  const [email, setEmail] = useState(currentUser?.email || 'marcos@email.com');
  const [phone, setPhone] = useState(currentUser?.phone || '(51) 9 9999-9999');
  const [city, setCity] = useState('Rolante (RS)');
  const [profileSaved, setProfileSaved] = useState(false);

  // Favoritos tab
  const [favoritesTab, setFavoritesTab] = useState<'noticias' | 'videos' | 'colunistas' | 'receitas'>('noticias');

  // Notificações tab
  const [notifTab, setNotifTab] = useState<'todas' | 'novas' | 'assinatura' | 'editorial' | 'sistema'>('todas');

  // Configurações tab
  const [settingsTab, setSettingsTab] = useState<'geral' | 'notificacoes' | 'privacidade' | 'aparencia' | 'idioma' | 'integracoes' | 'seguranca'>('geral');
  const [prefNewsletter, setPrefNewsletter] = useState(true);
  const [prefNovasMaterias, setPrefNovasMaterias] = useState(true);
  const [prefResumoDiario, setPrefResumoDiario] = useState(true);
  const [prefVideos, setPrefVideos] = useState(true);
  const [prefColunistas, setPrefColunistas] = useState(true);
  const [prefIdioma, setPrefIdioma] = useState('Português (Brasil)');
  const [prefFuso, setPrefFuso] = useState('Brasília (GMT-3)');
  const [settingsSaved, setSettingsSaved] = useState(false);

  if (!modalType) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-white rounded-xl shadow-2xl border border-[#D9DEE7] w-full max-w-3xl max-h-[92vh] overflow-y-auto flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ============================================================ */}
        {/* 2. POPUP - MEU PERFIL */}
        {/* ============================================================ */}
        {modalType === 'perfil' && (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#D9DEE7] bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2.5 text-[#0B2345]">
                <User className="w-5 h-5 text-[#0B5FFF]" />
                <h3 className="font-serif text-lg font-bold text-[#0B2345]">Meu Perfil</h3>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#5D6673] hover:text-[#0B2345] hover:bg-slate-100 transition cursor-pointer"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content: Sidebar + Form */}
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[420px]">
              {/* Left Sidebar Tabs */}
              <div className="md:col-span-4 bg-[#F8FAFC] border-r border-[#E2E8F0] p-4 space-y-1">
                {[
                  { id: 'dados', label: 'Dados Pessoais', icon: User },
                  { id: 'foto', label: 'Foto e Perfil', icon: Sparkles },
                  { id: 'senha', label: 'Senha e Segurança', icon: Lock },
                  { id: 'preferencias', label: 'Preferências', icon: Settings },
                  { id: 'privacidade', label: 'Privacidade', icon: ShieldCheck },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setProfileTab(item.id as any)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition text-left cursor-pointer ${
                      profileTab === item.id 
                        ? 'bg-[#0B5FFF] text-white shadow-xs' 
                        : 'text-[#475569] hover:bg-slate-200/60'
                    }`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Right Body */}
              <div className="md:col-span-8 p-6">
                <h4 className="font-serif text-base font-bold text-[#0B2345] mb-5">
                  Dados Pessoais
                </h4>

                {profileSaved && (
                  <div className="mb-4 p-3 bg-[#EBF7EE] border border-[#16803C]/30 text-[#16803C] text-xs rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Alterações salvas com sucesso!</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                  {/* Photo Avatar Row */}
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src="/images/marcos-vinicius.jpg" 
                      alt="Avatar" 
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#0B5FFF] shadow-xs" 
                    />
                    <div>
                      <button 
                        type="button"
                        onClick={() => alert('Foto de perfil vinculada ao cadastro verificado.')}
                        className="text-[11px] font-bold text-[#0B5FFF] hover:text-[#0B2345] border border-[#0B5FFF]/40 hover:border-[#0B2345] px-3 py-1.5 rounded transition cursor-pointer"
                      >
                        Alterar foto
                      </button>
                      <p className="text-[10px] text-[#64748B] mt-1">Formatos JPG, PNG ou WebP até 2MB</p>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#1E293B] mb-1">Nome completo</label>
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full border border-[#CBD5E1] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0B5FFF] focus:outline-none text-xs text-[#0F172A]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#1E293B] mb-1">E-mail</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-[#CBD5E1] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0B5FFF] focus:outline-none text-xs text-[#0F172A]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#1E293B] mb-1">Telefone</label>
                    <input 
                      type="text" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-[#CBD5E1] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0B5FFF] focus:outline-none text-xs text-[#0F172A]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#1E293B] mb-1">Cidade</label>
                    <input 
                      type="text" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full border border-[#CBD5E1] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0B5FFF] focus:outline-none text-xs text-[#0F172A]"
                    />
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit"
                      className="bg-[#0B5FFF] hover:bg-[#0948c2] text-white font-bold px-5 py-2.5 rounded-lg shadow-sm transition cursor-pointer"
                    >
                      Salvar alterações
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 3. POPUP - MINHA ASSINATURA */}
        {/* ============================================================ */}
        {modalType === 'assinatura' && (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#D9DEE7] bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2.5 text-[#0B2345]">
                <CreditCard className="w-5 h-5 text-[#0B5FFF]" />
                <h3 className="font-serif text-lg font-bold text-[#0B2345]">Minha Assinatura</h3>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#5D6673] hover:text-[#0B2345] hover:bg-slate-100 transition cursor-pointer"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content: 2 Columns */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                {/* Left Card: Plano Premium */}
                <div className="md:col-span-6 bg-linear-to-b from-white to-[#F8FAFC] border border-[#CBD5E1] rounded-xl p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">👑</span>
                        <h4 className="font-serif text-lg font-bold text-[#0B2345]">Plano Premium</h4>
                      </div>
                      <span className="bg-[#EBF7EE] text-[#16803C] border border-[#16803C]/30 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                        Ativo
                      </span>
                    </div>

                    <div className="mb-4">
                      <span className="text-2xl font-black text-[#0B2345]">R$ 24,90</span>
                      <span className="text-xs text-[#64748B]"> / mês</span>
                    </div>

                    <ul className="space-y-2 text-xs text-[#334155]">
                      {[
                        'Acesso a todas as notícias',
                        'Conteúdos exclusivos',
                        'Edição digital completa',
                        'Podcasts e vídeos',
                        'Newsletter semanal',
                        'Sem anúncios',
                      ].map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-[#16803C] shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Card: Detalhes da Assinatura */}
                <div className="md:col-span-6 bg-white border border-[#CBD5E1] rounded-xl p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif text-sm font-bold text-[#0B2345] mb-4 pb-2 border-b border-[#F1F5F9]">
                      Detalhes da Assinatura
                    </h4>

                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                        <span className="text-[#64748B]">Plano</span>
                        <span className="font-bold text-[#0B2345]">Premium (Mensal)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                        <span className="text-[#64748B]">Valor</span>
                        <span className="font-bold text-[#0B2345]">R$ 24,90</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                        <span className="text-[#64748B]">Data da assinatura</span>
                        <span className="font-medium text-[#0B2345]">09/10/2026</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                        <span className="text-[#64748B]">Próxima cobrança</span>
                        <span className="font-medium text-[#0B2345]">09/11/2026</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                        <span className="text-[#64748B]">Forma de pagamento</span>
                        <span className="font-bold text-[#0B2345]">PIX</span>
                      </div>
                      <div className="flex justify-between py-1 items-center">
                        <span className="text-[#64748B]">Status</span>
                        <span className="bg-[#EBF7EE] text-[#16803C] text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Ativo
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => alert('Opções de upgrade ou migração de plano disponíveis na central.')}
                    className="border border-[#CBD5E1] hover:bg-slate-50 text-[#0B2345] text-xs font-bold px-4 py-2 rounded-lg transition cursor-pointer"
                  >
                    Alterar plano
                  </button>
                  <button 
                    onClick={() => alert('Gerenciamento de chave Pix e cartões vinculado com segurança.')}
                    className="border border-[#CBD5E1] hover:bg-slate-50 text-[#0B2345] text-xs font-bold px-4 py-2 rounded-lg transition cursor-pointer"
                  >
                    Gerenciar pagamento
                  </button>
                </div>

                <button 
                  onClick={() => alert('Sua assinatura continuará ativa até 09/11/2026. Deseja prosseguir com o cancelamento?')}
                  className="bg-[#DC2626] hover:bg-[#b91c1c] text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow-xs cursor-pointer"
                >
                  Cancelar assinatura
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 4. POPUP - MEUS FAVORITOS */}
        {/* ============================================================ */}
        {modalType === 'favoritos' && (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#D9DEE7] bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2.5 text-[#0B2345]">
                <Star className="w-5 h-5 text-[#FFCC29] fill-[#FFCC29]" />
                <h3 className="font-serif text-lg font-bold text-[#0B2345]">Meus Favoritos</h3>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#5D6673] hover:text-[#0B2345] hover:bg-slate-100 transition cursor-pointer"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="px-6 pt-4 border-b border-[#E2E8F0] flex gap-2">
              {[
                { id: 'noticias', label: 'Notícias (12)' },
                { id: 'videos', label: 'Vídeos (5)' },
                { id: 'colunistas', label: 'Colunistas (3)' },
                { id: 'receitas', label: 'Receitas (4)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFavoritesTab(tab.id as any)}
                  className={`px-3 py-2 text-xs font-bold rounded-t-lg transition cursor-pointer ${
                    favoritesTab === tab.id
                      ? 'border-b-2 border-[#0B5FFF] text-[#0B5FFF] bg-slate-50'
                      : 'text-[#64748B] hover:text-[#0B2345]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* List of Saved Items */}
            <div className="p-6 space-y-3">
              {[
                {
                  id: 'fav-1',
                  title: 'Brasil avança com projeto de energia renovável na América Latina',
                  category: 'BRASIL',
                  badgeColor: 'bg-[#16803C]',
                  date: '8 de outubro de 2026',
                  image: '/images/hero_congresso.jpg',
                  slug: 'art-2'
                },
                {
                  id: 'fav-2',
                  title: 'Dólar recua e bolsa fecha em alta com expectativa de reformas',
                  category: 'ECONOMIA',
                  badgeColor: 'bg-[#0B5FFF]',
                  date: '8 de outubro de 2026',
                  image: '/images/news_economia.jpg',
                  slug: 'mercado-reage-positivamente-a-novas-medidas-economicas'
                },
                {
                  id: 'fav-3',
                  title: 'STF retoma julgamento sobre marco das redes sociais',
                  category: 'POLÍTICA',
                  badgeColor: 'bg-[#0B2345]',
                  date: '7 de outubro de 2026',
                  image: '/images/news_opiniao.jpg',
                  slug: 'art-1'
                },
                {
                  id: 'fav-4',
                  title: 'Feijoada completa: receita tradicional brasileira e os segredos do preparo autêntico',
                  category: 'RECEITA',
                  badgeColor: 'bg-[#DC2626]',
                  date: '8 de outubro de 2026',
                  image: '/images/receita-feijoada.jpg',
                  slug: 'feijoada-completa-receita-tradicional-brasileira'
                },
              ].map((item) => (
                <div 
                  key={item.id}
                  onClick={() => {
                    const match = articles.find(a => a.slug === item.slug || a.id === item.slug);
                    if (match && onSelectArticle) {
                      onSelectArticle(match);
                      onClose();
                    }
                  }}
                  className="flex items-center justify-between p-3 border border-[#E2E8F0] rounded-lg hover:border-[#0B5FFF] hover:shadow-xs transition group cursor-pointer bg-white"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.image} 
                      alt="" 
                      className="w-16 h-12 rounded object-cover border border-[#E2E8F0] shrink-0" 
                    />
                    <div>
                      <h5 className="font-serif text-xs font-bold text-[#0B2345] group-hover:text-[#0B5FFF] transition line-clamp-1">
                        {item.title}
                      </h5>
                      <div className="flex items-center gap-2 mt-1 text-[10px]">
                        <span className={`${item.badgeColor} text-white font-bold px-1.5 py-0.2 rounded uppercase`}>
                          {item.category}
                        </span>
                        <span className="text-[#64748B]">{item.date}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={(e) => { e.stopPropagation(); alert('Item removido dos favoritos.'); }}
                    title="Remover dos favoritos"
                    className="p-1.5 text-[#FFCC29] hover:text-[#DC2626] transition shrink-0 ml-2"
                  >
                    <Star className="w-4 h-4 fill-[#FFCC29]" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 5. POPUP - NOTIFICAÇÕES */}
        {/* ============================================================ */}
        {modalType === 'notificacoes' && (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#D9DEE7] bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2.5 text-[#0B2345]">
                <Bell className="w-5 h-5 text-[#0B5FFF]" />
                <h3 className="font-serif text-lg font-bold text-[#0B2345]">Notificações</h3>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#5D6673] hover:text-[#0B2345] hover:bg-slate-100 transition cursor-pointer"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="px-6 pt-4 border-b border-[#E2E8F0] flex gap-2 overflow-x-auto">
              {[
                { id: 'todas', label: 'Todas (5)' },
                { id: 'novas', label: 'Novas (2)' },
                { id: 'assinatura', label: 'Assinatura' },
                { id: 'editorial', label: 'Editorial' },
                { id: 'sistema', label: 'Sistema' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setNotifTab(tab.id as any)}
                  className={`px-3 py-2 text-xs font-bold rounded-t-lg transition whitespace-nowrap cursor-pointer ${
                    notifTab === tab.id
                      ? 'border-b-2 border-[#0B5FFF] text-[#0B5FFF] bg-slate-50'
                      : 'text-[#64748B] hover:text-[#0B2345]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Notification items */}
            <div className="p-6 space-y-3">
              {[
                {
                  id: 'n-1',
                  icon: FileText,
                  iconColor: 'bg-purple-100 text-purple-600',
                  title: 'Nova matéria publicada',
                  subtitle: 'Brasil amplia acordos comerciais na América do Sul',
                  time: 'há 12 minutos',
                  unread: true
                },
                {
                  id: 'n-2',
                  icon: MessageSquare,
                  iconColor: 'bg-emerald-100 text-emerald-600',
                  title: 'Comentário em sua publicação',
                  subtitle: 'Ana Costa comentou uma matéria que você salvou',
                  time: 'há 1 hora',
                  unread: true
                },
                {
                  id: 'n-3',
                  icon: Mail,
                  iconColor: 'bg-blue-100 text-blue-600',
                  title: 'Newsletter disponível',
                  subtitle: 'Edição semanal já disponível para leitura',
                  time: 'há 2 horas',
                  unread: false
                },
                {
                  id: 'n-4',
                  icon: CheckCircle2,
                  iconColor: 'bg-slate-100 text-slate-600',
                  title: 'Atualização da assinatura',
                  subtitle: 'Seu pagamento foi confirmado',
                  time: 'há 4 horas',
                  unread: false
                },
                {
                  id: 'n-5',
                  icon: Calendar,
                  iconColor: 'bg-amber-100 text-amber-600',
                  title: 'Convite para evento',
                  subtitle: 'Debate sobre segurança pública em Brasília',
                  time: 'há 1 dia',
                  unread: false
                },
              ].map((item) => (
                <div 
                  key={item.id}
                  className={`flex items-start justify-between p-3.5 border rounded-lg transition ${
                    item.unread 
                      ? 'bg-[#F0F7FF] border-[#BFDBFE]' 
                      : 'bg-white border-[#E2E8F0]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${item.iconColor}`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-[#0B2345]">{item.title}</h5>
                      <p className="text-xs text-[#475569] mt-0.5">{item.subtitle}</p>
                      <span className="text-[10px] text-[#94A3B8] mt-1 block">{item.time}</span>
                    </div>
                  </div>

                  {item.unread && (
                    <span className="w-2 h-2 rounded-full bg-[#0B5FFF] shrink-0 mt-1" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 6. POPUP - CONFIGURAÇÕES */}
        {/* ============================================================ */}
        {modalType === 'configuracoes' && (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#D9DEE7] bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2.5 text-[#0B2345]">
                <Settings className="w-5 h-5 text-[#0B5FFF]" />
                <h3 className="font-serif text-lg font-bold text-[#0B2345]">Configurações</h3>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#5D6673] hover:text-[#0B2345] hover:bg-slate-100 transition cursor-pointer"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content: Left Sidebar + Form */}
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[420px]">
              {/* Left Sidebar Tabs */}
              <div className="md:col-span-4 bg-[#F8FAFC] border-r border-[#E2E8F0] p-4 space-y-1">
                {[
                  { id: 'geral', label: 'Geral', icon: Settings },
                  { id: 'notificacoes', label: 'Notificações', icon: Bell },
                  { id: 'privacidade', label: 'Privacidade', icon: ShieldCheck },
                  { id: 'aparencia', label: 'Aparência', icon: Sparkles },
                  { id: 'idioma', label: 'Idioma', icon: Globe },
                  { id: 'integracoes', label: 'Integrações', icon: Sliders },
                  { id: 'seguranca', label: 'Segurança', icon: Lock },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSettingsTab(item.id as any)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition text-left cursor-pointer ${
                      settingsTab === item.id 
                        ? 'bg-[#0B5FFF] text-white shadow-xs' 
                        : 'text-[#475569] hover:bg-slate-200/60'
                    }`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Right Content */}
              <div className="md:col-span-8 p-6">
                <h4 className="font-serif text-base font-bold text-[#0B2345] mb-5">
                  Preferências Gerais
                </h4>

                {settingsSaved && (
                  <div className="mb-4 p-3 bg-[#EBF7EE] border border-[#16803C]/30 text-[#16803C] text-xs rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Preferências salvas com sucesso!</span>
                  </div>
                )}

                <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                  {/* Toggles */}
                  {[
                    { label: 'Receber newsletter por e-mail', state: prefNewsletter, setter: setPrefNewsletter },
                    { label: 'Notificações de novas matérias', state: prefNovasMaterias, setter: setPrefNovasMaterias },
                    { label: 'Resumo diário', state: prefResumoDiario, setter: setPrefResumoDiario },
                    { label: 'Notificações de vídeos', state: prefVideos, setter: setPrefVideos },
                    { label: 'Notificações de colunistas', state: prefColunistas, setter: setPrefColunistas },
                  ].map((toggle, idx) => (
                    <label key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                      <span className="font-medium text-[#1E293B]">{toggle.label}</span>
                      <input 
                        type="checkbox" 
                        checked={toggle.state}
                        onChange={(e) => toggle.setter(e.target.checked)}
                        className="w-4 h-4 accent-[#0B5FFF] cursor-pointer"
                      />
                    </label>
                  ))}

                  {/* Dropdowns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#E2E8F0]">
                    <div>
                      <label className="block font-bold text-[#1E293B] mb-1">Idioma do site</label>
                      <select 
                        value={prefIdioma}
                        onChange={(e) => setPrefIdioma(e.target.value)}
                        className="w-full border border-[#CBD5E1] rounded-lg p-2 focus:ring-2 focus:ring-[#0B5FFF] focus:outline-none text-xs"
                      >
                        <option value="Português (Brasil)">Português (Brasil)</option>
                        <option value="English">English</option>
                        <option value="Español">Español</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-[#1E293B] mb-1">Fuso horário</label>
                      <select 
                        value={prefFuso}
                        onChange={(e) => setPrefFuso(e.target.value)}
                        className="w-full border border-[#CBD5E1] rounded-lg p-2 focus:ring-2 focus:ring-[#0B5FFF] focus:outline-none text-xs"
                      >
                        <option value="Brasília (GMT-3)">Brasília (GMT-3)</option>
                        <option value="Manaus (GMT-4)">Manaus (GMT-4)</option>
                        <option value="Fernando de Noronha (GMT-2)">Fernando de Noronha (GMT-2)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit"
                      className="bg-[#0B5FFF] hover:bg-[#0948c2] text-white font-bold px-5 py-2.5 rounded-lg shadow-sm transition cursor-pointer"
                    >
                      Salvar preferências
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 7. POPUP - ÁREA DO ASSINANTE */}
        {/* ============================================================ */}
        {modalType === 'area-assinante' && (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#D9DEE7] bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2.5 text-[#0B2345]">
                <LayoutGrid className="w-5 h-5 text-[#0B5FFF]" />
                <h3 className="font-serif text-lg font-bold text-[#0B2345]">Área do Assinante</h3>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#5D6673] hover:text-[#0B2345] hover:bg-slate-100 transition cursor-pointer"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid of 8 Quick Action Cards */}
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  {
                    id: 'visao-geral',
                    title: 'Visão geral',
                    subtitle: 'Resumo da sua conta',
                    icon: LayoutGrid,
                    color: 'text-[#0B5FFF]',
                    target: 'area-assinante' as SubscriberModalType
                  },
                  {
                    id: 'meus-dados',
                    title: 'Meus dados',
                    subtitle: 'Perfil e segurança',
                    icon: User,
                    color: 'text-[#16803C]',
                    target: 'perfil' as SubscriberModalType
                  },
                  {
                    id: 'minha-assinatura',
                    title: 'Minha assinatura',
                    subtitle: 'Plano e pagamentos',
                    icon: CreditCard,
                    color: 'text-[#FFCC29]',
                    target: 'assinatura' as SubscriberModalType
                  },
                  {
                    id: 'favoritos',
                    title: 'Favoritos',
                    subtitle: 'Matérias salvas',
                    icon: Star,
                    color: 'text-[#0B5FFF]',
                    target: 'favoritos' as SubscriberModalType
                  },
                  {
                    id: 'notificacoes',
                    title: 'Notificações',
                    subtitle: 'Configurar alertas',
                    icon: Bell,
                    color: 'text-[#DC2626]',
                    target: 'notificacoes' as SubscriberModalType
                  },
                  {
                    id: 'historico',
                    title: 'Histórico',
                    subtitle: 'Pagamentos e faturas',
                    icon: FileText,
                    color: 'text-[#64748B]',
                    target: 'assinatura' as SubscriberModalType
                  },
                  {
                    id: 'suporte',
                    title: 'Suporte',
                    subtitle: 'Central de ajuda',
                    icon: MessageSquare,
                    color: 'text-[#0B5FFF]',
                    target: null
                  },
                  {
                    id: 'preferencias',
                    title: 'Preferências',
                    subtitle: 'Personalizar conteúdo',
                    icon: Settings,
                    color: 'text-[#334155]',
                    target: 'configuracoes' as SubscriberModalType
                  },
                ].map((card) => (
                  <button
                    key={card.id}
                    onClick={() => {
                      if (card.target && card.target !== 'area-assinante') {
                        onSwitchModal(card.target);
                      } else if (card.id === 'suporte') {
                        alert('Central de Suporte: suporte@opatriota.sbs');
                      }
                    }}
                    className="p-4 bg-white border border-[#CBD5E1] rounded-xl hover:border-[#0B5FFF] hover:shadow-md transition text-center flex flex-col items-center justify-center gap-2 group cursor-pointer aspect-square"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:scale-110 transition">
                      <card.icon className={`w-5 h-5 ${card.color}`} />
                    </div>
                    <div>
                      <h5 className="font-serif text-xs font-bold text-[#0B2345] group-hover:text-[#0B5FFF] transition">
                        {card.title}
                      </h5>
                      <p className="text-[10px] text-[#64748B] mt-0.5">{card.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
