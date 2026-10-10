// ─── Índice dos Contratos Compartilhados ───
// Frontend e backend importam APENAS deste pacote para tipos compartilhados.

export * from './auth';
export * from './articles';
export * from './finance';

// ─── Push & Notificações ───

export interface PushSubscriber {
  id: string;
  token: string;
  subscribedAt: string;
  userAgent?: string;
  deviceType?: 'desktop' | 'mobile' | 'tablet';
  active: boolean;
}

export interface PushNotificationCampaign {
  id: string;
  title: string;
  body: string;
  url: string;
  icon?: string;
  sentAt: string;
  recipientCount: number;
  status: 'enviado' | 'rascunho' | 'falha';
  sentCount?: number;
  failedCount?: number;
}

// ─── Newsletter ───

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  subscribedAt: string;
  source: string;
  consentLgpd: boolean;
}

// ─── Health ───

export interface HealthResponse {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  version: string;
  checks: Record<string, { status: 'ok' | 'error'; message?: string }>;
}
