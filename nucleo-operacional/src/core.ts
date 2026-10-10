import "dotenv/config";
import { createHash } from "node:crypto";
import { Prisma, PrismaClient, AgentRunStatus, AgentType, ArticleStatus, EditorialRiskLevel, IngestionStatus, OperationalTaskStatus, SourceKind, SourceStatus, UserRole } from "@prisma/client";

const prisma = new PrismaClient({ log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"] });
const MAX_FEED_BYTES = 3_000_000;
const editorialRoles = [UserRole.JOURNALIST, UserRole.EDITOR, UserRole.CHIEF_EDITOR, UserRole.ADMIN];
type FeedItem = { title: string; link: string; summary: string; publishedAt: string | null; imageUrl: string | null; imageCredit: string | null; externalId: string | null };
type Draft = { title: string; excerpt: string; body: string; slug: string; categorySlug?: string | null };
type GuardianReport = { riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"; decision: "READY_FOR_HUMAN_REVIEW" | "NEEDS_CORRECTION"; findings: unknown[]; attributionOk: boolean; imageCreditOk: boolean; correctionInstructions: string[]; summary: string };

function safeUrl(raw?: string | null): string | null {
  if (!raw) return null;
  try {
    const u = new URL(raw.trim());
    const host = u.hostname.toLowerCase();
    if (u.protocol !== "https:" || !host || host === "localhost" || host.endsWith(".localhost") || host === "::1" ||
        /^(10\.|127\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host)) return null;
    return u.toString();
  } catch { return null; }
}
function decodeXml(v: string): string {
  return v.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#(\d+);/g, (_m,n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_m,n) => String.fromCodePoint(parseInt(n,16))).replace(/\s+/g," ").trim();
}
function tag(block: string, name: string): string {
  const escaped = name.replace(/[.*+?^\u0024{}()|[\]\\]/g, "\\$&");
  const m = block.match(new RegExp("<" + escaped + "(?:\\s[^>]*)?>([\\s\\S]*?)<\\/" + escaped + "\\s*>", "i"));
  return m ? decodeXml(m[1]) : "";
}
function attr(block: string, name: string, key: string): string | null {
  const m = block.match(new RegExp("<" + name.replace(/[.*+?^\u0024{}()|[\]\\]/g, "\\$&") + "\\b[^>]*\\b" + key + "=[\"']([^\"']+)[\"']", "i"));
  return m?.[1] ? decodeXml(m[1]) : null;
}
function parseFeed(xml: string): FeedItem[] {
  const rss = xml.match(/<item\b[^>]*>[\s\S]*?<\/item>/gi) ?? [];
  const atom = xml.match(/<entry\b[^>]*>[\s\S]*?<\/entry>/gi) ?? [];
  return (rss.length ? rss : atom).slice(0,100).flatMap(block => {
    const title=tag(block,"title").slice(0,240);
    const link=safeUrl(tag(block,"link") || attr(block,"link","href"));
    if (!title || !link) return [];
    const dateRaw=tag(block,"pubDate") || tag(block,"published") || tag(block,"updated");
    const parsed=dateRaw ? new Date(dateRaw) : null;
    const publishedAt=parsed && !Number.isNaN(parsed.getTime()) ? parsed.toISOString() : null;
    const imageMatch=block.match(/<(?:media:content|media:thumbnail|enclosure)\b[^>]*?(?:url|href)=[\"']([^\"']+)[\"'][^>]*>/i)
      || block.match(/<img\b[^>]*\bsrc=[\"']([^\"']+)[\"']/i);
    const imageUrl=safeUrl(imageMatch?.[1]);
    const credit=tag(block,"media:credit") || tag(block,"credit") || tag(block,"dc:creator") || "";
    return [{title,link,summary:(tag(block,"description")||tag(block,"summary")||tag(block,"content")||tag(block,"encoded")).slice(0,6000),
      publishedAt,imageUrl,imageCredit:credit.slice(0,300)||null,externalId:(tag(block,"guid")||tag(block,"id")||link).slice(0,500)}];
  });
}
function slugify(v:string):string {
  return v.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,160)||"materia";
}
function asString(v:unknown,fallback=""):string { return typeof v==="string" ? v.trim() : fallback; }
function jsonInput(v:unknown):Prisma.InputJsonValue { return JSON.parse(JSON.stringify(v)) as Prisma.InputJsonValue; }
function parseModelJson(raw:unknown):Record<string,unknown> {
  if(typeof raw!=="string") throw new Error("A API de IA não devolveu conteúdo textual.");
  const clean=raw.replace(/^\s*```(?:json)?\s*/i,"").replace(/\s*```\s*$/,"").trim();
  try { const parsed=JSON.parse(clean); if(!parsed || typeof parsed!=="object" || Array.isArray(parsed)) throw new Error(); return parsed as Record<string,unknown>; }
  catch { throw new Error("A API de IA não devolveu JSON válido."); }
}
async function askModel(system:string,input:unknown):Promise<Record<string,unknown>> {
  const url=process.env.OPATRIOTA_AI_API_URL, key=process.env.OPATRIOTA_AI_API_KEY, model=process.env.OPATRIOTA_AI_MODEL;
  if(!url||!key||!model) throw new Error("IA não configurada: defina OPATRIOTA_AI_API_URL, OPATRIOTA_AI_API_KEY e OPATRIOTA_AI_MODEL no ambiente do worker.");
  const response=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${key}`},
    body:JSON.stringify({model,temperature:0.2,messages:[{role:"system",content:system},{role:"user",content:JSON.stringify(input)}]}),
    signal:AbortSignal.timeout(45_000)});
  if(!response.ok) throw new Error(`API de IA respondeu com HTTP ${response.status}.`);
  const data=await response.json() as {choices?:Array<{message?:{content?:unknown}}>};
  return parseModelJson(data.choices?.[0]?.message?.content);
}
function backoff(attempt:number):Date { return new Date(Date.now()+Math.min(3_600_000,5_000*2**Math.max(0,attempt-1))); }
function toRisk(v:unknown):EditorialRiskLevel {
  if(v==="LOW") return EditorialRiskLevel.LOW;
  if(v==="HIGH") return EditorialRiskLevel.HIGH;
  if(v==="CRITICAL") return EditorialRiskLevel.CRITICAL;
  return EditorialRiskLevel.MEDIUM;
}
async function runAgent<T>(taskId:string,agent:AgentType,input:unknown,fn:()=>Promise<T>):Promise<T> {
  const run=await prisma.agentExecution.create({data:{taskId,agent,input:jsonInput(input),status:AgentRunStatus.RUNNING}});
  try {
    const output=await fn();
    await prisma.agentExecution.update({where:{id:run.id},data:{status:AgentRunStatus.SUCCEEDED,output:jsonInput(output),finishedAt:new Date()}});
    return output;
  } catch(error) {
    await prisma.agentExecution.update({where:{id:run.id},data:{status:AgentRunStatus.FAILED,error:(error instanceof Error?error.message:"Erro desconhecido").slice(0,4000),finishedAt:new Date()}});
    throw error;
  }
}
export async function scheduleDueSources(now=new Date()):Promise<number> {
  const sources=await prisma.source.findMany({where:{status:SourceStatus.ACTIVE,kind:SourceKind.RSS}});
  let queued=0;
  for(const source of sources) {
    if(source.lastFetchedAt && source.lastFetchedAt.getTime()+Math.max(60,source.pollingSeconds)*1000>now.getTime()) continue;
    const bucket=Math.floor(now.getTime()/(Math.max(60,source.pollingSeconds)*1000));
    try {
      await prisma.operationalTask.create({data:{taskType:"POLL_SOURCE",payload:{sourceId:source.id},idempotencyKey:`poll:${source.id}:${bucket}`,availableAt:now}});
      queued++;
    } catch(error) {
      if(!(error instanceof Prisma.PrismaClientKnownRequestError)||error.code!=="P2002") throw error;
    }
  }
  return queued;
}
async function pollSource(sourceId:string):Promise<void> {
  const source=await prisma.source.findUnique({where:{id:sourceId}});
  if(!source||source.status!==SourceStatus.ACTIVE||source.kind!==SourceKind.RSS) return;
  try {
    const url=safeUrl(source.url);
    if(!url) throw new Error("URL da fonte rejeitada: é necessário HTTPS e um endereço público.");
    const response=await fetch(url,{headers:{"User-Agent":"OPatriota-Core/1.0 (+https://opatriota.com.br)",Accept:"application/rss+xml, application/atom+xml, application/xml, text/xml"},signal:AbortSignal.timeout(12_000)});
    if(!response.ok) throw new Error(`Fonte respondeu com HTTP ${response.status}.`);
    const xml=await response.text();
    if(xml.length>MAX_FEED_BYTES) throw new Error("Feed excede o limite de tamanho permitido.");
    for(const item of parseFeed(xml)) {
      const contentHash=createHash("sha256").update(`${source.id}\n${item.link}\n${item.title}`).digest("hex");
      let ingestion=await prisma.ingestionItem.findUnique({where:{sourceId_contentHash:{sourceId:source.id,contentHash}}});
      if(!ingestion) {
        try {
          ingestion=await prisma.ingestionItem.create({data:{sourceId:source.id,externalId:item.externalId,canonicalUrl:item.link,title:item.title,
            publishedAt:item.publishedAt?new Date(item.publishedAt):null,contentHash,payload:jsonInput(item),status:IngestionStatus.QUEUED}});
        } catch(error) {
          if(error instanceof Prisma.PrismaClientKnownRequestError&&error.code==="P2002") continue;
          throw error;
        }
      }
      if(ingestion.status===IngestionStatus.QUEUED) {
        try {
          await prisma.operationalTask.create({data:{taskType:"WRITE_AND_GUARD_DRAFT",payload:{ingestionItemId:ingestion.id},idempotencyKey:`draft:${ingestion.id}`}});
        } catch(error) {
          if(!(error instanceof Prisma.PrismaClientKnownRequestError)||error.code!=="P2002") throw error;
        }
      }
    }
    await prisma.source.update({where:{id:source.id},data:{lastFetchedAt:new Date(),lastSuccessAt:new Date(),lastError:null}});
  } catch(error) {
    await prisma.source.update({where:{id:source.id},data:{lastFetchedAt:new Date(),lastError:(error instanceof Error?error.message:"Erro desconhecido").slice(0,2000)}});
    throw error;
  }
}
async function writeAndGuard(taskId:string,ingestionItemId:string,forceCorrection=false,correctionRound=0):Promise<void> {
  const item=await prisma.ingestionItem.findUnique({where:{id:ingestionItemId},include:{source:true}});
  if(!item) throw new Error("Item de ingestão não encontrado.");
  const payload=item.payload as unknown as FeedItem;
  let article=await prisma.article.findFirst({where:{canonicalUrl:item.canonicalUrl}});
  if(!article) {
    const authorId=process.env.OPERATIONAL_AUTHOR_ID;
    if(!authorId) throw new Error("Defina OPERATIONAL_AUTHOR_ID com o ID de um utilizador editorial existente; o núcleo não cria contas nem privilégios.");
    const author=await prisma.user.findUnique({where:{id:authorId}});
    if(!author||author.disabledAt||!editorialRoles.includes(author.role)) throw new Error("OPERATIONAL_AUTHOR_ID não corresponde a uma conta editorial ativa e autorizada.");
    const writerInput={sourceName:item.source.name,sourceUrl:item.source.url,articleUrl:item.canonicalUrl,sourceTitle:payload.title||item.title||"",
      sourceSummary:payload.summary||"",publishedAt:item.publishedAt?.toISOString()??null,imageUrl:payload.imageUrl||null,imageCredit:payload.imageCredit||null,
      editorialDirection:"Enquadramento conservador/liberal quando pertinente, sem alterar factos."};
    const draft=await runAgent<Draft>(taskId,AgentType.EDITORIAL_WRITER,writerInput,async()=>{
      const r=await askModel("És o agente redator do O Patriota Brasil. Escreve em português brasileiro com base SOMENTE nos dados fornecidos. O feed pode conter apenas título e resumo: não inventes detalhes nem finjas ter lido o artigo completo. Resume e contextualiza; não copies integralmente texto protegido. Preserva a fonte e o URL original. A linha editorial pode usar enquadramento conservador/liberal quando pertinente, sem distorcer factos. Devolve apenas JSON {title,excerpt,body,slug,categorySlug}.",writerInput);
      const title=asString(r.title),body=asString(r.body);
      if(!title||!body) throw new Error("O agente redator devolveu título ou corpo vazio.");
      return {title:title.slice(0,240),excerpt:asString(r.excerpt).slice(0,1000),body:body.slice(0,100000),
        slug:slugify(asString(r.slug,title))+"-"+createHash("sha256").update(item.id).digest("hex").slice(0,8),categorySlug:asString(r.categorySlug)||null};
    });
    const category=draft.categorySlug?await prisma.category.findUnique({where:{slug:slugify(draft.categorySlug)}}):null;
    const imageUrl=safeUrl(payload.imageUrl);
    article=await prisma.article.create({data:{title:draft.title,excerpt:draft.excerpt||null,body:draft.body,slug:draft.slug,authorId:author.id,
      categoryId:category?.id??null,status:ArticleStatus.DRAFT,canonicalUrl:item.canonicalUrl,heroImageUrl:imageUrl,heroImageSourceUrl:imageUrl,
      heroImageCredit:payload.imageCredit||null,
      sources:{create:{sourceId:item.sourceId,note:"Fonte original da ingestão automatizada; confirmar atribuição e permissões antes da publicação."}}}});
  }
  if(forceCorrection && article) {
    if(article.status!==ArticleStatus.DRAFT) throw new Error("Correção automática bloqueada: a matéria já não está em rascunho.");
    const previous=article.riskAssessment as unknown as Partial<GuardianReport>|null;
    const instructions=Array.isArray(previous?.correctionInstructions)?previous.correctionInstructions.map(String):[];
    const correctionInput={currentDraft:{title:article.title,excerpt:article.excerpt,body:article.body},source:{name:item.source.name,url:item.source.url,articleUrl:item.canonicalUrl,title:payload.title,summary:payload.summary},findings:previous?.findings??[],instructions};
    const corrected=await runAgent<Draft>(taskId,AgentType.EDITORIAL_WRITER,correctionInput,async()=>{
      const r=await askModel("És o agente redator a corrigir um rascunho sinalizado pelo Guardião. Corrige apenas os problemas listados, não acrescentes factos ausentes nem inventes contexto, preserva atribuição à fonte e não copies integralmente texto protegido. Se o problema exigir confirmação factual ou jurídica externa, não inventes solução; deixa a limitação explícita. Devolve JSON {title,excerpt,body}.",correctionInput);
      const title=asString(r.title,article.title),body=asString(r.body);
      if(!body) throw new Error("A correção editorial devolveu corpo vazio.");
      return {title:title.slice(0,240),excerpt:asString(r.excerpt,article.excerpt||"").slice(0,1000),body:body.slice(0,100000),slug:article.slug};
    });
    article=await prisma.article.update({where:{id:article.id},data:{title:corrected.title,excerpt:corrected.excerpt||null,body:corrected.body,
      version:{increment:1},riskAssessment:Prisma.DbNull,humanApprovedAt:null,humanApprovedById:null}});
  }
  const guardianInput={article:{title:article.title,excerpt:article.excerpt,body:article.body,canonicalUrl:item.canonicalUrl},
    source:{name:item.source.name,url:item.source.url,originalItemUrl:item.canonicalUrl,title:payload.title,summary:payload.summary},
    image:{url:payload.imageUrl||null,credit:payload.imageCredit||null}};
  const report=await runAgent<GuardianReport>(taskId,AgentType.SYSTEM_GUARDIAN,guardianInput,async()=>{
    const r=await askModel("És o Agente Guardião do O Patriota Brasil. Revê proveniência, correspondência entre rascunho e dados de origem, atribuição e riscos aparentes. Uma publicação de uma fonte não prova automaticamente todas as alegações: não declares verificação independente sem evidência. Sinaliza alegações lesivas sem suporte, conteúdo que exceda o resumo e créditos de imagem ausentes. Não emitas parecer jurídico. Nunca aproves publicação: exige revisão humana. Devolve JSON {riskLevel:LOW|MEDIUM|HIGH|CRITICAL,decision:READY_FOR_HUMAN_REVIEW|NEEDS_CORRECTION,findings:[{level,issue,evidence,recommendation}],attributionOk:boolean,imageCreditOk:boolean,correctionInstructions:string[],summary:string}. Não inventes fotógrafo; se não houver crédito explícito, assinala-o.",guardianInput);
    const risk=["LOW","MEDIUM","HIGH","CRITICAL"].includes(String(r.riskLevel))?String(r.riskLevel):"MEDIUM";
    return {riskLevel:risk as GuardianReport["riskLevel"],decision:r.decision==="READY_FOR_HUMAN_REVIEW"?"READY_FOR_HUMAN_REVIEW":"NEEDS_CORRECTION",
      findings:Array.isArray(r.findings)?r.findings:[],attributionOk:r.attributionOk===true,imageCreditOk:r.imageCreditOk===true,
      correctionInstructions:Array.isArray(r.correctionInstructions)?r.correctionInstructions.map(String):[],
      summary:asString(r.summary,"Revisão preliminar concluída; aprovação humana continua obrigatória.")};
  });
  await prisma.article.update({where:{id:article.id},data:{riskLevel:toRisk(report.riskLevel),
    riskAssessment:jsonInput({...report,checkedAt:new Date().toISOString(),sourceUrl:item.canonicalUrl,agent:"SYSTEM_GUARDIAN"})}});
  if(report.decision==="NEEDS_CORRECTION" && (report.riskLevel==="LOW"||report.riskLevel==="MEDIUM") && correctionRound<1) {
    try {
      await prisma.operationalTask.create({data:{taskType:"WRITE_AND_GUARD_DRAFT",
        payload:{ingestionItemId:item.id,forceCorrection:true,correctionRound:correctionRound+1},
        idempotencyKey:`redraft:${article.id}:v${article.version}`}});
    } catch(error) {
      if(!(error instanceof Prisma.PrismaClientKnownRequestError)||error.code!=="P2002") throw error;
    }
  }
  await prisma.ingestionItem.update({where:{id:item.id},data:{status:IngestionStatus.REVIEWED,errorMessage:null}});
  await prisma.auditEvent.create({data:{action:"OPERATIONAL_DRAFT_CREATED_AND_GUARDED",entityType:"Article",entityId:article.id,
    metadata:jsonInput({taskId,ingestionItemId:item.id,sourceId:item.sourceId,sourceUrl:item.canonicalUrl,guardianDecision:report.decision,riskLevel:report.riskLevel})}});
}
async function processTask(id:string):Promise<void> {
  const claim=await prisma.operationalTask.updateMany({where:{id,status:OperationalTaskStatus.PENDING,availableAt:{lte:new Date()}},
    data:{status:OperationalTaskStatus.RUNNING,startedAt:new Date(),attempts:{increment:1},lastError:null}});
  if(!claim.count) return;
  const task=await prisma.operationalTask.findUnique({where:{id}});
  if(!task) return;
  try {
    const payload=task.payload as Record<string,unknown>;
    if(task.taskType==="POLL_SOURCE") { const sourceId=asString(payload.sourceId); if(!sourceId) throw new Error("Tarefa sem sourceId."); await pollSource(sourceId); }
    else if(task.taskType==="WRITE_AND_GUARD_DRAFT") { const itemId=asString(payload.ingestionItemId); if(!itemId) throw new Error("Tarefa sem ingestionItemId."); await writeAndGuard(task.id,itemId,payload.forceCorrection===true,Number(payload.correctionRound??0)); }
    else throw new Error(`Tipo de tarefa desconhecido: ${task.taskType}`);
    await prisma.operationalTask.update({where:{id},data:{status:OperationalTaskStatus.SUCCEEDED,finishedAt:new Date(),lastError:null}});
  } catch(error) {
    const message=(error instanceof Error?error.message:"Erro operacional desconhecido").slice(0,4000);
    const latest=await prisma.operationalTask.findUnique({where:{id}});
    const exhausted=!latest||latest.attempts>=latest.maxAttempts;
    await prisma.operationalTask.update({where:{id},data:{status:exhausted?OperationalTaskStatus.FAILED:OperationalTaskStatus.PENDING,
      availableAt:exhausted?new Date():backoff(latest?.attempts??1),finishedAt:exhausted?new Date():null,lastError:message}});
    console.error(JSON.stringify({level:"error",event:"operational_task_failed",taskId:id,taskType:task.taskType,exhausted,error:message}));
  }
}
async function recoverStaleTasks():Promise<void> {
  const cutoff=new Date(Date.now()-10*60_000);
  const stale=await prisma.operationalTask.findMany({where:{status:OperationalTaskStatus.RUNNING,startedAt:{lt:cutoff}},select:{id:true,attempts:true,maxAttempts:true}});
  for(const task of stale) {
    const exhausted=task.attempts>=task.maxAttempts;
    await prisma.operationalTask.update({where:{id:task.id},data:{status:exhausted?OperationalTaskStatus.FAILED:OperationalTaskStatus.PENDING,
      availableAt:exhausted?new Date():backoff(task.attempts),finishedAt:exhausted?new Date():null,lastError:"Execução interrompida; recuperada pelo worker."}});
    await prisma.agentExecution.updateMany({where:{taskId:task.id,status:AgentRunStatus.RUNNING},data:{status:AgentRunStatus.FAILED,error:"Worker interrompido durante a execução.",finishedAt:new Date()}});
  }
}
export async function runCycle():Promise<{scheduled:number;processed:number}> {
  await recoverStaleTasks();
  const scheduled=await scheduleDueSources();
  const pending=await prisma.operationalTask.findMany({where:{status:OperationalTaskStatus.PENDING,availableAt:{lte:new Date()}},
    orderBy:[{availableAt:"asc"},{createdAt:"asc"}],take:Math.max(1,Math.min(20,Number(process.env.CORE_BATCH_SIZE||5))),select:{id:true}});
  for(const task of pending) await processTask(task.id);
  return {scheduled,processed:pending.length};
}
export async function disconnectCore():Promise<void>{await prisma.$disconnect();}
