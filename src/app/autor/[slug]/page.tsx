type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props){const p=await params;return {title:"Autor: "+p.slug};}
export default async function AuthorPage({params}:Props){const p=await params;return <main className="site-shell" style={{paddingTop:"2rem"}}><h1 className="page-title">Autor: {p.slug.replace(/-/g," ")}</h1><p>A API atual ainda não expõe um endpoint de autores. Esta rota aguarda a migração funcional desse recurso.</p></main>;}
