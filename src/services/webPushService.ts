import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

const firebaseApp = getApps().length ? getApp() : initializeApp({
  apiKey: 'AIzaSyAM7XqRKi2DWNvEpwZZTg99QGgq75_FWgc',
  authDomain: 'o-patriota-5db52.firebaseapp.com',
  projectId: 'o-patriota-5db52',
  storageBucket: 'o-patriota-5db52.firebasestorage.app',
  messagingSenderId: '144044011965',
  appId: '1:144044011965:web:6da58292d47845e931e2d4'
});
import { PushSubscriber, PushNotificationCampaign } from '../types';

// VAPID Web Push Public Key provided for O Patriota
export const DEFAULT_VAPID_PUBLIC_KEY = 'BPA-ZMTWvVvRVhRaSqZiBvBOGl8vjYjtURNbJAbP0zZix6s8BkizVNqijXUxqrP27yLa0sdR9iSsvwqZM8dV2bg';
export const FCM_PROJECT_ID = 'o-patriota-5db52';

const LOCAL_PUSH_TOKEN_KEY = 'o_patriota_push_token_v1';
const LOCAL_PUSH_SUBSCRIBERS_KEY = 'o_patriota_push_subscribers_v1';
const LOCAL_PUSH_CAMPAIGNS_KEY = 'o_patriota_push_campaigns_v1';

/**
 * Checks if browser supports Web Push Notifications & Service Worker.
 */
export async function isPushNotificationSupported(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
    return false;
  }
  try {
    return await isSupported();
  } catch (err) {
    return false;
  }
}

/**
 * Gets current notification permission status: 'default' | 'granted' | 'denied'
 */
export function getPushPermissionStatus(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

/**
 * Registers the Service Worker for background FCM messaging
 */
export async function registerPushServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/'
    });
    return registration;
  } catch (error) {
    console.warn('[WebPush] Falha ao registrar Service Worker:', error);
    return null;
  }
}

/**
 * Requests permission and subscribes current browser to Web Push via FCM.
 */
export async function subscribeToWebPush(customVapidKey?: string): Promise<{
  success: boolean;
  token?: string;
  message: string;
  permission: NotificationPermission | 'unsupported';
}> {
  const supported = await isPushNotificationSupported();
  if (!supported) {
    return {
      success: false,
      message: 'Seu navegador não oferece suporte para notificações push.',
      permission: 'unsupported'
    };
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    return {
      success: false,
      message: permission === 'denied' 
        ? 'Notificações foram bloqueadas no navegador. Você pode reativá-las nas configurações do site.'
        : 'Permissão não concedida.',
      permission
    };
  }

  try {
    // 1. Ensure Service Worker is registered
    const registration = await registerPushServiceWorker();

    // 2. Obtain FCM messaging instance
    const messaging = getMessaging(firebaseApp);
    const vapidKey = customVapidKey || DEFAULT_VAPID_PUBLIC_KEY;

    // 3. Request FCM registration token with the VAPID key
    const currentToken = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration || undefined
    });

    if (!currentToken) {
      return {
        success: false,
        message: 'Não foi possível gerar a credencial push (token FCM não retornado).',
        permission
      };
    }

    // 4. Save token in browser storage
    try {
      localStorage.setItem(LOCAL_PUSH_TOKEN_KEY, currentToken);
    } catch (e) {}

    // 5. Detect device info
    const ua = navigator.userAgent;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
    const isTablet = /iPad|Tablet/i.test(ua);
    const deviceType: 'desktop' | 'mobile' | 'tablet' = isTablet ? 'tablet' : (isMobile ? 'mobile' : 'desktop');

    const subscriberData: PushSubscriber = {
      id: `push-${Date.now()}`,
      token: currentToken,
      subscribedAt: new Date().toISOString(),
      userAgent: ua.slice(0, 150),
      deviceType,
      active: true
    };

    // 6. Save in local subscriber list cache
    try {
      const raw = localStorage.getItem(LOCAL_PUSH_SUBSCRIBERS_KEY);
      const list: PushSubscriber[] = raw ? JSON.parse(raw) : [];
      if (!list.some(s => s.token === currentToken)) {
        list.push(subscriberData);
        localStorage.setItem(LOCAL_PUSH_SUBSCRIBERS_KEY, JSON.stringify(list));
      }
    } catch (e) {}

    // 7. Persist the subscription through the application API (PostgreSQL/Neon).
    const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
    try {
      const response = await fetch(`${apiBase}/api/push/subscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: currentToken,
          deviceType,
          userAgent: ua.slice(0, 150)
        })
      });
      if (!response.ok) {
        throw new Error(`API de notificações respondeu HTTP ${response.status}`);
      }
    } catch (apiError) {
      console.error('[WebPush] Não foi possível salvar a inscrição no backend PostgreSQL:', apiError);
      return {
        success: false,
        token: currentToken,
        message: 'A permissão do navegador foi concedida, mas não foi possível registrar o dispositivo no servidor. Tente novamente mais tarde.',
        permission
      };
    }

    return {
      success: true,
      token: currentToken,
      message: 'Inscrição registrada no servidor do O Patriota.',
      permission
    };
  } catch (err: any) {
    console.error('[WebPush] Erro ao obter token FCM:', err);
    return {
      success: false,
      message: `Erro ao ativar alertas: ${err.message || 'Falha na comunicação com o serviço push.'}`,
      permission
    };
  }
}

/**
 * Gets cached push registration token if available.
 */
export function getStoredPushToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(LOCAL_PUSH_TOKEN_KEY);
  } catch (e) {
    return null;
  }
}

/**
 * List registered push campaigns
 */
export function getPushCampaigns(): PushNotificationCampaign[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_PUSH_CAMPAIGNS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}

  // Initial seed campaigns for demonstration
  return [
    {
      id: 'camp-1',
      title: 'URGENTE: Nova votação no Congresso Nacional',
      body: 'Plenário inicia análise de projeto com impacto direto na economia e liberdades civis.',
      url: '/artigo/votacao-congresso',
      sentAt: '08/10/2026 14:32',
      recipientCount: 1420,
      status: 'enviado'
    },
    {
      id: 'camp-2',
      title: 'ALERTA METEOROLÓGICO: Defesa Civil RS',
      body: 'Inmet emite alerta meteorológico para capitais do Sul e Sudeste nesta quinta-feira.',
      url: '/artigo/alerta-meteorologico-inmet',
      sentAt: '07/10/2026 09:15',
      recipientCount: 1380,
      status: 'enviado'
    }
  ];
}

/**
 * Records a new push campaign broadcast
 */
export function recordPushCampaign(campaign: Omit<PushNotificationCampaign, 'id' | 'sentAt'>): PushNotificationCampaign {
  const newCamp: PushNotificationCampaign = {
    ...campaign,
    id: `camp-${Date.now()}`,
    sentAt: new Date().toLocaleString('pt-BR')
  };

  try {
    const list = getPushCampaigns();
    list.unshift(newCamp);
    localStorage.setItem(LOCAL_PUSH_CAMPAIGNS_KEY, JSON.stringify(list));
  } catch (e) {}

  return newCamp;
}

/**
 * Dispatches a simulated local broadcast notification if permission is granted
 */
export async function showLocalPushNotification(title: string, options?: NotificationOptions): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  if (Notification.permission !== 'granted') return false;

  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) {
        await reg.showNotification(title, {
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          ...options
        });
        return true;
      }
    }
    new Notification(title, options);
    return true;
  } catch (e) {
    return false;
  }
}
