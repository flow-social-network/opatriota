import React, { useState } from 'react';
import { 
  QrCode, 
  Copy, 
  CheckCircle2, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  Lock,
  ArrowRight
} from 'lucide-react';

interface PixDonationCardProps {
  onSuccess?: () => void;
  compact?: boolean;
}

export const PixDonationCard: React.FC<PixDonationCardProps> = ({ onSuccess, compact = false }) => {
  const [amount, setAmount] = useState<number>(25);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [donated, setDonated] = useState<boolean>(false);

  const selectedValue = isCustom ? (parseFloat(customAmount.replace(',', '.')) || 0) : amount;

  // Pix official details
  const pixKey = 'pix@opatriota.com.br';
  const recipientName = 'O PATRIOTA COMUNICACAO E JORNALISMO LTDA';
  const city = 'BRASILIA';
  
  // Format simulated EMV Pix Copia e Cola
  const pixCopiaECola = `00020126580014br.gov.bcb.pix0121${pixKey}520400005303986540${selectedValue > 0 ? selectedValue.toFixed(2) : '10.00'}5802BR59${recipientName.length < 10 ? '0' + recipientName.length : recipientName.length}${recipientName}6008${city}62070503***6304`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(pixCopiaECola);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSimulatePayment = () => {
    setDonated(true);
    if (onSuccess) {
      setTimeout(() => onSuccess(), 2500);
    }
  };

  if (donated) {
    return (
      <div className="bg-white border-2 border-[#16803C] rounded-2xl p-6 md:p-8 text-center shadow-lg animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-[#16803C]/10 text-[#16803C] rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="bg-[#16803C] text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-2">
          DOAÇÃO CONFIRMADA
        </span>
        <h3 className="font-serif text-2xl font-bold text-[#0B2345] mb-2">
          Muito Obrigado pelo seu Apoio Patriótico!
        </h3>
        <p className="text-xs md:text-sm text-[#4A5568] max-w-md mx-auto leading-relaxed mb-6">
          Sua doação voluntária de <strong className="text-[#16803C]">R$ {selectedValue.toFixed(2).replace('.', ',')}</strong> fortalece nossa redação independente em Brasília e garante a continuidade de reportagens investigativas sem subvenção governamental.
        </p>

        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 max-w-sm mx-auto text-left text-xs space-y-1.5 mb-6 text-[#4A5568]">
          <div className="flex justify-between">
            <span className="text-[#718096]">Protocolo:</span>
            <span className="font-mono font-bold text-[#0B2345]">PAT-{Date.now().toString().slice(-8)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#718096]">Beneficiário:</span>
            <span className="font-medium text-[#0B2345] truncate max-w-[200px]">O Patriota Jornalismo</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#718096]">Destinação:</span>
            <span className="font-semibold text-[#16803C]">Fundo de Investigação e Checagem</span>
          </div>
        </div>

        <button
          onClick={() => setDonated(false)}
          className="text-xs font-bold text-[#0B2345] hover:text-[#0B5FFF] underline cursor-pointer"
        >
          Fazer outra contribuição
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl border-2 border-[#32BCAD]/30 shadow-md overflow-hidden ${compact ? 'p-5' : 'p-6 md:p-8'}`}>
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#32BCAD]/10 text-[#32BCAD] flex items-center justify-center font-black">
            <QrCode className="w-5 h-5 text-[#32BCAD]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-black text-lg md:text-xl text-[#0B2345] leading-none">
                Doação Instantânea via Pix
              </h3>
              <span className="bg-[#32BCAD] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider">
                PIX OFICIAL
              </span>
            </div>
            <p className="text-[11px] text-[#718096] mt-0.5">
              Contribuição voluntária sem taxas bancárias e com crédito direto na redação
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[#16803C] bg-[#EBF7EE] px-3 py-1 rounded-full text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Banco Central do Brasil</span>
        </div>
      </div>

      {/* Value selection buttons */}
      <div className="mb-6">
        <label className="block text-xs font-bold text-[#0B2345] uppercase tracking-wider mb-2.5">
          Selecione o valor da sua contribuição:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[10, 25, 50, 100].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => { setAmount(val); setIsCustom(false); }}
              className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition cursor-pointer border ${
                !isCustom && amount === val
                  ? 'bg-[#0B2345] text-white border-[#0B2345] shadow-xs'
                  : 'bg-[#F8FAFC] text-[#2D3748] border-[#D9DEE7] hover:border-[#0B2345]'
              }`}
            >
              R$ {val},00
            </button>
          ))}
          <button
            type="button"
            onClick={() => setIsCustom(true)}
            className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition cursor-pointer border ${
              isCustom
                ? 'bg-[#0B2345] text-white border-[#0B2345] shadow-xs'
                : 'bg-[#F8FAFC] text-[#2D3748] border-[#D9DEE7] hover:border-[#0B2345]'
            }`}
          >
            Outro Valor
          </button>
        </div>

        {isCustom && (
          <div className="mt-3 flex items-center gap-2 max-w-xs">
            <span className="text-xs font-bold text-[#4A5568]">R$</span>
            <input
              type="text"
              placeholder="Ex: 75,00"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="flex-1 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-3 py-1.5 text-xs font-bold text-[#0B2345] focus:outline-hidden focus:ring-2 focus:ring-[#0B2345]"
            />
          </div>
        )}
      </div>

      {/* Main Grid: QR Code & Pix Code */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-[#F8FAFC] p-5 rounded-xl border border-[#E2E8F0]">
        {/* Left: QR Code Box */}
        <div className="md:col-span-5 flex flex-col items-center justify-center text-center">
          <div className="bg-white p-3.5 rounded-xl border-2 border-[#CBD5E1] shadow-xs relative group">
            {/* Authentic SVG QR Code Visualization */}
            <svg
              className="w-44 h-44 md:w-48 md:h-48"
              viewBox="0 0 160 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer background */}
              <rect width="160" height="160" fill="white" />
              
              {/* Finder pattern Top-Left */}
              <rect x="10" y="10" width="36" height="36" rx="6" fill="#0B2345" />
              <rect x="16" y="16" width="24" height="24" rx="3" fill="white" />
              <rect x="22" y="22" width="12" height="12" rx="2" fill="#0B2345" />
              
              {/* Finder pattern Top-Right */}
              <rect x="114" y="10" width="36" height="36" rx="6" fill="#0B2345" />
              <rect x="120" y="16" width="24" height="24" rx="3" fill="white" />
              <rect x="126" y="22" width="12" height="12" rx="2" fill="#0B2345" />
              
              {/* Finder pattern Bottom-Left */}
              <rect x="10" y="114" width="36" height="36" rx="6" fill="#0B2345" />
              <rect x="16" y="120" width="24" height="24" rx="3" fill="white" />
              <rect x="22" y="126" width="12" height="12" rx="2" fill="#0B2345" />
              
              {/* Data modules pattern simulation */}
              <rect x="54" y="12" width="6" height="6" fill="#0B2345" />
              <rect x="66" y="12" width="6" height="6" fill="#0B2345" />
              <rect x="78" y="12" width="6" height="6" fill="#0B2345" />
              <rect x="90" y="12" width="6" height="6" fill="#0B2345" />
              <rect x="102" y="12" width="6" height="6" fill="#0B2345" />
              
              <rect x="54" y="24" width="6" height="6" fill="#0B2345" />
              <rect x="72" y="24" width="6" height="6" fill="#0B2345" />
              <rect x="84" y="24" width="6" height="6" fill="#0B2345" />
              <rect x="96" y="24" width="6" height="6" fill="#0B2345" />

              <rect x="54" y="36" width="6" height="6" fill="#0B2345" />
              <rect x="66" y="36" width="6" height="6" fill="#0B2345" />
              <rect x="90" y="36" width="6" height="6" fill="#0B2345" />

              <rect x="12" y="54" width="6" height="6" fill="#0B2345" />
              <rect x="24" y="54" width="6" height="6" fill="#0B2345" />
              <rect x="36" y="54" width="6" height="6" fill="#0B2345" />
              <rect x="48" y="54" width="6" height="6" fill="#0B2345" />
              <rect x="60" y="54" width="6" height="6" fill="#0B2345" />
              <rect x="72" y="54" width="6" height="6" fill="#0B2345" />
              <rect x="84" y="54" width="6" height="6" fill="#0B2345" />
              <rect x="108" y="54" width="6" height="6" fill="#0B2345" />
              <rect x="120" y="54" width="6" height="6" fill="#0B2345" />
              <rect x="138" y="54" width="6" height="6" fill="#0B2345" />

              <rect x="12" y="66" width="6" height="6" fill="#0B2345" />
              <rect x="30" y="66" width="6" height="6" fill="#0B2345" />
              <rect x="48" y="66" width="6" height="6" fill="#0B2345" />
              <rect x="102" y="66" width="6" height="6" fill="#0B2345" />
              <rect x="126" y="66" width="6" height="6" fill="#0B2345" />
              <rect x="144" y="66" width="6" height="6" fill="#0B2345" />

              <rect x="12" y="78" width="6" height="6" fill="#0B2345" />
              <rect x="24" y="78" width="6" height="6" fill="#0B2345" />
              <rect x="42" y="78" width="6" height="6" fill="#0B2345" />
              <rect x="114" y="78" width="6" height="6" fill="#0B2345" />
              <rect x="132" y="78" width="6" height="6" fill="#0B2345" />

              <rect x="18" y="90" width="6" height="6" fill="#0B2345" />
              <rect x="36" y="90" width="6" height="6" fill="#0B2345" />
              <rect x="54" y="90" width="6" height="6" fill="#0B2345" />
              <rect x="108" y="90" width="6" height="6" fill="#0B2345" />
              <rect x="126" y="90" width="6" height="6" fill="#0B2345" />
              <rect x="144" y="90" width="6" height="6" fill="#0B2345" />

              <rect x="12" y="102" width="6" height="6" fill="#0B2345" />
              <rect x="30" y="102" width="6" height="6" fill="#0B2345" />
              <rect x="48" y="102" width="6" height="6" fill="#0B2345" />
              <rect x="66" y="102" width="6" height="6" fill="#0B2345" />
              <rect x="78" y="102" width="6" height="6" fill="#0B2345" />
              <rect x="96" y="102" width="6" height="6" fill="#0B2345" />
              <rect x="114" y="102" width="6" height="6" fill="#0B2345" />
              <rect x="138" y="102" width="6" height="6" fill="#0B2345" />

              <rect x="54" y="114" width="6" height="6" fill="#0B2345" />
              <rect x="72" y="114" width="6" height="6" fill="#0B2345" />
              <rect x="90" y="114" width="6" height="6" fill="#0B2345" />
              <rect x="108" y="114" width="6" height="6" fill="#0B2345" />
              <rect x="126" y="114" width="6" height="6" fill="#0B2345" />
              <rect x="138" y="114" width="6" height="6" fill="#0B2345" />

              <rect x="54" y="126" width="6" height="6" fill="#0B2345" />
              <rect x="66" y="126" width="6" height="6" fill="#0B2345" />
              <rect x="84" y="126" width="6" height="6" fill="#0B2345" />
              <rect x="102" y="126" width="6" height="6" fill="#0B2345" />
              <rect x="120" y="126" width="6" height="6" fill="#0B2345" />
              <rect x="144" y="126" width="6" height="6" fill="#0B2345" />

              <rect x="60" y="138" width="6" height="6" fill="#0B2345" />
              <rect x="78" y="138" width="6" height="6" fill="#0B2345" />
              <rect x="96" y="138" width="6" height="6" fill="#0B2345" />
              <rect x="114" y="138" width="6" height="6" fill="#0B2345" />
              <rect x="132" y="138" width="6" height="6" fill="#0B2345" />

              {/* Center Pix Symbol */}
              <circle cx="80" cy="80" r="16" fill="#32BCAD" />
              <path 
                d="M74 76L80 70L86 76L80 82L74 76Z M74 84L80 90L86 84L80 78L74 84Z" 
                fill="white" 
              />
            </svg>
          </div>
          <span className="text-[11px] font-bold text-[#5D6673] mt-2 flex items-center gap-1">
            <QrCode className="w-3.5 h-3.5 text-[#32BCAD]" />
            Aponte a câmera do aplicativo do seu banco
          </span>
        </div>

        {/* Right: Pix Details & Copia e Cola */}
        <div className="md:col-span-7 space-y-3.5">
          <div>
            <div className="text-[11px] font-bold text-[#718096] uppercase">Chave Pix Direta (E-mail):</div>
            <div className="font-mono font-bold text-sm text-[#0B2345] bg-white border border-[#CBD5E1] px-3 py-1.5 rounded-lg flex items-center justify-between">
              <span>{pixKey}</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(pixKey);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="text-[11px] text-[#0B5FFF] font-bold hover:underline cursor-pointer"
              >
                Copiar Chave
              </button>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-[#718096] uppercase mb-1">
              Código Pix Copia e Cola (Valor: R$ {selectedValue.toFixed(2).replace('.', ',')}):
            </div>
            <div className="relative">
              <textarea
                readOnly
                value={pixCopiaECola}
                rows={2}
                className="w-full bg-white border border-[#CBD5E1] rounded-lg p-2.5 font-mono text-[11px] text-[#4A5568] focus:outline-hidden resize-none select-all"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleCopy}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 ${
                copied
                  ? 'bg-[#16803C] text-white shadow-xs'
                  : 'bg-[#32BCAD] hover:bg-[#28A699] text-white shadow-sm active:scale-98'
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>CÓDIGO PIX COPIADO!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>COPIAR CÓDIGO PIX</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSimulatePayment}
              className="py-3 px-4 rounded-xl text-xs font-bold bg-[#0B2345] hover:bg-[#163866] text-white transition cursor-pointer flex items-center justify-center gap-2 shadow-sm active:scale-98"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>JÁ REALIZEI O PIX</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#718096] pt-1">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#16803C]" />
              Transação criptografada pelo SPB / Bacen
            </span>
            <span>Identificador: O PATRIOTA</span>
          </div>
        </div>
      </div>
    </div>
  );
};
