import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface SubscriberPasswordResetTabProps {
  resetEmail: string;
  resetSent: boolean;
  onEmailChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  onBackToLogin: () => void;
  onBackToLoginAfterSent: () => void;
}

export const SubscriberPasswordResetTab: React.FC<SubscriberPasswordResetTabProps> = ({
  resetEmail,
  resetSent,
  onEmailChange,
  onSubmit,
  onBackToLogin,
  onBackToLoginAfterSent
}) => {
  return (
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
            onClick={onBackToLoginAfterSent}
            className="mt-2 text-xs font-bold text-[#0B2345] underline"
          >
            Voltar para o Login
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">Seu E-mail Cadastrado:</label>
            <input
              type="email"
              placeholder="seu.email@exemplo.com.br"
              value={resetEmail}
              onChange={(e) => onEmailChange(e.target.value)}
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
              onClick={onBackToLogin}
              className="text-xs text-[#5D6673] hover:text-[#0B2345]"
            >
              ← Voltar para o Login
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
