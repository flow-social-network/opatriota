import type { IncomingMessage, ServerResponse } from 'node:http';
import { CATALOG, firestoreWrite, json, mpRequest, newId, readBody, validEmail, verifyFirebaseIdToken, type BillingCycle, type PlanId } from './_lib/billing';

export default async function handler(req: IncomingMessage & { method?: string; headers: any; body?: any }, res: ServerResponse & { statusCode: number; setHeader(name:string,value:string):void; end(body?:string):void }) {
  if (req.method !== 'POST') { res.setHeader('Allow','POST'); return json(res,405,{error:'METHOD_NOT_ALLOWED'}); }
  try {
    const body=await readBody(req);
    const planId=body.planId as PlanId; const cycle=body.cycle as BillingCycle;
    if(!Object.prototype.hasOwnProperty.call(CATALOG,planId) || !['monthly','annual'].includes(cycle)) return json(res,400,{error:'INVALID_PLAN'});
    const plan=CATALOG[planId]; const amount=cycle==='annual'?plan.annual:plan.monthly;
    const authHeader=String(req.headers.authorization||'');
    let user:any=null;
    if(authHeader.startsWith('Bearer ')) user=await verifyFirebaseIdToken(authHeader.slice(7));
    const email=String(user?.email||body.email||'').trim().toLowerCase();
    const name=String(user?.displayName||body.name||'').trim().slice(0,120);
    if(!validEmail(email) || !name) return json(res,400,{error:'CUSTOMER_DATA_REQUIRED',message:'Informe nome e e-mail válidos.'});
    if(amount<=0) return json(res,400,{error:'FREE_PLAN_NOT_PAYABLE',message:'O plano gratuito não deve gerar cobrança.'});
    if(!['pix','card'].includes(body.paymentMethod)) return json(res,400,{error:'INVALID_PAYMENT_METHOD'});
    const configuredSiteUrl = process.env.PUBLIC_SITE_URL || (process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : '');
    if (!configuredSiteUrl || !configuredSiteUrl.startsWith('https://')) return json(res,503,{error:'PUBLIC_SITE_URL_NOT_CONFIGURED',message:'Configure a URL HTTPS pública do jornal nas variáveis de ambiente.'});
    const siteUrl=configuredSiteUrl.replace(/\/$/,'');
    const orderId=newId();
    const order={orderId,uid:user?.localId||null,customerName:name,customerEmail:email,planId,planName:plan.name,cycle,amount,status:'pending',paymentProvider:'mercadopago',createdAt:new Date().toISOString(),paymentMethod:body.paymentMethod};
    await firestoreWrite('checkoutOrders',orderId,order,false);
    const preference:any={
      items:[{id:planId+'-'+cycle,title:'O PATRIOTA — '+plan.name+' ('+(cycle==='annual'?'anual':'mensal')+')',quantity:1,currency_id:'BRL',unit_price:amount}],
      payer:{name,email},
      external_reference:orderId,
      notification_url:siteUrl+'/api/webhooks/mercadopago',
      back_urls:{success:siteUrl+'/?checkout=success&order='+encodeURIComponent(orderId),pending:siteUrl+'/?checkout=pending&order='+encodeURIComponent(orderId),failure:siteUrl+'/?checkout=failure&order='+encodeURIComponent(orderId)},
      auto_return:'approved',
      statement_descriptor:'O PATRIOTA',
      payment_methods:{excluded_payment_types:body.paymentMethod==='pix'?[{id:'credit_card'},{id:'debit_card'},{id:'ticket'}]:[{id:'bank_transfer'},{id:'ticket'}]},
      metadata:{order_id:orderId,uid:user?.localId||'',plan_id:planId,billing_cycle:cycle,payment_method:body.paymentMethod}
    };
    const response=await mpRequest('/checkout/preferences',{method:'POST',headers:{'X-Idempotency-Key':orderId},body:JSON.stringify(preference)});
    const data:any=await response.json();
    if(!response.ok || !data.init_point) {
      await firestoreWrite('checkoutOrders',orderId,{status:'checkout_creation_failed',providerErrorStatus:response.status,updatedAt:new Date().toISOString()});
      return json(res,502,{error:'PAYMENT_PROVIDER_ERROR',message:'Não foi possível iniciar o pagamento. Tente novamente mais tarde.'});
    }
    await firestoreWrite('checkoutOrders',orderId,{preferenceId:data.id,checkoutUrl:data.init_point,sandboxCheckoutUrl:data.sandbox_init_point||null,updatedAt:new Date().toISOString()});
    return json(res,201,{orderId,checkoutUrl:process.env.MERCADOPAGO_ACCESS_TOKEN?.startsWith('TEST-')?(data.sandbox_init_point||data.init_point):data.init_point,amount,currency:'BRL',status:'pending'});
  } catch(error:any) {
    const message=String(error?.message||'');
    if(message.includes('not configured')) return json(res,503,{error:'BILLING_NOT_CONFIGURED',message:'O checkout precisa de configuração de credenciais no ambiente de produção.'});
    if(message.includes('Invalid Firebase ID token')) return json(res,401,{error:'UNAUTHENTICATED',message:'Sua sessão expirou. Entre novamente e tente de novo.'});
    console.error('checkout.create failed:',message);
    return json(res,500,{error:'CHECKOUT_FAILED',message:'Não foi possível criar o pedido.'});
  }
}
