import { useEffect, useState } from 'react';
import { Download, X, Smartphone, Share } from 'lucide-react';

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

const DISMISSED_KEY = 'o-patriota-pwa-prompt-dismissed';
const INSTALLED_KEY = 'o-patriota-pwa-installed';

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches
    || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export function PwaInstallPrompt() {
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    setIsIOS(/iphone|ipad|ipod/i.test(navigator.userAgent));
    if (isStandalone() || localStorage.getItem(INSTALLED_KEY) === 'true') return;

    let timer: number | undefined;
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallPromptEvent);
      if (localStorage.getItem(DISMISSED_KEY) !== 'true') {
        timer = window.setTimeout(() => setVisible(true), 4500);
      }
    };
    const onInstalled = () => {
      localStorage.setItem(INSTALLED_KEY, 'true');
      setVisible(false);
      setInstallEvent(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onInstalled);

    // iOS does not expose beforeinstallprompt; show a gentle help option later.
    if (/iphone|ipad|ipod/i.test(navigator.userAgent)
      && localStorage.getItem(DISMISSED_KEY) !== 'true') {
      timer = window.setTimeout(() => setVisible(true), 7000);
    }

    return () => {
      if (timer) window.clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setVisible(false);
    setShowHelp(false);
  };

  const install = async () => {
    if (!installEvent) {
      setShowHelp(true);
      return;
    }
    setInstalling(true);
    try {
      await installEvent.prompt();
      const choice = await installEvent.userChoice;
      if (choice.outcome === 'accepted') {
        localStorage.setItem(INSTALLED_KEY, 'true');
        setVisible(false);
      }
      setInstallEvent(null);
    } finally {
      setInstalling(false);
    }
  };

  if (!visible || isStandalone()) return null;

  return (
    <aside
      aria-label="Instalar O PATRIOTA"
      className="fixed inset-x-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[70] mx-auto max-w-md rounded-2xl border border-[#D9DEE7] bg-white p-4 shadow-2xl sm:bottom-5"
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="Fechar convite de instalação"
        className="absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-full text-[#5D6673] hover:bg-[#F1F3F5]"
      >
        <X size={18} />
      </button>

      <div className="flex items-start gap-3 pr-7">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0B2345] text-white">
          <Smartphone size={24} />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#0B2345]">Instale o O PATRIOTA</h2>
          <p className="mt-1 text-sm leading-5 text-[#5D6673]">
            Acesse notícias, análises e opiniões direto da tela inicial do seu dispositivo.
          </p>
        </div>
      </div>

      {showHelp && (
        <div className="mt-3 rounded-xl bg-[#F1F3F5] p-3 text-sm leading-5 text-[#17202A]">
          {isIOS ? (
            <p>Toque em <Share className="inline-block align-text-bottom" size={16} /> Compartilhar no Safari e escolha <strong>Adicionar à Tela de Início</strong>.</p>
          ) : (
            <p>No menu do navegador, procure <strong>Instalar aplicativo</strong> ou <strong>Adicionar à tela inicial</strong>, se essa opção estiver disponível.</p>
          )}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={install}
          disabled={installing}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#16803C] px-3 py-2 text-sm font-bold text-white transition hover:bg-[#116b31] disabled:opacity-60"
        >
          <Download size={17} />
          {installing ? 'Aguarde…' : 'Instalar aplicativo'}
        </button>
        <button
          type="button"
          onClick={dismiss}
          className="min-h-11 rounded-xl border border-[#D9DEE7] px-3 py-2 text-sm font-semibold text-[#0B2345] hover:bg-[#F7F8FA]"
        >
          Continuar no navegador
        </button>
      </div>
    </aside>
  );
}