import React from 'react';
import { ShieldCheck, BookOpen, FileText } from 'lucide-react';

interface InstitutionalModalProps {
  pageId: string | null;
  onClose: () => void;
}

export const InstitutionalModal: React.FC<InstitutionalModalProps> = ({ pageId, onClose }) => {
  if (!pageId) return null;

  const getContent = () => {
    switch (pageId) {
      case 'sobre':
        return {
          title: 'Sobre O Patriota',
          tag: 'IDENTIDADE EDITORIAL',
          body: (
            <div className="space-y-4 text-xs text-[#17202A] leading-relaxed">
              <p>
                <strong>O PATRIOTA — Notícias, Análise e Opinião</strong> é um veículo de comunicação jornalística independente, fundado sob o lema <em>"Informação com liberdade por um Brasil mais forte"</em>.
              </p>
              <p>
                Nossa atuação fundamenta-se na crença inegociável de que uma sociedade livre e democrática prospera quando alimentada por fatos verificados, debates de ideias com profundidade e respeito às instituições do Estado Democrático de Direito.
              </p>
              <p>
                Não pertencemos a partidos políticos ou grupos econômicos fechados. Nosso compromisso é com o público leitor e com o futuro do Brasil.
              </p>
            </div>
          )
        };
      case 'expediente':
        return {
          title: 'Expediente e Redação',
          tag: 'TRANSPARÊNCIA',
          body: (
            <div className="space-y-4 text-xs text-[#17202A] leading-relaxed">
              <div className="border-b border-[#D9DEE7] pb-3">
                <strong className="block text-[#0B2345]">Diretoria de Redação & Conselho Editorial</strong>
                <p className="text-[#5D6673]">Equipe multidisciplinar de jornalistas diplomados e analistas de políticas públicas.</p>
              </div>
              <div className="border-b border-[#D9DEE7] pb-3">
                <strong className="block text-[#0B2345]">Editoria de Política & Congresso</strong>
                <p className="text-[#5D6673]">Brasília - Distrito Federal (Correspondência credenciada no Congresso Nacional).</p>
              </div>
              <div className="border-b border-[#D9DEE7] pb-3">
                <strong className="block text-[#0B2345]">Núcleo de Checagem de Fatos</strong>
                <p className="text-[#5D6673]">Auditores de dados públicos e analistas de fontes primárias.</p>
              </div>
              <div>
                <strong className="block text-[#0B2345]">Contato da Redação</strong>
                <p className="text-[#5D6673]">redacao@opatriota.com.br • Brasília - DF</p>
              </div>
            </div>
          )
        };
      case 'linha-editorial':
        return {
          title: 'Princípios Editoriais',
          tag: 'CÓDIGO DE ÉTICA',
          body: (
            <div className="space-y-4 text-xs text-[#17202A] leading-relaxed">
              <p>
                <strong>1. Primazia da Verdade Factual:</strong> Os fatos são sagrados, as opiniões são livres. Notícias jamais devem misturar juízo de valor pessoal com relatos circunstanciados.
              </p>
              <p>
                <strong>2. Atribuição e Rigor Documental:</strong> Nenhuma acusação ou afirmação de impacto é publicada sem documento comprobatório, áudio verificado ou declaração registrada em fontes oficiais.
              </p>
              <p>
                <strong>3. Pluralidade e Contraditório:</strong> Sempre que uma matéria envolver partes antagônicas, o espaço para resposta é concedido em igualdade de condições.
              </p>
              <p>
                <strong>4. Brasil em Primeiro Lugar:</strong> Defesa da soberania territorial, da segurança pública e do direito de empreender de cada família brasileira.
              </p>
            </div>
          )
        };
      case 'fontes-metodologia':
        return {
          title: 'Fontes e Metodologia',
          tag: 'MÉTODO DE APURAÇÃO',
          body: (
            <div className="space-y-4 text-xs text-[#17202A] leading-relaxed">
              <p>
                O Patriota mantém conexão com canais RSS e APIs públicas de órgãos oficiais da República Federativa do Brasil, incluindo:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[#5D6673]">
                <li>Senado Federal e Câmara dos Deputados</li>
                <li>Supremo Tribunal Federal e Tribunais Superiores</li>
                <li>Ministério da Fazenda, Ministério da Justiça e Saúde</li>
                <li>Agência Brasil / EBC e Diário Oficial da União</li>
              </ul>
              <p>
                <strong>Publicação Humana Obrigatória:</strong> A esteira automatizada realiza triagem e deduplicação em 5 camadas. Em nenhuma circunstância qualquer matéria é publicada sem a autorização expressa de um editor de redação.
              </p>
            </div>
          )
        };
      case 'correcoes':
        return {
          title: 'Política de Correções e Erratas',
          tag: 'COMPROMISSO COM O LEITOR',
          body: (
            <div className="space-y-4 text-xs text-[#17202A] leading-relaxed">
              <p>
                Erros factuais, quando identificados pela redação ou apontados por leitores, são corrigidos com celeridade e transparência.
              </p>
              <p>
                Quando uma matéria for retificada, uma nota de atualização será inserida no topo ou rodapé do texto, com indicação precisa do que foi corrigido e o horário da atualização.
              </p>
            </div>
          )
        };
      case 'privacidade':
      case 'termos':
      case 'lgpd':
        return {
          title: 'Privacidade, Dados e LGPD',
          tag: 'LEI 13.709/2018',
          body: (
            <div className="space-y-4 text-xs text-[#17202A] leading-relaxed">
              <p>
                O PATRIOTA respeita rigorosamente a Lei Geral de Proteção de Dados (LGPD). Não comercializamos, compartilhamos ou repassamos informações pessoais fornecidas por assinantes de newsletter ou apoiadores.
              </p>
              <p>
                Qualquer titular de dados pode solicitar a exclusão de seu e-mail de nossas listas a qualquer momento pelo canal: privacidade@opatriota.com.br.
              </p>
            </div>
          )
        };
      case 'anuncie':
        return {
          title: 'Anuncie em O Patriota',
          tag: 'PUBLICIDADE TRANSPARENTE',
          body: (
            <div className="space-y-4 text-xs text-[#17202A] leading-relaxed">
              <p>
                Conecte sua marca a um público qualificado, consciente e engajado com os destinos da nação brasileira.
              </p>
              <p>
                Disponibilizamos formatos de banners no cabeçalho, rodapé, barra lateral e patrocínios de editorias devidamente identificados como espaço publicitário.
              </p>
              <p>
                Contato comercial: comercial@opatriota.com.br.
              </p>
            </div>
          )
        };
      default:
        return {
          title: 'Informação Institucional',
          tag: 'O PATRIOTA',
          body: <p>Conteúdo em atualização pela redação.</p>
        };
    }
  };

  const current = getContent();

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-lg max-w-xl w-full p-6 shadow-xl relative animate-in fade-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold text-lg p-1 cursor-pointer"
        >
          ✕
        </button>

        <div className="mb-4 pb-3 border-b border-[#D9DEE7]">
          <span className="text-[10px] font-bold text-[#0B5FFF] tracking-wider uppercase block mb-1">
            {current.tag}
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#0B2345]">
            {current.title}
          </h2>
        </div>

        <div className="max-h-[60vh] overflow-y-auto pr-1">
          {current.body}
        </div>

        <div className="mt-6 pt-3 border-t border-[#D9DEE7] flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#0B2345] hover:bg-[#0B5FFF] text-white text-xs font-bold px-4 py-2 rounded transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
