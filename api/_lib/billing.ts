import { createSign, randomUUID, timingSafeEqual } from 'node:crypto';

export type PlanId = 'gratuito' | 'digital' | 'premium';
export type BillingCycle = 'monthly' | 'annual';
export const CATALOG: Record<PlanId, { name: string; monthly: number; annual: number; accessLevel: string }> = {
  gratuito: { name: 'Acesso Livre', monthly: 0, annual: 0, accessLevel: 'aberto' },
  digital: { name: 'Digital Mensal Completa', monthly: 6.5, annual: 78, accessLevel: 'assinante' },
  premium: { name: 'CP Digital Anual Econômico', monthly: 5.24, annual: 62.9, accessLevel: 'premium' },
};
export const json = (res: any, status: number, body: unknown) => { res.statusCode = status; res.setHeader('Content-Type','application/json; charset=utf-8'); res.setHeader('Cache-Control','no-store'); res.end(JSON.stringify(body)); };
export async function readBody(req: any): Promise<any> {
  if (req.body && typeof req.body === 'object') return req.body;
  let raw = ''; for await (const chunk of req) { raw += chunk; if (raw.length > 32_000) throw new Error('BODY_TOO_LARGE'); }
  return raw ? JSON.parse(raw) : {};
}
export function validEmail(value: unknown): value is string { return typeof value === 'string' && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
export function serviceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not configured');
  const account = JSON.parse(raw);
  if (!account.client_email || !account.private_key || !account.project_id) throw new Error('Invalid Firebase service account JSON');
  return account;
}
export async function googleAccessToken(): Promise<string> {
  const account = serviceAccount();
  const now = Math.floor(Date.now()/1000);
  const enc = (v: unknown) => Buffer.from(JSON.stringify(v)).toString('base64url');
  const unsigned = enc({alg:'RS256',typ:'JWT'})+'.'+enc({iss:account.client_email,scope:'https://www.googleapis.com/auth/datastore',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600});
  const signer = createSign('RSA-SHA256'); signer.update(unsigned); signer.end();
  const assertion = unsigned+'.'+signer.sign(account.private_key).toString('base64url');
  const response = await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion})});
  const data:any = await response.json();
  if (!response.ok || !data.access_token) throw new Error('Firebase service token request failed');
  return data.access_token;
}
export async function firestoreWrite(collection: string, documentId: string, fields: Record<string, unknown>, _merge = true) {
 const account=serviceAccount(); const token=await googleAccessToken();
 const encode=(v:unknown):any=>v===null?{nullValue:null}:typeof v==='string'?{stringValue:v}:typeof v==='boolean'?{booleanValue:v}:typeof v==='number'?{doubleValue:v}:Array.isArray(v)?{arrayValue:{values:v.map(encode)}}:{mapValue:{fields:Object.fromEntries(Object.entries(v as object).map(([k,val])=>[k,encode(val)]))}};
 const base='https://firestore.googleapis.com/v1/projects/'+account.project_id+'/databases/(default)/documents';
 const encodedFields=Object.fromEntries(Object.entries(fields).map(([k,v])=>[k,encode(v)]));
 const query=Object.keys(fields).map(key=>'updateMask.fieldPaths='+encodeURIComponent(key)).join('&');
 const headers={Authorization:'Bearer '+token,'Content-Type':'application/json'};
 const patch=await fetch(base+'/'+collection+'/'+encodeURIComponent(documentId)+'?'+query,{method:'PATCH',headers,body:JSON.stringify({fields:encodedFields})});
 if(patch.ok)return;
 if(patch.status===404){
  const create=await fetch(base+'/'+collection+'?documentId='+encodeURIComponent(documentId),{method:'POST',headers,body:JSON.stringify({fields:encodedFields})});
  if(create.ok)return;
  throw new Error('Firestore create failed: '+create.status+' '+(await create.text()).slice(0,300));
 }
 throw new Error('Firestore update failed: '+patch.status+' '+(await patch.text()).slice(0,300));
}
export async function firestoreGet(collection: string, documentId: string): Promise<any|null> {
  const account = serviceAccount(); const token = await googleAccessToken();
  const response = await fetch('https://firestore.googleapis.com/v1/projects/'+account.project_id+'/databases/(default)/documents/'+collection+'/'+encodeURIComponent(documentId),{headers:{Authorization:'Bearer '+token}});
  if (response.status===404) return null;
  if(!response.ok) throw new Error('Firestore read failed: '+response.status);
  const doc:any=await response.json();
  const decode=(v:any):any=>v.stringValue!==undefined?v.stringValue:v.booleanValue!==undefined?v.booleanValue:v.integerValue!==undefined?Number(v.integerValue):v.doubleValue!==undefined?v.doubleValue:v.nullValue===null?null:v.mapValue?Object.fromEntries(Object.entries(v.mapValue.fields||{}).map(([k,val])=>[k,decode(val)])):v.arrayValue?(v.arrayValue.values||[]).map(decode):null;
  return {id:doc.name.split('/').pop(),...Object.fromEntries(Object.entries(doc.fields||{}).map(([k,v])=>[k,decode(v)]))};
}
export async function verifyFirebaseIdToken(idToken: string): Promise<any> {
  const apiKey = process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_WEB_API_KEY;
  if(!apiKey) throw new Error('FIREBASE_WEB_API_KEY is not configured');
  const response=await fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key='+encodeURIComponent(apiKey),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({idToken})});
  const data:any=await response.json();
  if(!response.ok || !data.users?.[0]) throw new Error('Invalid Firebase ID token');
  return data.users[0];
}
export async function mpRequest(path:string, init:RequestInit = {}) {
  const token=process.env.MERCADOPAGO_ACCESS_TOKEN;
  if(!token) throw new Error('MERCADOPAGO_ACCESS_TOKEN is not configured');
  return fetch('https://api.mercadopago.com'+path,{...init,headers:{Authorization:'Bearer '+token,'Content-Type':'application/json',...(init.headers||{})}});
}
export function constantTimeHexEqual(a:string,b:string) {
  try {const aa=Buffer.from(a,'hex'),bb=Buffer.from(b,'hex');return aa.length===bb.length&&timingSafeEqual(aa,bb);}catch{return false;}
}
export const newId=()=>randomUUID();
