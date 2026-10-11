import React from 'react';
import { useData } from '../../app/contexts/DataContext';
import { useAuth } from '../../app/contexts/AuthContext';

export function DashboardPage() {
  const { articles, sources, queueItems, pages, categories, authors, portalSettings, dataLoading } = useData();
  const { currentUser, role } = useAuth();

  // Calculate statistics from real data
  const totalArticles = articles.length;
  const publishedArticles = articles.filter(a => a.editorialStatus === 'PUBLICADA').length;
  const draftArticles = articles.filter(a => a.editorialStatus === 'RASCUNHO').length;
  const pendingArticles = articles.filter(a =>
    ['EM REVISÃO', 'CORREÇÕES', 'AGENDADA'].includes(a.editorialStatus)
  ).length;

  if (dataLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-pulse h-64 bg-[#E2E8F0] rounded mx-auto mb-4" />
        <p className="text-[#64748B]">Carregando indicadores...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="p-8 text-center">
        <p className="text-[#64748B]">Faça login para ver o painel administrativo.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-[#17202A] mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#F8FAFC] p-4 rounded border border-[#CBD5E0]">
          <div className="text-3xl font-bold text-[#0B2345]">{totalArticles}</div>
          <p className="text-sm text-[#4A5568] mt-1">Matérias no sistema</p>
        </div>

        <div className="bg-[#F8FAFC] p-4 rounded border border-[#CBD5E0]">
          <div className="text-3xl font-bold text-[#16803C]">{publishedArticles}</div>
          <p className="text-sm text-[#4A5568] mt-1">Com status publicado</p>
        </div>

        <div className="bg-[#F8FAFC] p-4 rounded border border-[#CBD5E0]">
          <div className="text-3xl font-bold text-[#FFCC29]">{draftArticles}</div>
          <p className="text-sm text-[#4A5568] mt-1">Em desenvolvimento</p>
        </div>

        <div className="bg-[#F8FAFC] p-4 rounded border border-[#CBD5E0]">
          <div className="text-3xl font-bold text-[#0B5FFF]">{pendingArticles}</div>
          <p className="text-sm text-[#4A5568] mt-1">Aguardando revisão</p>
        </div>
      </div>

      {/* Sources Section */}
      {role === 'editor_chefe' || role === 'administrador' && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-[#17202A] mb-4">Fontes RSS</h3>
          {dataLoading ? (
            <div className="h-32 bg-[#E2E8F0] rounded mx-auto my-4" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sources.map((source) => (
                <div
                  key={source.id}
                  className="border border-[#D9DEE7] rounded p-3 hover:bg-[#F8FAFC] transition-colors"
                >
                  <h4 className="font-medium">{source.name}</h4>
                  <p className="text-xs text-[#718096]">{source.rssUrl || 'Sem RSS'}...</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Queue Section */}
      {role === 'editor_chefe' || role === 'administrador' && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-[#17202A] mb-4">Fila Editorial</h3>
          {queueItems.length === 0 ? (
            <p className="text-[#718096]">Nenhuma matéria na fila.</p>
          ) : (
            <ul className="space-y-3">
              {queueItems.map((item) => (
                <li key={item.id} className="p-2 border-b border-[#E2E8F0] last-child:border-0">
                  <div className="font-medium">{item.title}</div>
                  <p className="text-xs text-[#718096]">{item.category} • {item.dedupStatus}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Recent Pages Section */}
      {role === 'editor_chefe' || role === 'administrador' && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-[#17202A] mb-4">Páginas Institucionais</h3>
          {pages.length === 0 ? (
            <p className="text-[#718096]">Nenhuma página institucional cadastrada.</p>
          ) : (
            <ul className="space-y-3">
              {pages.map((page) => (
                <li key={page.id} className="p-2 border-b border-[#E2E8F0] last-child:border-0">
                  <div className="font-medium">{page.title}</div>
                  <p className="text-xs text-[#718096]">{page.slug}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}