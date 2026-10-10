import type { IncomingMessage, ServerResponse } from 'node:http';
import { createHmac } from 'node:crypto';
import { constantTimeHexEqual, json, mpRequest } from '../_lib/billing';
import { documentGet, documentWrite } from '../_lib/storage';

function addBillingCycle(startValue: string | Date, cycle: unknown): string {
  const start = new Date(startValue);
  if (!Number.isFinite(start.getTime())) throw new Error('INVALID_SUBSCRIPTION_START_DATE');
  if (cycle === 'annual') {
    start.setUTCFullYear(start.getUTCFullYear() + 1);
  } else {
    const day = start.getUTCDate();
    start.setUTCDate(1);
    start.setUTCMonth(start.getUTCMonth() + 1);
    const lastDay = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0)).getUTCDate();
    start.setUTCDate(Math.min(day, lastDay));
  }
  return start.toISOString();
}

export default async function handler(req: IncomingMessage & { method?:string; headers:any; query?:Record<string,unknown>; body?:any; url?:string },res:ServerResponse & {statusCode:number;setHeader(name:string,value:string):void;end(body?:string):void}) {
  if(req.method!=='POST') {res.setHeader('Allow','POST');return json(res,405,{error:'METHOD_NOT_ALLOWED'});}
  try {
    const secret=process.env.MERCADOPAGO_WEBHOOK_SECRET;
    if(!secret) return json(res,503,{error:'WEBHOOK_NOT_CONFIGURED'});
    const url=new URL(req.url||'/api/webhooks/mercadopago','https://local.invalid');
    const paymentId=String((req.body as any)?.data?.id||url.searchParams.get('data.id')||url.searchParams.get('id')||'');
    const xSignature=String(req.headers['x-signature']||'');
    const xRequestId=String(req.headers['x-request-id']||'');
    const parts=Object.fromEntries(xSignature.split(',').map((p)=>p.trim().split('=').map(s=>s.trim())));
    const ts=parts.ts;const v1=parts.v1;
    if(!paymentId||!ts||!v1) return json(res,400,{error:'INVALID_SIGNATURE_HEADERS'});
    const manifest='id:'+paymentId+';request-id:'+xRequestId+';ts:'+ts+';';
    const expected=createHmac('sha256',secret).update(manifest).digest('hex');
    if(!constantTimeHexEqual(expected,v1)) return json(res,401,{error:'INVALID_SIGNATURE'});
    const paymentResponse=await mpRequest('/v1/payments/'+encodeURIComponent(paymentId));
    const payment:any=await paymentResponse.json();
    if(!paymentResponse.ok) return json(res,502,{error:'PAYMENT_LOOKUP_FAILED'});
    const externalReference=String(payment.external_reference||'');
    if(!externalReference) return json(res,200,{received:true,ignored:true});
    const nextStatus=payment.status==='approved'?'paid':payment.status==='rejected'?'rejected':payment.status==='cancelled'?'cancelled':payment.status==='refunded'?'refunded':'pending';
    if(externalReference.startsWith('donation:')) {
      const donationId=externalReference.slice('donation:'.length);
      const donation=await documentGet('donations',donationId);
      if(!donation) return json(res,404,{error:'DONATION_NOT_FOUND'});
      const approved=payment.status==='approved' && Number(payment.transaction_amount)===Number(donation.amount) && payment.currency_id==='BRL';
      const donationStatus=approved?'paid':nextStatus;
      await documentWrite('donations',donationId,{status:donationStatus,providerPaymentId:String(payment.id),providerStatus:String(payment.status||''),paymentMethodId:String(payment.payment_method_id||''),paidAt:approved?new Date().toISOString():null,updatedAt:new Date().toISOString()});
      return json(res,200,{received:true,type:'donation',status:donationStatus});
    }
    const orderId=externalReference;
    const order=await documentGet('checkoutOrders',orderId);
    if(!order) return json(res,404,{error:'ORDER_NOT_FOUND'});
    const approved=payment.status==='approved' && Number(payment.transaction_amount)===Number(order.amount) && payment.currency_id==='BRL';
    const orderStatus=approved?'paid':nextStatus;
    await documentWrite('checkoutOrders',orderId,{status:orderStatus,providerPaymentId:String(payment.id),providerStatus:String(payment.status||''),paymentMethodId:String(payment.payment_method_id||''),updatedAt:new Date().toISOString()});
    if (approved && order.uid) {
      const subscriptionId = String(order.uid);
      const existing = await documentGet('subscriptions', subscriptionId);
      const paymentKey = String(payment.id);
      const now = new Date();
      // Repeated notifications for the same payment must never extend a subscription.
      if (String(existing?.providerPaymentId || '') === paymentKey) {
        if (!existing?.validUntil) {
          const activatedAt = String(existing?.activatedAt || order.createdAt || now.toISOString());
          const validUntil = addBillingCycle(activatedAt, existing?.billingCycle || order.cycle);
          await documentWrite('subscriptions', subscriptionId, { validUntil, updatedAt: now.toISOString() });
        }
      } else {
        const existingExpiry = existing?.validUntil ? Date.parse(String(existing.validUntil)) : NaN;
        const baseDate = Number.isFinite(existingExpiry) && existingExpiry > now.getTime()
          ? new Date(existingExpiry)
          : now;
        const validUntil = addBillingCycle(baseDate, order.cycle);
        await documentWrite('subscriptions', subscriptionId, {
          uid: order.uid,
          orderId,
          planId: order.planId,
          planName: order.planName,
          billingCycle: order.cycle,
          status: 'active',
          amount: order.amount,
          currency: 'BRL',
          provider: 'mercadopago',
          providerPaymentId: paymentKey,
          activatedAt: now.toISOString(),
          validUntil,
          updatedAt: now.toISOString(),
        });
      }
    }
    return json(res,200,{received:true,status:orderStatus});
  } catch(error:any) {
    console.error('mercadopago.webhook failed:',String(error?.message||error));
    return json(res,500,{error:'WEBHOOK_PROCESSING_FAILED'});
  }
}
