import React, { useState } from 'react';
import { 
  UserSession, 
  Article, 
  SubscriptionPlan, 
  PaymentRecord 
} from '../../types';
import { api } from '../../services/apiClient';
import { signInWithEmail, registerWithEmail, requestPasswordReset } from '../../services/firebaseAuthService';
import { 
  User,
  BookOpen,
  Search,
  Menu,
  Newspaper,
  Users,
  Video,
  Headphones,
  Mail,
  Settings,
  HelpCircle,
  CreditCard, 
  Bookmark, 
  Bell, 
  Shield, 
  LogOut, 
  ArrowLeft, 
  Sparkles
} from 'lucide-react';
import { SubscriberLoginTab } from './SubscriberLoginTab';
import { SubscriberRegisterTab } from './SubscriberRegisterTab';
import { SubscriberPasswordResetTab } from './SubscriberPasswordResetTab';
import { SubscriberDashboardTab } from './SubscriberDashboardTab';
import { SubscriberSubscriptionTab } from './SubscriberSubscriptionTab';
import { SubscriberPaymentsTab } from './SubscriberPaymentsTab';
import { SubscriberFavoritesTab } from './SubscriberFavoritesTab';
import { SubscriberProfileTab } from './SubscriberProfileTab';
import { SubscriberNotificationsTab } from './SubscriberNotificationsTab';
import { SubscriberPrivacyTab } from './SubscriberPrivacyTab';
import { SubscriberJournalTab } from './SubscriberJournalTab';

interface SubscriberPortalProps {
  currentUser: UserSession | null;
  onLogin: (user: UserSession) => void;
  onLogout: () => void;
  onBackToHome: () => void;
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  initialSubpage?: string;
}

