import React, { useState } from 'react';
import type { Article, CategorySlug, ContentAccessLevel, EditorialStatus } from '../../types';
import { useData } from '../../app/contexts/DataContext';
import { useAuth } from '../../app/contexts/AuthContext';
import { useToast } from '../../app/contexts/ToastContext';
import { api } from '../../services/apiClient';

type ArticlePayload = Article & { status: string };

const CATEGORY_OPTIONS: CategorySlug[] = [
  'politica', 'brasil', 'economia', 'seguranca', 'saude', 'cultura',
  'esportes', 'tecnologia', 'mundo', 'opiniao', 'checagem', 'receita', 'videos', 'podcast',
];

const slugify = (value: string) => value.normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

export function ArticlesPage() {
  const { articles, setArticles, dataLoading, dataError } = useData();
  const { currentUser, role } = useAuth();
  const { showToast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<CategorySlug>('brasil');
  const [content, setContent] = useState('');
  const [accessLevel, setAccessLevel] = useState<ContentAccessLevel>('aberto');
  const [editorialStatus, setEditorialStatus] = useState<EditorialStatus>('EM REDAÇÃO');
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setSubtitle('');
    setCategory('brasil');
    setContent('');
    setAccessLevel('aberto');
    setEditorialStatus('EM REDAÇÃO');
  };

  const beginEdit = (article: Article) => {
    setEditingId(article.id);
    setTitle(article.title);
    setSlug(article.slug);
    setSubtitle(article.subtitle || '');
    setCategory(article.category);
    setContent(article.content || '');
    setAccessLevel(article.accessLevel || 'aberto');
    setEditorialStatus(article.editorialStatus || 'EM REDAÇÃO');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveArticle = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) {
      showToast('Título e conteúdo são obrigatórios.');
      return;
    }
    if (!currentUser) {
      showToast('Entre na sua conta para salvar matérias.');
      return;
    }
    const normalizedSlug = slugify(slug || title);
    if (!normalizedSlug) {
      showToast('Informe um título ou slug válido.');
      return;
    }
    const existing = articles.find((article) => article.id === editingId);
    const now = new Date().toISOString();
    const publish = editorialStatus === 'PUBLICADA';
    const payload: Partial<ArticlePayload> = {
      ...(existing || {}),
      title: title.trim().slice(0, 300),
      slug: normalizedSlug,
      subtitle: subtitle.trim(),
      kicker: category.toUpperCase(),
      category,
      content: content.trim(),
      author: existing?.author || currentUser.name || 'Redação',
      authorId: existing?.authorId || currentUser.id,
      authorRole: currentUser.role,
      publishedAt: publish ? existing?.publishedAt || now : '',
      updatedAt: now,
      readTimeMinutes: Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200)),
      imageUrl: existing?.imageUrl || '',
      imageCaption: existing?.imageCaption || '',
      imageCredits: existing?.imageCredits || '',
      sourceName: existing?.sourceName || '',
      accessLevel,
      editorialStatus,
      status: publish ? 'publicada' : 'rascunho',
    };

    setSaving(true);
    try {
      const saved = editingId
        ? await api.patch<ArticlePayload>(`/articles/${encodeURIComponent(editingId)}`, payload)
        : await api.post<ArticlePayload>('/articles', payload);
      setArticles((current) => editingId
        ? current.map((item) => item.id === saved.id ? saved : item)
        : [saved, ...current]);
      showToast(editingId ? 'Matéria atualizada no servidor.' : 'Matéria criada no servidor.');
      resetForm();
    } catch (cause) {
      showToast(cause instanceof Error ? cause.message : 'A API não confirmou o salvamento.');
    } finally {
      setSaving(false);
    }
  };

  const deleteArticle = async (article: Article) => {
    if (!window.confirm(`Excluir definitivamente a matéria “${article.title}”?`)) return;
    try {
      await api.delete(`/articles/${encodeURIComponent(article.id)}`);
      setArticles((current) => current.filter((item) => item.id !== article.id));
      if (editingId === article.id) resetForm();
      showToast('Matéria excluída no servidor.');
    } catch (cause) {
      showToast(cause instanceof Error ? cause.message : 'Não foi possível excluir a matéria.');
    }
  };

  if (role !== 'administrador' && role !== 'editor_chefe') {
    return <section className="p-6"><h1 className="text-2xl font-bold">Gestão de matérias</h1><p className="mt-2 text-sm text-slate-600">Apenas editores-chefes e administradores podem usar este módulo.</p></section>;
  }

  return (
    <section className="space-y-6 p-4 sm:p-8">
      <header>
        <h1 className="text-2xl font-bold text-[#17202A]">Gestão de matérias</h1>
        <p className="mt-1 text-sm text-[#64748B]">Criação, edição e exclusão persistidas pela API editorial.</p>
      </header>

      {dataError && <p role="alert" className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950">A API não confirmou o carregamento das matérias: {dataError}</p>}

      <form onSubmit={saveArticle} className="space-y-4 rounded-xl border border-[#D9DEE7] bg-white p-5">
        <h2 className="text-lg font-bold text-[#0B2345]">{editingId ? 'Editar matéria' : 'Nova matéria'}</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block text-sm font-semibold text-[#344054]">Título
            <input value={title} onChange={(event) => { setTitle(event.target.value); if (!editingId && !slug) setSlug(slugify(event.target.value)); }} required maxLength={300} className="mt-1.5 min-h-11 w-full rounded-lg border border-[#CBD5E0] px-3 font-normal" />
          </label>
          <label className="block text-sm font-semibold text-[#344054]">Slug
            <input value={slug} onChange={(event) => setSlug(slugify(event.target.value))} required maxLength={180} className="mt-1.5 min-h-11 w-full rounded-lg border border-[#CBD5E0] px-3 font-normal" />
          </label>
          <label className="block text-sm font-semibold text-[#344054]">Editoria
            <select value={category} onChange={(event) => setCategory(event.target.value as CategorySlug)} className="mt-1.5 min-h-11 w-full rounded-lg border border-[#CBD5E0] bg-white px-3 font-normal">
              {CATEGORY_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="block text-sm font-semibold text-[#344054]">Acesso
            <select value={accessLevel} onChange={(event) => setAccessLevel(event.target.value as ContentAccessLevel)} className="mt-1.5 min-h-11 w-full rounded-lg border border-[#CBD5E0] bg-white px-3 font-normal">
              <option value="aberto">Público</option>
              <option value="assinante">Assinante digital</option>
              <option value="premium">Premium</option>
            </select>
          </label>
          <label className="block text-sm font-semibold text-[#344054] md:col-span-2">Subtítulo
            <input value={subtitle} onChange={(event) => setSubtitle(event.target.value)} maxLength={500} className="mt-1.5 min-h-11 w-full rounded-lg border border-[#CBD5E0] px-3 font-normal" />
          </label>
          <label className="block text-sm font-semibold text-[#344054] md:col-span-2">Conteúdo
            <textarea value={content} onChange={(event) => setContent(event.target.value)} required rows={10} className="mt-1.5 w-full rounded-lg border border-[#CBD5E0] p-3 font-normal" />
          </label>
          <label className="block text-sm font-semibold text-[#344054]">Estado editorial
            <select value={editorialStatus} onChange={(event) => setEditorialStatus(event.target.value as EditorialStatus)} className="mt-1.5 min-h-11 w-full rounded-lg border border-[#CBD5E0] bg-white px-3 font-normal">
              <option value="EM REDAÇÃO">Em redação</option>
              <option value="EM REVISÃO">Em revisão</option>
              <option value="PUBLICADA">Publicada</option>
              <option value="ARQUIVADA">Arquivada</option>
            </select>
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="submit" disabled={saving} className="min-h-11 rounded-lg bg-[#0B2345] px-5 py-2 text-sm font-bold text-white hover:bg-[#0B5FFF] disabled:opacity-50">{saving ? 'Salvando…' : editingId ? 'Salvar alterações' : 'Criar matéria'}</button>
          {editingId && <button type="button" onClick={resetForm} className="min-h-11 rounded-lg border border-[#CBD5E0] px-4 py-2 text-sm font-semibold">Cancelar edição</button>}
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-[#D9DEE7] bg-white">
        <table className="min-w-full divide-y divide-[#E2E8F0]">
          <thead className="bg-[#F8FAFC]"><tr>
            <th className="p-3 text-left text-xs font-bold uppercase text-[#64748B]">Matéria</th>
            <th className="p-3 text-left text-xs font-bold uppercase text-[#64748B]">Estado</th>
            <th className="p-3 text-left text-xs font-bold uppercase text-[#64748B]">Acesso</th>
            <th className="p-3 text-left text-xs font-bold uppercase text-[#64748B]">Ações</th>
          </tr></thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {dataLoading ? <tr><td colSpan={4} className="p-5 text-sm text-slate-500">Carregando matérias reais…</td></tr> :
              articles.length === 0 ? <tr><td colSpan={4} className="p-5 text-sm text-slate-500">A API não retornou matérias para esta conta.</td></tr> :
              articles.map((article) => (
                <tr key={article.id} className="align-top hover:bg-[#F8FAFC]">
                  <td className="p-3"><p className="font-semibold text-[#17202A]">{article.title}</p><p className="mt-1 text-xs text-[#64748B]">/{article.slug}</p></td>
                  <td className="p-3 text-sm">{article.editorialStatus}</td>
                  <td className="p-3 text-sm">{article.accessLevel}</td>
                  <td className="p-3"><div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => beginEdit(article)} className="rounded border border-[#CBD5E0] px-3 py-1.5 text-xs font-semibold hover:bg-slate-100">Editar</button>
                    <button type="button" onClick={() => void deleteArticle(article)} className="rounded border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50">Excluir</button>
                  </div></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
