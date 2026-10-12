import React, { useState } from 'react';
import type { CategoryDetail } from '../../types';
import { useData } from '../../app/contexts/DataContext';
import { useAuth } from '../../app/contexts/AuthContext';
import { useToast } from '../../app/contexts/ToastContext';
import { api } from '../../services/apiClient';

const makeSlug = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export function CategoriesPage() {
  const { categories, setCategories, dataLoading } = useData();
  const { role } = useAuth();
  const { showToast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [introText, setIntroText] = useState('');
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setEditingId(null); setName(''); setSlug(''); setDescription(''); setIntroText(''); setActive(true);
  };

  const edit = (category: CategoryDetail) => {
    setEditingId(category.id); setName(category.name); setSlug(category.slug);
    setDescription(category.description || ''); setIntroText(category.introText || ''); setActive(category.active);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (role !== 'administrador' && role !== 'editor_chefe' && role !== 'editor') {
      showToast('Sua função não pode gerenciar editorias.'); return;
    }
    const cleanName = name.trim();
    const cleanSlug = makeSlug(slug || name);
    if (!cleanName || !cleanSlug) { showToast('Nome e slug são obrigatórios.'); return; }
    const existing = categories.find((item) => item.id === editingId);
    const payload = {
      ...(existing || {}),
      name: cleanName,
      slug: cleanSlug,
      description: description.trim(),
      introText: introText.trim(),
      active,
      order: existing?.order ?? categories.length + 1,
    };
    setSaving(true);
    try {
      const saved = editingId
        ? await api.patch<CategoryDetail>(`/categories/${encodeURIComponent(editingId)}`, payload)
        : await api.post<CategoryDetail>('/categories', payload);
      setCategories((current) => editingId
        ? current.map((item) => item.id === saved.id ? saved : item)
        : [...current, saved]);
      showToast(editingId ? 'Editoria atualizada no servidor.' : 'Editoria criada no servidor.');
      reset();
    } catch (cause) {
      showToast(cause instanceof Error ? cause.message : 'A API não confirmou o salvamento.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (category: CategoryDetail) => {
    if (!window.confirm(`Excluir a editoria “${category.name}”? Esta ação não exclui as matérias existentes.`)) return;
    try {
      await api.delete(`/categories/${encodeURIComponent(category.id)}`);
      setCategories((current) => current.filter((item) => item.id !== category.id));
      if (editingId === category.id) reset();
      showToast('Editoria excluída no servidor.');
    } catch (cause) {
      showToast(cause instanceof Error ? cause.message : 'Não foi possível excluir a editoria.');
    }
  };

  if (!['administrador', 'editor_chefe', 'editor'].includes(String(role))) {
    return <section className="p-6"><h1 className="text-2xl font-bold">Editorias e categorias</h1><p className="mt-2 text-sm text-slate-600">Sua função não permite gerenciar editorias.</p></section>;
  }

  return (
    <section className="space-y-6 p-4 sm:p-8">
      <header><h1 className="text-2xl font-bold text-[#17202A]">Editorias e categorias</h1><p className="mt-1 text-sm text-[#64748B]">As alterações são persistidas na API; não há lista de demonstração.</p></header>
      <form onSubmit={save} className="space-y-4 rounded-xl border border-[#D9DEE7] bg-white p-5">
        <h2 className="text-lg font-bold text-[#0B2345]">{editingId ? 'Editar editoria' : 'Nova editoria'}</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold text-[#344054]">Nome<input required value={name} onChange={(event) => { setName(event.target.value); if (!editingId && !slug) setSlug(makeSlug(event.target.value)); }} className="mt-1.5 min-h-11 w-full rounded-lg border border-[#CBD5E0] px-3 font-normal" /></label>
          <label className="text-sm font-semibold text-[#344054]">Slug<input required value={slug} onChange={(event) => setSlug(makeSlug(event.target.value))} className="mt-1.5 min-h-11 w-full rounded-lg border border-[#CBD5E0] px-3 font-normal" /></label>
          <label className="text-sm font-semibold text-[#344054] md:col-span-2">Descrição<input value={description} onChange={(event) => setDescription(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-lg border border-[#CBD5E0] px-3 font-normal" /></label>
          <label className="text-sm font-semibold text-[#344054] md:col-span-2">Texto de introdução<textarea rows={3} value={introText} onChange={(event) => setIntroText(event.target.value)} className="mt-1.5 w-full rounded-lg border border-[#CBD5E0] p-3 font-normal" /></label>
          <label className="flex items-center gap-2 text-sm font-semibold text-[#344054]"><input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} /> Editoria ativa</label>
        </div>
        <div className="flex gap-2"><button type="submit" disabled={saving} className="min-h-11 rounded-lg bg-[#0B2345] px-5 text-sm font-bold text-white disabled:opacity-50">{saving ? 'Salvando…' : editingId ? 'Salvar alterações' : 'Criar editoria'}</button>{editingId && <button type="button" onClick={reset} className="min-h-11 rounded-lg border border-[#CBD5E0] px-4 text-sm font-semibold">Cancelar</button>}</div>
      </form>
      <div className="overflow-x-auto rounded-xl border border-[#D9DEE7] bg-white">
        <table className="min-w-full divide-y divide-[#E2E8F0]"><thead className="bg-[#F8FAFC]"><tr>
          <th className="p-3 text-left text-xs font-bold uppercase text-[#64748B]">Editoria</th><th className="p-3 text-left text-xs font-bold uppercase text-[#64748B]">Slug</th><th className="p-3 text-left text-xs font-bold uppercase text-[#64748B]">Estado</th><th className="p-3 text-left text-xs font-bold uppercase text-[#64748B]">Ações</th>
        </tr></thead><tbody className="divide-y divide-[#E2E8F0]">
          {dataLoading ? <tr><td colSpan={4} className="p-5 text-sm text-slate-500">Carregando editorias reais…</td></tr> : categories.length === 0 ? <tr><td colSpan={4} className="p-5 text-sm text-slate-500">A API não retornou editorias cadastradas.</td></tr> : categories.map((item) => (
            <tr key={item.id}><td className="p-3"><p className="font-semibold">{item.name}</p><p className="text-xs text-slate-500">{item.description}</p></td><td className="p-3 text-sm">{item.slug}</td><td className="p-3 text-sm">{item.active ? 'Ativa' : 'Inativa'}</td><td className="p-3"><div className="flex gap-2"><button type="button" onClick={() => edit(item)} className="rounded border border-[#CBD5E0] px-3 py-1.5 text-xs font-semibold">Editar</button><button type="button" onClick={() => void remove(item)} className="rounded border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700">Excluir</button></div></td></tr>
          ))}
        </tbody></table>
      </div>
    </section>
  );
}
