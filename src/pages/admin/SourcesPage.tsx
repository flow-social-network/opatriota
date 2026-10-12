import React, { useState } from 'react';
import type { CategorySlug, EditorialQueueItem, RssSource } from '../../types';
import { useData } from '../../app/contexts/DataContext';
import { useAuth } from '../../app/contexts/AuthContext';
import { useToast } from '../../app/contexts/ToastContext';
import { api } from '../../services/apiClient';

const CATEGORIES: CategorySlug[] = ['politica', 'brasil', 'economia', 'seguranca', 'saude', 'cultura', 'esportes', 'tecnologia', 'mundo', 'opiniao', 'checagem', 'receita'];

export function SourcesPage() {
  const { sources, setSources, queueItems, setQueueItems, dataLoading } = useData();
  const { role } = useAuth();
  const { showToast } = useToast();
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [name, setName] = useState('');
  const [rssUrl, setRssUrl] = useState('');
  const [officialUrl, setOfficialUrl] = useState('');
  const [category, setCategory] = useState<CategorySlug>('brasil');
  const [sourceType, setSourceType] = useState<RssSource['sourceType']>('veículo');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const canManage = ['administrador', 'editor_chefe', 'editor'].includes(String(role));
  const canView = ['administrador', 'editor_chefe', 'editor', 'revisor', 'jornalista'].includes(String(role));
  const reset = () => { setEditingId(null); setName(''); setRssUrl(''); setOfficialUrl(''); setCategory('brasil'); setSourceType('veículo'); setIsActive(true); };
  const edit = (source: RssSource) => {
    setEditingId(source.id); setName(source.name); setRssUrl(source.rssUrl);
    setOfficialUrl(source.officialUrl || ''); setCategory(source.category);
    setSourceType(source.sourceType); setIsActive(source.isActive);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canManage) { showToast('Sua função não pode gerenciar fontes.'); return; }
    if (!name.trim() || !rssUrl.trim()) { showToast('Nome e URL do feed são obrigatórios.'); return; }
    try { new URL(rssUrl); if (officialUrl.trim()) new URL(officialUrl); }
    catch { showToast('Informe URLs válidas, incluindo https://.'); return; }

    const existing = sources.find((source) => String(source.id) === String(editingId));
    const payload = {
      ...(existing || {}),
      name: name.trim(),
      rssUrl: rssUrl.trim(),
      officialUrl: officialUrl.trim() || rssUrl.trim(),
      newsUrl: existing?.newsUrl || rssUrl.trim(),
      category,
      sourceType,
      isActive,
      pollFrequencyMin: existing?.pollFrequencyMin || 60,
      lastPolled: existing?.lastPolled || '',
      lastSuccess: existing?.lastSuccess || '',
      lastError: existing?.lastError ?? null,
      itemsReceived: existing?.itemsReceived || 0,
    };

    setSaving(true);
    try {
      const saved = editingId !== null
        ? await api.patch<RssSource>(`/editorial/sources/${encodeURIComponent(String(editingId))}`, payload)
        : await api.post<RssSource>('/editorial/sources', payload);
      setSources((current) => editingId !== null
        ? current.map((source) => String(source.id) === String(saved.id) ? saved : source)
        : [...current, saved]);
      showToast(editingId !== null ? 'Fonte atualizada no servidor.' : 'Fonte cadastrada no servidor.');
      reset();
    } catch (cause) {
      showToast(cause instanceof Error ? cause.message : 'A API não confirmou o salvamento.');
    } finally {
      setSaving(false);
    }
  };

  const syncFeeds = async () => {
    if (!canManage) return;
    setSyncing(true);
    try {
      const result = await api.post<{
        sources: RssSource[];
        queueItems: EditorialQueueItem[];
        importedCount: number;
        checkedSources: number;
      }>('/editorial/sources/sync', {});
      const updatedById = new Map((result.sources || []).map((source) => [String(source.id), source]));
      setSources((current) => current.map((source) => updatedById.get(String(source.id)) || source));
      const existingIds = new Set(queueItems.map((item) => String(item.id)));
      const additions = (result.queueItems || []).filter((item) => !existingIds.has(String(item.id)));
      if (additions.length) setQueueItems((current) => [...additions, ...current]);
      showToast(`Sincronização concluída: ${result.checkedSources} fontes consultadas e ${result.importedCount} novas pautas importadas.`);
    } catch (cause) {
      showToast(cause instanceof Error ? cause.message : 'A API não confirmou a sincronização dos feeds.');
    } finally {
      setSyncing(false);
    }
  };

  const remove = async (source: RssSource) => {
    if (!window.confirm(`Excluir a fonte “${source.name}”? O histórico de matérias importadas não será apagado.`)) return;
    try {
      await api.delete(`/editorial/sources/${encodeURIComponent(String(source.id))}`);
      setSources((current) => current.filter((item) => String(item.id) !== String(source.id)));
      if (String(editingId) === String(source.id)) reset();
      showToast('Fonte excluída no servidor.');
    } catch (cause) {
      showToast(cause instanceof Error ? cause.message : 'Não foi possível excluir a fonte.');
    }
  };

  if (!canView) {
    return <section className="p-6"><h1 className="text-2xl font-bold">Fontes RSS</h1><p className="mt-2 text-sm text-slate-600">Apenas a equipa editorial pode consultar fontes.</p></section>;
  }

  return (
    <section className="space-y-6 p-4 sm:p-8">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div><h1 className="text-2xl font-bold text-[#17202A]">Fontes e feeds RSS</h1><p className="mt-1 max-w-2xl text-sm text-[#64748B]">Os feeds ativos são consultados pelo backend. A sincronização regista erros reais e importa pautas novas sem duplicar URLs canónicas.</p></div>
        {canManage && <button type="button" onClick={() => void syncFeeds()} disabled={syncing} className="min-h-11 rounded-lg bg-[#0B2345] px-4 py-2 text-sm font-bold text-white disabled:opacity-50">{syncing ? 'Sincronizando…' : 'Sincronizar feeds RSS'}</button>}
      </header>
      {canManage && <form onSubmit={save} className="space-y-4 rounded-xl border border-[#D9DEE7] bg-white p-5">
        <h2 className="text-lg font-bold text-[#0B2345]">{editingId !== null ? 'Editar fonte' : 'Nova fonte'}</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold text-[#344054]">Nome<input required value={name} onChange={(event) => setName(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-lg border border-[#CBD5E0] px-3 font-normal" /></label>
          <label className="text-sm font-semibold text-[#344054]">URL do feed RSS<input required type="url" value={rssUrl} onChange={(event) => setRssUrl(event.target.value)} placeholder="https://exemplo.gov.br/rss" className="mt-1.5 min-h-11 w-full rounded-lg border border-[#CBD5E0] px-3 font-normal" /></label>
          <label className="text-sm font-semibold text-[#344054]">Site oficial (opcional)<input type="url" value={officialUrl} onChange={(event) => setOfficialUrl(event.target.value)} placeholder="https://exemplo.gov.br" className="mt-1.5 min-h-11 w-full rounded-lg border border-[#CBD5E0] px-3 font-normal" /></label>
          <label className="text-sm font-semibold text-[#344054]">Editoria<select value={category} onChange={(event) => setCategory(event.target.value as CategorySlug)} className="mt-1.5 min-h-11 w-full rounded-lg border border-[#CBD5E0] bg-white px-3 font-normal">{CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label className="text-sm font-semibold text-[#344054]">Tipo de fonte<select value={sourceType} onChange={(event) => setSourceType(event.target.value as RssSource['sourceType'])} className="mt-1.5 min-h-11 w-full rounded-lg border border-[#CBD5E0] bg-white px-3 font-normal">{['órgão público', 'governo', 'congresso', 'tribunal', 'agência oficial', 'veículo', 'partido'].map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label className="flex items-center gap-2 text-sm font-semibold text-[#344054]"><input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} /> Fonte ativa</label>
        </div>
        <div className="flex gap-2"><button type="submit" disabled={saving} className="min-h-11 rounded-lg bg-[#0B2345] px-5 text-sm font-bold text-white disabled:opacity-50">{saving ? 'Salvando…' : editingId !== null ? 'Salvar alterações' : 'Cadastrar fonte'}</button>{editingId !== null && <button type="button" onClick={reset} className="min-h-11 rounded-lg border border-[#CBD5E0] px-4 text-sm font-semibold">Cancelar</button>}</div>
      </form>}
      <div className="overflow-x-auto rounded-xl border border-[#D9DEE7] bg-white">
        <table className="min-w-full divide-y divide-[#E2E8F0]"><thead className="bg-[#F8FAFC]"><tr>
          <th className="p-3 text-left text-xs font-bold uppercase text-[#64748B]">Fonte</th><th className="p-3 text-left text-xs font-bold uppercase text-[#64748B]">Editoria</th><th className="p-3 text-left text-xs font-bold uppercase text-[#64748B]">Estado</th>{canManage && <th className="p-3 text-left text-xs font-bold uppercase text-[#64748B]">Ações</th>}
        </tr></thead><tbody className="divide-y divide-[#E2E8F0]">
          {dataLoading ? <tr><td colSpan={canManage ? 4 : 3} className="p-5 text-sm text-slate-500">Carregando fontes reais…</td></tr> : sources.length === 0 ? <tr><td colSpan={canManage ? 4 : 3} className="p-5 text-sm text-slate-500">A API não retornou fontes cadastradas.</td></tr> : sources.map((source) => (
            <tr key={String(source.id)}><td className="p-3"><p className="font-semibold">{source.name}</p><a href={source.rssUrl} target="_blank" rel="noopener noreferrer" className="break-all text-xs text-[#0B5FFF] hover:underline">{source.rssUrl}</a></td><td className="p-3 text-sm">{source.category}</td><td className="p-3 text-sm">{source.isActive ? 'Ativa' : 'Inativa'}</td>{canManage && <td className="p-3"><div className="flex gap-2"><button type="button" onClick={() => edit(source)} className="rounded border border-[#CBD5E0] px-3 py-1.5 text-xs font-semibold">Editar</button><button type="button" onClick={() => void remove(source)} className="rounded border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700">Excluir</button></div></td>}</tr>
          ))}
        </tbody></table>
      </div>
    </section>
  );
}
