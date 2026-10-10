import React from 'react';
import { AlertCircle, Mail, KeyRound } from 'lucide-react';

interface SubscriberLoginTabProps {
  loginError: string | null;
  loginEmail: string;
  loginPassword: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  onForgotPassword: () => void;
}

export const SubscriberLoginTab: React.FC<SubscriberLoginTabProps> = ({
  loginError,
  loginEmail,
  loginPassword,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onForgotPassword
}) => {
  return (
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

      <form onSubmit={onSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold mb-1">E-mail Cadastrado:</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#5D6673] absolute left-3 top-2.5" />
            <input
              type="email"
              placeholder="seu.email@exemplo.com.br"
              value={loginEmail}
              onChange={(e) => onEmailChange(e.target.value)}
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
              onClick={onForgotPassword}
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
              onChange={(e) => onPasswordChange(e.target.value)}
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
    </div>
  );
};
