import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { useAuth } from '../../app/contexts/AuthContext';
import { api } from '../../services/apiClient';
import type { UserSession } from '../../types';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn,
  AlertCircle, 
  ShieldAlert
} from 'lucide-react';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Informe o e-mail administrativo e a chave de acesso.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post<{ user: UserSession }>('/editorial/auth/login', { email, password }, { auth: false });
      const user = response.user;
      if (user.role !== 'administrador') {
        setErrorMessage('Acesso negado: esta conta não possui perfil administrativo.');
        return;
      }
      setCurrentUser(user);
      navigate('/admin');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Falha na autenticação administrativa. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      badgeTitle="PAINEL ADMINISTRATIVO"
      badgeColor="gold"
      heading="Login Administrativo"
      subheading="Acesso restrito para administração central, gestão de pautas, esteira editorial e configurações gerais."
      securityNote="Área restrita de alta criticidade. Todas as tentativas de acesso, alterações de permissão e configurações são registradas em logs de auditoria imutáveis."
    >
      {/* Alert banner for high security */}
      <div className="mb-6 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span>Ambiente restrito com controle de integridade ativo. Mantenha suas chaves em sigilo.</span>
      </div>

      {errorMessage && (
        <div className="mb-6 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#17202A] mb-1.5 uppercase tracking-wide">
            E-mail de Administrador
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@opatriota.sbs"
              className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#17202A] placeholder-gray-400 focus:outline-none focus:border-[#FFCC29] focus:ring-1 focus:ring-[#FFCC29] transition"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-[#17202A] uppercase tracking-wide">
              Senha Administrativa
            </label>
            <Link
              to="/auth/esqueci-a-senha/admin"
              className="text-xs text-[#0B5FFF] hover:text-[#0848C7] hover:underline font-medium"
            >
              Recuperar chave?
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
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#17202A] placeholder-gray-400 focus:outline-none focus:border-[#FFCC29] focus:ring-1 focus:ring-[#FFCC29] transition"
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
            <span className="text-xs text-[#4A5568]">Manter sessão administrativa protegida</span>
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
              <span>Acessar Administração</span>
            </>
          )}
        </button>
      </form>

    </AuthLayout>
  );
}
