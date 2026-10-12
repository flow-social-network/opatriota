import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { useAuth, DEMO_MARCOS_VINICIUS } from '../../app/contexts/AuthContext';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function ClientLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithEmail, loginWithGoogle, setCurrentUser } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const nextUrl = searchParams.get('next') || '/minha-conta';

  const [identifier, setIdentifier] = useState('marcos@email.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim() || !password.trim()) {
      setErrorMessage('Informe seu e-mail (ou CPF) e senha de acesso.');
      return;
    }

    setLoading(true);
    try {
      await loginWithEmail(identifier, password);
      navigate(nextUrl);
    } catch (err: any) {
      setErrorMessage(err?.message || 'E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setErrorMessage(null);
    try {
      await loginWithGoogle();
      navigate(nextUrl);
    } catch (err: any) {
      // Fallback already sets Marcos Vinicius if not configured
      navigate(nextUrl);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleDemoSubscriberLogin = () => {
    setCurrentUser(DEMO_MARCOS_VINICIUS);
    if (typeof window !== 'undefined') {
      localStorage.setItem('opatriota_session', JSON.stringify(DEMO_MARCOS_VINICIUS));
    }
    navigate(nextUrl);
  };

  return (
    <AuthLayout
      badgeTitle="ÁREA DO ASSINANTE"
      badgeColor="emerald"
      heading="Acesse sua Conta"
      subheading="Entre com suas credenciais para ler matérias exclusivas, salvar artigos e gerenciar sua assinatura."
      securityNote="Seus dados estão protegidos sob a LGPD e criptografia de ponta a ponta. Não compartilhamos informações com terceiros."
    >
      {errorMessage && (
        <div className="mb-6 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Social Google Login Button */}
      <div className="mb-5">
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full py-2.5 px-4 bg-white border border-[#CBD5E1] hover:bg-gray-50 text-[#17202A] text-xs font-bold rounded-lg shadow-xs transition flex items-center justify-center gap-3 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continuar com Google</span>
        </button>
      </div>

      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-200" />
        <span className="px-3 text-xs text-gray-400 font-medium">ou com seu e-mail</span>
        <div className="flex-1 border-t border-gray-200" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#17202A] mb-1.5 uppercase tracking-wide">
            E-mail ou CPF
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="seu@email.com ou 000.000.000-00"
              className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#17202A] placeholder-gray-400 focus:outline-none focus:border-[#0B2345] focus:ring-1 focus:ring-[#0B2345] transition"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-[#17202A] uppercase tracking-wide">
              Sua Senha
            </label>
            <Link
              to="/auth/esqueci-a-senha"
              className="text-xs text-[#0B5FFF] hover:text-[#0848C7] hover:underline font-medium"
            >
              Esqueci a senha
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#17202A] placeholder-gray-400 focus:outline-none focus:border-[#0B2345] focus:ring-1 focus:ring-[#0B2345] transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
              tabIndex={-1}
              aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-[#0B2345] rounded border-gray-300 focus:ring-[#0B2345]"
            />
            <span className="text-xs text-[#4A5568]">Lembrar de mim</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-[#0B2345] hover:bg-[#132D50] active:scale-[0.99] text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <LogIn className="w-4 h-4 text-[#FFCC29]" />
              <span>Entrar no Portal</span>
            </>
          )}
        </button>
      </form>

      {/* Sign up prompt */}
      <div className="mt-6 text-center text-xs text-[#4A5568]">
        <span>Ainda não possui uma assinatura? </span>
        <Link to="/auth/cadastro" className="text-[#0B5FFF] font-bold hover:underline">
          Cadastre-se gratuitamente
        </Link>
        <span className="mx-1.5">•</span>
        <Link to="/planos" className="text-[#16803C] font-bold hover:underline">
          Ver Planos
        </Link>
      </div>

      {/* Quick Demo Login */}
      <div className="mt-8 pt-6 border-t border-[#E2E8F0]">
        <button
          type="button"
          onClick={handleDemoSubscriberLogin}
          className="w-full py-2.5 px-3 rounded-lg border border-emerald-300 bg-emerald-50/60 hover:bg-emerald-100/60 text-[#16803C] text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Acesso Rápido — Marcos Vinicius (Assinante Premium)</span>
        </button>
      </div>
    </AuthLayout>
  );
}
