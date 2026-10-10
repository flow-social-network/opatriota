import type { IncomingMessage, ServerResponse } from 'node:http';
import { json, newId, readBody, validEmail } from './_lib/billing';
import { documentWrite } from './_lib/storage';

export default async function handler(req: IncomingMessage & { method?: string; headers: any; body?: any }, res: ServerResponse & { statusCode: number; setHeader(name: string, value: string): void; end(body?: string): void }) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'METHOD_NOT_ALLOWED', message: 'Método não permitido.' });
  }
  try {
    const body = await readBody(req);
    const name = String(body.name || '').trim().slice(0, 120);
    const email = String(body.email || '').trim().toLowerCase();
    const details = String(body.details || '').trim();
    const allowedTypes = ['acesso', 'correcao', 'exclusao', 'revogacao_consentimento'];
    if (name.length < 3 || !validEmail(email) || details.length < 10 || details.length > 10000 || !allowedTypes.includes(body.requestType)) {
      return json(res, 400, { error: 'INVALID_PRIVACY_REQUEST', message: 'Confira os dados e o tipo da solicitação.' });
    }
    const id = newId();
    const protocol = 'LGPD-' + id.replace(/-/g, '').slice(0, 10).toUpperCase();
    const request = {
      id, protocol, name, email,
      documentId: String(body.documentId || '').replace(/[^0-9]/g, '').slice(0, 14) || null,
      requestType: body.requestType, details, status: 'recebido',
      createdAt: new Date().toISOString()
    };
    await documentWrite('privacyRequests', id, request, false);
    return json(res, 201, { id, protocol, status: 'recebido' });
  } catch (error) {
    console.error('privacy request failed:', error instanceof Error ? error.message : 'unknown error');
    return json(res, 500, { error: 'PRIVACY_REQUEST_FAILED', message: 'Não foi possível registrar a solicitação. Tente novamente.' });
  }
}
