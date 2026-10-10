import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface SubscriberRegisterTabProps {
  regSuccess: boolean;
  regError: string | null;
  regName: string;
  regEmail: string;
  regPassword: string;
  regPasswordConfirm: string;
  regTermsAccepted: boolean;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onPasswordConfirmChange: (value: string) => void;
  onTermsChange: (value: boolean) => void;
  onSubmit: (event: React.FormEvent) => void;
}

export const SubscriberRegisterTab: React.FC<SubscriberRegisterTabProps> = ({
  regSuccess,
  regError,
  regName,
  regEmail,
  regPassword,
  regPasswordConfirm,
  regTermsAccepted,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onPasswordConfirmChange,
  onTermsChange,
  onSubmit
}) => {
  return (
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

      <form onSubmit={onSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold mb-1">Nome Completo:</label>
          <input
            type="text"
            placeholder="Ex: João da Silva"
            value={regName}
            onChange={(e) => onNameChange(e.target.value)}
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
            onChange={(e) => onEmailChange(e.target.value)}
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
            onChange={(e) => onPasswordChange(e.target.value)}
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
            onChange={(e) => onPasswordConfirmChange(e.target.value)}
            className="w-full border border-[#D9DEE7] p-2 rounded focus:outline-none focus:border-[#0B5FFF]"
            required
          />
        </div>

        <div className="flex items-start gap-2 pt-1">
          <input
            type="checkbox"
            id="terms"
            checked={regTermsAccepted}
            onChange={(e) => onTermsChange(e.target.checked)}
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
  );
};
