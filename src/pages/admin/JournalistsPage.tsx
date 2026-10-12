import React, { useState } from 'react';
import type { AuthorDetail } from '../../types';
import { useData } from '../../app/contexts/DataContext';
import { useAuth } from '../../app/contexts/AuthContext';
import { useToast } from '../../app/contexts/ToastContext';
import { api } from '../../services/apiClient';

const slugify = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export function JournalistsPage() {
  const { authors, setAuthors, dataLoading } = useData();
  const { role } = useAuth();
  const { showToast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [bylineRole, setBylineRole] = useState('Colunista');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [email, setEmail] = useState('');
  const [credentials, setCredentials] = useState('');
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setEditingId(null); setName(''); setSlug(''); setBylineRole('Colunista');
    setBio(''); setAvatarUrl(''); setEmail(''); setCredentials('');
  };

  const edit = (author: AuthorDetail) => {
    setEditingId(author.id); setName(author.name); setSlug(author.slug);
    setBylineRole(author.role || 'Colunista'); setBio(author.bio || '');
    setAvatarUrl(author.avatarUrl || ''); setEmail(author.email || '');
    setCredentials(author.credentials || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!['administrador', 'editor_chefe', 'editor'].includes(String(role))) {
      showToast('Sua função não pode gerenciar perfis de autores.'); return;
    }
    const cleanName = name.trim();
    const cleanSlug = slugify(slug || name);
    if (!cleanName || !cleanSlug) { showToast('Nome e slug são obrigatórios.'); return; }
    const existing = authors.find((author) => author.id === editingId);
    const payload = {
      ...(existing || {}),
      name: cleanName,
      slug: cleanSlug,
      role: bylineRole.trim() || 'Colunista',
      bio: bio.trim(),
      avatarUrl: avatarUrl.trim(),
      email: email.trim(),
      credentials: credentials.trim(),
      active: true,
    };
    setSaving(true);
    try {
      const saved = editingId
        ? await api.patch<AuthorDetail>(`/authors/${encodeURIComponent(editingId)}`, payload)
        : await api.post<AuthorDetail>('/authors', payload);
      setAuthors((current) => editingId
        ? current.map((author) => author.id === saved.id ? saved : author)
        : [...current, saved]);
      showToast(editingId ? 'Perfil de autor atualizado no servidor.' : 'Perfil de autor criado no servidor.');
      reset();
    } catch (cause) {
      showToast(cause instanceof Error ? cause.message : 'A API não confirmou o salvamento.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (author: AuthorDetail) => {
    if (!window.confirm(`Excluir o perfil público de “${author.name}”? As matérias existentes não serão excluídas.`)) return;
    try {
      await api.delete(`/authors/${encodeURIComponent(author.id)}`);
      setAuthors((current) => current.filter((item) => item.id !== author.id));
      if (editingId === author.id) reset();
      showToast('Perfil público de autor excluído no servidor.');
    } catch (cause) {
      showToast(cause instanceof Error ? cause.message : 'Não foi possível excluir o perfil.');
    }
  };

  if (!['administrador', 'editor_chefe', 'editor'].includes(String(role))) {
    return <section className="p-6"><h1 className="text-2xl font-bold">Autores e colaboradores</h1><p className="mt-2 text-sm text-slate-600">Sua função não permite gerenciar perfis públicos de autores.</p></section>;
  }

  return (
    <section className="space-y-6 p-4 sm:p-8">
      <header><h1 className="text-2xl font-bold text-[#17202A]">Autores e colaboradores</h1><p className="mt-1 text-sm text-[#64748B]">Este módulo gerencia perfis públicos de autoria; não cria contas de login nem verifica credenciais profissionais.</p></header>
      <form onSubmit={save} className="space-y-4 rounded-xl border border-[#D9DEE7] bg-white p-5">
        <h2 className="text-lg font-bold text-[#0B2345]">{editingId ? 'Editar perfil público' : 'Novo perfil de autor'}</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold text-[#344054]">Nome<input required value={name} onChange={(event) => { setName(event.target.value); if (!editingId && !slug) setSlug(slugify(event.target.value)); }} className="mt-1.5 min-h-11 w-full rounded-lg border border-[#CBD5E0] px-3 font-normal" /></label>
          <label className="text-sm font-semibold text-[#344054]">Slug<input required value={slug} onChange={(event) => setSlug(slugify(event.target.value))} className="mt-1.5 min-h-11 w-full rounded-lg border border-[#CBD5E0] px-3 font-normal" /></label>
          <label className="text-sm font-semibold text-[#344054]">Função de autoria<input value={bylineRole} onChange={(event) => setBylineRole(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-lg border border-[#CBD5E0] px-3 font-normal" /></label>
          <label className="text-sm font-semibold text-[#344054]">E-mail público (opcional)<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-lg border border-[#CBD5E0] px-3 font-normal" /></label>
          <label className="text-sm font-semibold text-[#344054] md:col-span-2">URL da imagem de perfil<input type="url" value={avatarUrl} onChange={(event) => setAvatarUrl(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-lg border border-[#CBD5E0] px-3 font-normal" /></label>
          <label className="text-sm font-semibold text-[#344054] md:col-span-2">Biografia<textarea rows={4} value={bio} onChange={(event) => setBio(event.target.value)} className="mt-1.5 w-full rounded-lg border border-[#CBD5E0] p-3 font-normal" /></label>
          <label className="text-sm font-semibold text-[#344054] md:col-span-2">Credenciais informadas (não verificadas)<input value={credentials} onChange={(event) => setCredentials(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-lg border border-[#CBD5E0] px-3 font-normal" /></label>
        </div>
        <div className="flex gap-2"><button type="submit" disabled={saving} className="min-h-11 rounded-lg bg-[#0B2345] px-5 text-sm font-bold text-white disabled:opacity-50">{saving ? 'Salvando…' : editingId ? 'Salvar alterações' : 'Cadastrar perfil'}</button>{editingId && <button type="button" onClick={reset} className="min-h-11 rounded-lg border border-[#CBD5E0] px-4 text-sm font-semibold">Cancelar</button>}</div>
      </form>
      <div className="overflow-x-auto rounded-xl border border-[#D9DEE7] bg-white">
        <table className="min-w-full divide-y divide-[#E2E8F0]"><thead className="bg-[#F8FAFC]"><tr>
          <th className="p-3 text-left text-xs font-bold uppercase text-[#64748B]">Autor</th><th className="p-3 text-left text-xs font-bold uppercase text-[#64748B]">Função de autoria</th><th className="p-3 text-left text-xs font-bold uppercase text-[#64748B]">Ações</th>
        </tr></thead><tbody className="divide-y divide-[#E2E8F0]">
          {dataLoading ? <tr><td colSpan={3} className="p-5 text-sm text-slate-500">Carregando perfis reais…</td></tr> : authors.length === 0 ? <tr><td colSpan={3} className="p-5 text-sm text-slate-500">A API não retornou perfis de autoria cadastrados.</td></tr> : authors.map((author) => (
            <tr key={author.id}><td className="p-3"><p className="font-semibold">{author.name}</p><p className="text-xs text-slate-500">/{author.slug}</p><p className="text-xs text-slate-500">{author.email || 'Sem e-mail público'}</p></td><td className="p-3 text-sm">{author.role}</td><td className="p-3"><div className="flex gap-2"><button type="button" onClick={() => edit(author)} className="rounded border border-[#CBD5E0] px-3 py-1.5 text-xs font-semibold">Editar</button><button type="button" onClick={() => void remove(author)} className="rounded border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700">Excluir</button></div></td></tr>
          ))}
        </tbody></table>
      </div>
    </section>
  );
}
