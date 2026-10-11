import React from 'react';
import { useData } from '../../app/contexts/DataContext';
import { useAuth } from '../../app/contexts/AuthContext';
import { useToast } from '../../app/contexts/ToastContext';

export function JournalistsPage() {
  const { authors, dataLoading } = useData();
  const { currentUser, role } = useAuth();
  const { showToast } = useToast();

  if (role !== 'administrador' && role !== 'editor_chefe') {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold text-[#17202A] mb-6">Jornalistas e Colaboradores</h2>
        <p className="text-[#64748B]">Apenas administradores e editores-chefe podem gerenciar jornalistas.</p>
      </div>
    );
  }

  if (dataLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-pulse h-64 bg-[#E2E8F0] rounded mx-auto mb-4" />
        <p className="text-[#64748B]">Carregando jornalistas...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-[#17202A] mb-6">Jornalistas e Colaboradores</h2>

      {authors.length === 0 ? (
        <div className="bg-[#F8FAFC] p-6 rounded border border-[#CBD5E0]">
          <p className="text-[#718096]">Nenhum jornalista cadastrado.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full rounded border border-[#E2E8F0]">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                <th className="p-3 text-left text-xs font-medium text-[#4A5568] uppercase tracking-wider">Nome</th>
                <th className="p-3 text-left text-xs font-medium text-[#4A5568] uppercase tracking-wider">E-mail</th>
                <th className="p-3 text-left text-xs font-medium text-[#4A5568] uppercase tracking-wider">Papel</th>
                <th className="p-3 text-left text-xs font-medium text-[#4A5568] uppercase tracking-wider">Inscrição</th>
                <th className="p-3 text-left text-xs font-medium text-[#4A5568] uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody>
              {authors.map((author: any) => (
                <tr key={author.id} className="hover:bg-[#F8FAFC]">
                  <td className="p-3">{author.name}</td>
                  <td className="p-3">{author.email}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs rounded ${author.role === 'administrador' ? 'bg-[#0B2345] text-white' : author.role === 'editor_chefe' ? 'bg-[#1A365D] text-white' : author.role === 'jornalista' ? 'bg-[#0B5FFF] text-white' : 'bg-[#BDF2FF]'}`}>
                      {author.role}
                    </span>
                  </td>
                  <td className="p-3">
                    {author.subscription && author.subscription.plan ? (
                      <span className="text-sm">
                        {author.subscription.plan} - {author.subscription.status}
                      </span>
                    ) : (
                      <span className="text-xs text-[#718096]">Não cadastrado</span>
                    )}
                  </td>
                  <td className="p-3">
                    <button className="text-[#0B5FFF] text-sm hover:underline">Editar</button>
                    <button className="text-[#EF4444] text-sm ml-2 hover:underline">Remover</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4">
        <button className="bg-[#0B2345] text-white px-4 py-2 rounded hover:bg-[#132D50] transition-colors">
          Cadastrar Novo Jornalista
        </button>
      </p>
    </div>
  );
}