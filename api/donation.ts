import type { IncomingMessage, ServerResponse } from 'node:http';
import { json, mpRequest, newId, readBody, validEmail } from './_lib/billing';
import { documentWrite } from './_lib/storage';

export default async function handler(req: IncomingMessage & { method?:string; headers:any; body?:any },res:ServerResponse & {statusCode:number;setHeader(name:string,value:string):void;end(body?:string):void}) {
 if(req.method!=='POST'){res.setHeader('Allow','POST');return json(res,405,{error:'METHOD_NOT_ALLOWED'});}
 try {
  const body=await readBody(req);
  const amount=Number(body.amount);
  if(!Number.isFinite(amount)||amount<5||amount>10000||Math.round(amount*100)!==amount*100) return json(res,400,{error:'INVALID_AMOUNT',message:'A contribuição deve ser de R$ 5,00 a R$ 10.000,00.'});
  const donorName=String(body.donorName||'').trim().slice(0,120);
  const donorEmail=String(body.donorEmail||'').trim().toLowerCase();
  const message=String(body.message||'').trim();
  if(donorEmail&&!validEmail(donorEmail)) return json(res,400,{error:'INVALID_EMAIL',message:'Informe um e-mail válido.'});
  if(message.length>500) return json(res,400,{error:'MESSAGE_TOO_LONG',message:'A mensagem pode ter no máximo 500 caracteres.'});
  const configuredSiteUrl=process.env.PUBLIC_SITE_URL||(process.env.VERCEL_URL?'https://'+process.env.VERCEL_URL:'');
  if(!configuredSiteUrl||!configuredSiteUrl.startsWith('https://')) return json(res,503,{error:'PUBLIC_SITE_URL_NOT_CONFIGURED',message:'Configure a URL HTTPS pública do jornal.'});
  const siteUrl=configuredSiteUrl.replace(/\/$/,'');
  const donationId=newId();
  const donation={donationId,donorName:donorName||'Doador não identificado',donorEmail:donorEmail||null,amount:Number(amount.toFixed(2)),currency:'BRL',status:'pending',message:message||null,messageModerationStatus:message?'pending_review':'not_provided',createdAt:new Date().toISOString(),provider:'mercadopago'};
    await documentWrite('donations',donationId,donation,false);
  const preference:any={
   items:[{id:'donation-'+donationId,title:'Contribuição voluntária — O Patriota',quantity:1,currency_id:'BRL',unit_price:Number(amount.toFixed(2))}],
   external_reference:'donation:'+donationId,
   notification_url:siteUrl+'/api/webhooks/mercadopago',
   back_urls:{success:siteUrl+'/?donation=success&id='+encodeURIComponent(donationId),pending:siteUrl+'/?donation=pending&id='+encodeURIComponent(donationId),failure:siteUrl+'/?donation=failure&id='+encodeURIComponent(donationId)},
   auto_return:'approved',
   statement_descriptor:'O PATRIOTA',
   metadata:{donation_id:donationId,type:'donation',message_provided:Boolean(message)}
  };
  if(donorEmail) preference.payer={email:donorEmail,name:donorName||undefined};
  const response=await mpRequest('/checkout/preferences',{method:'POST',headers:{'X-Idempotency-Key':donationId},body:JSON.stringify(preference)});
  const data:any=await response.json();
    if(!response.ok||!data.init_point){await documentWrite('donations',donationId,{status:'checkout_creation_failed',updatedAt:new Date().toISOString()});return json(res,502,{error:'PAYMENT_PROVIDER_ERROR',message:'Não foi possível iniciar a contribuição. Tente novamente.'});}
    await documentWrite('donations',donationId,{preferenceId:String(data.id),checkoutUrl:data.init_point,updatedAt:new Date().toISOString()});
  return json(res,201,{donationId,checkoutUrl:process.env.MERCADOPAGO_ACCESS_TOKEN?.startsWith('TEST-')?(data.sandbox_init_point||data.init_point):data.init_point,amount:Number(amount.toFixed(2)),currency:'BRL',status:'pending'});
 } catch(error:any) {
  const message=String(error?.message||'');
  if(message.includes('not configured')) return json(res,503,{error:'DONATION_NOT_CONFIGURED',message:'O serviço de doações ainda precisa de configuração no ambiente.'});
  console.error('donation.create failed:',message);
  return json(res,500,{error:'DONATION_CREATION_FAILED',message:'Não foi possível criar a contribuição.'});
 }
}
