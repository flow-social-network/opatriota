import { api } from './apiClient';

export type PortalEventType = 'page_view' | 'session_start' | 'auth_login' | 'signup_completed' | 'subscription_started' | 'unauthorized_access';

function getSessionKey() {
  const key = 'opatriota.analytics.session';
  try {
    const current = sessionStorage.getItem(key);
    if (current) return current;
    const created = crypto.randomUUID();
    sessionStorage.setItem(key, created);
    return created;
  } catch {
    return `session-${Date.now()}`;
  }
}

export async function trackPortalEvent(eventType: PortalEventType, pagePath: string, extra: Record<string, unknown> = {}) {
  const deduplicationKey = `${eventType}:${getSessionKey()}:${pagePath}`;
  try {
    await api.post('/analytics/events', { eventType, pagePath, sessionKey: getSessionKey(), deduplicationKey, pageTitle: document.title, referrerHost: document.referrer ? new URL(document.referrer).hostname : '', ...extra }, { auth: false, timeoutMs: 5000 });
  } catch {
    // Analytics never blocks navigation or the public experience.
  }
}
