import React, { useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, ClipboardPaste, Download, FileImage, LoaderCircle, Search, ShieldCheck, UploadCloud } from 'lucide-react';

type Evidence = { title: string; url: string; snippet: string; domain?: string };
type Report = { status: string; claim: string; verdict: string; summary: string; extractedText?: string; evidence: Evidence[]; searchedAt: string; mode: string; limitations?: string[] };

interface Props { onBack: () => void }

export const FactCheckSubmissionPage: React.FC<Props> = ({ onBack }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [trustedOnly, setTrustedOnly] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState<Report | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setReport(null);
    if (!text.trim() && !file) { setError('Cole o texto da alegação ou envie uma captura de tela.'); return; }
    if (file && !file.type.startsWith('image/')) { setError('Envie uma imagem PNG, JPG ou WEBP.'); return; }
    if (file && file.size > 8 * 1024 * 1024) { setError('A imagem deve ter no máximo 8 MB.'); return; }
    setLoading(true);
    try {
      let image: { mimeType: string; data: string } | undefined;
      if (file) {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Não foi possível ler a imagem.'));
          reader.onerror = () => reject(new Error('Não foi possível ler a imagem.'));
          reader.readAsDataURL(file);
        });
        image = { mimeType: file.type, data: dataUrl.split(',')[1] };
      }
      const response = await fetch('/api/fact-check', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), image, trustedOnly }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Não foi possível concluir a checagem.');
      setReport(data as Report);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao consultar o serviço de checagem.');
    } finally { setLoading(false); }
  };

  const downloadReport = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = `o-patriota-checagem-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click(); URL.revokeObjectURL(url);
  };

  return <div className="min-h-[65vh] bg-[#F7F8FA] px-4 py-8">
    <div className="mx-auto max-w-5xl">
      <button onClick={onBack} className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#0B2345] hover:text-[#0B5FFF]"><ArrowLeft size={16}/> Voltar à Agência de Checagem</button>
      <header className="rounded-t-xl bg-[#0B2345] p-6 text-white md:p-8">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-[#FFCC29]"><ShieldCheck size={16}/> O PATRIOTA · VERIFICAÇÃO</div>
        <h1 className="font-serif text-3xl font-black md:text-4xl">Envie para checagem</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-white/85">Cole a mensagem copiada ou envie uma captura de tela. O sistema tentará extrair as alegações, pesquisar evidências online e montar um relatório com links para as fontes consultadas.</p>
      </header>
      <form onSubmit={submit} className="space-y-6 rounded-b-xl border border-t-0 border-[#D9DEE7] bg-white p-5 shadow-sm md:p-8">
        <div>
          <label htmlFor="fact-check-text" className="mb-2 block text-sm font-bold text-[#0B2345]"><ClipboardPaste className="mr-2 inline" size={17}/>Texto copiado (opcional se enviar imagem)</label>
          <textarea id="fact-check-text" value={text} onChange={e => setText(e.target.value)} rows={6} maxLength={12000} placeholder="Cole aqui a mensagem, publicação, notícia ou alegação que deseja verificar…" className="w-full rounded-lg border border-[#C8D0DC] p-3 text-sm leading-6 outline-none focus:border-[#0B5FFF] focus:ring-2 focus:ring-blue-100"/>
          <p className="mt-1 text-right text-xs text-slate-500">{text.length}/12.000 caracteres</p>
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold text-[#0B2345]"><FileImage className="mr-2 inline" size={17}/>Captura de tela ou imagem</label>
          <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)}/>
          <button type="button" onClick={() => inputRef.current?.click()} className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#A9B8CC] bg-[#F8FAFC] p-6 text-center hover:border-[#0B5FFF] hover:bg-blue-50">
            <UploadCloud className="mb-2 text-[#0B5FFF]" size={28}/><span className="text-sm font-bold text-[#0B2345]">{file ? file.name : 'Clique para selecionar uma imagem'}</span><span className="mt-1 text-xs text-slate-500">PNG, JPG ou WEBP · máximo 8 MB</span>
          </button>
          {file && <button type="button" onClick={() => { setFile(null); if(inputRef.current) inputRef.current.value=''; }} className="mt-2 text-xs font-semibold text-red-700 underline">Remover imagem</button>}
        </div>
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#D9DEE7] p-4">
          <input type="checkbox" checked={trustedOnly} onChange={e => setTrustedOnly(e.target.checked)} className="mt-1 h-4 w-4 accent-[#0B5FFF]"/>
          <span><strong className="block text-sm text-[#0B2345]">Confiar prioritariamente nas fontes cadastradas pelo O PATRIOTA</strong><span className="mt-1 block text-xs leading-5 text-slate-600">Quando ativado, a busca prioriza fontes institucionais e fontes incluídas na lista confiável configurada no servidor. Isso não significa que uma fonte seja infalível: as evidências e divergências devem ser examinadas.</span></span>
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-xs leading-5 text-slate-500">A checagem automática é preliminar. A IA pode errar; o resultado não será publicado automaticamente como conclusão editorial.</p>
          <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0B5FFF] px-6 py-3 text-sm font-black text-white hover:bg-[#0B2345] disabled:cursor-wait disabled:opacity-60">{loading ? <><LoaderCircle className="animate-spin" size={17}/> Pesquisando evidências…</> : <><Search size={17}/> Verificar alegação</>}</button>
        </div>
        {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
      </form>
      {report && <section className="mt-8 rounded-xl border border-[#D9DEE7] bg-white p-5 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#D9DEE7] pb-4">
          <div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#16803C]"><CheckCircle2 size={16}/> Relatório gerado</div><h2 className="mt-2 font-serif text-2xl font-black text-[#0B2345]">{report.verdict}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">{report.summary}</p></div>
          <button onClick={downloadReport} className="inline-flex items-center gap-2 rounded border border-[#0B5FFF] px-3 py-2 text-xs font-bold text-[#0B5FFF] hover:bg-blue-50"><Download size={15}/> Baixar relatório JSON</button>
        </div>
        {report.extractedText && <div className="mt-5"><h3 className="text-sm font-bold text-[#0B2345]">Texto extraído da imagem</h3><p className="mt-2 whitespace-pre-wrap rounded bg-slate-50 p-3 text-sm">{report.extractedText}</p></div>}
        <div className="mt-5"><h3 className="text-sm font-bold text-[#0B2345]">Alegação analisada</h3><p className="mt-2 text-sm leading-6">{report.claim}</p></div>
        <div className="mt-6"><h3 className="mb-3 text-sm font-bold text-[#0B2345]">Evidências encontradas · {report.evidence?.length || 0}</h3>
          {report.evidence?.length ? <ol className="space-y-3">{report.evidence.map((item, index) => <li key={item.url + index} className="rounded-lg border border-[#D9DEE7] p-4"><div className="text-[10px] font-bold uppercase tracking-wider text-[#16803C]">Evidência {index + 1}{item.domain ? ` · ${item.domain}` : ''}</div><a className="mt-1 block font-bold text-[#0B5FFF] underline underline-offset-2" href={item.url} target="_blank" rel="noopener noreferrer">{item.title || item.url}</a><p className="mt-2 text-sm leading-5 text-slate-600">{item.snippet}</p></li>)}</ol> : <p className="rounded bg-amber-50 p-4 text-sm text-amber-900">Nenhuma evidência retornada pelo mecanismo de busca. Isso não comprova que a alegação seja verdadeira ou falsa.</p>}
        </div>
        {report.limitations?.length ? <div className="mt-5 rounded-lg bg-amber-50 p-4 text-xs leading-5 text-amber-900">{report.limitations.join(' ')}</div> : null}
        <p className="mt-5 text-[11px] text-slate-500">Consultado em {new Date(report.searchedAt).toLocaleString('pt-BR')} · Modo: {report.mode}. Resultado auxiliar para revisão humana, não uma decisão factual definitiva.</p>
      </section>}
    </div>
  </div>;
};
