// ─── Financeiro e Pagamentos ───

export type PaymentProvider = 'efi' | 'mercadopago';

export type PaymentStatus =
  | 'pendente'
  | 'aprovado'
  | 'recusado'
  | 'cancelado'
  | 'reembolsado'
  | 'expirado';

export type PaymentMethod = 'pix' | 'credito' | 'boleto';

export interface CheckoutOrder {
  id: string;
  uid: string;
  planId: string;
  planName: string;
  cycle: 'monthly' | 'annual';
  amount: number;
  currency: 'BRL';
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  provider: PaymentProvider;
  providerPaymentId?: string;
  paymentUrl?: string;
  qrCode?: string;
  qrCodeBase64?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCheckoutRequest {
  planId: string;
  cycle: 'monthly' | 'annual';
  paymentMethod?: PaymentMethod;
}

export interface CreateCheckoutResponse {
  orderId: string;
  paymentUrl: string;
  qrCode?: string;
  qrCodeBase64?: string;
  expiresAt?: string;
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  planName: string;
  status: 'concluido' | 'processando' | 'reembolsado';
  invoiceNumber: string;
}

export interface SubscriptionPlan {
  id: 'gratuito' | 'digital' | 'premium';
  name: string;
  badge?: string;
  priceMonthly: number;
  priceAnnual: number;
  originalPriceMonthly?: number;
  originalPriceAnnual?: number;
  promoNotice?: string;
  loyaltyTerm?: string;
  description: string;
  benefits: string[];
  accessLevel: 'aberto' | 'assinante' | 'premium';
  isPopular?: boolean;
  bestValue?: boolean;
}

export interface WebhookEvent {
  provider: PaymentProvider;
  eventId: string;
  type: string;
  orderId?: string;
  paymentId: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
}
