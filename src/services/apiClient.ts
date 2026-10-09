/**
 * Cliente HTTP único do frontend O PATRIOTA.
 * O frontend nunca deve simular persistência: falhas da API são devolvidas ao chamador.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

type TokenProvider = () => Promise<string | null>;

let tokenProvider: TokenProvider = async () => null;

const configuredBaseUrl = String(import.meta.env.VITE_API_BASE_URL || '').trim();
export const API_BASE_URL = configuredBaseUrl.replace(/\/$/, '');

export function setApiTokenProvider(provider: TokenProvider) {
  tokenProvider = provider;
}

export function isApiConfigured() {
  return Boolean(API_BASE_URL);
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  auth?: boolean;
  timeoutMs?: number;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new ApiError('A API não está configurada. Defina VITE_API_BASE_URL.', 0, 'API_NOT_CONFIGURED');
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? 15000;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');

  let body: BodyInit | undefined;
  if (options.body !== undefined) {
    if (options.body instanceof FormData || options.body instanceof Blob || typeof options.body === 'string') {
      body = options.body as BodyInit;
    } else {
      headers.set('Content-Type', 'application/json');
      body = JSON.stringify(options.body);
    }
  }

  if (options.auth !== false) {
    const token = await tokenProvider();
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${normalizedPath}`, {
      ...options,
      headers,
      body,
      signal: options.signal ?? controller.signal,
    });
    if (response.status === 204) {
      if (!response.ok) throw new ApiError('A API recusou o pedido.', response.status);
      return undefined as T;
    }

    const contentType = response.headers.get('content-type') || '';
    const payload: unknown = contentType.includes('application/json')
      ? await response.json().catch(() => null)
      : await response.text().catch(() => '');

    if (!response.ok) {
      const record = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {};
      throw new ApiError(
        typeof record.message === 'string' ? record.message : `Falha na API (HTTP ${response.status}).`,
        response.status,
        typeof record.error === 'string' ? record.error : undefined,
        payload,
      );
    }

    return payload as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('O pedido expirou ou foi cancelado.', 408, 'REQUEST_TIMEOUT');
    }
    throw new ApiError('Não foi possível contactar a API. Verifique a ligação e tente novamente.', 0, 'NETWORK_ERROR', error);
  } finally {
    clearTimeout(timeout);
  }
}

export const api = {
  get: <T>(path: string, options: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    apiRequest<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    apiRequest<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    apiRequest<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, options: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    apiRequest<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    apiRequest<T>(path, { ...options, method: 'DELETE' }),
};
