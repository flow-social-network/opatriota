import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, FileText, BookOpen, Users, Scale } from 'lucide-react';

type Info = { title: string; eyebrow: string; intro: string; sections: { title: string; body: string }[] };

const CONTENT: Record<string, Info> = {
  'sobre-o-patriota': { eyebrow: 'Institucional', title: 'Sobre O Patriota Brasil', intro: 'O Patriota Brasil é um projeto jornalístico digital dedicado à cobertura de assuntos públicos, política, economia, segurança, cultura e temas que impactam a vida dos brasileiros.', sections: [
    { title: 'Nossa missão', body: 'Informar com clareza, contextualizar os acontecimentos e permitir que o leitor consulte as fontes e compreenda a diferença entre notícia, análise, opinião e conteúdo patrocinado.' },
    { title: 'Compromisso editorial', body: 'A publicação de conteúdos deve respeitar a verificação dos fatos, a identificação das fontes disponíveis, o direito de resposta e a correção transparente de erros.' },
    { title: 'Independência', body: 'A cobertura jornalística deve distinguir decisões editoriais de interesses comerciais, partidários ou de anunciantes.' }
  ]},
  'principios-editoriais': { eyebrow: 'Transparência', title: 'Princípios editoriais', intro: 'Estes princípios orientam a produção, a edição e a correção do conteúdo publicado pelo O Patriota Brasil.', sections: [
    { title: 'Precisão e verificação', body: 'Afirmações factuais devem ser verificadas com fontes identificáveis e, sempre que possível, documentos originais. Alegações ainda não confirmadas devem ser identificadas como tais.' },
    { title: 'Separação entre notícia e opinião', body: 'Notícias, análises, colunas, sátiras e conteúdos publicitários devem ser identificados de modo que o leitor reconheça a natureza de cada publicação.' },
    { title: 'Correções e direito de resposta', body: 'Erros relevantes devem ser corrigidos com transparência. Pedidos de correção ou manifestação podem ser encaminhados à redação pela página de contato.' },
    { title: 'Responsabilidade', body: 'Não se deve apresentar conteúdo de terceiros como apuração própria nem atribuir credenciais, declarações ou dados sem base verificável.' }
  ]},
  'expediente': { eyebrow: 'Institucional', title: 'Expediente e redação', intro: 'Informações editoriais e canais de contato do O Patriota Brasil.', sections: [
    { title: 'Responsabilidade editorial', body: 'A identificação nominal de responsáveis, endereço empresarial e registros profissionais deve ser publicada somente após confirmação documental e validação institucional.' },
    { title: 'Contato da redação', body: 'Para sugestões de pauta, envio de documentos, pedidos de correção ou direito de resposta, utilize o canal oficial de contato.' },
    { title: 'Transparência', body: 'O expediente será atualizado quando os dados institucionais e responsáveis estiverem formalmente confirmados.' }
  ]},
  'fontes-e-metodologia': { eyebrow: 'Jornalismo', title: 'Fontes e metodologia', intro: 'O conteúdo pode combinar apuração própria, documentos públicos, comunicados oficiais e feeds de fontes jornalísticas cadastradas.', sections: [
    { title: 'Fontes primárias', body: 'Sempre que disponível, priorizamos documentos oficiais, decisões judiciais, dados públicos, notas técnicas, entrevistas e declarações atribuídas.' },
    { title: 'Fontes secundárias', body: 'Conteúdos de outros veículos devem preservar a atribuição da origem. A presença em um feed não significa, por si só, confirmação independente da informação.' },
    { title: 'Imagens e contexto', body: 'Fotografias devem corresponder ao conteúdo quando disponíveis. Imagens ilustrativas precisam ser tratadas como tal e não devem induzir o leitor a erro.' }
  ]},
  'politica-de-correcoes': { eyebrow: 'Transparência', title: 'Política de correções', intro: 'O Patriota Brasil recebe apontamentos sobre erros factuais e procura tratar pedidos de forma responsável.', sections: [
    { title: 'Como solicitar', body: 'Envie o endereço da publicação, descreva o trecho questionado e, se possível, inclua documentação que sustente a correção solicitada.' },
    { title: 'Análise', body: 'A redação deve avaliar o pedido e, quando houver erro confirmado, corrigir a informação de forma proporcional e transparente.' },
    { title: 'Direito de resposta', body: 'Pedidos de manifestação ou direito de resposta podem ser enviados pelo formulário de contato, com identificação do conteúdo e dos fatos envolvidos.' }
  ]},
  'politica-de-privacidade': { eyebrow: 'Privacidade', title: 'Política de privacidade', intro: 'Esta página explica, em termos gerais, o compromisso de transparência no tratamento de dados no portal.', sections: [
    { title: 'Dados tratados', body: 'Dados enviados voluntariamente em formulários, informações de conta e dados técnicos necessários ao funcionamento podem ser tratados conforme a finalidade de cada serviço.' },
    { title: 'Finalidade e segurança', body: 'O tratamento deve observar finalidade, necessidade, transparência e medidas de segurança compatíveis com os dados processados.' },
    { title: 'Solicitações do titular', body: 'Para solicitar acesso, correção ou outras providências relacionadas aos seus dados, consulte a página de Gestão de Dados (LGPD).' }
  ]},
  'termos-de-uso': { eyebrow: 'Condições de uso', title: 'Termos de uso', intro: 'Ao utilizar o portal, o leitor deve respeitar a legislação aplicável e os direitos relativos aos conteúdos publicados.', sections: [
    { title: 'Conteúdo jornalístico', body: 'O conteúdo é disponibilizado para informação. A publicação de uma notícia não constitui aconselhamento jurídico, financeiro ou profissional individualizado.' },
    { title: 'Direitos autorais', body: 'Textos, marcas, fotografias e outros materiais estão sujeitos aos direitos dos respetivos titulares. A reprodução deve observar a legislação e a atribuição devida.' },
    { title: 'Disponibilidade', body: 'O portal pode passar por manutenção ou alterações. Não se deve interpretar a disponibilidade de uma página como garantia de que serviços externos estejam operacionais.' }
  ]},
  'seguranca-da-informacao': { eyebrow: 'Segurança', title: 'Segurança da informação', intro: 'A proteção de contas e dados depende de medidas técnicas e de cuidados dos utilizadores.', sections: [
    { title: 'Proteção de conta', body: 'Utilize uma senha exclusiva, não compartilhe códigos de acesso e encerre sessões em dispositivos partilhados.' },
    { title: 'Comunicação de incidentes', body: 'Suspeitas de acesso indevido ou exposição de dados devem ser comunicadas à equipe responsável pelo canal oficial de contato.' }
  ]},
  'contrato-de-assinatura': { eyebrow: 'Assinaturas', title: 'Contrato de assinatura digital', intro: 'Esta página apresenta informações gerais sobre a assinatura. As condições comerciais finais devem ser exibidas antes da confirmação do pagamento.', sections: [
    { title: 'Plano e preço', body: 'O plano, o preço, a periodicidade, os benefícios e eventuais condições promocionais devem corresponder às informações mostradas no checkout no momento da contratação.' },
    { title: 'Pagamento e renovação', body: 'A cobrança e a renovação seguem as condições apresentadas pelo processador de pagamento e no checkout. Consulte os detalhes antes de confirmar.' },
    { title: 'Cancelamento e suporte', body: 'Pedidos relacionados com a assinatura podem ser feitos pela área do assinante ou pelo canal de contato. Direitos legais aplicáveis permanecem preservados.' },
    { title: 'Condições contratuais', body: 'Este texto informativo não substitui a versão contratual completa aprovada juridicamente. A contratação deve apresentar os termos vinculantes antes do pagamento.' }
  ]},
};

