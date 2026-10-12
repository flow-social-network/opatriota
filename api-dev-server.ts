/**
 * Servidor API local para desenvolvimento.
 * Empacota handlers estilo Vercel em um servidor Node simples.
 *
 * Uso: pnpm exec tsx api-dev-server.ts
 */
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '.env');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
    }
  }
}

const PORT = Number(process.env.API_PORT || 3010);
type Handler = (req: any, res: any) => void | Promise<void>;
const handlerCache = new Map<string, Handler>();

async function loadHandler(name: string): Promise<Handler | null> {
  if (handlerCache.has(name)) return handlerCache.get(name)!;
  const candidates = [
    resolve(__dirname, 'api', `${name}.ts`),
    resolve(__dirname, 'api', name, 'index.ts'),
  ];
  for (const file of candidates) {
    if (!existsSync(file)) continue;
    try {
      const mod = await import(/* @vite-ignore */ file);
      const handler = mod.default;
      if (typeof handler === 'function') {
        handlerCache.set(name, handler);
        return handler;
      }
    } catch (err) {
      console.error(`Failed to load handler ${name}:`, err);
    }
  }
  return null;
}

function parseBody(req: any): Promise<unknown> {
  return new Promise((resolvePromise, rejectPromise) => {
    if (req.method === 'GET' || req.method === 'DELETE') {
      resolvePromise(undefined);
      return;
    }
    const chunks: Buffer[] = [];
    let totalBytes = 0;
    let tooLarge = false;
    req.on('data', (chunk: Buffer | string) => {
      if (tooLarge) return;
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      totalBytes += buffer.length;
      if (totalBytes > 1_000_000) {
        tooLarge = true;
        chunks.length = 0;
        return;
      }
      chunks.push(buffer);
    });
    req.on('end', () => {
      if (tooLarge) return rejectPromise(new Error('REQUEST_BODY_TOO_LARGE'));
      const raw = Buffer.concat(chunks).toString('utf-8');
      if (!raw) return resolvePromise(undefined);
      try {
        resolvePromise(JSON.parse(raw));
      } catch {
        rejectPromise(new Error('INVALID_JSON_BODY'));
      }
    });
    req.on('error', rejectPromise);
  });
}

async function main() {
  const catchAll = await loadHandler('[...path]');
  const plans = await loadHandler('plans');
  const checkout = await loadHandler('checkout');
  const donation = await loadHandler('donation');
  const contact = await loadHandler('contact-submissions');
  const privacy = await loadHandler('privacy-requests');
  const webhookMp = await loadHandler('webhooks/mercadopago');

  // Handlers dedicados devem ser usados também no servidor local, com as
  // mesmas regras de autorização e acesso do ambiente Vercel.
  const articles = await loadHandler('articles');
  const articleDetail = await loadHandler('articles/[id]');
  const pages = await loadHandler('pages');
  const pageDetail = await loadHandler('pages/[id]');

  console.log('Loaded handlers:', {
    catchAll: !!catchAll, plans: !!plans, checkout: !!checkout, donation: !!donation,
    contact: !!contact, privacy: !!privacy, webhookMp: !!webhookMp,
    articles: !!articles, articleDetail: !!articleDetail, pages: !!pages, pageDetail: !!pageDetail,
  });

  const server = createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.end();
      return;
    }

    const url = new URL(req.url || '/', `http://localhost:${PORT}`);
    const pathname = url.pathname.replace(/\/$/, '') || '/';

    try {
      (req as any).body = await parseBody(req);
    } catch (error) {
      const code = String((error as Error)?.message || '');
      res.statusCode = code === 'REQUEST_BODY_TOO_LARGE' ? 413 : 400;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ error: code === 'REQUEST_BODY_TOO_LARGE' ? code : 'INVALID_JSON_BODY' }));
      return;
    }

    // Vercel preenche req.query automaticamente; o servidor local precisa fazê-lo.
    (req as any).query = Object.fromEntries(url.searchParams.entries());

    try {
      if (pathname === '/api/plans' && plans) return await plans(req, res);
      if (pathname === '/api/checkout' && checkout) return await checkout(req, res);
      if (pathname === '/api/donation' && donation) return await donation(req, res);
      if (pathname === '/api/contact-submissions' && contact) return await contact(req, res);
      if (pathname === '/api/privacy-requests' && privacy) return await privacy(req, res);
      if (pathname === '/api/webhooks/mercadopago' && webhookMp) return await webhookMp(req, res);

      if (pathname === '/api/articles' && articles) return await articles(req, res);
      const articleMatch = pathname.match(/^\/api\/articles\/([^/]+)$/);
      if (articleMatch && articleDetail) {
        try {
          (req as any).query.id = decodeURIComponent(articleMatch[1]);
        } catch {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ error: 'INVALID_ARTICLE_ID' }));
          return;
        }
        return await articleDetail(req, res);
      }

      if (pathname === '/api/pages' && pages) return await pages(req, res);
      const pageMatch = pathname.match(/^\/api\/pages\/([^/]+)$/);
      if (pageMatch && pageDetail) {
        try {
          (req as any).query.id = decodeURIComponent(pageMatch[1]);
        } catch {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ error: 'INVALID_PAGE_ID' }));
          return;
        }
        return await pageDetail(req, res);
      }

      if (catchAll) return await catchAll(req, res);
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ error: 'NOT_FOUND', message: `No handler for ${pathname}` }));
    } catch (err: any) {
      console.error(`API error [${pathname}]:`, err?.message || err);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({ error: 'INTERNAL_ERROR' }));
      }
    }
  });

  server.listen(PORT, () => console.log(`API dev server: http://localhost:${PORT}/api`));
}

main().catch((err) => {
  console.error('Failed to start API dev server:', err);
  process.exit(1);
});
