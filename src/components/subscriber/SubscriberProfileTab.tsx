import React from 'react';
import { UserSession } from '../../types';
import { CheckCircle2 } from 'lucide-react';

interface SubscriberProfileTabProps {
  currentUser: UserSession;
  profileName: string;
  profilePhone: string;
  profileBio: string;
  profileSaved: boolean;
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onBioChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
}

export const SubscriberProfileTab: React.FC<SubscriberProfileTabProps> = ({
  currentUser,
  profileName,
  profilePhone,
  profileBio,
  profileSaved,
  onNameChange,
  onPhoneChange,
  onBioChange,
  onSubmit
}) => {
  return (
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

      <form onSubmit={onSubmit} className="space-y-4 text-xs max-w-lg">
        <div>
          <label className="block font-semibold mb-1">Nome Completo:</label>
          <input
            type="text"
            value={profileName}
            onChange={(e) => onNameChange(e.target.value)}
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
            onChange={(e) => onPhoneChange(e.target.value)}
            className="w-full border border-[#D9DEE7] p-2 rounded focus:outline-none focus:border-[#0B5FFF]"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Breve Biografia / Cidade:</label>
          <textarea
            rows={3}
            value={profileBio}
            onChange={(e) => onBioChange(e.target.value)}
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
  );
};