const ALIASES: Record<string, string> = {
  'sobre': 'sobre-o-patriota', 'principios': 'principios-editoriais', 'principios-editoriais': 'principios-editoriais',
  'expediente-e-redacao': 'expediente', 'fontes': 'fontes-e-metodologia', 'metodologia': 'fontes-e-metodologia',
  'correcoes': 'politica-de-correcoes', 'privacidade': 'politica-de-privacidade', 'termos': 'termos-de-uso',
  'contrato': 'contrato-de-assinatura', 'contrato-assinatura': 'contrato-de-assinatura',
};

export default function InstitutionalInfoPage() {
  const { pathname } = useLocation();
  const rawSlug = pathname.split('/').filter(Boolean).pop() || 'sobre-o-patriota';
  const slug = ALIASES[rawSlug] || rawSlug;
  const info = CONTENT[slug] || CONTENT['sobre-o-patriota'];
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
      <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-[#5D6673]"><ShieldCheck className="h-4 w-4 text-[#16803C]" /> {info.eyebrow}</div>
      <article className="overflow-hidden rounded-2xl border border-[#D9DEE7] bg-white shadow-sm">
        <header className="border-b border-[#D9DEE7] bg-gradient-to-r from-[#0B2345] to-[#173C67] px-6 py-8 text-white sm:px-10 sm:py-12">
          <p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-[#FFCC29]">O Patriota Brasil</p>
          <h1 className="max-w-3xl font-serif text-3xl font-bold leading-tight sm:text-4xl">{info.title}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/85 sm:text-base">{info.intro}</p>
        </header>
        <div className="space-y-8 px-6 py-8 sm:px-10 sm:py-10">
          {info.sections.map((section) => <section key={section.title} className="max-w-3xl"><h2 className="mb-2 flex items-center gap-2 font-serif text-xl font-bold text-[#0B2345]"><BookOpen className="h-4 w-4 text-[#16803C]" />{section.title}</h2><p className="text-sm leading-7 text-[#4A5568]">{section.body}</p></section>)}
          <div className="flex flex-wrap gap-3 border-t border-[#E8EBF0] pt-6">
            <Link to="/contato" className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#0B2345] px-5 py-2 text-sm font-bold text-white hover:bg-[#0B5FFF]"><Users className="h-4 w-4" /> Falar com a redação</Link>
            <Link to="/planos" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#D9DEE7] px-5 py-2 text-sm font-bold text-[#0B2345] hover:bg-[#F1F3F5]"><Scale className="h-4 w-4" /> Ver planos</Link>
            <Link to="/" className="inline-flex min-h-10 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[#5D6673] hover:text-[#0B2345]"><ArrowLeft className="h-4 w-4" /> Voltar ao início</Link>
          </div>
        </div>
      </article>
      <p className="mt-4 text-xs leading-5 text-[#6B7280]">Nota: textos institucionais e contratuais devem ser revistos e aprovados pela administração responsável antes de serem tratados como declarações jurídicas definitivas.</p>
    </main>
  );
}
