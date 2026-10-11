import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home, LogIn, Lock } from 'lucide-react';
import { Logo } from '../../components/Logo';

export default function AccessDeniedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#071322] flex flex-col justify-between text-white p-4 sm:p-8">
      {/* Top micro bar */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between text-xs text-white/60 pb-6 border-b border-white/10">
        <Link to="/" className="inline-flex items-center gap-1.5 text-white/80 hover:text-[#FFCC29] transition">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar ao Portal</span>
        </Link>
        <div className="flex items-center gap-2 text-[11px] text-red-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>STATUS: 403 FORBIDDEN</span>
        </div>
      </div>

      <div className="max-w-lg w-full mx-auto my-auto text-center py-12 px-6 bg-gradient-to-b from-[#0B2345] to-[#08182E] rounded-2xl border border-white/10 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif font-black text-white mb-3">
          Acesso Restrito ou Negado
        </h1>
        <p className="text-sm text-white/70 leading-relaxed mb-8">
          Sua conta atual não possui o nível de permissão ou privilégios exigidos para visualizar esta seção restrita do portal O Patriota.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-xs">
          <Link
            to="/redacao/login"
            className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-[#0B5FFF] hover:bg-white/10 text-white font-bold transition flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4 text-[#0B5FFF]" />
            <span>Login da Redação</span>
          </Link>
          <Link
            to="/admin/login"
            className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-[#FFCC29] hover:bg-white/10 text-white font-bold transition flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4 text-[#FFCC29]" />
            <span>Login Administrativo</span>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
          <Link
            to="/"
            className="flex-1 py-2.5 px-4 bg-[#FFCC29] hover:bg-[#F0BE20] text-[#071322] rounded-lg text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Página Inicial</span>
          </Link>
          <Link
            to="/login"
            className="flex-1 py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Trocar de Conta</span>
          </Link>
        </div>
      </div>

      <footer className="text-center text-[11px] text-white/40 pt-6">
        O Patriota Brasil • Segurança da Informação • Taquara–RS / Brasília–DF
      </footer>
    </div>
  );
}
