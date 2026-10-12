import React, { useCallback, useEffect, useState } from 'react';
import { api } from '../../services/apiClient';
import { useAuth } from '../../app/contexts/AuthContext';
import { useToast } from '../../app/contexts/ToastContext';

type ManagedRole =
  | 'leitor_gratuito'
  | 'assinante_digital'
  | 'assinante_premium'
  | 'jornalista'
  | 'revisor'
  | 'editor'
  | 'editor_chefe'
  | 'administrador';

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: ManagedRole;
  createdAt?: string | null;
  updatedAt?: string | null;
}

const ROLE_OPTIONS: { value: ManagedRole; label: string }[] = [
  { value: 'leitor_gratuito', label: 'Leitor gratuito' },
  { value: 'assinante_digital', label: 'Assinante digital' },
  { value: 'assinante_premium', label: 'Assinante premium' },
  { value: 'jornalista', label: 'Jornalista' },
  { value: 'revisor', label: 'Revisor' },
  { value: 'editor', label: 'Editor' },
  { value: 'editor_chefe', label: 'Editor-chefe' },
  { value: 'administrador', label: 'Administrador' },
];

export function UsersPage() {
  const { currentUser, role } = useAuth();
  const { showToast } = useToast();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [draftRoles, setDraftRoles] = useState<Record<string, ManagedRole>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.get<ManagedUser[]>('/admin/users');
      const safeUsers = Array.isArray(result) ? result : [];
      setUsers(safeUsers);
      setDraftRoles(Object.fromEntries(safeUsers.map((user) => [user.id, user.role])));
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Não foi possível carregar os usuários.';
      setError(message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (role === 'administrador') void loadUsers();
    else setLoading(false);
  }, [role, loadUsers]);

  const saveRole = async (user: ManagedUser) => {
    const nextRole = draftRoles[user.id];
    if (!nextRole || nextRole === user.role) return;
    setSavingId(user.id);
    try {
      const updated = await api.patch<ManagedUser>(`/admin/users/${encodeURIComponent(user.id)}`, { role: nextRole });
      setUsers((current) => current.map((item) => item.id === updated.id ? { ...item, ...updated } : item));
      showToast(`Função de ${user.email || user.id} atualizada.`);
    } catch (cause) {
      showToast(cause instanceof Error ? cause.message : 'Não foi possível salvar a função do usuário.');
      setDraftRoles((current) => ({ ...current, [user.id]: user.role }));
    } finally {
      setSavingId(null);
    }
  };

  if (role !== 'administrador') {
    return (
      <section className="p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-[#17202A]">Gestão de usuários</h1>
        <p className="mt-3 text-sm text-[#64748B]">Apenas administradores podem consultar e alterar funções.</p>
      </section>
    );
  }

  return (
    <section className="p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#17202A]">Gestão de usuários</h1>
          <p className="mt-1 max-w-2xl text-sm text-[#64748B]">
            Perfis e funções cadastrados no portal. A lista não representa contas Firebase que ainda não possuem perfil ou função persistida.
          </p>
        </div>
        <button type="button" onClick={() => void loadUsers()} disabled={loading} className="min-h-10 rounded-lg border border-[#CBD5E0] px-3 py-2 text-sm font-semibold text-[#0B2345] disabled:opacity-50">
          {loading ? 'Carregando…' : 'Atualizar lista'}
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-900" role="alert">
          Não foi possível carregar usuários da API: {error}
        </div>
      )}

      {loading ? (
        <p className="rounded-lg border border-[#D9DEE7] bg-white p-6 text-sm text-[#64748B]" role="status">Carregando usuários reais…</p>
      ) : error ? null : users.length === 0 ? (
        <p className="rounded-lg border border-dashed border-[#D9DEE7] bg-white p-6 text-sm text-[#64748B]">A API não retornou perfis ou funções cadastrados.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[#D9DEE7] bg-white">
          <table className="min-w-full divide-y divide-[#E2E8F0]">
            <thead className="bg-[#F8FAFC]">
              <tr>
                <th className="p-3 text-left text-xs font-bold uppercase tracking-wide text-[#4A5568]">Usuário</th>
                <th className="p-3 text-left text-xs font-bold uppercase tracking-wide text-[#4A5568]">Função atual</th>
                <th className="p-3 text-left text-xs font-bold uppercase tracking-wide text-[#4A5568]">Alterar função</th>
                <th className="p-3 text-left text-xs font-bold uppercase tracking-wide text-[#4A5568]">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {users.map((user) => (
                <tr key={user.id} className="align-top hover:bg-[#F8FAFC]">
                  <td className="p-3">
                    <p className="font-semibold text-[#17202A]">{user.name || 'Nome não informado'}</p>
                    <p className="text-sm text-[#64748B]">{user.email || 'E-mail não informado'}</p>
                    <p className="mt-1 break-all font-mono text-[10px] text-[#94A3B8]">{user.id}</p>
                  </td>
                  <td className="p-3 text-sm text-[#344054]">{ROLE_OPTIONS.find((option) => option.value === user.role)?.label || user.role}</td>
                  <td className="p-3">
                    <select
                      value={draftRoles[user.id] || user.role}
                      onChange={(event) => setDraftRoles((current) => ({ ...current, [user.id]: event.target.value as ManagedRole }))}
                      disabled={savingId === user.id || user.id === currentUser?.id}
                      aria-label={`Nova função para ${user.email || user.id}`}
                      className="min-h-10 w-full rounded-lg border border-[#CBD5E0] bg-white px-2 text-sm text-[#17202A] disabled:bg-[#F1F5F9]"
                    >
                      {ROLE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                    {user.id === currentUser?.id && <p className="mt-1 text-xs text-[#64748B]">Sua própria função não pode ser alterada aqui.</p>}
                  </td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => void saveRole(user)}
                      disabled={savingId === user.id || draftRoles[user.id] === user.role || user.id === currentUser?.id}
                      className="min-h-10 rounded-lg bg-[#0B2345] px-3 py-2 text-xs font-bold text-white hover:bg-[#0B5FFF] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {savingId === user.id ? 'Salvando…' : 'Salvar função'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
