import React, { useState } from 'react';
import { ShieldCheck, Newspaper, AlertCircle, ArrowLeft } from 'lucide-react';

type AdminLoginPageProps = {
  onGoogleLogin: () => Promise<void>;
  onBack: () => void;
  loading?: boolean;
  error?: string | null;
};

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onGoogleLogin, onBack, loading = false, error }) => (
  <main className="flex min-h-[75vh] flex-1 items-center justify-center bg-[#F7F8FA] px-4 py-12">
    <section className="w-full max-w-md overflow-hidden rounded-2xl border border-[#D9DEE7] bg-white shadow-xl">
      <div className="bg-[#0B2345] px-8 py-8 text-white">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
          <Newspaper className="h-7 w-7 text-[#FFCC29]" />
        </div>
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#FFCC29]">O Patriota Brasil</p>
        <h1 className="mt-3 text-3xl font-bold">Acesso administrativo</h1>
        <p className="mt-3 text-sm leading-6 text-white/80">Entre com a conta Google institucional previamente autorizada. Não existe cadastro público nesta área.</p>
      </div>
      <div className="space-y-5 p-8">
        {error && <p role="alert" className="flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="h-5 w-5 shrink-0" />{error}</p>}
        <button type="button" onClick={() => void onGoogleLogin()} disabled={loading}
          className="flex min-h-12 w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 font-bold text-slate-800 transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60">
          <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.01 13.22l7.98 6.19C11.93 13.72 17.47 9.5 24 9.5Z" transform="translate(0 4)"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.98 46.98 31.92 46.98 24.55Z"/><path fill="#FBBC05" d="M10.64 28.59A14.4 14.4 0 0 1 9.87 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.55 2.58 10.78l8.06-6.19Z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.44-4.89 2.3-8.18 2.3-6.53 0-12.07-4.22-14.01-10.09l-8.06 6.19C6.51 42.62 14.62 48 24 48Z"/></svg>
          {loading ? 'Conectando com o Google…' : 'Entrar com Google'}
        </button>
        <div className="flex gap-3 rounded-lg bg-slate-50 p-4 text-xs leading-5 text-slate-600"><ShieldCheck className="h-5 w-5 shrink-0 text-emerald-700" /><p>O login autentica a identidade. O acesso administrativo depende de autorização específica; uma conta Google comum não recebe privilégios automaticamente.</p></div>
        <button type="button" onClick={onBack} className="flex w-full items-center justify-center gap-2 py-2 text-sm font-semibold text-slate-500 hover:text-[#0B2345]"><ArrowLeft className="h-4 w-4" /> Voltar ao portal</button>
      </div>
    </section>
  </main>
);
