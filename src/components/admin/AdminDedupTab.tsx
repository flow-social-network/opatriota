import React from 'react';
import { Shield } from 'lucide-react';

interface AdminDedupTabProps {
  testTitle: string;
  onTestTitleChange: (value: string) => void;
  dedupTestResult: any;
  onSubmitTest: (e: React.FormEvent) => void;
}

export const AdminDedupTab: React.FC<AdminDedupTabProps> = ({
  testTitle,
  onTestTitleChange,
  dedupTestResult,
  onSubmitTest
}) => {
  return (
    <div className="bg-white p-6 rounded border border-[#D9DEE7] shadow-xs space-y-6">
      <div>
        <h3 className="font-serif text-lg font-bold text-[#0B2345]">
          Motor de Deduplicação em 5 Camadas
        </h3>
        <p className="text-xs text-[#5D6673]">
          Evita duplicidades e plágio involuntário comparando URLs canônicas, GUIDs RSS, hashes de texto e distâncias fonéticas/Levenshtein.
        </p>
      </div>

      {/* Interactive Deduplication Tester */}
      <div className="p-5 bg-[#F7F8FA] border border-[#D9DEE7] rounded space-y-4">
        <h4 className="font-bold text-xs uppercase text-[#0B2345] flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-[#0B5FFF]" />
          <span>Simulador Interativo das 5 Camadas</span>
        </h4>

        <form onSubmit={onSubmitTest} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold mb-1">Título da Notícia a Testar:</label>
            <input
              type="text"
              placeholder="Digite o título da matéria para testar similaridade..."
              value={testTitle}
              onChange={(e) => onTestTitleChange(e.target.value)}
              className="w-full border border-[#D9DEE7] p-2.5 rounded bg-white text-xs"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-[#0B2345] hover:bg-[#0B5FFF] text-white font-bold px-4 py-2 rounded transition cursor-pointer"
          >
            Executar Teste de Deduplicação
          </button>
        </form>

        {dedupTestResult && (
          <div 
            className="p-4 rounded border text-xs space-y-2 mt-4"
            style={{ borderColor: dedupTestResult.color, backgroundColor: `${dedupTestResult.color}10` }}
          >
            <div className="flex items-center justify-between font-bold" style={{ color: dedupTestResult.color }}>
              <span>RESULTADO: {dedupTestResult.status}</span>
              <span>Similaridade: {dedupTestResult.score}%</span>
            </div>
            <p className="text-[#17202A] leading-relaxed">
              {dedupTestResult.reason}
            </p>
          </div>
        )}
      </div>

      {/* Architecture Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded">
          <strong className="block text-[#0B2345] mb-1">Camada 1: URL Canônica</strong>
          <p className="text-[#5D6673]">Limpa parâmetros UTM, fbclid e normaliza trailing slashes.</p>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded">
          <strong className="block text-[#0B2345] mb-1">Camada 2: GUID RSS</strong>
          <p className="text-[#5D6673]">Verifica o identificador único fornecido pelo veículo emissor.</p>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded">
          <strong className="block text-[#0B2345] mb-1">Camada 3: Hash do Título</strong>
          <p className="text-[#5D6673]">SHA-256 do texto minúsculo, sem pontuação ou acentos.</p>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded">
          <strong className="block text-[#0B2345] mb-1">Camada 4: Similaridade</strong>
          <p className="text-[#5D6673]">Algoritmo similar_text com threshold em 82% nas últimas 72h.</p>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded">
          <strong className="block text-[#0B2345] mb-1">Camada 5: Decisão Humana</strong>
          <p className="text-[#5D6673]">Caso ambíguo é remetido obrigatoriamente para a redação.</p>
        </div>
      </div>
    </div>
  );
};
