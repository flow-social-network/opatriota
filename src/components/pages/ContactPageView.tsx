import React, { useState } from 'react';
import { ContactSubmission } from '../../types';
import { Breadcrumbs } from './Breadcrumbs';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldCheck,
  FileQuestion,
  HelpCircle,
  Building
} from 'lucide-react';

interface ContactPageViewProps {
  onNavigateHome: () => void;
  onSubmitContact: (submission: ContactSubmission) => Promise<{ id: string; protocol: string }>;
}

export const ContactPageView: React.FC<ContactPageViewProps> = ({
  onNavigateHome,
  onSubmitContact
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState<'sugestao_pauta' | 'correcao_materia' | 'duvida_editorial' | 'comercial' | 'institucional'>('sugestao_pauta');
  const [articleRef, setArticleRef] = useState('');
  const [message, setMessage] = useState('');
  
  // Anti-spam honeypot (bots fill this, humans don't)
  const [honeypot, setHoneypot] = useState('');

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedProtocol, setSubmittedProtocol] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (honeypot) return;
    if (!name.trim() || name.trim().length < 3) {
      setErrorMessage('Por favor, informe seu nome completo (mínimo de 3 caracteres).');
      return;
    }
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Por favor, informe um endereço de e-mail válido.');
      return;
    }
    if (!message.trim() || message.trim().length < 15) {
      setErrorMessage('Por favor, detalhe sua mensagem com no mínimo 15 caracteres.');
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await onSubmitContact({
        id: '', date: new Date().toISOString(), name: name.trim(), email: email.trim(),
        phone: phone.trim() || undefined, subject, articleRef: articleRef.trim() || undefined,
        message: message.trim(), status: 'recebido'
      });
      setSubmittedProtocol(result.protocol);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Não foi possível enviar a mensagem. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setSubject('sugestao_pauta');
    setArticleRef('');
    setMessage('');
    setSubmittedProtocol(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-16">
      {/* Breadcrumbs Bar */}
      <div className="bg-white border-b border-[#D9DEE7] py-2.5">
        <div className="max-w-[1240px] mx-auto px-4 flex items-center justify-between">
          <Breadcrumbs
            onNavigateHome={onNavigateHome}
            items={[
              { label: 'Institucional' },
              { label: 'Fale com a Redação' }
            ]}
          />
          <span className="text-xs text-[#5D6673]">
            Canal Direto da Redação O Patriota
          </span>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 pt-8">
        
        {/* Page Title */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#0B2345] text-white text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded">
              ATENDIMENTO EDITORIAL & LEITORES
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-black text-[#0B2345] mb-2">
            Fale com a Redação
          </h1>
          <p className="text-sm md:text-base text-[#404B5A] max-w-3xl leading-relaxed">
            Envie sugestões de pauta, aponte correções em matérias publicadas, tire dúvidas sobre nossa linha editorial ou fale com o departamento comercial.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Form Column (8 cols) */}
          <main className="lg:col-span-8 bg-white border border-[#D9DEE7] rounded-lg p-6 md:p-10 shadow-xs">
            
            {submittedProtocol ? (
              /* Success State */
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-[#16803C]/10 text-[#16803C] flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-[#0B2345] mb-2">
                  Mensagem Enviada com Sucesso!
                </h2>
                <div className="bg-[#F1F3F5] inline-block px-4 py-2 rounded text-xs font-mono text-[#0B2345] font-bold mb-4">
                  Protocolo de Atendimento: {submittedProtocol}
                </div>
                <p className="text-sm text-[#5D6673] max-w-md mx-auto leading-relaxed mb-6">
                  Sua mensagem foi protocolada no sistema de redação e distribuída ao editor responsável. A confirmação foi enviada para <strong>{email}</strong>. Responderemos no menor prazo possível.
                </p>
                <button
                  onClick={handleResetForm}
                  className="bg-[#0B2345] hover:bg-[#0B5FFF] text-white text-xs font-bold px-6 py-2.5 rounded transition cursor-pointer"
                >
                  Enviar Nova Mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-xs text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Honeypot hidden input for spam bots */}
                <input
                  type="text"
                  name="website_url_check"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0B2345] mb-1.5">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex.: Lucas Fernandes"
                      className="w-full text-xs border border-[#D9DEE7] rounded px-3 py-2.5 text-[#17202A] focus:outline-none focus:border-[#0B5FFF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0B2345] mb-1.5">
                      E-mail para Resposta *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@exemplo.com.br"
                      className="w-full text-xs border border-[#D9DEE7] rounded px-3 py-2.5 text-[#17202A] focus:outline-none focus:border-[#0B5FFF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0B2345] mb-1.5">
                      Telefone / WhatsApp (Opcional)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(DDD) 99999-9999"
                      className="w-full text-xs border border-[#D9DEE7] rounded px-3 py-2.5 text-[#17202A] focus:outline-none focus:border-[#0B5FFF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0B2345] mb-1.5">
                      Assunto da Mensagem *
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value as any)}
                      className="w-full text-xs border border-[#D9DEE7] rounded px-3 py-2.5 text-[#17202A] focus:outline-none focus:border-[#0B5FFF] bg-white cursor-pointer"
                    >
                      <option value="sugestao_pauta">Sugestão de Pauta / Denúncia</option>
                      <option value="correcao_materia">Correção de Matéria / Errata</option>
                      <option value="duvida_editorial">Dúvida sobre Princípios Editoriais</option>
                      <option value="comercial">Anúncios & Parcerias Comerciais</option>
                      <option value="institucional">Contato Institucional & Jurídico</option>
                    </select>
                  </div>
                </div>

                {subject === 'correcao_materia' && (
                  <div>
                    <label className="block text-xs font-bold text-[#0B2345] mb-1.5">
                      Link ou Título da Matéria a ser Corrigida *
                    </label>
                    <input
                      type="text"
                      value={articleRef}
                      onChange={(e) => setArticleRef(e.target.value)}
                      placeholder="Cole a URL da matéria ou informe a manchete..."
                      className="w-full text-xs border border-[#D9DEE7] rounded px-3 py-2.5 text-[#17202A] focus:outline-none focus:border-[#0B5FFF] bg-amber-50/50"
                    />
                    <p className="text-[11px] text-[#717E8E] mt-1">
                      Conforme nossa <a href="/politica-de-correcoes/" className="text-[#0B5FFF] underline">Política de Correções</a>, detalhe os dados a retificar e anexe referências.
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#0B2345] mb-1.5">
                    Mensagem Detalhada *
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escreva sua mensagem com clareza..."
                    className="w-full text-xs border border-[#D9DEE7] rounded p-3 text-[#17202A] focus:outline-none focus:border-[#0B5FFF] leading-relaxed"
                  />
                  <div className="flex justify-between items-center text-[11px] text-[#717E8E] mt-1">
                    <span>Mínimo de 15 caracteres.</span>
                    <span>{message.length} caracteres digitados</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EAECEF] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-[11px] text-[#5D6673] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#16803C]" />
                    <span>Seus dados são protegidos nos termos da LGPD e não são compartilhados.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-[#0B2345] hover:bg-[#0B5FFF] text-white text-xs font-bold px-8 py-3 rounded transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Enviando mensagem...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Enviar Mensagem</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </main>

          {/* Sidebar Info Column (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Direct Departments Card */}
            <div className="bg-white border border-[#D9DEE7] rounded-lg p-6 shadow-xs">
              <h3 className="font-serif font-bold text-sm text-[#0B2345] uppercase tracking-wider pb-3 border-b border-[#EAECEF] mb-4 flex items-center gap-2">
                <Building className="w-4 h-4 text-[#0B5FFF]" />
                Departamentos da Redação
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="font-bold text-[#0B2345] block">Pauta & Notícias:</span>
                  <a href="mailto:pauta@opatriota.com.br" className="text-[#0B5FFF] hover:underline">
                    pauta@opatriota.com.br
                  </a>
                </div>

                <div>
                  <span className="font-bold text-[#0B2345] block">Correções e Erratas:</span>
                  <a href="mailto:correcoes@opatriota.com.br" className="text-[#0B5FFF] hover:underline">
                    correcoes@opatriota.com.br
                  </a>
                </div>

                <div>
                  <span className="font-bold text-[#0B2345] block">Área do Assinante & Suporte:</span>
                  <a href="mailto:assinante@opatriota.com.br" className="text-[#0B5FFF] hover:underline">
                    assinante@opatriota.com.br
                  </a>
                </div>

                <div>
                  <span className="font-bold text-[#0B2345] block">Comercial & Publicidade:</span>
                  <a href="mailto:comercial@opatriota.com.br" className="text-[#0B5FFF] hover:underline">
                    comercial@opatriota.com.br
                  </a>
                </div>

                <div>
                  <span className="font-bold text-[#0B2345] block">Privacidade e Dados (DPO):</span>
                  <a href="mailto:privacidade@opatriota.com.br" className="text-[#0B5FFF] hover:underline">
                    privacidade@opatriota.com.br
                  </a>
                </div>
              </div>
            </div>

            {/* Sede Social da Mantenedora */}
            <div className="bg-[#F8FAFC] border border-[#D9DEE7] rounded-lg p-6 shadow-xs">
              <h3 className="font-serif font-bold text-sm text-[#0B2345] uppercase tracking-wider pb-3 border-b border-[#EAECEF] mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#FFCC29]" />
                Empresa Mantenedora
              </h3>

              <div className="space-y-3 text-xs text-[#404B5A] leading-relaxed">
                <div>
                  <span className="font-bold text-[#0B2345] block">Razão Social:</span>
                  <span>DEEVO SOLUÇÕES FINANCEIRAS LTDA</span>
                </div>
                <div>
                  <span className="font-bold text-[#0B2345] block">CNPJ:</span>
                  <span className="font-mono text-[#0B2345]">63.187.175/0001-70</span>
                </div>
                <div>
                  <span className="font-bold text-[#0B2345] block">Sede Social:</span>
                  <span>Taquara, Rio Grande do Sul — Brasil</span>
                </div>
                <div className="pt-2 border-t border-[#EAECEF]">
                  <span className="font-bold text-[#0B2345] block mb-1">Facebook Oficial:</span>
                  <a 
                    href="https://www.facebook.com/opatriota.news.brasil" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#0B5FFF] hover:underline break-all block"
                  >
                    facebook.com/opatriota.news.brasil
                  </a>
                </div>
              </div>
            </div>

            {/* Address & Hours */}
            <div className="bg-white border border-[#D9DEE7] rounded-lg p-6 shadow-xs">
              <h3 className="font-serif font-bold text-sm text-[#0B2345] uppercase tracking-wider pb-3 border-b border-[#EAECEF] mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#16803C]" />
                Sede Central Brasília
              </h3>

              <div className="space-y-3 text-xs text-[#404B5A] leading-relaxed">
                <p>
                  <strong>Edifício Centro Empresarial Brasília</strong><br />
                  Setor Comercial Sul (SCS), Quadra 4, Bloco A, Salas 601-604<br />
                  Asa Sul — Brasília - DF<br />
                  CEP 70304-900
                </p>

                <div className="pt-2 border-t border-[#F1F3F5] flex items-center gap-2 text-[#5D6673]">
                  <Clock className="w-3.5 h-3.5 text-[#0B2345]" />
                  <span>Segunda a Sexta: 08h00 às 19h00</span>
                </div>
                <div className="flex items-center gap-2 text-[#5D6673]">
                  <Phone className="w-3.5 h-3.5 text-[#0B2345]" />
                  <span>Central: (61) 3244-8800</span>
                </div>
              </div>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
};
