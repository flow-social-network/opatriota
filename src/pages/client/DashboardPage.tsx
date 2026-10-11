import React from 'react';
import { useData } from '../../app/contexts/DataContext';
import { useAuth } from '../../app/contexts/AuthContext';
import { useToast } from '../../app/contexts/ToastContext';

export function DashboardPage() {
  const { articles, subscriptionPlans } = useData();
  const { currentUser, role, subscription } = useAuth();

  if (!currentUser) {
    return (
      <div className="p-8 text-center">
        <p className="text-[#64748B]">Faça login para ver sua conta.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-[#17202A] mb-6">Minha Conta</h2>

      {/* User Profile */}
      <div className="bg-[#F8FAFC] p-6 rounded border border-[#CBD5E0] mb-8">
        <h3 className="text-lg font-medium text-[#17202A] mb-4">Perfil</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-[#4A5568]">Nome</p>
            <p className="font-medium">{currentUser.name}</p>
          </div>
          <div>
            <p className="text-sm text-[#4A5568]">E-mail</p>
            <p className="font-medium">{currentUser.email}</p>
          </div>
        </div>
        <p className="text-sm text-[#718096]">
          Inscrição: {currentUser.createdAt}
        </p>
      </div>

      {/* Subscription Info */}
      {subscription && subscription.plan && subscription.status && (
        <div className="bg-[#F8FAFC] p-6 rounded border border-[#CBD5E0] mb-8">
          <h3 className="text-lg font-medium text-[#17202A] mb-4">Assinatura Atual</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-[#4A5568]">Plano</p>
              <p className="font-medium text-lg">{subscription.plan}</p>
            </div>
            <div>
              <p className="text-sm text-[#4A5568]">Status</p>
              <p className={`font-medium ${subscription.status === 'ativo' ? 'text-[#16803C]' : 'text-[#EF4444]'}`}>
                {subscription.status}
              </p>
            </div>
          </div>
          {subscription.validUntil && (
            <p className="text-sm text-[#718096]">Válido até: {subscription.validUntil}</p>
          )}
        </div>
      )}

      {/* Plan Benefits */}
      {role === 'assinante_digital' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#F8FAFC] p-4 rounded border border-[#CBD5E0]">
            <h4 className="font-medium text-sm text-[#17202A]">Benefícios</h4>
            <ul className="text-sm text-[#718096] space-y-2">
              <li>Acesso completo ao site e portal</li>
              <li>Réplica digital folheável (PDF)</li>
              <li>Acervo digital histórico</li>
              <li>Acesso a conteúdo em vídeo e podcasts</li>
            </ul>
          </div>

          <div className="bg-[#F8FAFC] p-4 rounded border border-[#CBD5E0]">
            <h4 className="font-medium text-sm text-[#17202A]">Notificações</h4>
            <ul className="text-sm text-[#718096] space-y-2">
              <li>Breaking news no navegador</li>
              <li>Boletim diário</li>
              <li>Checagens de fatos</li>
              <li>Roteiro semanal</li>
            </ul>
          </div>

          <div className="bg-[#F8FAFC] p-4 rounded border border-[#CBD5E0]">
            <h4 className="font-medium text-sm text-[#17202A]">Perfil</h4>
            <ul className="text-sm text-[#718096] space-y-2">
              <li>Favoritos de artigos</li>
              <li>Preferências de leitura</li>
            </ul>
          </div>
        </div>
      )}

      {/* Role-specific content */}
      {role === 'assinante_premium' && (
        <div className="bg-[#F8FAFC] p-6 rounded border border-[#CBD5E0] mb-8">
          <h3 className="text-lg font-medium text-[#17202A] mb-4">Benefícios Premium</h3>
          <ul className="text-sm text-[#718096] space-y-3">
            <li>Todos os benefícios do Digital</li>
            <li>Clube Correio do Povo incluso</li>
            <li>Fidelidade 12 meses com renovação automática</li>
            <li>Acesso prioritário na bancada de checagem</li>
            <li>Prioridade na bancada de checagem de fatos</li>
          </ul>
        </div>
      )}

      {/* Action buttons */}
      {role === 'assinante_digital' && (
        <div className="mt-8">
          <button className="bg-[#0B2345] text-white px-6 py-3 rounded hover:bg-[#132D50] transition-colors text-lg font-medium">
            Renoviar Assinatura
          </button>
        </div>
      )}

      {role === 'leitor_gratuito' && (
        <div className="mt-8">
          <button className="bg-[#0B2345] text-white px-6 py-3 rounded hover:bg-[#132D50] transition-colors text-lg font-medium">
            Assinar Agora
          </button>
        </div>
      )}
    </div>
  );
}