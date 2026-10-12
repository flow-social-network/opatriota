import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { api } from './apiClient';

const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {} as Record<string, string>;

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};
const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean);
const firebaseApp = hasFirebaseConfig
  ? (getApps().length ? getApp() : initializeApp(firebaseConfig))
  : null;


export const DEFAULT_VAPID_PUBLIC_KEY = String(env.VITE_FIREBASE_VAPID_PUBLIC_KEY || '');
export const FCM_PROJECT_ID = String(env.VITE_FIREBASE_PROJECT_ID || '');

const LOCAL_PUSH_TOKEN_KEY = 'o_patriota_push_token_v1';

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
  const permissionBeforeRequest = getPushPermissionStatus();
  const vapidKey = String(customVapidKey || DEFAULT_VAPID_PUBLIC_KEY).trim();
  if (!firebaseApp || !vapidKey) {
    return {
      success: false,
      message: 'Web Push não configurado: valide as variáveis Firebase e a chave VAPID pública no ambiente do portal.',
      permission: permissionBeforeRequest,
    };
  }
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

    // 4. Detect device info
    const ua = navigator.userAgent;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
    const isTablet = /iPad|Tablet/i.test(ua);
    const deviceType: 'desktop' | 'mobile' | 'tablet' = isTablet ? 'tablet' : (isMobile ? 'mobile' : 'desktop');

    // Persist the subscription on the server before reporting success.
    try {
      await api.post('/push-subscriptions', {
        id: `push-${Date.now()}`,
        token: currentToken,
        subscribedAt: new Date().toISOString(),
        userAgent: ua.slice(0, 150),
        deviceType,
        active: true,
        vapidPublicKey: vapidKey,
      });
    } catch {
      return {
        success: false,
        message: 'O navegador gerou um token, mas o servidor não confirmou a inscrição. Tente novamente; nenhum sucesso foi registrado localmente.',
        permission,
      };
    }

    try {
      localStorage.setItem(LOCAL_PUSH_TOKEN_KEY, currentToken);
    } catch {
      // The server subscription is already persisted; local caching is optional.
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
