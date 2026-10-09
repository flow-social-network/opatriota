import { DEFAULT_VAPID_PUBLIC_KEY, FCM_PROJECT_ID } from '../src/services/webPushService';
import { DEFAULT_WEBPUSH_CONFIG } from '../src/services/siteConfigService';

console.log('========================================================================');
console.log('AUDITORIA E VALIDAÇÃO TÉCNICA DO MÓDULO WEB PUSH (FCM) — O PATRIOTA');
console.log('========================================================================\n');

let passCount = 0;
let totalCount = 0;

function assert(condition: boolean, message: string) {
  totalCount++;
  if (condition) {
    console.log(`[PASS] ${message}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${message}`);
  }
}

// 1. Validação do Certificado Push Web (VAPID Key)
console.log('1. VALIDAÇÃO DA CHAVE PÚBLICA VAPID & PROJETO FCM:');
const expectedVapid = 'BPA-ZMTWvVvRVhRaSqZiBvBOGl8vjYjtURNbJAbP0zZix6s8BkizVNqijXUxqrP27yLa0sdR9iSsvwqZM8dV2bg';
assert(DEFAULT_VAPID_PUBLIC_KEY === expectedVapid, 'Chave VAPID pública oficial configurada com exatidão');
assert(DEFAULT_VAPID_PUBLIC_KEY.length > 50, 'Comprimento da chave VAPID consistente com padrão ECDSA P-256');
assert(FCM_PROJECT_ID === 'o-patriota-5db52', 'ID do projeto Firebase FCM vinculado a o-patriota-5db52');
assert(DEFAULT_WEBPUSH_CONFIG.vapidPublicKey === expectedVapid, 'Configuração padrão do portal possui a chave VAPID oficial');
assert(DEFAULT_WEBPUSH_CONFIG.enabled === true, 'Módulo Web Push ativado por padrão no portal');

// 2. Validação dos tipos e estrutura de dados
console.log('\n2. VALIDAÇÃO DAS INTERFACES E CAMPOS DO SISTEMA:');
assert(typeof DEFAULT_WEBPUSH_CONFIG.welcomeTitle === 'string' && DEFAULT_WEBPUSH_CONFIG.welcomeTitle.length > 0, 'Título de boas-vindas do push definido');
assert(typeof DEFAULT_WEBPUSH_CONFIG.welcomeMessage === 'string' && DEFAULT_WEBPUSH_CONFIG.welcomeMessage.length > 0, 'Mensagem de boas-vindas do push definida');
assert(DEFAULT_WEBPUSH_CONFIG.projectId === 'o-patriota-5db52', 'Project ID coincide com a conta de serviço do Firebase');

console.log('\n========================================================================');
console.log(`RESULTADO DA AUDITORIA WEB PUSH: ${passCount}/${totalCount} testes aprovados.`);
console.log('========================================================================');

if (passCount !== totalCount) {
  process.exit(1);
}
