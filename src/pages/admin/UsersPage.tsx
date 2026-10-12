import React, { useState } from 'react';
import { useData } from '../../app/contexts/DataContext';
import { useAuth } from '../../app/contexts/AuthContext';
import { useToast } from '../../app/contexts/ToastContext';

export function UsersPage() {
  const { authors, dataLoading, saveAuthor } = useData();
  const { currentUser, role } = useAuth();
  const { showToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [authorRole, setAuthorRole] = useState('jornalista');
  const [saving, setSaving] = useState(false);

  if (role !== 'administrador') {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold text-[#17202A] mb-6">Usuários</h2>
        <p className="text-[#64748B]">Apenas administradores podem gerenciar usuários.</p>
      </div>
    );
  }

  if (dataLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-pulse h-64 bg-[#E2E8F0] rounded mx-auto mb-4" />
        <p className="text-[#64748B]">Carregando usuários...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-[#17202A] mb-6">Gestão de Usuários</h2>

      {authors.length === 0 ? (
        <div className="bg-[#F8FAFC] p-6 rounded border border-[#CBD5E0]">
          <p className="text-[#718096]">Nenhum usuário cadastrado.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full rounded border border-[#E2E8F0]">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                <th className="p-3 text-left text-xs font-medium text-[#4A5568] uppercase tracking-wider">Nome</th>
                <th className="p-3 text-left text-xs font-medium text-[#4A5568] uppercase tracking-wider">E-mail</th>
                <th className="p-3 text-left text-xs font-medium text-[#4A5568] uppercase tracking-wider">Papel</th>
                <th className="p-3 text-left text-xs font-medium text-[#4A5568] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {authors.map((author: any) => (
                <tr key={author.id} className="hover:bg-[#F8FAFC]">
                  <td className="p-3">{author.name}</td>
                  <td className="p-3">{author.email}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs rounded ${author.role === 'administrador' ? 'bg-[#0B2345] text-white' : author.role === 'editor_chefe' ? 'bg-[#1A365D] text-white' : 'bg-[#BDF2FF] text-[#0B5FFF]'}`}>
                      {author.role}
                    </span>
                  </td>
                  <td className="p-3">
                    {author.subscription && author.subscription.status === 'ativo' ? (
                      <span className="text-[#16803C]">Ativo</span>
                    ) : (
                      <span className="text-[#EF4444]">Inativo</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && <form className="mt-6 grid gap-3 rounded border border-[#CBD5E0] bg-[#F8FAFC] p-4 md:grid-cols-4" onSubmit={async (event) => {
        event.preventDefault();
        if (!name.trim() || !email.trim()) { showToast('Nome e e-mail são obrigatórios.'); return; }
        setSaving(true);
        try {
          await saveAuthor({ id: `author-${crypto.randomUUID()}`, slug: name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'), name: name.trim(), email: email.trim(), role: authorRole, bio: '', avatarUrl: '' });
          setName(''); setEmail(''); setAuthorRole('jornalista'); setShowForm(false);
        } finally { setSaving(false); }
      }}>
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nome completo" aria-label="Nome completo" className="rounded border border-[#CBD5E0] px-3 py-2 text-sm" />
        <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="E-mail" aria-label="E-mail" className="rounded border border-[#CBD5E0] px-3 py-2 text-sm" />
        <select value={authorRole} onChange={(event) => setAuthorRole(event.target.value)} aria-label="Papel" className="rounded border border-[#CBD5E0] px-3 py-2 text-sm"><option value="jornalista">Jornalista</option><option value="revisor">Revisor</option><option value="editor">Editor</option><option value="editor_chefe">Editor-chefe</option><option value="administrador">Administrador</option></select>
        <button disabled={saving} className="rounded bg-[#0B2345] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Gravando...' : 'Gravar usuário'}</button>
      </form>}
      {role === 'administrador' && <p className="mt-4"><button onClick={() => setShowForm(value => !value)} className="bg-[#0B2345] text-white px-4 py-2 rounded hover:bg-[#132D50] transition-colors">{showForm ? 'Cancelar' : 'Adicionar Novo Usuário'}</button></p>}
    </div>
  );
}
