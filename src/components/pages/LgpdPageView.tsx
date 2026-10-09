import React, { useState } from 'react';
import { LgpdRequest } from '../../types';
import { Breadcrumbs } from './Breadcrumbs';
import { 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Clock, 
  Lock,
  UserCheck
} from 'lucide-react';

interface LgpdPageViewProps {
  onNavigateHome: () => void;
  onSubmitLgpd: (request: LgpdRequest) => Promise<{ id: string; protocol: string }>;
}

export const LgpdPageView: React.FC<LgpdPageViewProps> = ({
  onNavigateHome,
  onSubmitLgpd
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [requestType, setRequestType] = useState<'acesso' | 'correcao' | 'exclusao' | 'revogacao_consentimento'>('acesso');
  const [details, setDetails] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedProtocol, setSubmittedProtocol] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!name.trim() || name.trim().length < 3) {
      setErrorMessage('Informe seu nome completo cadastrado.');
      return;
    }
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Informe um e-mail válido para comprovação de titularidade.');
      return;
    }
    if (!details.trim() || details.trim().length < 10) {
      setErrorMessage('Por favor, especifique o detalhe da sua solicitação com clareza.');
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await onSubmitLgpd({
        id: '', date: new Date().toISOString(), name: name.trim(), email: email.trim(),
        documentId: documentId.trim() || undefined, requestType, details: details.trim(), status: 'recebido'
      });
      setSubmittedProtocol(result.protocol);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Não foi possível registrar a solicitação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-16">
      <div className="bg-white border-b border-[#D9DEE7] py-2.5">
        <div className="max-w-[1100px] mx-auto px-4 flex items-center justify-between">
          <Breadcrumbs
            onNavigateHome={onNavigateHome}
            items={[
              { label: 'Transparência & Legal' },
              { label: 'Gestão de Dados (LGPD)' }
            ]}
          />
          <span className="text-xs text-[#5D6673]">
            Lei Federal nº 13.709/2018
          </span>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 pt-8">
        <header className="mb-8">
          <span className="bg-[#0B2345] text-white text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded inline-block mb-2">
            CANAL OFICIAL DO TITULAR DE DADOS
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-black text-[#0B2345] mb-2">
            Gestão de Dados Pessoais e LGPD
          </h1>
          <p className="text-sm md:text-base text-[#404B5A] max-w-3xl leading-relaxed">
            Exerça seus direitos previstos na Lei Geral de Proteção de Dados com total segurança, transparência e sem burocracia.
          </p>
        </header>

        <div className="bg-white border border-[#D9DEE7] rounded-lg p-6 md:p-10 shadow-xs mb-8">
          {submittedProtocol ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-[#16803C]/10 text-[#16803C] flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#0B2345] mb-2">
                Solicitação LGPD Protocolada!
              </h2>
              <div className="bg-[#F1F3F5] inline-block px-4 py-2 rounded text-xs font-mono text-[#0B2345] font-bold mb-4">
                Protocolo: {submittedProtocol}
              </div>
              <p className="text-sm text-[#5D6673] max-w-lg mx-auto leading-relaxed mb-6">
                Recebemos sua manifestação como titular de dados. Uma notificação foi enviada ao e-mail <strong>{email}</strong>. Conforme o artigo 19, II da LGPD, forneceremos a resposta conclusiva em até 15 dias úteis.
              </p>
              <button
                onClick={() => {
                  setName('');
                  setEmail('');
                  setDocumentId('');
                  setDetails('');
                  setSubmittedProtocol(null);
                }}
                className="bg-[#0B2345] hover:bg-[#0B5FFF] text-white text-xs font-bold px-6 py-2.5 rounded transition cursor-pointer"
              >
                Fazer Nova Solicitação
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0B2345] mb-1.5">
                    Nome Completo do Titular *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full text-xs border border-[#D9DEE7] rounded px-3 py-2.5 focus:outline-none focus:border-[#0B5FFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B2345] mb-1.5">
                    E-mail Cadastrado *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com.br"
                    className="w-full text-xs border border-[#D9DEE7] rounded px-3 py-2.5 focus:outline-none focus:border-[#0B5FFF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0B2345] mb-1.5">
                    CPF (Para confirmação de titularidade de cadastro)
                  </label>
                  <input
                    type="text"
                    value={documentId}
                    onChange={(e) => setDocumentId(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full text-xs border border-[#D9DEE7] rounded px-3 py-2.5 focus:outline-none focus:border-[#0B5FFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B2345] mb-1.5">
                    Tipo de Solicitação *
                  </label>
                  <select
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value as any)}
                    className="w-full text-xs border border-[#D9DEE7] rounded px-3 py-2.5 focus:outline-none focus:border-[#0B5FFF] bg-white cursor-pointer"
                  >
                    <option value="acesso">Confirmação e Acesso aos Dados Pessoais</option>
                    <option value="correcao">Correção de Dados Incompletos ou Inexatos</option>
                    <option value="exclusao">Eliminação / Exclusão Definitiva da Conta</option>
                    <option value="revogacao_consentimento">Revogação de Consentimento de Newsletters</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B2345] mb-1.5">
                  Detalhes Específicos da Solicitação *
                </label>
                <textarea
                  rows={4}
                  required
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Especifique com detalhes quais registros ou dados deseja consultar, corrigir ou excluir..."
                  className="w-full text-xs border border-[#D9DEE7] rounded p-3 focus:outline-none focus:border-[#0B5FFF] leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-[#EAECEF] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-[11px] text-[#5D6673] flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-[#16803C]" />
                  <span>Envio criptografado diretamente para o DPO (Encarregado de Dados).</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-[#0B2345] hover:bg-[#0B5FFF] text-white text-xs font-bold px-8 py-3 rounded transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Registrando protocolo...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submeter Solicitação LGPD</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
