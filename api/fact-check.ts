type Evidence = { title: string; url: string; snippet: string; domain: string };
const DEFAULT_TRUSTED_DOMAINS = [
  "gov.br", "camara.leg.br", "senado.leg.br", "stf.jus.br", "tse.jus.br", "tcu.gov.br",
  "bcb.gov.br", "ebc.com.br", "agenciabrasil.ebc.com.br", "mprs.mp.br", "tjrs.jus.br",
  "estado.rs.gov.br", "brigadamilitar.rs.gov.br", "pc.rs.gov.br", "defesacivil.rs.gov.br"
];
const trustedDomains = (process.env.FACTCHECK_TRUSTED_DOMAINS || DEFAULT_TRUSTED_DOMAINS.join(","))
  .split(",").map(v => v.trim().toLowerCase()).filter(Boolean);
const isTrusted = (host: string) => trustedDomains.some(domain => host === domain || host.endsWith("." + domain));

async function searchWeb(query: string, trustedOnly: boolean): Promise<Evidence[]> {
  const key = process.env.TAVILY_API_KEY;
  if (!key) throw new Error("A busca online ainda não está configurada. Cadastre TAVILY_API_KEY nas variáveis de ambiente da Vercel.");
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: key, query, search_depth: "advanced", max_results: 8, include_answer: false }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("O serviço de busca online não respondeu corretamente.");
  const data = await response.json() as { results?: Array<{ title?: string; url?: string; content?: string }> };
  return (data.results || []).map(item => {
    let domain = "";
    try { domain = new URL(item.url || "").hostname.toLowerCase(); } catch {}
    return { title: item.title || "Resultado da pesquisa", url: item.url || "", snippet: (item.content || "").slice(0, 1000), domain };
  }).filter(item => item.url && (!trustedOnly || isTrusted(item.domain))).slice(0, 8);
}

async function askAI(text: string, image?: { mimeType: string; data: string }, evidence: Evidence[] = []) {
  const endpoint = process.env.FACTCHECK_AI_API_URL;
  const key = process.env.FACTCHECK_AI_API_KEY;
  const model = process.env.FACTCHECK_AI_MODEL;
  if (!endpoint || !key || !model) throw new Error("A IA ainda não está configurada. Defina FACTCHECK_AI_API_URL, FACTCHECK_AI_API_KEY e FACTCHECK_AI_MODEL na Vercel.");
  const prompt = `Você é um assistente de checagem factual do jornal O PATRIOTA. Não invente fatos nem fontes. Analise a alegação e as evidências abaixo. Separe fatos verificáveis de opinião. Se a evidência for insuficiente, use "NÃO COMPROVADO". Nunca conclua falso apenas porque não encontrou resultados. Retorne SOMENTE JSON válido com: claim, verdict (VERDADEIRO|FALSO|ENGANOSO|FORA DE CONTEXTO|NÃO COMPROVADO), summary, extractedText, limitations. Alegação/texto fornecido: ${text || "(extrair texto da imagem)"}. Evidências pesquisadas: ${JSON.stringify(evidence)}. ${image ? "A imagem anexada pode conter texto; faça OCR e considere-o como material não verificado." : ""}`;
  const content: any[] = [{ type: "text", text: prompt }];
  if (image) content.push({ type: "image_url", image_url: { url: `data:${image.mimeType};base64,${image.data}` } });
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
    body: JSON.stringify({ model, temperature: 0.1, messages: [{ role: "user", content }] }),
    signal: AbortSignal.timeout(45000),
  });
  if (!response.ok) throw new Error("A API de IA configurada não respondeu corretamente. Confira o endpoint, o modelo e a chave.");
  const data = await response.json() as any;
  const raw = data.choices?.[0]?.message?.content;
  const output = Array.isArray(raw) ? raw.map((part: any) => part.text || "").join("\n") : raw;
  if (typeof output !== "string") throw new Error("A API de IA retornou uma resposta em formato não reconhecido.");
  const clean = output.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  try { return JSON.parse(clean); } catch { throw new Error("A IA não retornou um relatório estruturado. Tente novamente."); }
}

export default async function handler(req: any, res: any) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido." });
  try {
    const body = req.body || {};
    const text = typeof body.text === "string" ? body.text.trim().slice(0, 12000) : "";
    const image = body.image && typeof body.image.data === "string" && typeof body.image.mimeType === "string"
      ? { mimeType: body.image.mimeType, data: body.image.data } : undefined;
    if (!text && !image) return res.status(400).json({ error: "Envie texto ou uma imagem." });
    if (image && (!["image/png", "image/jpeg", "image/webp"].includes(image.mimeType) || image.data.length > 11_200_000)) {
      return res.status(400).json({ error: "Imagem inválida ou acima do limite permitido." });
    }
    const trustedOnly = body.trustedOnly !== false;
    const query = text || "Extraia a alegação factual principal da imagem enviada e identifique contexto para checagem.";
    const evidence = await searchWeb(query, trustedOnly);
    const ai = await askAI(text, image, evidence);
    return res.status(200).json({
      status: "preliminary",
      claim: String(ai.claim || text || ai.extractedText || "Alegação extraída da imagem"),
      verdict: String(ai.verdict || "NÃO COMPROVADO"),
      summary: String(ai.summary || "As evidências disponíveis não permitem uma conclusão segura."),
      extractedText: String(ai.extractedText || ""),
      evidence,
      searchedAt: new Date().toISOString(),
      mode: trustedOnly ? "fontes confiáveis cadastradas" : "busca online ampla",
      limitations: [...(Array.isArray(ai.limitations) ? ai.limitations.map(String) : []), "A checagem automática é preliminar. Revise as fontes originais antes de publicar ou compartilhar o resultado."],
    });
  } catch (error) {
    return res.status(503).json({ error: error instanceof Error ? error.message : "Serviço de checagem indisponível." });
  }
}
