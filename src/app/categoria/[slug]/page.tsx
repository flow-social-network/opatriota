import {getArticles} from "@/lib/next/api";
import {ApiError,NewsCard} from "@/components/next/NewsCard";
export const dynamic = "force-dynamic";
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props){const p=await params;return {title:"Categoria: "+p.slug};}
export default async function CategoryPage({params}:Props){const p=await params;try{const result=await getArticles({page:1,pageSize:50,category:p.slug});return <main className="site-shell" style={{paddingTop:"2rem"}}><h1 className="page-title">Categoria: {p.slug.replace(/-/g," ")}</h1>{result.articles.length?<div className="news-grid">{result.articles.map(a=><NewsCard key={a.id} article={a}/>)}</div>:<p>Não há matérias publicadas nesta categoria.</p>}</main>;}catch(error){return <main className="site-shell"><h1 className="page-title">Categoria: {p.slug}</h1><ApiError message={error instanceof Error?error.message:"Não foi possível carregar a categoria."}/></main>;}}
