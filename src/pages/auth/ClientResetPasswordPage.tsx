import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, KeyRound, ArrowLeft } from 'lucide-react';

export default function ClientResetPasswordPage() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword.length < 6) {
      setErrorMessage('A nova senha deve ter no mínimo 6 dígitos.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('As senhas digitadas não conferem.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 700);
  };

  return (
    <AuthLayout
      badgeTitle="REDEFINIÇÃO DE SENHA"
      badgeColor="emerald"
      heading="Cadastre sua Nova Senha"
      subheading="Informe o código recebido por e-mail e escolha sua nova chave de acesso."
      securityNote="Ao redefinir sua senha, você poderá acessar imediatamente todas as suas matérias salvas e benefícios."
    >
      {success ? (
        <div className="text-center py-6">
          <div className="w-14 h-14 bg-emerald-100 text-[#16803C] rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[#0B2345] mb-2">Senha redefinida com sucesso!</h3>
          <p className="text-sm text-[#4A5568] leading-relaxed mb-6">
            Você já pode acessar sua conta de assinante com a nova senha criada.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 px-4 bg-[#0B2345] hover:bg-[#132D50] text-[#FFCC29] text-sm font-bold rounded-lg shadow-md transition cursor-pointer"
          >
            Fazer Login Agora
          </button>
        </div>
      ) : (
        <>
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#17202A] mb-1.5 uppercase tracking-wide">
                Código de Redefinição
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Código enviado ao seu e-mail"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#17202A] placeholder-gray-400 focus:outline-none focus:border-[#0B2345] focus:ring-1 focus:ring-[#0B2345] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17202A] mb-1.5 uppercase tracking-wide">
                Nova Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 dígitos"
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

            <div>
              <label className="block text-xs font-bold text-[#17202A] mb-1.5 uppercase tracking-wide">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#17202A] placeholder-gray-400 focus:outline-none focus:border-[#0B2345] focus:ring-1 focus:ring-[#0B2345] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#0B2345] hover:bg-[#132D50] active:scale-[0.99] text-[#FFCC29] text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Salvar Nova Senha</span>
              )}
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs text-[#0B5FFF] hover:text-[#0848C7] hover:underline font-bold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Cancelar e voltar ao login</span>
              </Link>
            </div>
          </form>
        </>
      )}
    </AuthLayout>
  );
}
