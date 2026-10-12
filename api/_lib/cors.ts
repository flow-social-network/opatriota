import type { IncomingMessage, ServerResponse } from 'node:http';

const ALLOWED_ORIGINS = new Set([
  'https://www.opatriota.sbs',
  'https://opatriota.sbs',
  'https://opatriota.com.br',
  'https://www.opatriota.com.br',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
]);

export function handleCors(
  req: IncomingMessage & { headers: Record<string, string | string[] | undefined> },
  res: ServerResponse & { setHeader(name: string, value: string): void; statusCode: number; end(chunk?: any): void }
): boolean {
  const originHeader = req.headers['origin'];
  const origin = Array.isArray(originHeader) ? originHeader[0] : originHeader || '';

  let matchedOrigin = 'https://www.opatriota.sbs';

  if (origin) {
    if (ALLOWED_ORIGINS.has(origin)) {
      matchedOrigin = origin;
    } else {
      try {
        const url = new URL(origin);
        if (
          url.hostname.endsWith('.run.app') ||
          url.hostname.endsWith('.vercel.app') ||
          url.hostname === 'localhost' ||
          url.hostname === '127.0.0.1'
        ) {
          matchedOrigin = origin;
        }
      } catch {
        // Fallback to official domain
      }
    }
  }

  res.setHeader('Access-Control-Allow-Origin', matchedOrigin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With, X-Idempotency-Key, Cache-Control'
  );
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true; // handled
  }

  return false;
}
