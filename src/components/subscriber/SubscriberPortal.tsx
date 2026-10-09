import React, { useState } from 'react';
import { AuthModal } from '../AuthModal';
import { 
  UserSession, 
  Article, 
  SubscriptionPlan, 
  PaymentRecord 
} from '../../types';
import { SUBSCRIPTION_PLANS, DEMO_USERS, INITIAL_PAYMENTS } from '../../data/mockData';
import { 
  User, 
  CreditCard, 
  Bookmark, 
  Bell, 
  Shield, 
  LogOut, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  ExternalLink,
  Lock,
  Mail,
  KeyRound,
  Trash2,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface SubscriberPortalProps {
  currentUser: UserSession | null;
  onLogin: (user: UserSession) => void;
  onGoogleLogin: () => Promise<void> | void;
  onLogout: () => void;
  onBackToHome: () => void;
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  initialSubpage?: string;
}

export const SubscriberPortal: React.FC<SubscriberPortalProps> = ({
  currentUser,
  onLogin,
  onGoogleLogin,
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
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);

  // LGPD Privacy
  const [deletionRequested, setDeletionRequested] = useState(false);

  // Login handler with brute force protection
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (loginAttempts >= 5) {
      setLoginError('Muitas tentativas consecutivas incorretas. Por motivos de segurança (proteção contra força bruta), aguarde 15 minutos.');
      return;
    }

    // Match demo users
    const foundUser = Object.values(DEMO_USERS).find(
      u => u.email.toLowerCase() === loginEmail.trim().toLowerCase()
    );

    if (foundUser) {
      onLogin(foundUser);
      setCurrentSubpage('dashboard');
      setLoginAttempts(0);
    } else if (loginEmail.trim() && loginPassword.length >= 6) {
      // Create user session dynamically
      const newUser: UserSession = {
        id: 'usr-' + Date.now(),
        name: loginEmail.split('@')[0],
        email: loginEmail,
        role: 'leitor_gratuito',
        subscription: {
          plan: 'gratuito',
          status: 'ativo',
          autoRenew: false
        },
        bookmarks: [],
        notificationPrefs: {
          breakingNews: true,
          dailyBrief: false,
          factChecks: true,
          weeklyDigest: true
        },
        createdAt: new Date().toLocaleDateString('pt-BR')
      };
      onLogin(newUser);
      setCurrentSubpage('dashboard');
      setLoginAttempts(0);
    } else {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      setLoginError(`Credenciais incorretas. Tentativa ${newAttempts} de 5.`);
    }
  };

  // Quick switch demo user for testing
  const handleQuickDemoLogin = (demoKey: keyof typeof DEMO_USERS) => {
    const user = DEMO_USERS[demoKey];
    onLogin(user);
    setActivePlanId(user.subscription.plan);
    setProfileName(user.name);
    setProfilePhone(user.phone || '');
    setProfileBio(user.bio || '');
    setCurrentSubpage('dashboard');
  };

  // Registration handler
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regName.trim() || !regEmail.trim()) {
      setRegError('Preencha todos os campos obrigatórios.');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('A senha deve possuir no mínimo 6 caracteres.');
      return;
    }

    if (regPassword !== regPasswordConfirm) {
      setRegError('A confirmação de senha não confere.');
      return;
    }

    if (!regTermsAccepted) {
      setRegError('É necessário aceitar os Termos de Uso e a Política de Privacidade.');
      return;
    }

    const created: UserSession = {
      id: 'usr-' + Date.now(),
      name: regName,
      email: regEmail,
      role: 'leitor_gratuito',
      subscription: {
        plan: 'gratuito',
        status: 'ativo',
        autoRenew: false
      },
      bookmarks: [],
      notificationPrefs: {
        breakingNews: true,
        dailyBrief: true,
        factChecks: true,
        weeklyDigest: true
      },
      createdAt: new Date().toLocaleDateString('pt-BR')
    };

    setRegSuccess(true);
    setTimeout(() => {
      onLogin(created);
      setCurrentSubpage('dashboard');
      setRegSuccess(false);
    }, 1500);
  };

  // Profile save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    currentUser.name = profileName;
    currentUser.phone = profilePhone;
    currentUser.bio = profileBio;
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  // Plan change
  const handleChangePlan = (planId: 'gratuito' | 'digital' | 'premium') => {
    if (!currentUser) return;
    currentUser.subscription.plan = planId;
    currentUser.role = planId === 'premium' ? 'assinante_premium' : planId === 'digital' ? 'assinante_digital' : 'leitor_gratuito';
    setActivePlanId(planId);

    if (planId !== 'gratuito') {
      const newPay: PaymentRecord = {
        id: 'pay-' + Date.now(),
        date: new Date().toLocaleDateString('pt-BR'),
        amount: planId === 'digital' ? 29.90 : 59.90,
        planName: planId === 'digital' ? 'Assinante Digital (Mensal)' : 'Assinante Patriota Premium (Mensal)',
        status: 'concluido',
        invoiceNumber: 'NF-PAT-2026-' + Math.floor(10000 + Math.random() * 90000)
      };
      setPayments([newPay, ...payments]);
    }

    setPlanSuccessMsg(`Seu plano foi atualizado para ${planId.toUpperCase()} com sucesso! Os acessos exclusivos foram liberados.`);
    setTimeout(() => setPlanSuccessMsg(null), 5000);
  };

  // Bookmarks
  const bookmarkedArticles = articles.filter(a => 
    currentUser?.bookmarks?.includes(a.id)
  );

  const handleRemoveBookmark = (artId: string) => {
    if (!currentUser) return;
    currentUser.bookmarks = currentUser.bookmarks.filter(id => id !== artId);
    // Force re-render
    onLogin({ ...currentUser });
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

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] text-[#17202A]">
        <div className="mx-auto max-w-3xl px-4 py-10 text-center">
          <button onClick={onBackToHome} className="mb-8 text-sm font-semibold text-[#0B2345] hover:underline">
            ← Voltar para as notícias
          </button>
          <h1 className="font-serif text-3xl font-bold text-[#0B2345]">Área do Leitor</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600">
            Entre gratuitamente com sua conta Google para salvar matérias e acessar os conteúdos disponíveis. Você poderá escolher um plano depois.
          </p>
        </div>
        <AuthModal onClose={onBackToHome} onGoogleLogin={onGoogleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#17202A] select-none py-4 sm:py-6">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        
        {/* Top Breadcrumb & Return to Portal */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-[#D9DEE7]">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-xs font-bold text-[#0B2345] hover:text-[#0B5FFF] transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>VOLTAR PARA A HOMEPAGE</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-[#5D6673]">
            <span>Área Exclusiva do Leitor & Assinante</span>
            <span>•</span>
            <span className="font-semibold text-[#0B2345]">O Patriota</span>
          </div>
        </div>

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
              <div>
                <div className="text-center mb-6">
                  <h2 className="font-serif text-2xl font-bold text-[#0B2345]">Acesse sua Conta</h2>
                  <p className="text-xs text-[#5D6673] mt-1">
                    Informe seu e-mail e senha para ler conteúdos exclusivos e gerenciar sua assinatura.
                  </p>
                </div>

                {loginError && (
                  <div className="mb-4 p-3 bg-[#FEF3F2] border border-[#B42318]/30 text-[#B42318] text-xs rounded flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">E-mail Cadastrado:</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#5D6673] absolute left-3 top-2.5" />
                      <input
                        type="email"
                        placeholder="seu.email@exemplo.com.br"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full border border-[#D9DEE7] pl-9 pr-3 py-2 rounded focus:outline-none focus:border-[#0B5FFF]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-semibold">Senha:</label>
                      <button
                        type="button"
                        onClick={() => setCurrentSubpage('recuperar-senha')}
                        className="text-[11px] text-[#0B5FFF] hover:underline"
                      >
                        Esqueceu a senha?
                      </button>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-[#5D6673] absolute left-3 top-2.5" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full border border-[#D9DEE7] pl-9 pr-3 py-2 rounded focus:outline-none focus:border-[#0B5FFF]"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0B2345] hover:bg-[#0B5FFF] text-white text-xs font-bold py-2.5 rounded transition shadow-xs cursor-pointer"
                  >
                    ENTRAR NO PORTAL
                  </button>
                </form>

                {/* Quick Testing Accounts */}
                <div className="mt-8 pt-6 border-t border-[#D9DEE7] text-xs">
                  <div className="text-[11px] font-bold text-[#5D6673] uppercase mb-2 text-center">
                    Acessar Rapidamente para Testes:
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                    <button
                      onClick={() => handleQuickDemoLogin('gratuito')}
                      className="p-2 border border-[#D9DEE7] hover:border-[#0B2345] rounded bg-[#F7F8FA] cursor-pointer"
                    >
                      <div className="font-bold text-[#0B2345]">Leitor Grátis</div>
                      <div className="text-[9px] text-[#5D6673]">Acesso Aberto</div>
                    </button>
                    <button
                      onClick={() => handleQuickDemoLogin('digital')}
                      className="p-2 border border-[#0B5FFF] text-[#0B5FFF] hover:bg-[#0B5FFF] hover:text-white rounded bg-[#F7F8FA] cursor-pointer font-bold"
                    >
                      <div>Assinante Digital</div>
                      <div className="text-[9px]">Acesso Exclusivo</div>
                    </button>
                    <button
                      onClick={() => handleQuickDemoLogin('premium')}
                      className="p-2 border border-[#16803C] text-[#16803C] hover:bg-[#16803C] hover:text-white rounded bg-[#F7F8FA] cursor-pointer font-bold"
                    >
                      <div>Patriota Premium</div>
                      <div className="text-[9px]">Acesso Irrestrito</div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: REGISTER */}
            {currentSubpage === 'cadastro' && (
              <div>
                <div className="text-center mb-6">
                  <h2 className="font-serif text-2xl font-bold text-[#0B2345]">Crie sua Conta Gratuita</h2>
                  <p className="text-xs text-[#5D6673] mt-1">
                    Cadastre-se para salvar matérias, receber informativos e assinar conteúdos exclusivos.
                  </p>
                </div>

                {regSuccess && (
                  <div className="mb-4 p-3 bg-[#EBF7EE] border border-[#16803C]/30 text-[#16803C] text-xs rounded flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Conta criada com sucesso! Redirecionando para seu painel...</span>
                  </div>
                )}

                {regError && (
                  <div className="mb-4 p-3 bg-[#FEF3F2] border border-[#B42318]/30 text-[#B42318] text-xs rounded flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{regError}</span>
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Nome Completo:</label>
                    <input
                      type="text"
                      placeholder="Ex: João da Silva"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full border border-[#D9DEE7] p-2 rounded focus:outline-none focus:border-[#0B5FFF]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">E-mail Válido:</label>
                    <input
                      type="email"
                      placeholder="seu.email@exemplo.com.br"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full border border-[#D9DEE7] p-2 rounded focus:outline-none focus:border-[#0B5FFF]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Senha de Acesso (mínimo 6 dígitos):</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full border border-[#D9DEE7] p-2 rounded focus:outline-none focus:border-[#0B5FFF]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Confirmação de Senha:</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={regPasswordConfirm}
                      onChange={(e) => setRegPasswordConfirm(e.target.value)}
                      className="w-full border border-[#D9DEE7] p-2 rounded focus:outline-none focus:border-[#0B5FFF]"
                      required
                    />
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={regTermsAccepted}
                      onChange={(e) => setRegTermsAccepted(e.target.checked)}
                      className="mt-0.5"
                    />
                    <label htmlFor="terms" className="text-[11px] text-[#5D6673] leading-snug">
                      Concordo com os Termos de Uso e a Política de Privacidade de O Patriota em conformidade com a LGPD.
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#16803C] hover:bg-[#22A447] text-white text-xs font-bold py-2.5 rounded transition shadow-xs cursor-pointer"
                  >
                    CONCLUIR CADASTRO
                  </button>
                </form>
              </div>
            )}

            {/* TAB: PASSWORD RESET */}
            {currentSubpage === 'recuperar-senha' && (
              <div>
                <div className="text-center mb-6">
                  <h2 className="font-serif text-2xl font-bold text-[#0B2345]">Recuperação de Senha</h2>
                  <p className="text-xs text-[#5D6673] mt-1">
                    Insira o e-mail cadastrado. Um link de redefinição com token seguro de uso único será enviado.
                  </p>
                </div>

                {resetSent ? (
                  <div className="p-4 bg-[#EBF7EE] border border-[#16803C]/30 text-[#16803C] text-xs rounded space-y-3 text-center">
                    <CheckCircle2 className="w-8 h-8 mx-auto" />
                    <p className="font-semibold">
                      Link de recuperação enviado com sucesso para: <strong>{resetEmail}</strong>
                    </p>
                    <p className="text-[11px] text-[#5D6673]">
                      Verifique sua caixa de entrada e pasta de spam. O token é válido por 30 minutos.
                    </p>
                    <button
                      onClick={() => { setResetSent(false); setCurrentSubpage('entrar'); }}
                      className="mt-2 text-xs font-bold text-[#0B2345] underline"
                    >
                      Voltar para o Login
                    </button>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); if (resetEmail) setResetSent(true); }} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold mb-1">Seu E-mail Cadastrado:</label>
                      <input
                        type="email"
                        placeholder="seu.email@exemplo.com.br"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full border border-[#D9DEE7] p-2 rounded focus:outline-none focus:border-[#0B5FFF]"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#0B2345] hover:bg-[#0B5FFF] text-white text-xs font-bold py-2.5 rounded transition cursor-pointer"
                    >
                      ENVIAR LINK DE REDEFINIÇÃO
                    </button>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => setCurrentSubpage('entrar')}
                        className="text-xs text-[#5D6673] hover:text-[#0B2345]"
                      >
                        ← Voltar para o Login
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        ) : (
          /* IF USER IS LOGGED IN: SHOW DASHBOARD WITH SIDEBAR NAVIGATION */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* LEFT SIDEBAR: PROFILE SUMMARY & NAVIGATION */}
            <aside className="lg:col-span-3 bg-white p-4 sm:p-5 rounded border border-[#D9DEE7] shadow-xs space-y-5">
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
                  { id: 'assinatura', label: 'Minha Assinatura', icon: Sparkles },
                  { id: 'pagamentos', label: 'Histórico de Pagamentos', icon: CreditCard },
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
            <main className="lg:col-span-9 bg-white p-4 sm:p-6 rounded border border-[#D9DEE7] shadow-xs">
              
              {/* SUBPAGE: DASHBOARD GERAL */}
              {currentSubpage === 'dashboard' && (
                <div className="space-y-5">
                  {/* Greeting Box */}
                  <div className="p-5 bg-[#0B2345] text-white rounded border border-[#07172E] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-[#FFCC29] uppercase tracking-wider block mb-1">
                        ÁREA DO LEITOR O PATRIOTA
                      </span>
                      <h2 className="font-serif text-2xl font-bold">
                        Olá, {currentUser.name}!
                      </h2>
                      <p className="text-xs text-white/80 mt-1 max-w-xl leading-relaxed">
                        Bem-vindo ao seu ambiente personalizado. Aqui você gerencia sua assinatura, acessa notícias salvas e configura seus alertas editoriais.
                      </p>
                    </div>

                    <div className="shrink-0">
                      <span className="bg-[#16803C] text-white text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider inline-block">
                        Status: Ativo
                      </span>
                    </div>
                  </div>

                  {/* Quick Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                    <div className="p-4 rounded border border-[#D9DEE7] bg-[#F7F8FA]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#5D6673]">Plano Atual</span>
                        <Sparkles className="w-4 h-4 text-[#0B5FFF]" />
                      </div>
                      <div className="text-lg font-black text-[#0B2345] uppercase">
                        {currentUser.subscription.plan}
                      </div>
                      <button
                        onClick={() => setCurrentSubpage('assinatura')}
                        className="text-[11px] font-bold text-[#0B5FFF] hover:underline mt-2 inline-block cursor-pointer"
                      >
                        Gerenciar ou alterar plano →
                      </button>
                    </div>

                    <div className="p-4 rounded border border-[#D9DEE7] bg-[#F7F8FA]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#5D6673]">Notícias Salvas</span>
                        <Bookmark className="w-4 h-4 text-[#16803C]" />
                      </div>
                      <div className="text-lg font-black text-[#0B2345]">
                        {currentUser.bookmarks.length} Matérias
                      </div>
                      <button
                        onClick={() => setCurrentSubpage('favoritos')}
                        className="text-[11px] font-bold text-[#0B5FFF] hover:underline mt-2 inline-block cursor-pointer"
                      >
                        Ver lista de leitura →
                      </button>
                    </div>

                    <div className="p-4 rounded border border-[#D9DEE7] bg-[#F7F8FA]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#5D6673]">Membro Desde</span>
                        <ShieldCheck className="w-4 h-4 text-[#FFCC29]" />
                      </div>
                      <div className="text-lg font-black text-[#0B2345]">
                        {currentUser.createdAt}
                      </div>
                      <span className="text-[11px] text-[#5D6673] mt-2 inline-block">
                        Conta verificada por e-mail
                      </span>
                    </div>
                  </div>

                  {/* Recent Bookmarks on Dashboard */}
                  <div>
                    <div className="flex items-center justify-between mb-3 border-b border-[#D9DEE7] pb-2">
                      <h3 className="font-serif text-base font-bold text-[#0B2345]">
                        Suas Notícias Salvas Recentemente
                      </h3>
                      <button
                        onClick={() => setCurrentSubpage('favoritos')}
                        className="text-xs font-bold text-[#0B5FFF] hover:underline cursor-pointer"
                      >
                        Ver todas ({currentUser.bookmarks.length})
                      </button>
                    </div>

                    {bookmarkedArticles.length === 0 ? (
                      <p className="text-xs text-[#5D6673] italic py-4">
                        Você ainda não salvou nenhuma notícia. Clique no ícone de marcador nas reportagens para ler depois.
                      </p>
                    ) : (
                      <div className="divide-y divide-[#D9DEE7]">
                        {bookmarkedArticles.slice(0, 3).map((art) => (
                          <div key={art.id} className="py-3 flex items-center justify-between gap-4">
                            <div>
                              <span className="text-[10px] font-bold text-[#0B5FFF] uppercase block mb-0.5">
                                {art.kicker}
                              </span>
                              <h4 className="font-serif text-sm font-bold text-[#0B2345] hover:text-[#0B5FFF] cursor-pointer" onClick={() => onSelectArticle(art)}>
                                {art.title}
                              </h4>
                            </div>
                            <button
                              onClick={() => onSelectArticle(art)}
                              className="text-xs font-bold text-[#0B2345] hover:text-[#0B5FFF] shrink-0 cursor-pointer"
                            >
                              Ler Matéria →
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SUBPAGE: ASSINATURA */}
              {currentSubpage === 'assinatura' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#0B2345]">Planos de Assinatura</h3>
                    <p className="text-xs text-[#5D6673] mt-1">
                      Escolha a modalidade que melhor se adapta à sua rotina de leitura e fortaleça o jornalismo nacional independente.
                    </p>
                  </div>

                  {planSuccessMsg && (
                    <div className="p-3 bg-[#EBF7EE] border border-[#16803C]/30 text-[#16803C] text-xs rounded flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{planSuccessMsg}</span>
                    </div>
                  )}

                  {/* Plan Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    {SUBSCRIPTION_PLANS.map((plan) => {
                      const isCurrent = activePlanId === plan.id;
                      return (
                        <div
                          key={plan.id}
                          className={`rounded border p-6 flex flex-col justify-between transition-all ${
                            isCurrent
                              ? 'border-[#0B2345] bg-[#F7F8FA] ring-2 ring-[#0B2345]/20 shadow-md'
                              : 'border-[#D9DEE7] bg-white hover:border-[#0B5FFF]'
                          }`}
                        >
                          <div>
                            {plan.badge && (
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded inline-block mb-3 ${
                                plan.id === 'premium' ? 'bg-[#FFCC29] text-[#17202A]' : 'bg-[#0B2345] text-white'
                              }`}>
                                {plan.badge}
                              </span>
                            )}
                            <h4 className="font-serif text-lg font-bold text-[#0B2345] mb-1">
                              {plan.name}
                            </h4>
                            <p className="text-xs text-[#5D6673] mb-4 min-h-[32px]">
                              {plan.description}
                            </p>

                            <div className="mb-6">
                              <span className="text-2xl font-black text-[#0B2345]">
                                {plan.priceMonthly === 0 ? 'Grátis' : `R$ ${plan.priceMonthly.toFixed(2)}`}
                              </span>
                              {plan.priceMonthly > 0 && <span className="text-xs text-[#5D6673]"> /mês</span>}
                            </div>

                            <ul className="space-y-2 text-xs text-[#5D6673] mb-6">
                              {plan.benefits.map((b, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16803C] shrink-0 mt-0.5" />
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            {isCurrent ? (
                              <div className="w-full text-center py-2 bg-[#EBF7EE] text-[#16803C] font-bold text-xs rounded border border-[#16803C]/30">
                                ✓ SEU PLANO ATIVO
                              </div>
                            ) : (
                              <button
                                onClick={() => handleChangePlan(plan.id)}
                                className="w-full bg-[#0B2345] hover:bg-[#0B5FFF] text-white text-xs font-bold py-2.5 rounded transition cursor-pointer"
                              >
                                {plan.id === 'gratuito' ? 'MUDAR PARA GRÁTIS' : `ASSINAR ${plan.name.toUpperCase()}`}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SUBPAGE: HISTÓRICO DE PAGAMENTOS */}
              {currentSubpage === 'pagamentos' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#0B2345]">Histórico de Pagamentos</h3>
                    <p className="text-xs text-[#5D6673] mt-1">
                      Comprovantes de faturamento e notas fiscais eletrônicas de sua assinatura.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#F7F8FA] border-b border-[#D9DEE7] text-[#5D6673] uppercase text-[10px] font-bold">
                        <tr>
                          <th className="py-2.5 px-3">Data</th>
                          <th className="py-2.5 px-3">Plano / Descrição</th>
                          <th className="py-2.5 px-3">Valor</th>
                          <th className="py-2.5 px-3">Nota Fiscal</th>
                          <th className="py-2.5 px-3">Situação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#D9DEE7]">
                        {payments.map((p) => (
                          <tr key={p.id} className="hover:bg-[#F7F8FA]">
                            <td className="py-3 px-3 font-semibold">{p.date}</td>
                            <td className="py-3 px-3">{p.planName}</td>
                            <td className="py-3 px-3 font-bold text-[#0B2345]">R$ {p.amount.toFixed(2)}</td>
                            <td className="py-3 px-3 font-mono text-[11px] text-[#5D6673]">{p.invoiceNumber}</td>
                            <td className="py-3 px-3">
                              <span className="bg-[#EBF7EE] text-[#16803C] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                                Concluído
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUBPAGE: NOTÍCIAS SALVAS / FAVORITOS */}
              {currentSubpage === 'favoritos' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#0B2345]">Notícias Salvas nos Favoritos</h3>
                    <p className="text-xs text-[#5D6673] mt-1">
                      Reportagens marcadas para consulta ou leitura aprofundada posterior.
                    </p>
                  </div>

                  {bookmarkedArticles.length === 0 ? (
                    <div className="p-8 text-center bg-[#F7F8FA] rounded border border-[#D9DEE7] text-xs text-[#5D6673]">
                      <Bookmark className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                      <p className="font-semibold text-sm text-[#0B2345]">Nenhum artigo salvo até o momento.</p>
                      <p className="mt-1">Ao navegar pelo portal, clique no marcador para salvar artigos nesta lista.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bookmarkedArticles.map((art) => (
                        <div
                          key={art.id}
                          className="p-4 rounded border border-[#D9DEE7] hover:border-[#0B5FFF] transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F7F8FA]"
                        >
                          <div className="flex gap-4 items-center">
                            <img
                              src={art.imageUrl}
                              alt={art.title}
                              className="w-16 h-14 object-cover rounded shrink-0 border border-[#D9DEE7]"
                            />
                            <div>
                              <span className="text-[10px] font-bold text-[#0B5FFF] uppercase block">
                                {art.kicker}
                              </span>
                              <h4
                                className="font-serif text-sm font-bold text-[#0B2345] hover:text-[#0B5FFF] cursor-pointer"
                                onClick={() => onSelectArticle(art)}
                              >
                                {art.title}
                              </h4>
                              <span className="text-[11px] text-[#5D6673]">
                                {art.readTimeMinutes} min de leitura • {art.publishedAt}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => onSelectArticle(art)}
                              className="bg-[#0B2345] hover:bg-[#0B5FFF] text-white text-xs font-bold px-3 py-1.5 rounded transition cursor-pointer"
                            >
                              Ler Matéria
                            </button>
                            <button
                              onClick={() => handleRemoveBookmark(art.id)}
                              className="p-1.5 text-[#5D6673] hover:text-[#B42318] rounded border border-[#D9DEE7] bg-white transition cursor-pointer"
                              title="Remover dos favoritos"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SUBPAGE: DADOS CADASTRAIS */}
              {currentSubpage === 'perfil' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#0B2345]">Dados Pessoais</h3>
                    <p className="text-xs text-[#5D6673] mt-1">
                      Edite seus dados cadastrais conforme a Lei Geral de Proteção de Dados (LGPD).
                    </p>
                  </div>

                  {profileSaved && (
                    <div className="p-3 bg-[#EBF7EE] border border-[#16803C]/30 text-[#16803C] text-xs rounded flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Dados pessoais atualizados com sucesso!</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveProfile} className="space-y-4 text-xs max-w-lg">
                    <div>
                      <label className="block font-semibold mb-1">Nome Completo:</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full border border-[#D9DEE7] p-2 rounded focus:outline-none focus:border-[#0B5FFF]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">E-mail Cadastrado:</label>
                      <input
                        type="email"
                        value={currentUser.email}
                        disabled
                        className="w-full border border-[#D9DEE7] p-2 rounded bg-slate-100 text-[#5D6673] cursor-not-allowed"
                      />
                      <span className="text-[10px] text-[#5D6673]">Para trocar o e-mail, entre em contato com a equipe de suporte.</span>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Telefone / WhatsApp (opcional):</label>
                      <input
                        type="text"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full border border-[#D9DEE7] p-2 rounded focus:outline-none focus:border-[#0B5FFF]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Breve Biografia / Cidade:</label>
                      <textarea
                        rows={3}
                        value={profileBio}
                        onChange={(e) => setProfileBio(e.target.value)}
                        className="w-full border border-[#D9DEE7] p-2 rounded focus:outline-none focus:border-[#0B5FFF]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-[#0B2345] hover:bg-[#0B5FFF] text-white text-xs font-bold px-5 py-2.5 rounded transition cursor-pointer"
                    >
                      SALVAR ALTERAÇÕES
                    </button>
                  </form>
                </div>
              )}

              {/* SUBPAGE: PREFERÊNCIAS DE ALERTAS */}
              {currentSubpage === 'notificacoes' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#0B2345]">Preferências de Notificações</h3>
                    <p className="text-xs text-[#5D6673] mt-1">
                      Defina os canais e a periodicidade dos informativos editoriais.
                    </p>
                  </div>

                  {notifSaved && (
                    <div className="p-3 bg-[#EBF7EE] border border-[#16803C]/30 text-[#16803C] text-xs rounded flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Preferências de notificação salvas com sucesso!</span>
                    </div>
                  )}

                  <div className="space-y-4 text-xs divide-y divide-[#D9DEE7]">
                    <div className="pt-2 flex items-center justify-between">
                      <div>
                        <strong className="block text-[#0B2345]">Alertas de Últimas Notícias (Breaking News)</strong>
                        <span className="text-[#5D6673]">Avisos urgentes de acontecimentos de impacto nacional.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifPrefs.breakingNews}
                        onChange={(e) => setNotifPrefs({ ...notifPrefs, breakingNews: e.target.checked })}
                        className="w-4 h-4 text-[#0B2345]"
                      />
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <div>
                        <strong className="block text-[#0B2345]">Resumo Diário da Manhã (Briefing de Brasília)</strong>
                        <span className="text-[#5D6673]">E-mail às 7h com as principais manchetes da Esplanada e dos Ministérios.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifPrefs.dailyBrief}
                        onChange={(e) => setNotifPrefs({ ...notifPrefs, dailyBrief: e.target.checked })}
                        className="w-4 h-4 text-[#0B2345]"
                      />
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <div>
                        <strong className="block text-[#0B2345]">Dossiês da Agência de Checagem</strong>
                        <span className="text-[#5D6673]">Verificações de fatos e desmentidos de boatos virais.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifPrefs.factChecks}
                        onChange={(e) => setNotifPrefs({ ...notifPrefs, factChecks: e.target.checked })}
                        className="w-4 h-4 text-[#0B2345]"
                      />
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <div>
                        <strong className="block text-[#0B2345]">Carta Semanal dos Editores</strong>
                        <span className="text-[#5D6673]">Análises de fundo sobre geopolítica e economia aos sábados.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifPrefs.weeklyDigest}
                        onChange={(e) => setNotifPrefs({ ...notifPrefs, weeklyDigest: e.target.checked })}
                        className="w-4 h-4 text-[#0B2345]"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      currentUser.notificationPrefs = notifPrefs;
                      setNotifSaved(true);
                      setTimeout(() => setNotifSaved(false), 3000);
                    }}
                    className="bg-[#0B2345] hover:bg-[#0B5FFF] text-white text-xs font-bold px-5 py-2.5 rounded transition cursor-pointer"
                  >
                    SALVAR PREFERÊNCIAS
                  </button>
                </div>
              )}

              {/* SUBPAGE: PRIVACIDADE & LGPD */}
              {currentSubpage === 'privacidade' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#0B2345]">Privacidade e Gestão de Dados (LGPD)</h3>
                    <p className="text-xs text-[#5D6673] mt-1">
                      Em conformidade com a Lei nº 13.709/2018, você possui controle absoluto sobre seus dados.
                    </p>
                  </div>

                  <div className="p-4 bg-[#F7F8FA] border border-[#D9DEE7] rounded space-y-3 text-xs">
                    <strong className="text-[#0B2345] block font-semibold">1. Portabilidade e Exportação de Dados</strong>
                    <p className="text-[#5D6673]">
                      Baixe uma cópia estruturada em formato JSON de todos os seus dados pessoais, histórico de assinaturas e preferências armazenadas no sistema.
                    </p>
                    <button
                      onClick={handleExportData}
                      className="inline-flex items-center gap-1.5 bg-white border border-[#D9DEE7] hover:border-[#0B2345] text-[#0B2345] font-bold px-3 py-1.5 rounded transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Exportar Meus Dados (JSON)</span>
                    </button>
                  </div>

                  <div className="p-4 bg-[#FEF3F2] border border-[#B42318]/30 rounded space-y-3 text-xs">
                    <strong className="text-[#B42318] block font-semibold">2. Direito ao Esquecimento / Exclusão de Conta</strong>
                    <p className="text-[#5D6673]">
                      Ao solicitar a exclusão de sua conta, seus dados de perfil, favoritos e sessões ativas serão permanentemente apagados dos servidores de O Patriota, mantendo-se apenas os registros contábeis estritamente exigidos pela legislação fiscal brasileira.
                    </p>

                    {deletionRequested ? (
                      <div className="p-3 bg-white border border-[#B42318] text-[#B42318] font-bold rounded">
                        ✓ Solicitação de exclusão protocolada sob o código LGPD-{Date.now().toString().slice(-6)}. Nossa equipe de privacidade concluirá o expurgo em até 48 horas úteis.
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          if (confirm('Tem certeza de que deseja solicitar a exclusão de sua conta? Esta ação é irreversível.')) {
                            setDeletionRequested(true);
                          }
                        }}
                        className="bg-[#B42318] hover:bg-red-700 text-white font-bold px-3.5 py-2 rounded transition cursor-pointer"
                      >
                        SOLICITAR EXCLUSÃO DEFINITIVA DA CONTA
                      </button>
                    )}
                  </div>
                </div>
              )}

            </main>
          </div>
        )}

      </div>
    </div>
  );
};
