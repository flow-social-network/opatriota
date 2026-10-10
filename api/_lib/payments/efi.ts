/**
 * Efi Bank (antes Gerencianet) — Gateway de pagamento brasileiro.
 * Suporta: Pix (cobrança imediata e com vencimento), cartão de crédito, boleto.
 *
 * Documentação: https://dev.efipay.com.br/docs/api/
 *
 * Ambiente sandbox: https://sandbox.efipay.com.br/
 * Ambiente produção: https://api.efipay.com.br/
 */

const BASE_URLS = {
  sandbox: 'https://sandbox.efipay.com.br',
  production: 'https://api.efipay.com.br',
} as const;

interface EfiConfig {
  clientId: string;
  clientSecret: string;
  sandbox: boolean;
}

interface EfiTokenResponse {
  access_token: string;
  expires_in: number;
}

export interface PixChargeParams {
  /** Valor em reais (ex: 29.90) */
  valor: number;
  /** Identificador único do pedido no nosso sistema */
  orderId: string;
  /** Descrição exibida ao pagador */
  descricao?: string;
  /** CPF ou CNPJ do pagador (opcional) */
  pagador?: { nome: string; cpf: string; email?: string };
  /** Data de expiração da cobrança (formato: YYYY-MM-DD) */
  expiracao?: string;
}

export interface PixChargeResponse {
  /** ID da cobrança no Efi */
  efiChargeId: number;
  /** Código Pix copia-e-cola */
  brcode: string;
  /** URL da imagem QR Code */
  qrcodeUrl?: string;
  /** QR Code em base64 */
  qrcodeBase64?: string;
  /** Link de pagamento */
  link?: string;
}

let cachedToken: { value: string; expiresAt: number } | null = null;

function getConfig(): EfiConfig {
  const clientId = process.env.EFI_CLIENT_ID;
  const clientSecret = process.env.EFI_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('EFI_CLIENT_ID e EFI_CLIENT_SECRET devem estar definidos no .env');
  }
  return {
    clientId,
    clientSecret,
    sandbox: process.env.EFI_SANDBOX !== 'false',
  };
}

function getBaseUrl(): string {
  return getConfig().sandbox ? BASE_URLS.sandbox : BASE_URLS.production;
}

/**
 * Obtém token OAuth2 com cache em memória.
 * O token do Efi expira em ~1 hora; renovamos 5 min antes.
 */
export async function getEfiToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 5 * 60 * 1000) {
    return cachedToken.value;
  }

  const config = getConfig();
  const auth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');

  const response = await fetch(`${getBaseUrl()}/oauth/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'client_credentials',
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Efi OAuth failed (${response.status}): ${body}`);
  }

  const data: EfiTokenResponse = await response.json();
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return data.access_token;
}

/**
 * Cria uma cobrança Pix imediata.
 *
 * Uso:
 *   const charge = await createPixCharge({
 *     valor: 29.90,
 *     orderId: 'order_123',
 *     descricao: 'Assinatura O Patriota - Plano Digital',
 *   });
 */
export async function createPixCharge(params: PixChargeParams): Promise<PixChargeResponse> {
  const token = await getEfiToken();
  const config = getConfig();

  const body: Record<string, unknown> = {
    calendario: {
      expiracao: 3600, // 1 hora em segundos
    },
    valor: {
      original: params.valor.toFixed(2),
    },
    chave: process.env.EFI_PIX_KEY,
    infoAdicionais: [
      { nome: 'Pedido', valor: params.orderId },
    ],
  };

  if (params.descricao) {
    (body as any).infoAdicionais.push({ nome: 'Descrição', valor: params.descricao.slice(0, 200) });
  }

  if (params.pagador) {
    body.pagador = {
      nome: params.pagador.nome,
      cpf: params.pagador.cpf.replace(/\D/g, ''),
      ...(params.pagador.email ? { email: params.pagador.email } : {}),
    };
  }

  const endpoint = config.sandbox
    ? '/v2/cob'
    : '/v2/cob';

  const response = await fetch(`${getBaseUrl()}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => '');
    throw new Error(`Efi Pix charge failed (${response.status}): ${errBody}`);
  }

  const data = await response.json();

  // Gera o QR Code (copia-e-cola)
  const brcode = await generatePixBrcode(data.loc?.id);

  return {
    efiChargeId: data.loc?.id ?? data.revisao ?? 0,
    brcode: brcode ?? '',
    qrcodeBase64: data.qrcode?.imagem,
    link: data.links?.find((l: any) => l.rel === 'qrcode')?.href,
  };
}

/**
 * Gera o código Pix copia-e-cola a partir do ID da localização.
 */
async function generatePixBrcode(locationId?: number): Promise<string | undefined> {
  if (!locationId) return undefined;

  const token = await getEfiToken();
  const response = await fetch(
    `${getBaseUrl()}/v2/pix/qrcode/cobrancas/${locationId}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    },
  );

  if (!response.ok) return undefined;
  const data = await response.json();
  return data.qrcode?.copiaECola;
}

/**
 * Consulta uma cobrança Pix pelo ID.
 */
export async function getPixCharge(chargeId: number): Promise<any> {
  const token = await getEfiToken();
  const response = await fetch(`${getBaseUrl()}/v2/cob/${chargeId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Efi charge lookup failed (${response.status})`);
  }
  return response.json();
}

/**
 * Webhook: valida se o evento veio do Efi.
 * O Efi envia um header `x-webhook-signature` com HMAC-SHA256 do corpo.
 */
export function verifyEfiWebhookSignature(
  body: string | Buffer,
  signature: string,
  secret: string,
): boolean {
  if (!signature || !secret) return false;

  const crypto = require('crypto');
  const expected = crypto
    .createHmac('sha256', secret)
    .update(typeof body === 'string' ? body : body.toString())
    .digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

/**
 * Estado do pagamento retornado pelo webhook Efi.
 */
export function mapEfiPixStatus(status: string): 'approved' | 'waiting' | 'refunded' | 'expired' {
  switch (status) {
    case 'CONCLUIDA':
      return 'approved';
    case 'ATIVA':
      return 'waiting';
    case 'REMOVIDA_PELO_USUARIO_RECEBEDOR':
    case 'REMOVIDA_PELA_INSTITUICAO':
      return 'refunded';
    case 'EXPIRADA':
      return 'expired';
    default:
      return 'waiting';
  }
}