export const SubscriberPortal: React.FC<SubscriberPortalProps> = ({
  currentUser,
  onLogin,
  onLogout,
  onBackToHome,
  articles,
  onSelectArticle,
  initialSubpage = 'dashboard'
}) => {
  const [currentSubpage, setCurrentSubpage] = useState<string>(
    currentUser ? initialSubpage : 'entrar'
  );

  // Authentication form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Registration form states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');
  const [regTermsAccepted, setRegTermsAccepted] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  // Password reset states
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Profile edit states
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [profileBio, setProfileBio] = useState(currentUser?.bio || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // Subscription management
  const [activePlanId, setActivePlanId] = useState<'gratuito' | 'digital' | 'premium'>(
    currentUser?.subscription.plan || 'gratuito'
  );
  const [planSuccessMsg, setPlanSuccessMsg] = useState<string | null>(null);

  // Notification preferences
  const [notifPrefs, setNotifPrefs] = useState(
    currentUser?.notificationPrefs || {
      breakingNews: true,
      dailyBrief: true,
      factChecks: true,
      weeklyDigest: true
    }
  );
  const [notifSaved, setNotifSaved] = useState(false);

  // Payments
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);

  // LGPD Privacy
  const [deletionRequested, setDeletionRequested] = useState(false);
  const [deletionProtocol, setDeletionProtocol] = useState<string | null>(null);

  React.useEffect(() => {
    void api.get<SubscriptionPlan[]>('/plans', { auth: false }).then(setSubscriptionPlans).catch(error => {
      console.error('Falha ao carregar planos reais:', error);
    });
  }, []);

  React.useEffect(() => {
    if (!currentUser) return;
    void api.get<PaymentRecord[]>('/me/payments').then(setPayments).catch(error => {
      console.error('Falha ao carregar histórico real de pagamentos:', error);
    });
  }, [currentUser?.id]);

  // Authentication and registration are delegated to Firebase; no browser-created sessions.
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (loginAttempts >= 5) {
      setLoginError('Muitas tentativas consecutivas. Aguarde antes de tentar novamente.');
      return;
    }
    try {
      const user = await signInWithEmail(loginEmail, loginPassword);
      onLogin(user);
      setCurrentSubpage('dashboard');
      setLoginAttempts(0);
    } catch (error) {
      const attempts = loginAttempts + 1;
      setLoginAttempts(attempts);
      setLoginError(error instanceof Error && error.message === 'AUTH_NOT_CONFIGURED'
        ? 'Autenticação ainda não configurada neste ambiente.'
        : `Não foi possível entrar com estas credenciais (tentativa ${attempts} de 5).`);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    if (!regName.trim() || !regEmail.trim()) { setRegError('Preencha todos os campos obrigatórios.'); return; }
    if (regPassword.length < 8) { setRegError('A senha deve possuir no mínimo 8 caracteres.'); return; }
    if (regPassword !== regPasswordConfirm) { setRegError('A confirmação de senha não confere.'); return; }
    if (!regTermsAccepted) { setRegError('É necessário aceitar os Termos de Uso e a Política de Privacidade.'); return; }
    try {
      const user = await registerWithEmail(regName, regEmail, regPassword);
      onLogin(user);
      setCurrentSubpage('dashboard');
      setRegSuccess(true);
    } catch (error) {
      setRegError(error instanceof Error && error.message === 'AUTH_NOT_CONFIGURED'
        ? 'Autenticação ainda não configurada neste ambiente.'
        : 'Não foi possível criar a conta. Verifique se o e-mail já está cadastrado e tente novamente.');
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      await requestPasswordReset(resetEmail);
      setResetSent(true);
    } catch (error) {
      setLoginError(error instanceof Error && error.message === 'AUTH_NOT_CONFIGURED'
        ? 'Autenticação ainda não configurada neste ambiente.'
        : 'Não foi possível enviar o link. Verifique o e-mail informado.');
    }
  };

  // Profile and plan actions are confirmed by the server/provider.
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
      const updated = await api.patch<Partial<UserSession>>('/me', {
        name: profileName.trim(), phone: profilePhone.trim(), bio: profileBio.trim()
      });
      onLogin({ ...currentUser, ...updated });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Não foi possível salvar o perfil.');
    }
  };

  const handleChangePlan = async (planId: 'gratuito' | 'digital' | 'premium') => {
    if (!currentUser) return;
    if (planId === 'gratuito') {
      setPlanSuccessMsg('O estado da assinatura gratuita é confirmado pelo servidor; não há cobrança a iniciar.');
      return;
    }
    setPlanSuccessMsg(null);
    try {
      const checkout = await api.post<{ checkoutUrl: string }>('/checkout', {
        planId, cycle: 'monthly', paymentMethod: 'pix',
        name: currentUser.name, email: currentUser.email
      });
      if (!checkout.checkoutUrl || !/^https:\/\//.test(checkout.checkoutUrl)) {
        throw new Error('O provedor não devolveu um endereço de checkout válido.');
      }
      window.location.assign(checkout.checkoutUrl);
    } catch (error) {
      setPlanSuccessMsg(error instanceof Error ? error.message : 'Não foi possível iniciar o checkout.');
    }
  };

  // Bookmarks
  const bookmarkedArticles = articles.filter(a => 
    currentUser?.bookmarks?.includes(a.id)
  );

  const handleRemoveBookmark = async (artId: string) => {
    if (!currentUser) return;
    const bookmarks = currentUser.bookmarks.filter(id => id !== artId);
    try {
      await api.put('/me/bookmarks', { bookmarks });
      onLogin({ ...currentUser, bookmarks });
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Não foi possível atualizar os favoritos.');
    }
  };

    // LGPD Export
  const handleExportData = () => {
    if (!currentUser) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentUser, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `dados_pessoais_opatriota_${currentUser.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleToggleNotifPref = (key: keyof UserSession['notificationPrefs'], checked: boolean) => {
    setNotifPrefs({ ...notifPrefs, [key]: checked });
  };

  const handleSaveNotifications = () => {
    if (!currentUser) return;
    currentUser.notificationPrefs = notifPrefs;
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 3000);
  };

  const handleRequestAccountDeletion = () => {
    if (confirm('Tem certeza de que deseja solicitar a exclusão de sua conta? Esta ação é irreversível.')) {
      void api.post<{ protocol: string }>('/privacy-requests', {
        name: currentUser?.name, email: currentUser?.email,
        requestType: 'exclusao',
        details: 'Solicitação de exclusão de conta, perfil e dados pessoais vinculados ao utilizador autenticado.'
      }, { auth: false }).then(result => {
        setDeletionProtocol(result.protocol);
        setDeletionRequested(true);
      }).catch(error => {
        setLoginError(error instanceof Error ? error.message : 'Não foi possível registrar o pedido de exclusão.');
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F7FC] text-[#17202A] select-none">
      <header className="sticky top-0 z-30 bg-gradient-to-r from-[#061D40] via-[#0A3470] to-[#05658C] text-white shadow-lg">
        <div className="mx-auto flex h-[86px] max-w-[1780px] items-center gap-5 px-4 lg:px-7">
          <div className="flex min-w-[245px] items-center gap-3"><img src="/pwa-icon-192.svg" alt="O Patriota" className="h-14 w-14 rounded-full border-2 border-white/80 bg-[#FFCC29] p-1 object-contain" /><div><div className="font-serif text-3xl font-black leading-none tracking-tight">O PATRIOTA</div><div className="mt-1 text-[9px] font-bold uppercase tracking-[.16em] text-white/80">Informação com liberdade, por um Brasil mais forte</div></div></div>
          <div className="hidden max-w-2xl flex-1 items-center rounded-lg bg-white/95 px-4 py-2.5 text-[#49617F] md:flex"><Search className="mr-3 h-5 w-5 text-[#0B5FFF]" /><input aria-label="Buscar na Área do Leitor" placeholder="Buscar matérias, colunas, autores..." className="w-full bg-transparent text-sm outline-none" /></div>
          <div className="ml-auto flex items-center gap-4"><button aria-label="Notificações" onClick={() => setCurrentSubpage('notificacoes')} className="relative rounded-full p-2 hover:bg-white/10"><Bell className="h-6 w-6" /><span className="absolute right-0 top-0 rounded-full bg-[#EF2B2D] px-1.5 text-[10px] font-black">3</span></button><div className="hidden items-center gap-3 border-l border-white/20 pl-4 sm:flex"><img src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'} alt="" className="h-12 w-12 rounded-full border-2 border-white object-cover" /><div><b className="block text-sm">{currentUser?.name || 'Leitor'}</b><span className="text-xs text-white/75">Leitor Premium</span></div></div><button onClick={onLogout} aria-label="Sair" className="rounded p-2 hover:bg-white/10"><LogOut className="h-5 w-5" /></button></div>
        </div>
      </header>
      <div className="mx-auto flex max-w-[1780px]">
        <div className="max-w-[1440px] flex-1 px-4 py-5 sm:px-6 lg:px-7">

        {/* IF USER NOT LOGGED IN: SHOW AUTHENTICATION PAGES */}
        {!currentUser ? (
          <div className="max-w-md mx-auto bg-white p-8 rounded border border-[#D9DEE7] shadow-sm">
            {/* Auth Tabs */}
            <div className="flex border-b border-[#D9DEE7] mb-6">
              <button
                onClick={() => { setCurrentSubpage('entrar'); setLoginError(null); }}
                className={`flex-1 py-3 text-center text-xs font-bold tracking-wider uppercase transition cursor-pointer ${
                  currentSubpage === 'entrar'
                    ? 'border-b-2 border-[#0B2345] text-[#0B2345]'
                    : 'text-[#5D6673] hover:text-[#0B2345]'
                }`}
              >
                ENTRAR
              </button>
              <button
                onClick={() => { setCurrentSubpage('cadastro'); setRegError(null); }}
                className={`flex-1 py-3 text-center text-xs font-bold tracking-wider uppercase transition cursor-pointer ${
                  currentSubpage === 'cadastro'
                    ? 'border-b-2 border-[#0B2345] text-[#0B2345]'
                    : 'text-[#5D6673] hover:text-[#0B2345]'
                }`}
              >
                CRIAR CONTA
              </button>
            </div>

            {/* TAB: LOGIN */}
            {currentSubpage === 'entrar' && (
              <SubscriberLoginTab
                loginError={loginError}
                loginEmail={loginEmail}
                loginPassword={loginPassword}
                onEmailChange={setLoginEmail}
                onPasswordChange={setLoginPassword}
                onSubmit={handleLoginSubmit}
                onForgotPassword={() => setCurrentSubpage('recuperar-senha')}
              />
            )}

            {/* TAB: REGISTER */}
            {currentSubpage === 'cadastro' && (
              <SubscriberRegisterTab
                regSuccess={regSuccess}
                regError={regError}
                regName={regName}
                regEmail={regEmail}
                regPassword={regPassword}
                regPasswordConfirm={regPasswordConfirm}
                regTermsAccepted={regTermsAccepted}
                onNameChange={setRegName}
                onEmailChange={setRegEmail}
                onPasswordChange={setRegPassword}
                onPasswordConfirmChange={setRegPasswordConfirm}
                onTermsChange={setRegTermsAccepted}
                onSubmit={handleRegisterSubmit}
              />
            )}

            {/* TAB: PASSWORD RESET */}
            {currentSubpage === 'recuperar-senha' && (
              <SubscriberPasswordResetTab
                resetEmail={resetEmail}
                resetSent={resetSent}
                onEmailChange={setResetEmail}
                onSubmit={handlePasswordReset}
                onBackToLogin={() => setCurrentSubpage('entrar')}
                onBackToLoginAfterSent={() => { setResetSent(false); setCurrentSubpage('entrar'); }}
              />
            )}
          </div>
        ) : (
          /* IF USER IS LOGGED IN: SHOW DASHBOARD WITH SIDEBAR NAVIGATION */
          <div className="grid grid-cols-1 gap-5 items-start lg:grid-cols-[255px_minmax(0,1fr)]">
            
            {/* LEFT SIDEBAR: PROFILE SUMMARY & NAVIGATION */}
            <aside className="lg:sticky lg:top-[106px] bg-white p-3 sm:p-4 rounded-xl border border-[#D9E6F5] shadow-sm space-y-4">
              {/* User Avatar & Name */}
              <div className="flex items-center gap-3 pb-4 border-b border-[#D9DEE7]">
                <img
                  src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                  alt={currentUser.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#0B2345]"
                />
                <div className="truncate">
                  <h3 className="font-bold text-sm text-[#0B2345] truncate">{currentUser.name}</h3>
                  <div className="text-[11px] text-[#5D6673] truncate">{currentUser.email}</div>
                  <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mt-1 ${
                    currentUser.subscription.plan === 'premium'
                      ? 'bg-[#EBF7EE] text-[#16803C]'
                      : currentUser.subscription.plan === 'digital'
                      ? 'bg-[#EFF6FF] text-[#2563EB]'
                      : 'bg-[#F1F3F5] text-[#5D6673]'
                  }`}>
                    {currentUser.subscription.plan.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1 text-xs">
                {[
                  { id: 'dashboard', label: 'Painel Geral', icon: User },
                  { id: 'jornal', label: 'Ler o Jornal Digital', icon: BookOpen },
                  { id: 'assinatura', label: 'Minha Assinatura', icon: Sparkles },
                  { id: 'pagamentos', label: 'Forma de Pagamento', icon: CreditCard },
                  { id: 'editorias', label: 'Editorias', icon: Newspaper },
                  { id: 'colunistas', label: 'Colunistas', icon: Users },
                  { id: 'videos', label: 'Vídeos', icon: Video },
                  { id: 'podcasts', label: 'Podcasts', icon: Headphones },
                  { id: 'newsletter', label: 'Newsletter', icon: Mail },
                  { id: 'favoritos', label: `Notícias Salvas (${currentUser.bookmarks.length})`, icon: Bookmark },
                  { id: 'perfil', label: 'Dados Cadastrais', icon: User },
                  { id: 'notificacoes', label: 'Preferências de Alertas', icon: Bell },
                  { id: 'privacidade', label: 'Privacidade & LGPD', icon: Shield },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = currentSubpage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentSubpage(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded font-semibold transition text-left cursor-pointer ${
                        isActive
                          ? 'bg-[#0B2345] text-white'
                          : 'text-[#5D6673] hover:bg-[#F1F3F5] hover:text-[#0B2345]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Logout Button */}
              <div className="pt-4 border-t border-[#D9DEE7]">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#B42318] hover:bg-[#FEF3F2] rounded transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>ENCERRAR SESSÃO</span>
                </button>
              </div>
            </aside>

            {/* RIGHT CONTENT: SELECTED SUBPAGE */}
            <main className="min-w-0 rounded-xl bg-transparent">
              
              {/* SUBPAGE: JORNAL DIGITAL */}
              {currentSubpage === 'jornal' && (
                <SubscriberJournalTab
                  articles={articles}
                  onSelectArticle={onSelectArticle}
                  onBack={() => setCurrentSubpage('dashboard')}
                />
              )}

              {/* SUBPAGE: DASHBOARD GERAL */}
              {currentSubpage === 'dashboard' && (
                <SubscriberDashboardTab
                  currentUser={currentUser}
                  bookmarkedArticles={bookmarkedArticles}
                  onSelectArticle={onSelectArticle}
                  onNavigate={setCurrentSubpage}
                />
              )}

              {/* SUBPAGE: ASSINATURA */}
              {currentSubpage === 'assinatura' && (
                <SubscriberSubscriptionTab
                  plans={subscriptionPlans}
                  activePlanId={activePlanId}
                  successMessage={planSuccessMsg}
                  onChangePlan={(planId) => { void handleChangePlan(planId); }}
                />
              )}

              {/* SUBPAGE: HISTÓRICO DE PAGAMENTOS */}
              {currentSubpage === 'pagamentos' && (
                <SubscriberPaymentsTab payments={payments} />
              )}

              {/* SUBPAGE: NOTÍCIAS SALVAS / FAVORITOS */}
              {currentSubpage === 'favoritos' && (
                <SubscriberFavoritesTab
                  bookmarkedArticles={bookmarkedArticles}
                  onSelectArticle={onSelectArticle}
                  onRemoveBookmark={handleRemoveBookmark}
                />
              )}

              {/* SUBPAGE: DADOS CADASTRAIS */}
              {currentSubpage === 'perfil' && (
                <SubscriberProfileTab
                  currentUser={currentUser}
                  profileName={profileName}
                  profilePhone={profilePhone}
                  profileBio={profileBio}
                  profileSaved={profileSaved}
                  onNameChange={setProfileName}
                  onPhoneChange={setProfilePhone}
                  onBioChange={setProfileBio}
                  onSubmit={handleSaveProfile}
                />
              )}

              {/* SUBPAGE: PREFERÊNCIAS DE ALERTAS */}
              {currentSubpage === 'notificacoes' && (
                <SubscriberNotificationsTab
                  notifPrefs={notifPrefs}
                  notifSaved={notifSaved}
                  onTogglePref={handleToggleNotifPref}
                  onSave={handleSaveNotifications}
                />
              )}

              {/* SUBPAGE: PRIVACIDADE & LGPD */}
              {currentSubpage === 'privacidade' && (
                <SubscriberPrivacyTab
                  deletionRequested={deletionRequested}
                  deletionProtocol={deletionProtocol}
                  onExportData={handleExportData}
                  onRequestDeletion={handleRequestAccountDeletion}
                />
              )}

            </main>
          </div>
        )}

        </div>
      </div>
    </div>
  );
};
