import React from 'react';
import { useData } from '../../app/contexts/DataContext';
import { useAuth } from '../../app/contexts/AuthContext';
import { useToast } from '../../app/contexts/ToastContext';

export function PermissionsPage() {
  const { categories, sources, authors, portalSettings } = useData();
  const { currentUser, role } = useAuth();
  const { showToast } = useToast();

  if (!role || !['administrador', 'editor_chefe'].includes(role)) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold text-[#17202A] mb-6">Permissões</h2>
        <p className="text-[#64748B]">Apenas administradores e editores-chefe podem gerenciar permissões.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-[#17202A] mb-6">Permissões e Funções</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#F8FAFC] p-4 rounded border border-[#CBD5E0]">
          <h4 className="font-medium">Jornalista</h4>
          <p className="text-sm text-[#4A5568]">Pode criar e editar matérias, submeter para revisão</p>
        </div>

        <div className="bg-[#F8FAFC] p-4 rounded border border-[#CBD5E0]">
          <h4 className="font-medium">Revisor</h4>
          <p className="text-sm text-[#4A5568]">Pode revisar textos e checar fontes</p>
        </div>

        <div className="bg-[#F8FAFC] p-4 rounded border border-[#CBD5E0]">
          <h4 className="font-medium">Editor</h4>
          <p className="text-sm text-[#4A5568]">Pode aprovar e publicar matérias</p>
        </div>

        <div className="bg-[#F8FAFC] p-4 rounded border border-[#CBD5E0]">
          <h4 className="font-medium">Editor-Chefe</h4>
          <p className="text-sm text-[#4A5568]">Pode gerenciar usuários, configurações e fontes</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold text-[#17202A] mb-4">Perfis de Acesso</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#F8FAFC] p-4 rounded border border-[#CBD5E0]">
            <h5 className="font-semibold">Leitor Gratuito</h5>
            <ul className="text-sm text-[#718096] space-y-1">
              <li>Acesso a conteúdo aberto</li>
              <li>Leitura de fatos-checados</li>
            </ul>
          </div>

          <div className="bg-[#F8FAFC] p-4 rounded border border-[#CBD5E0]">
            <h5 className="font-semibold">Assinante Digital</h5>
            <ul className="text-sm text-[#718096] space-y-1">
              <li>Acesso completo ao portal</li>
              <li>Réplica em PDF</li>
              <li>Acervo histórico</li>
            </ul>
          </div>

          <div className="bg-[#F8FAFC] p-4 rounded border border-[#CBD5E0]">
            <h5 className="font-semibold">Assinante Premium</h5>
            <ul className="text-sm text-[#718096] space-y-1">
              <li>Todos os benefícios digitais</li>
              <li>Clube Patrimônio Incluso</li>
              <li>Prioridade na checagem</li>
            </ul>
          </div>

          <div className="bg-[#F8FAFC] p-4 rounded border border-[#CBD5E0]">
            <h5 className="fontificado">Administrador</h5>
            <ul className="text-sm text-[#718096] space-y-1">
              <li>Gestão completa do sistema</li>
              <li>Controle de usuários e permissões</li>
              <li>Configurações institucionais</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}