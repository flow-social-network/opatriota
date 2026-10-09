import type { IncomingMessage, ServerResponse } from 'node:http';
import { CATALOG, json } from './_lib/billing';

export default function handler(req: IncomingMessage & { method?: string }, res: ServerResponse & { statusCode: number; setHeader(name: string, value: string): void; end(body?: string): void }) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return json(res, 405, { error: 'METHOD_NOT_ALLOWED', message: 'Método não permitido.' });
  }
  const plans = Object.entries(CATALOG).map(([id, plan]) => ({
    id,
    name: plan.name,
    description: id === 'gratuito' ? 'Acesso às notícias abertas.' : 'Acesso a conteúdos exclusivos para assinantes.',
    monthlyPrice: plan.monthly,
    annualPrice: plan.annual,
    currency: 'BRL',
    accessLevel: plan.accessLevel,
    features: [],
    active: true
  }));
  return json(res, 200, plans);
}
