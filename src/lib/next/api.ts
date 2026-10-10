export type ArticleSummary = { id:string; slug:string; title:string; excerpt:string|null; heroImageUrl:string|null; heroImageSourceUrl?:string|null; heroImageCredit?:string|null; canonicalUrl?:string|null; publishedAt:string|null; author?:{displayName?:string;profileSlug?:string|null}|null; category?:{slug:string;name:string}|null; };
export type ArticleDetail = ArticleSummary & { body:string; sources?:Array<{source?:{name?:string;url?:string;kind?:string};note?:string|null}>; };
type Envelope<T> = { data?:T; pagination?:{page:number;pageSize:number;total:number;pages:number} };
function apiBase(){return (process.env.OPATRIOTA_API_URL||process.env.NEXT_PUBLIC_OPATRIOTA_API_URL||"http://localhost:8080").replace(/\/$/,"");}
export async function getArticles(options:{page?:number;pageSize?:number;category?:string}={}){const url=new URL("/api/articles",apiBase());url.searchParams.set("page",String(options.page??1));url.searchParams.set("pageSize",String(options.pageSize??20));if(options.category)url.searchParams.set("category",options.category);const res=await fetch(url,{cache:"no-store",headers:{Accept:"application/json"}});if(!res.ok)throw new Error("API de notícias indisponível (HTTP "+res.status+").");const body=await res.json() as Envelope<ArticleSummary[]>;if(!Array.isArray(body.data))throw new Error("A API não devolveu uma lista de notícias válida.");return {articles:body.data,pagination:body.pagination};}
export type JournalistProfile = {
 name:string; slug:string; professionalTitle:string|null; bio:string|null; photoUrl:string|null;
 publicContactUrl:string|null; credentialCode:string; verificationStatus:"CONFIRMED"; verifiedAt:string; expiresAt:string|null;
 outlet:string; verificationScope:string; articles:Array<{slug:string;title:string;excerpt:string|null;publishedAt:string|null}>;
};
export type JournalistSearchResult = {name:string;slug:string;professionalTitle:string|null;credentialCode:string;verifiedAt:string;expiresAt:string|null;outlet:string;verificationStatus:"CONFIRMED"};
export async function getJournalist(slug:string):Promise<JournalistProfile>{
 const url=new URL("/api/journalists/"+encodeURIComponent(slug),apiBase());
 const response=await fetch(url,{cache:"no-store",headers:{Accept:"application/json"}});
 if(response.status===404)throw new Error("JOURNALIST_NOT_FOUND");
 if(!response.ok)throw new Error("Serviço de verificação indisponível (HTTP "+response.status+").");
 const payload=await response.json() as Envelope<JournalistProfile>;
 if(!payload.data||payload.data.verificationStatus!=="CONFIRMED")throw new Error("Perfil profissional inválido.");
 return payload.data;
}
export async function searchJournalists(query:string):Promise<JournalistSearchResult[]>{
 const url=new URL("/api/journalists",apiBase());url.searchParams.set("query",query);
 const response=await fetch(url,{cache:"no-store",headers:{Accept:"application/json"}});
 if(!response.ok)throw new Error("Não foi possível consultar o registo de imprensa (HTTP "+response.status+").");
 const payload=await response.json() as Envelope<JournalistSearchResult[]>;
 return Array.isArray(payload.data)?payload.data:[];
}
export async function getArticle(slug:string){const url=new URL("/api/articles/"+encodeURIComponent(slug),apiBase());const res=await fetch(url,{cache:"no-store",headers:{Accept:"application/json"}});if(res.status===404)throw new Error("ARTICLE_NOT_FOUND");if(!res.ok)throw new Error("API do artigo indisponível (HTTP "+res.status+").");const body=await res.json() as Envelope<ArticleDetail>;if(!body.data||typeof body.data.title!=="string")throw new Error("A API devolveu um artigo inválido.");return body.data;}
