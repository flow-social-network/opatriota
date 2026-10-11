import React from 'react';
import { useData } from '../../app/contexts/DataContext';
import { useAuth } from '../../app/contexts/AuthContext';
import { useToast } from '../../app/contexts/ToastContext';

export function DashboardPage() {
  const { articles, sources, pages, categories, authors, subscriptionPlans, dataLoading } = useData();
  const { currentUser, role } = useAuth();

  if (dataLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-pulse h-64 bg-[#E2E8F0] rounded mx-auto mb-4" />
        <p className="text-[#64748B]">Carregando dashboard editorial...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="p-8 text-center">
        <p className="text-[#64748B]">Faça login para acessar a redação.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-[#17202A] mb-6">Dashboard da Redação</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#F8FAFC] p-4 rounded border border-[#CBD5E0]">
          <div className="text-3xl font-bold text-[#0B2345]">{articles.length}</div>
          <p className="text-sm text-[#4A5568]">Total de matérias</p>
        </div>

        <div className="bg-[#F8FAFC] p-4 rounded border border-[#CBD5E0]">
          <div className="text-3xl font-bold text-[#16803C]">
            {articles.filter(a => a.editorialStatus === 'PUBLICADA').length}
          </div>
          <p className="text-sm text-[#4A5568]">Publicadas</p>
        </div>

        <div className="bg-[#F8FAFC] p-4 rounded border border-[#CBD5E0]">
          <div className="text-3xl font-bold text-[#FFCC29]">
            {articles.filter(a => a.editorialStatus === 'RASCUNHO').length}
          </div>
          <p className="text-sm text-[#4A5568]">Rascunhos</p>
        </div>

        <div className="bg-[#F8FAFC] p-4 rounded border border-[#CBD5E0]">
          <div className="text-3xl font-bold text-[#0B5FFF]">
            {articles.filter(a => ['EM REVISÃO', 'CORREÇÕES', 'AGENDADA'].includes(a.editorialStatus)).length}
          </div>
          <p className="text-sm text-[#4A5568]">Em revisão</p>
        </div>
      </div>

      {/* Sources Section */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-[#17202A] mb-4">Fontes RSS</h3>
        {sources.length === 0 ? (
          <p className="text-[#718096]">Nenhuma fonte cadastrada.</p>
        ) : (
          <ul className="space-y-3">
            {sources.map((source) => (
              <li key={source.id} className="p-2 border-b border-[#E2E8F0] last-child:border-0">
                <div className="font-medium">{source.name}</div>
                <p className="text-xs text-[#718096]">{source.category}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Articles List */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-[#17202A] mb-4">Últimas Matérias</h3>
        {articles.length === 0 ? (
          <p className="text-[#718096]">Nenhuma matéria encontrada.</p>
        ) : (
          <ul className="space-y-3">
            {articles.slice(0, 5).map((article) => (
              <li key={article.id} className="p-2 border-b border-[#E2E8F0] last-child:border-0">
                <div className="font-medium">{article.title}</div>
                <p className="text-xs text-[#718096]">
                  {article.category} • {article.editorialStatus}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}