import Link from "next/link";
import { searchJournalists } from "@/lib/next/api";

export const dynamic = "force-dynamic";
export const metadata = { title: "Verificar profissional de imprensa", description: "Consulte o registo público de vínculos jornalísticos confirmados pelo O Patriota Brasil." };
type Props = { searchParams: Promise<{ q?: string }> };

export default async function VerifyPressPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const query = q.trim().slice(0,100);
  let results: Awaited<ReturnType<typeof searchJournalists>> = [];
  let error: string | null = null;
  if (query.length >= 2) {
    try { results = await searchJournalists(query); }
    catch { error = "O serviço de verificação está temporariamente indisponível. Tente novamente."; }
  }
  return <main className="site-shell" style={{ maxWidth: 1000, paddingTop: "2rem", paddingBottom: "3rem" }}>
    <p className="source-credit">O PATRIOTA BRASIL · TRANSPARÊNCIA</p>
    <h1 className="page-title">Verificar profissional de imprensa</h1>
    <p>Empresas, assessorias e entidades podem consultar aqui os perfis de vínculo editorial confirmados pelo O Patriota Brasil.</p>
    <form action="/verificar-imprensa" method="get" className="verification-search">
      <label htmlFor="q">Nome, endereço do perfil ou código da credencial</label>
      <div><input id="q" name="q" defaultValue={query} maxLength={100} minLength={2} required placeholder="Ex.: Maria Silva ou OPB-1A2B3C4D5E6F" /><button type="submit">Consultar</button></div>
    </form>
    <p className="verification-scope">A confirmação refere-se exclusivamente ao vínculo editorial com O Patriota Brasil. Não representa credencial emitida pelo governo nem comprova vínculo com outras organizações.</p>
    {error ? <p className="error-state" role="status">{error}</p> : null}
    {query.length >= 2 && !error ? <section aria-live="polite"><h2>Resultados da consulta</h2>
      {results.length ? <div className="news-grid">{results.map(profile => <article className="news-card" key={profile.slug}>
        <p className="verified-label">✓ VÍNCULO CONFIRMADO</p><h2><Link href={"/imprensa/" + encodeURIComponent(profile.slug)}>{profile.name}</Link></h2>
        {profile.professionalTitle ? <p>{profile.professionalTitle}</p> : null}
        <p className="source-credit">Código: <code>{profile.credentialCode}</code></p>
        <p><Link href={"/imprensa/" + encodeURIComponent(profile.slug)}>Ver perfil e validar credencial →</Link></p>
      </article>)}</div> : <p>Nenhum perfil com vínculo atualmente confirmado corresponde à consulta. Isso não é prova de que a pessoa não exerça jornalismo; significa apenas que não há um perfil confirmado correspondente neste registo.</p>}
    </section> : <p>Introduza pelo menos dois caracteres ou o código de verificação para pesquisar.</p>}
  </main>;
}
