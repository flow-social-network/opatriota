import React from 'react';
import { Link } from 'react-router-dom';

export default function AccessDeniedPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-3xl font-bold text-[#0B2345]">Acesso negado</h1>
      <p className="text-sm text-[#4A5568] text-center max-w-md">
        Você não tem permissão para acessar esta área. Se você acredita que isso é um erro,
        entre em contato com a administração.
      </p>
      <div className="flex gap-3 mt-4">
        <Link
          to="/"
          className="px-5 py-2.5 bg-[#0B2345] text-white rounded-lg text-sm font-medium hover:bg-[#132D50] transition-colors"
        >
          Voltar ao início
        </Link>
        <Link
          to="/minha-conta"
          className="px-5 py-2.5 border border-[#CBD5E0] text-[#4A5568] rounded-lg text-sm hover:bg-white transition-colors"
        >
          Minha conta
        </Link>
      </div>
    </div>
  );
}
