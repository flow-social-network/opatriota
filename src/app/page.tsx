import Link from "next/link";
import {getArticles} from "@/lib/next/api";
import {ApiError,NewsCard} from "@/components/next/NewsCard";
export const dynamic = "force-dynamic";
export const metadata = {title:"Início",description:"Notícias, análise e opinião com fontes identificadas."};
export default async function HomePage(){try{const {articles}=await getArticles({page:1,pageSize:12});return <main className="site-shell"><section style={{padding:"2rem 0"}}><p className="source-credit">Notícias · Análise · Opinião</p><h1 className="page-title">O Brasil em pauta.</h1><p>Jornalismo com origem identificada, atribuição clara e transparência.</p><p><Link href="/noticias">Ver todas as notícias</Link></p></section><section><h2>Últimas notícias</h2>{articles.length?<div className="news-grid">{articles.map(a=><NewsCard key={a.id} article={a}/>)}</div>:<p>Nenhuma notícia publicada está disponível no momento.</p>}</section></main>;}catch(error){return <main className="site-shell"><h1 className="page-title">O Patriota Brasil</h1><ApiError message={error instanceof Error?error.message:"Não foi possível carregar as notícias. Verifique a API."}/></main>;}}
