/**
 * Cliente HTTP único do frontend O PATRIOTA.
 * O frontend não simula persistência: falhas da API são devolvidas ao chamador.
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
export const API_BASE_URL = configuredBaseUrl.replace(/\/+$/, '');

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
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');

  let body: BodyInit | undefined;
  if (options.body !== undefined) {
    if (
      (typeof FormData !== 'undefined' && options.body instanceof FormData) ||
      (typeof Blob !== 'undefined' && options.body instanceof Blob) ||
      typeof options.body === 'string'
    ) {
      body = options.body as BodyInit;
    } else {
      headers.set('Content-Type', 'application/json');
      body = JSON.stringify(options.body);
    }
  }

  const abortFromCaller = () => controller.abort(options.signal?.reason);
  if (options.signal?.aborted) abortFromCaller();
  else options.signal?.addEventListener('abort', abortFromCaller, { once: true });

  const timeout = setTimeout(() => controller.abort(new DOMException('Request timed out', 'TimeoutError')), timeoutMs);

  try {
    if (options.auth !== false) {
      const token = await tokenProvider();
      if (token) headers.set('Authorization', `Bearer ${token}`);
      else headers.delete('Authorization');
    } else {
      headers.delete('Authorization');
    }

    const { auth: _auth, timeoutMs: _timeoutMs, signal: _signal, ...requestInit } = options;
    const response = await fetch(`${API_BASE_URL}${normalizedPath}`, {
      ...requestInit,
      headers,
      body,
      signal: controller.signal,
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
    if (controller.signal.aborted) {
      const timedOut = controller.signal.reason instanceof DOMException &&
        (controller.signal.reason.name === 'TimeoutError' || controller.signal.reason.name === 'AbortError') &&
        !options.signal?.aborted;
      if (timedOut) throw new ApiError('O pedido expirou. Tente novamente.', 408, 'REQUEST_TIMEOUT');
      throw new ApiError('O pedido foi cancelado.', 499, 'REQUEST_ABORTED');
    }
    throw new ApiError(
      'Não foi possível contactar a API. Verifique a ligação e tente novamente.',
      0,
      'NETWORK_ERROR',
      error,
    );
  } finally {
    clearTimeout(timeout);
    options.signal?.removeEventListener('abort', abortFromCaller);
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
