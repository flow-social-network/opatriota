import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { useAuth } from '../../app/contexts/AuthContext';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  AlertCircle, 
  CheckCircle2, 
  PenTool, 
  UserCheck 
} from 'lucide-react';

export default function NewsroomLoginPage() {
  const navigate = useNavigate();
  const { loginWithEmail, setCurrentUser } = useAuth();
  
  const [email, setEmail] = useState('redacao@opatriota.sbs');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Por favor, preencha o e-mail e a senha profissional.');
      return;
    }

    setLoading(true);
    try {
      const user = await loginWithEmail(email, password);
      // Validação estrita de autorização editorial
      const allowedRoles = ['jornalista', 'revisor', 'editor', 'editor_chefe', 'administrador'];
      if (!allowedRoles.includes(user.role)) {
        setErrorMessage('Acesso negado: sua conta não possui credenciais autorizadas para o Painel da Redação.');
        return;
      }
      navigate('/redacao');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Falha na autenticação. Verifique suas credenciais de redação.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRoleSelect = (role: 'jornalista' | 'revisor' | 'editor' | 'editor_chefe') => {
    const roleLabels = {
      jornalista: 'Repórter Carlos Eduardo',
      revisor: 'Revisora Mariana Rios',
      editor: 'Editor Paulo Roberto',
      editor_chefe: 'Editor-Chefe Marcos Vinicius',
    };
    const session = {
      id: `usr-${role}`,
      name: roleLabels[role],
      email: `${role}@opatriota.sbs`,
      role,
      subscription: { plan: 'premium' as const, status: 'ativo' as const, validUntil: '2026-12-31', autoRenew: true },
      bookmarks: [],
      notificationPrefs: { breakingNews: true, dailyBrief: true, factChecks: true, weeklyDigest: true },
      createdAt: '2026-10-09T10:00:00Z',
    };
    setCurrentUser(session);
    if (typeof window !== 'undefined') {
      localStorage.setItem('opatriota_session', JSON.stringify(session));
    }
    navigate('/redacao');
  };

  return (
    <AuthLayout
      badgeTitle="PAINEL DA REDAÇÃO"
      badgeColor="blue"
      heading="Login da Redação"
      subheading="Acesso restrito para repórteres, revisores, editores e colunistas do O Patriota."
      securityNote="Área monitorada por conformidade editorial. O compartilhamento de credenciais é expressamente vedado e monitorado em logs."
    >
      {errorMessage && (
        <div className="mb-6 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#17202A] mb-1.5 uppercase tracking-wide">
            E-mail Profissional
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
              placeholder="seu.nome@opatriota.sbs"
              className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#17202A] placeholder-gray-400 focus:outline-none focus:border-[#0B5FFF] focus:ring-1 focus:ring-[#0B5FFF] transition"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-[#17202A] uppercase tracking-wide">
              Senha de Acesso
            </label>
            <Link
              to="/auth/esqueci-a-senha/redacao"
              className="text-xs text-[#0B5FFF] hover:text-[#0848C7] hover:underline font-medium"
            >
              Esqueceu a senha?
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
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#17202A] placeholder-gray-400 focus:outline-none focus:border-[#0B5FFF] focus:ring-1 focus:ring-[#0B5FFF] transition"
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
            <span className="text-xs text-[#4A5568]">Manter sessão ativa nesta estação</span>
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
              <LogIn className="w-4 h-4" />
              <span>Entrar na Redação</span>
            </>
          )}
        </button>
      </form>

      {/* QUICK ROLE SELECTOR (FOR VERIFICATION AND TESTING AS SPECIFIED) */}
      <div className="mt-8 pt-6 border-t border-[#E2E8F0]">
        <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5 text-[#0B5FFF]" />
          <span>Acesso Rápido por Perfil Editorial (Ambiente Homologado):</span>
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleQuickRoleSelect('jornalista')}
            className="p-2 text-left rounded border border-[#E2E8F0] hover:border-[#0B5FFF] hover:bg-blue-50/50 transition cursor-pointer"
          >
            <div className="font-bold text-[#0B2345]">Repórter</div>
            <div className="text-[10px] text-gray-500">Criação & Rascunho</div>
          </button>
          <button
            type="button"
            onClick={() => handleQuickRoleSelect('revisor')}
            className="p-2 text-left rounded border border-[#E2E8F0] hover:border-[#0B5FFF] hover:bg-blue-50/50 transition cursor-pointer"
          >
            <div className="font-bold text-[#0B2345]">Revisor</div>
            <div className="text-[10px] text-gray-500">Checagem de texto</div>
          </button>
          <button
            type="button"
            onClick={() => handleQuickRoleSelect('editor')}
            className="p-2 text-left rounded border border-[#E2E8F0] hover:border-[#0B5FFF] hover:bg-blue-50/50 transition cursor-pointer"
          >
            <div className="font-bold text-[#0B2345]">Editor</div>
            <div className="text-[10px] text-gray-500">Pauta e Aprovação</div>
          </button>
          <button
            type="button"
            onClick={() => handleQuickRoleSelect('editor_chefe')}
            className="p-2 text-left rounded border border-[#E2E8F0] hover:border-[#16803C] hover:bg-emerald-50/50 transition cursor-pointer"
          >
            <div className="font-bold text-[#16803C]">Editor-Chefe</div>
            <div className="text-[10px] text-gray-500">Publicação final</div>
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
