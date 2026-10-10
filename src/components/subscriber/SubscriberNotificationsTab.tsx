import React from 'react';
import { UserSession } from '../../types';
import { CheckCircle2 } from 'lucide-react';

type NotificationPrefs = UserSession['notificationPrefs'];

interface SubscriberNotificationsTabProps {
  notifPrefs: NotificationPrefs;
  notifSaved: boolean;
  onTogglePref: (key: keyof NotificationPrefs, checked: boolean) => void;
  onSave: () => void;
}

export const SubscriberNotificationsTab: React.FC<SubscriberNotificationsTabProps> = ({
  notifPrefs,
  notifSaved,
  onTogglePref,
  onSave
}) => {
  return (
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
            onChange={(e) => onTogglePref('breakingNews', e.target.checked)}
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
            onChange={(e) => onTogglePref('dailyBrief', e.target.checked)}
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
            onChange={(e) => onTogglePref('factChecks', e.target.checked)}
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
            onChange={(e) => onTogglePref('weeklyDigest', e.target.checked)}
            className="w-4 h-4 text-[#0B2345]"
          />
        </div>
      </div>

      <button
        onClick={onSave}
        className="bg-[#0B2345] hover:bg-[#0B5FFF] text-white text-xs font-bold px-5 py-2.5 rounded transition cursor-pointer"
      >
        SALVAR PREFERÊNCIAS
      </button>
    </div>
  );
};
