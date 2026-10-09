import React, { useEffect, useState } from 'react';
import { X, ShieldCheck, Newspaper } from 'lucide-react';

type AuthModalProps = {
  onClose: () => void;
  onGoogleLogin: () => Promise<void> | void;
  onFacebookLogin: () => Promise<void> | void;
  errorMessage?: string | null;
};

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onGoogleLogin, onFacebookLogin, errorMessage }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  const handleProviderLogin = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    try {
      if (provider === 'google') await onGoogleLogin();
      else await onFacebookLogin();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#06152b]/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="reader-auth-title"
        className="relative w-full max-w-md overflow-hidden rounded-xl border border-[#D9DEE7] bg-white shadow-2xl">
        <button type="button" onClick={onClose} aria-label="Fechar janela de acesso"
          className="absolute right-3 top-3 z-10 rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-[#0B2345]">
          <X className="h-5 w-5" />
        </button>
        <div className="bg-[#0B2345] px-7 pb-7 pt-8 text-white">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-white/10">
            <Newspaper className="h-6 w-6 text-[#FFCC29]" />
          </div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#FFCC29]">O Patriota</p>
          <h2 id="reader-auth-title" className="font-serif text-2xl font-bold">
            {mode === 'login' ? 'Entre para continuar lendo' : 'Crie sua conta gratuita'}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/80">
            Acesse notícias, salve matérias e personalize sua leitura. Você pode escolher um plano e assinar depois.
          </p>
        </div>
        <div className="p-7">
          <div className="mb-6 grid grid-cols-2 rounded-lg bg-slate-100 p-1" role="tablist" aria-label="Acesso à conta">
            <button type="button" role="tab" aria-selected={mode === 'login'} onClick={() => setMode('login')}
              className={`rounded-md px-3 py-2.5 text-sm font-semibold transition ${mode === 'login' ? 'bg-white text-[#0B2345] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
              Entrar
            </button>
            <button type="button" role="tab" aria-selected={mode === 'register'} onClick={() => setMode('register')}
              className={`rounded-md px-3 py-2.5 text-sm font-semibold transition ${mode === 'register' ? 'bg-white text-[#0B2345] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
              Cadastrar
            </button>
          </div>
          {errorMessage && <p role="alert" className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{errorMessage}</p>}
          <button type="button" onClick={() => handleProviderLogin('google')} disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60">
            <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.01 13.22l7.98 6.19C11.93 13.72 17.47 9.5 24 9.5Z" transform="translate(0 4)"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.98 46.98 31.92 46.98 24.55Z"/>
              <path fill="#FBBC05" d="M10.64 28.59A14.4 14.4 0 0 1 9.87 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.55 2.58 10.78l8.06-6.19Z" transform="translate(0 0)"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.44-4.89 2.3-8.18 2.3-6.53 0-12.07-4.22-14.01-10.09l-8.06 6.19C6.51 42.62 14.62 48 24 48Z"/>
            </svg>
            {loading ? 'Conectando com o Google…' : mode === 'login' ? 'Continuar com Google' : 'Cadastrar com Google'}
          </button>
          <button type="button" onClick={() => handleProviderLogin('facebook')} disabled={loading}
            className="mt-3 flex w-full items-center justify-center gap-3 rounded-lg bg-[#1877F2] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#166FE5] disabled:cursor-wait disabled:opacity-60">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.098 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.49 0-1.955.93-1.955 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.098 24 12.073Z"/>
            </svg>
            {loading ? 'Conectando…' : mode === 'login' ? 'Continuar com Facebook' : 'Cadastrar com Facebook'}
          </button>
          <div className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-slate-500">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#16803C]" />
            <p>Conta gratuita para começar. A assinatura é opcional e pode ser escolhida dentro da sua área do leitor.</p>
          </div>
          <button type="button" onClick={onClose} className="mt-5 w-full py-2 text-sm font-semibold text-slate-500 hover:text-[#0B2345]">Continuar navegando sem entrar</button>
        </div>
      </section>
    </div>
  );
};
