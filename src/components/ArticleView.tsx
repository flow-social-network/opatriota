import React, { useState } from 'react';
import { Article, CategorySlug, UserSession } from '../types';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  User, 
  Share2, 
  Printer, 
  ShieldCheck, 
  ExternalLink, 
  Bookmark, 
  Lock, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface ArticleViewProps {
  article: Article;
  onBack: () => void;
  onSelectCategory: (cat: CategorySlug) => void;
  onSelectArticle: (art: Article) => void;
  relatedArticles: Article[];
  currentUser: UserSession | null;
  onToggleBookmark: (artId: string) => void;
  onOpenSubscribe: () => void;
  onOpenLogin: () => void;
  onSelectAuthor?: (authorName: string) => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  article,
  onBack,
  onSelectCategory,
  onSelectArticle,
  relatedArticles,
  currentUser,
  onToggleBookmark,
  onOpenSubscribe,
  onOpenLogin,
  onSelectAuthor
}) => {
  const [copied, setCopied] = useState(false);
  const isBookmarked = currentUser?.bookmarks?.includes(article.id) || false;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.subtitle,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // Determine if the current reader can access this article based on server-like validation
  const canAccessFullArticle = () => {
    if (article.accessLevel === 'aberto') {
      return true;
    }

    // Staff members always have full access
    const staffRoles = ['jornalista', 'revisor', 'editor', 'editor_chefe', 'administrador'];
    if (currentUser && staffRoles.includes(currentUser.role)) {
      return true;
    }

    if (!currentUser) {
      return false;
    }

    if (article.accessLevel === 'assinante') {
      return currentUser.subscription.plan === 'digital' || currentUser.subscription.plan === 'premium';
    }

    if (article.accessLevel === 'premium') {
      return currentUser.subscription.plan === 'premium';
    }

    return false;
  };

  const isAccessAllowed = canAccessFullArticle();
  const paragraphs = article.content.split('\n\n');
  const visibleParagraphs = isAccessAllowed ? paragraphs : paragraphs.slice(0, 1);

  return (
    <div className="max-w-[1360px] mx-auto px-4 py-8 select-none">
      {/* Top back navigation & action bar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#D9DEE7]">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#0B2345] hover:text-[#0B5FFF] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>VOLTAR PARA A HOMEPAGE</span>
        </button>

        <div className="flex items-center gap-2 text-xs">
          {/* Bookmark Button */}
          <button
            onClick={() => onToggleBookmark(article.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded border transition cursor-pointer ${
              isBookmarked
                ? 'bg-[#EBF7EE] text-[#16803C] border-[#16803C]'
                : 'border-[#D9DEE7] hover:bg-[#F1F3F5] text-[#17202A]'
            }`}
            title={isBookmarked ? 'Remover dos favoritos' : 'Salvar para ler depois'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#16803C]' : ''}`} />
            <span>{isBookmarked ? 'Salvo' : 'Salvar'}</span>
          </button>

          <button
            onClick={handleShare}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded border transition cursor-pointer ${
              copied
                ? 'bg-[#EBF7EE] text-[#16803C] border-[#16803C] font-semibold'
                : 'border-[#D9DEE7] hover:bg-[#F1F3F5] text-[#17202A]'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Link Copiado!' : 'Compartilhar'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#D9DEE7] hover:bg-[#F1F3F5] text-[#17202A] transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Main Article Content (8 cols on lg) */}
        <main className="lg:col-span-8">
          <article>
            {/* Category Kicker & Access Level Badge */}
            <div className="mb-3 flex items-center gap-3">
              <button
                onClick={() => onSelectCategory(article.category)}
                className="text-xs font-bold uppercase tracking-wider text-[#0B5FFF] hover:underline cursor-pointer"
              >
                {article.kicker}
              </button>

              {article.accessLevel !== 'aberto' && (
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 ${
                  article.accessLevel === 'premium' ? 'bg-[#FFCC29] text-[#17202A]' : 'bg-[#0B2345] text-white'
                }`}>
                  <Lock className="w-2.5 h-2.5" />
                  <span>{article.accessLevel === 'premium' ? 'PATRIOTA PREMIUM' : 'EXCLUSIVO ASSINANTES'}</span>
                </span>
              )}
            </div>

            {/* Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B2345] leading-[1.15] mb-4">
              {article.title}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#5D6673] leading-relaxed mb-6 font-normal">
              {article.subtitle}
            </p>

            {/* Author Byline & Date & Read Time */}
            <div className="flex flex-wrap items-center gap-4 py-4 border-y border-[#D9DEE7] mb-8 text-xs text-[#5D6673]">
              <div className="flex items-center gap-2 font-medium text-[#17202A]">
                <User className="w-3.5 h-3.5 text-[#0B5FFF]" />
                {onSelectAuthor ? (
                  <button
                    onClick={() => onSelectAuthor(article.author)}
                    className="font-bold text-[#0B2345] hover:text-[#0B5FFF] hover:underline cursor-pointer"
                  >
                    {article.author}
                  </button>
                ) : (
                  <span className="font-bold">{article.author}</span>
                )}
                <span>({article.authorRole})</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#5D6673]" />
                <span>{article.publishedAt}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#5D6673]" />
                <span>{article.readTimeMinutes} min de leitura</span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="mb-8 rounded overflow-hidden border border-[#D9DEE7] bg-slate-100">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full max-h-[480px] object-cover"
              />
              {(article.imageCaption || article.imageCredits) && (
                <div className="p-3 bg-[#F7F8FA] border-t border-[#D9DEE7] text-xs text-[#5D6673] flex justify-between items-center">
                  <span className="italic">{article.imageCaption}</span>
                  {article.imageCredits && <span className="text-[10px] uppercase font-semibold">Créditos: {article.imageCredits}</span>}
                </div>
              )}
            </div>

            {/* Article Prose */}
            <div className="prose prose-slate max-w-none text-[#17202A] text-base leading-relaxed space-y-6">
              {visibleParagraphs.map((para, idx) => (
                <p key={idx} className="leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            {/* IF ACCESS IS BLOCKED: RENDER PAYWALL BARRIER */}
            {!isAccessAllowed && (
              <div className="my-10 p-8 bg-[#0B2345] text-white rounded border border-[#07172E] text-center shadow-lg relative overflow-hidden">
                <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                  <div className="inline-flex items-center gap-1.5 bg-[#FFCC29] text-[#17202A] text-[10px] font-black tracking-widest px-3 py-1 rounded uppercase">
                    <Lock className="w-3 h-3" />
                    <span>CONTEÚDO EXCLUSIVO PARA ASSINANTES</span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                    Continue lendo esta reportagem com o jornalismo independente de O Patriota
                  </h3>

                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                    {article.accessLevel === 'premium'
                      ? 'Esta análise de inteligência estratégica é exclusiva para os membros do plano Patriota Premium. Assine agora para desbloquear o acesso total.'
                      : 'Nossas investigações aprofundadas e bastidores de Brasília são viabilizados pelo apoio direto dos nossos assinantes.'}
                  </p>

                  <div className="pt-2 flex flex-wrap justify-center gap-3">
                    <button
                      onClick={onOpenSubscribe}
                      className="bg-[#16803C] hover:bg-[#22A447] text-white font-bold text-xs px-6 py-3 rounded transition shadow-md cursor-pointer flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-[#FFCC29]" />
                      <span>CONHECER PLANOS DE ASSINATURA →</span>
                    </button>

                    <button
                      onClick={onOpenLogin}
                      className="border border-white/30 hover:border-white text-white font-bold text-xs px-6 py-3 rounded transition cursor-pointer"
                    >
                      JÁ É ASSINANTE? FAÇA LOGIN
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Author Profile Box (Modelo 4 integration) */}
            <div className="mt-10 p-5 bg-white rounded-lg border border-[#D9DEE7] shadow-2xs flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-[#0B2345] text-white flex items-center justify-center font-serif font-black text-lg shrink-0">
                {article.author.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <span className="text-[10px] font-bold text-[#0B5FFF] uppercase tracking-wider block">AUTORIA DA REPORTAGEM</span>
                <h4 className="font-serif font-bold text-base text-[#0B2345] mb-1">
                  {article.author}
                </h4>
                <p className="text-xs text-[#5D6673] mb-2">
                  {article.authorRole} • Registro Profissional e Cobertura Editorial O Patriota.
                </p>
                {onSelectAuthor && (
                  <button
                    onClick={() => onSelectAuthor(article.author)}
                    className="text-xs font-bold text-[#0B2345] hover:text-[#0B5FFF] hover:underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>Ver perfil completo e outras matérias do autor →</span>
                  </button>
                )}
              </div>
            </div>

            {/* Official Source Reference Box */}
            {isAccessAllowed && (
              <div className="mt-12 p-6 bg-[#F1F3F5] rounded border border-[#D9DEE7]">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0B2345] mb-2">
                  <ShieldCheck className="w-4 h-4 text-[#16803C]" />
                  <span>Transparência & Fontes Oficiais</span>
                </div>
                <p className="text-xs text-[#5D6673] leading-relaxed mb-3">
                  Esta reportagem foi elaborada com base em documentos oficiais, projetos em tramitação e informações primárias fornecidas por: <strong>{article.sourceName}</strong>.
                </p>
                {article.sourcesConsulted && article.sourcesConsulted.length > 0 && (
                  <div className="mt-2 text-xs text-[#5D6673]">
                    <span className="font-semibold text-[#0B2345]">Documentos citados:</span>
                    <ul className="list-disc pl-5 mt-1 space-y-0.5">
                      {article.sourcesConsulted.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {article.sourceUrl && (
                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B5FFF] hover:underline mt-3 block"
                  >
                    <span>Consultar portal de origem ({article.sourceName})</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}

            {/* Editorial Board Guarantee */}
            <div className="mt-8 p-4 bg-white rounded border border-[#D9DEE7] text-xs text-[#5D6673] flex items-center justify-between">
              <div>
                <strong>O Patriota — Compromisso Editorial:</strong> Todas as informações publicadas passam por revisão humana e apuração documental rigorosa.
              </div>
            </div>
          </article>
        </main>

        {/* Sidebar: Related Stories & Editorial Notice (4 cols on lg) */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Related Stories */}
          <div className="bg-white p-5 rounded border border-[#D9DEE7] shadow-xs">
            <h3 className="font-serif text-base font-bold text-[#0B2345] border-b border-[#D9DEE7] pb-3 mb-4">
              MATÉRIAS RELACIONADAS
            </h3>
            <div className="divide-y divide-[#D9DEE7]">
              {relatedArticles.slice(0, 4).map((rel) => (
                <article
                  key={rel.id}
                  onClick={() => onSelectArticle(rel)}
                  className="py-3 flex gap-3 cursor-pointer group"
                >
                  <div className="w-16 h-14 rounded overflow-hidden shrink-0 border border-[#D9DEE7] bg-slate-100">
                    <img src={rel.imageUrl} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#0B5FFF] uppercase block mb-0.5">{rel.kicker}</span>
                    <h5 className="font-serif text-xs font-bold text-[#0B2345] leading-snug group-hover:text-[#0B5FFF] transition line-clamp-2">
                      {rel.title}
                    </h5>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Fact Check Banner */}
          <div className="bg-[#0B2345] text-white p-5 rounded border border-[#07172E] shadow-xs">
            <h4 className="font-serif text-sm font-bold text-white mb-2">AGÊNCIA DE CHECAGEM</h4>
            <p className="text-xs text-white/80 leading-relaxed mb-4">
              Recebeu uma mensagem duvidosa nas redes sociais? Nossa equipe verifica documentos oficiais para esclarecer o que é fato e o que é boato.
            </p>
            <button
              onClick={() => onSelectCategory('checagem')}
              className="w-full bg-[#16803C] hover:bg-[#22A447] text-white text-xs font-bold py-2 rounded transition cursor-pointer"
            >
              ACESSAR CHECAGENS DE FATOS
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
};
