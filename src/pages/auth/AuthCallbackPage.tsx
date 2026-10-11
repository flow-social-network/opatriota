import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/contexts/AuthContext';
import { Logo } from '../../components/Logo';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { currentUser, authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      if (currentUser) {
        if (currentUser.role === 'administrador') {
          navigate('/admin');
        } else if (['jornalista', 'revisor', 'editor', 'editor_chefe'].includes(currentUser.role)) {
          navigate('/redacao');
        } else {
          navigate('/minha-conta');
        }
      } else {
        navigate('/login');
      }
    }
  }, [currentUser, authLoading, navigate]);

  return (
    <div className="min-h-screen bg-[#071322] flex flex-col items-center justify-center p-6 text-white text-center">
      <div className="mb-6">
        <Logo size="lg" variant="footer" />
      </div>
      <div className="w-10 h-10 border-4 border-[#FFCC29]/20 border-t-[#FFCC29] rounded-full animate-spin mb-4" />
      <h2 className="text-xl font-bold font-serif text-white mb-2">Concluindo autenticação...</h2>
      <p className="text-sm text-white/70">Aguarde enquanto validamos sua sessão e permissões no sistema.</p>
    </div>
  );
}
