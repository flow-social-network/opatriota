import React, { useEffect, useState } from 'react';
import { X, ShieldCheck, Newspaper } from 'lucide-react';

type AuthModalProps = {
  onClose: () => void;
  onGoogleLogin: () => Promise<void> | void;
  errorMessage?: string | null;
};

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onGoogleLogin, errorMessage }) => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', onKeyDown); };
  }, [onClose]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try { await onGoogleLogin(); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#06152b]/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="reader-auth-title"
        className="relative w-full max-w-md overflow-hidden rounded-xl border border-[#D9DEE7] bg-white shadow-2xl">
        <button type="button" onClick={onClose} aria-label="Fechar janela de acesso"
          className="absolute right-3 top-3 z-10 rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white"><X className="h-5 w-5" /></button>
        <div className="bg-[#0B2345] px-7 pb-7 pt-8 text-white">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-white/10"><Newspaper className="h-6 w-6 text-[#FFCC29]" /></div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#FFCC29]">O Patriota Brasil</p>
          <h2 id="reader-auth-title" className="font-serif text-2xl font-bold">Entre com sua conta Google</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/80">Acesse sua conta existente. Não há formulário de cadastro nesta tela.</p>
        </div>
        <div className="p-7">
          {errorMessage && <p role="alert" className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{errorMessage}</p>}
          <button type="button" onClick={() => void handleGoogleLogin()} disabled={loading}
            className="flex min-h-12 w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60">
            <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.01 13.22l7.98 6.19C11.93 13.72 17.47 9.5 24 9.5Z" transform="translate(0 4)"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.98 46.98 31.92 46.98 24.55Z"/>
              <path fill="#FBBC05" d="M10.64 28.59A14.4 14.4 0 0 1 9.87 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.55 2.58 10.78l8.06-6.19Z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.44-4.89 2.3-8.18 2.3-6.53 0-12.07-4.22-14.01-10.09l-8.06 6.19C6.51 42.62 14.62 48 24 48Z"/>
            </svg>
            {loading ? 'Conectando com o Google…' : 'Continuar com Google'}
          </button>
          <div className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-slate-500"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#16803C]" /><p>O acesso é autenticado pelo Google. Permissões administrativas e editoriais são concedidas separadamente.</p></div>
          <button type="button" onClick={onClose} className="mt-5 w-full py-2 text-sm font-semibold text-slate-500 hover:text-[#0B2345]">Continuar navegando sem entrar</button>
        </div>
      </section>
    </div>
  );
};
