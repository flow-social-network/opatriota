import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { useAuth } from '../../app/contexts/AuthContext';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Send, ShieldCheck } from 'lucide-react';

export default function AdminForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Informe seu e-mail administrativo oficial.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Não foi possível processar a solicitação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      badgeTitle="ADMINISTRAÇÃO — RECUPERAÇÃO"
      badgeColor="gold"
      heading="Recuperação Administrativa"
      subheading="Insira o e-mail de administrador para emitir um token seguro de redefinição de acesso."
      securityNote="Processo auditado com validação de segurança reforçada. Notificação enviada aos canais de segurança interna."
    >
      {submitted ? (
        <div className="text-center py-6">
          <div className="w-14 h-14 bg-emerald-100 text-[#16803C] rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[#0B2345] mb-2">Token de recuperação despachado!</h3>
          <p className="text-sm text-[#4A5568] leading-relaxed mb-6">
            Caso o e-mail <strong className="text-[#0B2345]">{email}</strong> esteja cadastrado como administrador de sistema, um link com token autenticado foi enviado para sua caixa de entrada.
          </p>
          <div className="space-y-3">
            <Link
              to="/auth/redefinir-senha/admin"
              className="inline-flex items-center justify-center w-full py-2.5 px-4 bg-[#0B2345] hover:bg-[#132D50] text-[#FFCC29] text-xs font-bold rounded-lg transition"
            >
              Já possuo o token / Redefinir agora
            </Link>
            <Link
              to="/auth/login/admin"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-[#0B2345] text-xs font-bold rounded-lg transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Login Administrativo</span>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#17202A] mb-1.5 uppercase tracking-wide">
                E-mail Administrativo
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#0B2345] hover:bg-[#132D50] active:scale-[0.99] text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4 text-[#FFCC29]" />
                  <span>Enviar Chave de Recuperação</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <Link
                to="/auth/login/admin"
                className="inline-flex items-center gap-1.5 text-xs text-[#0B5FFF] hover:text-[#0848C7] hover:underline font-bold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar para o Login Administrativo</span>
              </Link>
            </div>
          </form>
        </>
      )}
    </AuthLayout>
  );
}
