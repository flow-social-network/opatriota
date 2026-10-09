// Give the service worker access to Firebase Messaging.
// Note: This script runs in the service worker scope in the background.
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in the messagingSenderId
firebase.initializeApp({
  apiKey: "AIzaSyAM7XqRKi2DWNvEpwZZTg99QGgq75_FWgc",
  authDomain: "o-patriota-5db52.firebaseapp.com",
  projectId: "o-patriota-5db52",
  storageBucket: "o-patriota-5db52.firebasestorage.app",
  messagingSenderId: "144044011965",
  appId: "1:144044011965:web:6da58292d47845e931e2d4"
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Mensagem recebida em segundo plano: ', payload);
  
  const notificationTitle = payload.notification?.title || payload.data?.title || 'O Patriota — Alerta Urgente';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || 'Nova notícia urgente publicada no portal.',
    icon: payload.notification?.icon || '/favicon.ico',
    badge: '/favicon.ico',
    data: {
      url: payload.data?.url || '/'
    }
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes(self.registration.scope) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
