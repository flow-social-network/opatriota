/**
 * O PATRIOTA BRASIL — Configuração Oficial de Domínio e URLs Canônicas
 * Domínio oficial atualizado: https://www.opatriota.sbs/
 */

export const CANONICAL_DOMAIN = 'www.opatriota.sbs';
export const APEX_DOMAIN = 'opatriota.sbs';
export const CANONICAL_ORIGIN = `https://${CANONICAL_DOMAIN}`;

export const OFFICIAL_DOMAINS = [
  CANONICAL_DOMAIN,
  APEX_DOMAIN,
] as const;

export const LEGACY_DOMAINS = [
  'opatriota.com.br',
  'www.opatriota.com.br',
] as const;

export const AUTHORIZED_AUTH_DOMAINS = [
  CANONICAL_DOMAIN,
  APEX_DOMAIN,
  'o-patriota-5db52.firebaseapp.com',
  'o-patriota-5db52.web.app',
  'localhost',
  '127.0.0.1',
] as const;

/**
 * Retorna a URL canônica absoluta formatada para indexação e OpenGraph.
 */
export function getCanonicalUrl(pathname: string = '/'): string {
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${CANONICAL_ORIGIN}${cleanPath}`;
}

/**
 * Converte caminhos relativos de imagens ou links para URLs absolutas no domínio oficial.
 */
export function toAbsoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return CANONICAL_ORIGIN;
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }
  const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${CANONICAL_ORIGIN}${cleanPath}`;
}

/**
 * Verifica se um hostname pertence aos domínios oficiais ou de desenvolvimento permitidos.
 */
export function isAllowedOrigin(originOrHost: string): boolean {
  try {
    const host = originOrHost.includes('://') 
      ? new URL(originOrHost).host 
      : originOrHost.split(':')[0];
      
    if (OFFICIAL_DOMAINS.includes(host as any)) return true;
    if (LEGACY_DOMAINS.includes(host as any)) return true;
    if (host === 'localhost' || host === '127.0.0.1') return true;
    if (host.endsWith('.run.app') || host.endsWith('.vercel.app')) return true;
    return false;
  } catch {
    return false;
  }
}
