import { createRoot } from 'react-dom/client';
import App from './app/App.tsx';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <>
    <App />
    <PwaInstallPrompt />
  </>
);

// Register the service worker only in production. Development HMR remains untouched.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch((error) => {
      console.error('Não foi possível registrar o service worker do O PATRIOTA.', error);
    });
  });
}
