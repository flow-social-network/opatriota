/**
 * Servidor API local para desenvolvimento.
 * Empacota os handlers estilo Vercel em um servidor Node simples.
 *
 * Uso: npx tsx api-dev-server.ts
 */
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Carrega .env manualmente (sem dependência externa)
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

// Cache de handlers carregados dinamicamente
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
  return new Promise((resolvePromise) => {
    if (req.method === 'GET' || req.method === 'DELETE') {
      resolvePromise(undefined);
      return;
    }
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => chunks.push(c));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf-8');
      if (!raw) return resolvePromise(undefined);
      try {
        resolvePromise(JSON.parse(raw));
      } catch {
        resolvePromise(raw);
      }
    });
    req.on('error', () => resolvePromise(undefined));
  });
}

async function main() {
  // Pré-carrega handlers
  const catchAll = await loadHandler('[...path]');
  const plans = await loadHandler('plans');
  const checkout = await loadHandler('checkout');
  const donation = await loadHandler('donation');
  const contact = await loadHandler('contact-submissions');
  const privacy = await loadHandler('privacy-requests');
  const webhookMp = await loadHandler('webhooks/mercadopago');

  console.log('Loaded handlers:', {
    catchAll: !!catchAll,
    plans: !!plans,
    checkout: !!checkout,
    donation: !!donation,
    contact: !!contact,
    privacy: !!privacy,
    webhookMp: !!webhookMp,
  });

  const server = createServer(async (req, res) => {
    // CORS para dev
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

    // Parse body
    (req as any).body = await parseBody(req);

    try {
      // Rotas específicas primeiro
      if (pathname === '/api/plans' && plans) {
        return await plans(req, res);
      }
      if (pathname === '/api/checkout' && checkout) {
        return await checkout(req, res);
      }
      if (pathname === '/api/donation' && donation) {
        return await donation(req, res);
      }
      if (pathname === '/api/contact-submissions' && contact) {
        return await contact(req, res);
      }
      if (pathname === '/api/privacy-requests' && privacy) {
        return await privacy(req, res);
      }
      if (pathname === '/api/webhooks/mercadopago' && webhookMp) {
        return await webhookMp(req, res);
      }

      // Catch-all
      if (catchAll) {
        // Ensure req.url includes /api prefix for the catch-all router
        return await catchAll(req, res);
      }

      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'NOT_FOUND', message: `No handler for ${pathname}` }));
    } catch (err: any) {
      console.error(`API error [${pathname}]:`, err?.message || err);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'INTERNAL_ERROR', message: err?.message || 'Internal error' }));
      }
    }
  });

  server.listen(PORT, () => {
    console.log(`✅ API dev server: http://localhost:${PORT}/api`);
  });
}

main().catch((err) => {
  console.error('Failed to start API dev server:', err);
  process.exit(1);
});
