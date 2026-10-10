import {getArticles} from "@/lib/next/api";
import {ApiError,NewsCard} from "@/components/next/NewsCard";
export const dynamic = "force-dynamic"; export const metadata = {title:"Arquivo de notícias"};
export default async function Page(){try{const result=await getArticles({page:1,pageSize:50});return <main className="site-shell" style={{paddingTop:"2rem"}}><h1 className="page-title">Arquivo de notícias</h1>{result.articles.length?<div className="news-grid">{result.articles.map(a=><NewsCard key={a.id} article={a}/>)}</div>:<p>Não há notícias publicadas disponíveis.</p>}</main>;}catch(error){return <main className="site-shell"><h1 className="page-title">Arquivo de notícias</h1><ApiError message={error instanceof Error?error.message:"Não foi possível carregar os dados."}/></main>;}}
