import type { IncomingMessage, ServerResponse } from 'node:http';
import { createHmac } from 'node:crypto';
import { constantTimeHexEqual, firestoreGet, firestoreWrite, json, mpRequest } from '../_lib/billing';

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
    const orderId=String(payment.external_reference||'');
    if(!orderId) return json(res,200,{received:true,ignored:true});
    const order=await firestoreGet('checkoutOrders',orderId);
    if(!order) return json(res,404,{error:'ORDER_NOT_FOUND'});
    const approved=payment.status==='approved' && Number(payment.transaction_amount)===Number(order.amount) && payment.currency_id==='BRL';
    const nextStatus=approved?'paid':payment.status==='rejected'?'rejected':payment.status==='cancelled'?'cancelled':payment.status==='refunded'?'refunded':'pending';
    // Idempotent status reconciliation; subscription entitlement is a separate, explicit record.
    await firestoreWrite('checkoutOrders',orderId,{status:nextStatus,providerPaymentId:String(payment.id),providerStatus:String(payment.status||''),paymentMethodId:String(payment.payment_method_id||''),updatedAt:new Date().toISOString()});
    if(approved && order.uid) {
      const subscriptionId=String(order.uid);
      await firestoreWrite('subscriptions',subscriptionId,{uid:order.uid,orderId,planId:order.planId,planName:order.planName,billingCycle:order.cycle,status:'active',amount:order.amount,currency:'BRL',provider:'mercadopago',providerPaymentId:String(payment.id),activatedAt:new Date().toISOString()});
    }
    return json(res,200,{received:true,status:nextStatus});
  } catch(error:any) {
    console.error('mercadopago.webhook failed:',String(error?.message||error));
    return json(res,500,{error:'WEBHOOK_PROCESSING_FAILED'});
  }
}
