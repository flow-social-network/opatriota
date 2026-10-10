import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface ToastContextValue {
  toastMessage: string | null;
  showToast: (message: string) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextValue>({
  toastMessage: null,
  showToast: () => {},
  hideToast: () => {},
});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(prev => (prev === message ? null : prev));
    }, 4000);
  }, []);

  const hideToast = useCallback(() => setToastMessage(null), []);

  return (
    <ToastContext.Provider value={{ toastMessage, showToast, hideToast }}>
      {children}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-[#0B2345] text-white px-4 py-3 rounded-lg shadow-xl border border-[#FFCC29] text-xs sm:text-sm flex items-center gap-3 animate-fade-in"
        >
          <span className="font-medium">{toastMessage}</span>
          <button
            type="button"
            onClick={hideToast}
            className="text-white/70 hover:text-white font-bold ml-2 cursor-pointer"
            aria-label="Fechar notificação"
          >
            ✕
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
