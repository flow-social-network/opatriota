import type { IncomingMessage, ServerResponse } from 'node:http';
import { firestoreWrite, json, newId, readBody, validEmail } from './_lib/billing';

export default async function handler(req: IncomingMessage & { method?: string; headers: any; body?: any }, res: ServerResponse & { statusCode: number; setHeader(name: string, value: string): void; end(body?: string): void }) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'METHOD_NOT_ALLOWED', message: 'Método não permitido.' });
  }
  try {
    const body = await readBody(req);
    const name = String(body.name || '').trim().slice(0, 120);
    const email = String(body.email || '').trim().toLowerCase();
    const message = String(body.message || '').trim();
    const allowedSubjects = ['sugestao_pauta', 'correcao_materia', 'duvida_editorial', 'comercial', 'institucional'];
    if (name.length < 3 || !validEmail(email) || message.length < 15 || message.length > 10000 || !allowedSubjects.includes(body.subject)) {
      return json(res, 400, { error: 'INVALID_CONTACT_SUBMISSION', message: 'Confira nome, e-mail, assunto e mensagem.' });
    }
    const id = newId();
    const protocol = 'OP-' + id.replace(/-/g, '').slice(0, 10).toUpperCase();
    const submission = {
      id, protocol, name, email,
      phone: String(body.phone || '').trim().slice(0, 40) || null,
      subject: body.subject,
      articleRef: String(body.articleRef || '').trim().slice(0, 500) || null,
      message, status: 'recebido', createdAt: new Date().toISOString()
    };
    await firestoreWrite('contactSubmissions', id, submission, false);
    return json(res, 201, { id, protocol, status: 'recebido' });
  } catch (error) {
    console.error('contact submission failed:', error instanceof Error ? error.message : 'unknown error');
    return json(res, 500, { error: 'CONTACT_SUBMISSION_FAILED', message: 'Não foi possível registrar a mensagem. Tente novamente.' });
  }
}
