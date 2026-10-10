import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import https from "node:https";

const DEFAULT_MAX_BYTES = 3_000_000;
const DEFAULT_TIMEOUT_MS = 12_000;
const MAX_REDIRECTS = 5;

export type PublicFeedResponse = { status: number; body: string; finalUrl: string };

export function isPublicIpv4Address(address: string): boolean {
  if (isIP(address) !== 4) return false;
  const octets = address.split(".").map(Number);
  if (octets.length !== 4 || octets.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  const [first, second, third] = octets;
  if (first === 0 || first === 10 || first === 127 || first >= 224) return false;
  if (first === 100 && second >= 64 && second <= 127) return false;
  if (first === 169 && second === 254) return false;
  if (first === 172 && second >= 16 && second <= 31) return false;
  if (first === 192 && (second === 168 || (second === 0 && (third === 0 || third === 2)) || (second === 88 && third === 99))) return false;
  if (first === 198 && (second === 18 || second === 19 || (second === 51 && third === 100))) return false;
  if (first === 203 && second === 0 && third === 113) return false;
  return true;
}

export function validatePublicFeedUrl(raw: string): URL {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("URL da fonte inválida.");
  }
  const host = url.hostname.toLowerCase().replace(/\.$/, "");
  if (url.protocol !== "https:" || url.username || url.password || !host || host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local")) {
    throw new Error("Feed bloqueado: use uma URL HTTPS pública sem credenciais incorporadas.");
  }
  if (isIP(host) === 4 && !isPublicIpv4Address(host)) {
    throw new Error("Feed bloqueado: o endereço IP não é público.");
  }
  if (isIP(host) === 6) {
    throw new Error("Feed bloqueado: fontes por endereço IPv6 literal não são aceites.");
  }
  return url;
}

async function resolvePinnedPublicIpv4(host: string): Promise<{ address: string; family: 4 }> {
  const records = isIP(host) === 4
    ? [{ address: host, family: 4 as const }]
    : (await lookup(host, { all: true, verbatim: true })).filter((record) => record.family === 4);
  if (!records.length || records.some((record) => !isPublicIpv4Address(record.address))) {
    throw new Error("Feed bloqueado: o host não resolve exclusivamente para endereços IPv4 públicos.");
  }
  return { address: records[0].address, family: 4 };
}

function requestPinned(url: URL, address: { address: string; family: 4 }, maxBytes: number, timeoutMs: number): Promise<{ status: number; body: string; location?: string }> {
  return new Promise((resolve, reject) => {
    const lookupPinned = ((_hostname: string, _options: unknown, callback: (error: NodeJS.ErrnoException | null, address: string, family: number) => void) => {
      callback(null, address.address, address.family);
    }) as NonNullable<https.RequestOptions["lookup"]>;
    const request = https.request({
      protocol: "https:",
      hostname: url.hostname,
      port: url.port || 443,
      path: `${url.pathname}${url.search}`,
      method: "GET",
      headers: { "User-Agent": "OPatriota-Core/1.0 (+https://opatriota.com.br)", Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml" },
      servername: isIP(url.hostname) ? undefined : url.hostname,
      family: 4,
      lookup: lookupPinned,
    }, (response) => {
      const status = response.statusCode || 0;
      const location = response.headers.location;
      if ([301, 302, 303, 307, 308].includes(status)) {
        response.resume();
        response.once("end", () => finish({ status, body: "", location }));
        return;
      }
      if (status < 200 || status >= 300) {
        response.resume();
        response.once("end", () => finish({ status, body: "" }));
        return;
      }
      const contentLength = Number(response.headers["content-length"] || 0);
      if (contentLength > maxBytes) {
        request.destroy(new Error("Feed excede o limite de tamanho permitido."));
        return;
      }
      const chunks: Buffer[] = [];
      let totalBytes = 0;
      response.on("data", (chunk: Buffer) => {
        totalBytes += chunk.length;
        if (totalBytes > maxBytes) {
          request.destroy(new Error("Feed excede o limite de tamanho permitido."));
          return;
        }
        chunks.push(chunk);
      });
      response.once("end", () => finish({ status, body: Buffer.concat(chunks).toString("utf8") }));
    });

    const timer = setTimeout(() => request.destroy(new Error("Timeout ao consultar o feed.")), timeoutMs);
    const finish = (result: { status: number; body: string; location?: string }) => {
      clearTimeout(timer);
      resolve(result);
    };
    request.once("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    request.end();
  });
}

export async function fetchPublicFeed(rawUrl: string, options: { maxBytes?: number; timeoutMs?: number } = {}): Promise<PublicFeedResponse> {
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  let url = validatePublicFeedUrl(rawUrl);
  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects += 1) {
    const pinnedAddress = await resolvePinnedPublicIpv4(url.hostname);
    const response = await requestPinned(url, pinnedAddress, maxBytes, timeoutMs);
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      if (!response.location || redirects === MAX_REDIRECTS) throw new Error("Feed excedeu o limite de redirecionamentos.");
      url = validatePublicFeedUrl(new URL(response.location, url).toString());
      continue;
    }
    if (response.status < 200 || response.status >= 300) throw new Error(`Fonte respondeu com HTTP ${response.status}.`);
    return { ...response, finalUrl: url.toString() };
  }
  throw new Error("Feed excedeu o limite de redirecionamentos.");
}