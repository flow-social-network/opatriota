import express, { type Request, type Response } from "express";
import crypto from "node:crypto";

/**
 * Efí Cobranças integration.
 *
 * Required environment:
 * EFI_CLIENT_ID, EFI_CLIENT_SECRET, EFI_SANDBOX ("true" or "false"),
 * EFI_NOTIFICATION_URL, DATABASE_URL, APP_BASE_URL.
 *
 * This module deliberately never grants access from a browser redirect.
 * Only a verified Efí notification fetched from Efí's API can activate access.
 */
const router = express.Router();
const sandbox = process.env.EFI_SANDBOX !== "false";
const apiBase = sandbox
  ? "https://sandbox.gerencianet.com.br"
  : "https://api.gerencianet.com.br";

type EfíToken = { access_token: string; expires_in: number };
type EfíNotificationItem = {
  id: number;
  type: string;
  custom_id?: string | null;
  identifiers?: { charge_id?: number; subscription_id?: number };
  status?: { current?: string; previous?: string | null };
  value?: number;
};
type EfíNotification = { data?: EfíNotificationItem[] };
type PaymentPlan = { id: string; title: string; amountCents: number; currency: "BRL"; durationDays: number };

// These are examples; replace with database-backed plans before production.
const PLANS: Record<string, PaymentPlan> = {
  mensal: { id: "mensal", title: "Assinatura mensal O PATRIOTA", amountCents: 1990, currency: "BRL", durationDays: 30 },
  anual: { id: "anual", title: "Assinatura anual O PATRIOTA", amountCents: 19900, currency: "BRL", durationDays: 365 }
};

let cachedToken: { value: string; expiresAt: number } | undefined;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) return cachedToken.value;
  const clientId = process.env.EFI_CLIENT_ID;
  const clientSecret = process.env.EFI_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("Credenciais Efí ausentes.");
  const response = await fetch(`${apiBase}/v1/authorize`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ grant_type: "client_credentials" })
  });
  if (!response.ok) throw new Error(`Efí OAuth falhou: HTTP ${response.status}`);
  const token = await response.json() as EfíToken;
  cachedToken = { value: token.access_token, expiresAt: Date.now() + token.expires_in * 1000 };
  return token.access_token;
}

async function efiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await getAccessToken();
  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers || {})
    }
  });
  if (!response.ok) throw new Error(`Efí API falhou: HTTP ${response.status}`);
  return await response.json() as T;
}

/**
 * Adapter contract for persistence. Implement with PostgreSQL transactions:
 * - create pending order + user/plan association before contacting Efí;
 * - uniquely constrain charge_id and processed notification IDs;
 * - store provider event and entitlement changes atomically.
 */
export interface SubscriptionStore {
  createPending(input: { orderId: string; userId: string; plan: PaymentPlan }): Promise<void>;
  attachCharge(input: { orderId: string; chargeId: number; paymentUrl: string }): Promise<void>;
  findByChargeId(chargeId: number): Promise<{ orderId: string; userId: string; planId: string } | null>;
  applyProviderEvent(input: {
    eventKey: string;
    orderId: string;
    providerStatus: string;
    action: "activate" | "revoke" | "pending" | "ignore";
  }): Promise<"applied" | "duplicate">;
}
let store: SubscriptionStore | undefined;
export function configureSubscriptionStore(value: SubscriptionStore) { store = value; }

router.post("/checkout", express.json(), async (req: Request, res: Response) => {
  try {
    if (!store) return res.status(503).json({ error: "subscription_store_not_configured" });
    // userId must come from verified server-side authentication, never from arbitrary client input.
    const userId = String((req as Request & { user?: { id?: string } }).user?.id || "");
    if (!userId) return res.status(401).json({ error: "authentication_required" });
    const plan = PLANS[String(req.body?.planId || "")];
    if (!plan) return res.status(400).json({ error: "invalid_plan" });
    const email = String((req as Request & { user?: { email?: string } }).user?.email || "");
    if (!email) return res.status(400).json({ error: "account_email_required" });

    const orderId = crypto.randomUUID();
    await store.createPending({ orderId, userId, plan });
    const result = await efiRequest<{
      data: { charge_id: number; status: string; payment_url: string; total: number; custom_id?: string };
    }>("/v1/charge/one-step/link", {
      method: "POST",
      body: JSON.stringify({
        items: [{ name: plan.title, value: plan.amountCents, amount: 1 }],
        metadata: {
          custom_id: orderId,
          notification_url: process.env.EFI_NOTIFICATION_URL
        },
        customer: { email },
        settings: { payment_method: "all" }
      })
    });
    if (!result.data?.charge_id || !result.data?.payment_url || result.data.total !== plan.amountCents) {
      throw new Error("Resposta inesperada da Efí ao criar cobrança.");
    }
    await store.attachCharge({ orderId, chargeId: result.data.charge_id, paymentUrl: result.data.payment_url });
    return res.status(201).json({ data: { orderId, paymentUrl: result.data.payment_url, status: "pending" } });
  } catch (error) {
    console.error("efi_checkout_failed", error instanceof Error ? error.message : "unknown");
    return res.status(502).json({ error: "payment_provider_unavailable" });
  }
});

/**
 * Efí posts a notification token. We fetch the actual event history from Efí;
 * never trust status/value/user IDs sent by a browser or raw callback body.
 */
router.post("/webhook", express.urlencoded({ extended: false }), express.json(), async (req: Request, res: Response) => {
  try {
    if (!store) return res.status(503).send("Store unavailable");
    const notificationToken = String(req.body?.notification || "");
    if (!notificationToken || notificationToken.length > 512) return res.status(400).send("Invalid notification");
    const notification = await efiRequest<EfíNotification>(
      `/v1/notification/${encodeURIComponent(notificationToken)}`,
      { method: "GET" }
    );
    const events = Array.isArray(notification.data) ? notification.data : [];
    for (const event of events) {
      const chargeId = event.identifiers?.charge_id;
      if (!chargeId) continue;
      const order = await store.findByChargeId(chargeId);
      if (!order) continue;
      const status = String(event.status?.current || "").toLowerCase();
      let action: "activate" | "revoke" | "pending" | "ignore" = "ignore";
      if (status === "paid") action = "activate";
      else if (["refunded", "refund", "chargeback", "contested", "canceled"].includes(status)) action = "revoke";
      else if (["new", "link", "waiting", "unpaid"].includes(status)) action = "pending";
      await store.applyProviderEvent({
        eventKey: `efi:${chargeId}:${event.id}`,
        orderId: order.orderId,
        providerStatus: status,
        action
      });
    }
    return res.status(200).send("OK");
  } catch (error) {
    // Non-2xx causes Efí to retry; log safely, never log tokens or credentials.
    console.error("efi_webhook_failed", error instanceof Error ? error.message : "unknown");
    return res.status(503).send("Retry");
  }
});

export default router;
