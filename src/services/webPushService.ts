import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { api } from './apiClient';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean);
const firebaseApp = hasFirebaseConfig
  ? (getApps().length ? getApp() : initializeApp(firebaseConfig))
  : null;
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
    if (!firebaseApp) throw new Error('Firebase não está configurado.');
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

    // 7. Persist through the API so the active database provider owns the record.
    try {
      await api.post('/push-subscriptions', {
        ...subscriberData,
        vapidPublicKey: vapidKey
      });
    } catch (apiError) {
      console.info('[WebPush] Token mantido localmente; a API ainda não persistiu a inscrição.');
    }

    return {
      success: true,
      token: currentToken,
      message: 'Inscrição para alertas urgentes ativada com sucesso!',
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
 * Campaign history is server-owned. This legacy synchronous helper intentionally
 * returns no campaigns; the admin panel must load /admin/push-campaigns from the API.
 */
export function getPushCampaigns(): PushNotificationCampaign[] {
  return [];
}

/**
 * Legacy compatibility helper. It creates a draft value only and never claims
 * that a notification was sent or that the campaign was persisted.
 */
export function recordPushCampaign(campaign: Omit<PushNotificationCampaign, 'id' | 'sentAt'>): PushNotificationCampaign {
  return {
    ...campaign,
    id: `draft-${Date.now()}`,
    sentAt: '',
    status: 'rascunho',
    recipientCount: 0,
    sentCount: 0,
    failedCount: 0,
  };
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
