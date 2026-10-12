import React, { useState } from 'react';
import { Article, CategorySlug, UserSession } from '../types';
import { ArticleImage } from './ArticleImage';
import { 
  ArrowLeft, 
  ArrowRight,
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
  CheckCircle2,
  Video,
  MessageSquare,
  Send,
  ThumbsUp,
  Check
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

interface ReaderComment {
  id: string;
  author: string;
  location?: string;
  date: string;
  text: string;
  likes: number;
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
  const [comments, setComments] = useState<ReaderComment[]>([
    {
      id: 'c-1',
      author: 'Carlos Eduardo Mendes',
      location: 'São Paulo/SP',
      date: '12/10/2026 às 10:24',
      text: 'Manifestação é um direito sagrado e constitucional de qualquer cidadão. O que não pode ser admitido em hipótese alguma é a depredação de estações e bens públicos. A lei precisa valer rigorosamente para todos os lados políticos.',
      likes: 42
    },
    {
      id: 'c-2',
      author: 'Renata Silveira',
      location: 'Curitiba/PR',
      date: '12/10/2026 às 10:48',
      text: 'Excelente cobertura editorial. Investigação técnica, transparência e responsabilidade individual com base em provas. É exatamente isso que a sociedade exige da imprensa independente.',
      likes: 31
    },
    {
      id: 'c-3',
      author: 'Marcelo Fontes',
      location: 'Brasília/DF',
      date: '12/10/2026 às 11:15',
      text: 'Destruir bens que atendem o trabalhador comum não é protesto, é vandalismo. Cobrança necessária e na medida certa.',
      likes: 27
    }
  ]);
  const [newCommentAuthor, setNewCommentAuthor] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [commentSubmitted, setCommentSubmitted] = useState(false);

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

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const authorName = newCommentAuthor.trim() || currentUser?.name || 'Leitor Patriota';
    const newEntry: ReaderComment = {
      id: `c-${Date.now()}`,
      author: authorName,
      location: 'Brasil',
      date: 'Agora mesmo',
      text: newCommentText.trim(),
      likes: 1
    };
    setComments([newEntry, ...comments]);
    setNewCommentText('');
    setCommentSubmitted(true);
    setTimeout(() => setCommentSubmitted(false), 4000);
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, likes: c.likes + 1 } : c));
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

            {/* Featured Media: Video Embed or Static Image */}
            {article.videoEmbedUrl ? (
              <div className="mb-8 rounded-lg overflow-hidden border border-[#D9DEE7] bg-black shadow-md">
                <div className="relative aspect-video w-full bg-black">
                  <iframe
                    className="w-full h-full"
                    src={article.videoEmbedUrl}
                    title={article.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
                {(article.imageCaption || article.imageCredits) && (
                  <div className="p-3 bg-[#0B2345] border-t border-[#07172E] text-xs text-white/90 flex flex-wrap justify-between items-center gap-2">
                    <span className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-[#FFCC29]" />
                      <span>{article.imageCaption || article.title}</span>
                    </span>
                    {article.imageCredits && (
                      <span className="text-[10px] text-white/70 uppercase font-semibold">
                        Fonte: {article.imageCredits}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="mb-8 rounded overflow-hidden border border-[#D9DEE7] bg-slate-100">
                <ArticleImage
                  src={article.imageUrl}
                  fallbackSrc="/images/policia_metro_paulista.jpg"
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
            )}

            {/* Article Prose */}
            <div className="prose prose-slate max-w-none text-[#17202A] text-base leading-relaxed space-y-5">
              {visibleParagraphs.map((para, idx) => {
                const trimmed = para.trim();
                if (trimmed.startsWith('### ')) {
                  return (
                    <h3 key={idx} className="font-serif text-xl font-bold text-[#0B2345] pt-4 pb-1 border-b border-[#E2E8F0]">
                      {trimmed.replace(/^###\s+/, '')}
                    </h3>
                  );
                }
                if (trimmed.startsWith('## ')) {
                  return (
                    <h2 key={idx} className="font-serif text-2xl font-bold text-[#0B2345] pt-5 pb-1 border-b-2 border-[#0B2345]">
                      {trimmed.replace(/^##\s+/, '')}
                    </h2>
                  );
                }
                if (trimmed.startsWith('- ') || trimmed.includes('\n- ')) {
                  const items = trimmed.split('\n').filter(line => line.trim().startsWith('- '));
                  return (
                    <ul key={idx} className="list-disc pl-5 space-y-1.5 my-3 text-[#2D3748]">
                      {items.map((line, itemIdx) => {
                        const raw = line.trim().replace(/^-\s*/, '');
                        return <li key={itemIdx} className="leading-relaxed">{renderInlineFormatted(raw)}</li>;
                      })}
                    </ul>
                  );
                }
                if (/^\d+\.\s/.test(trimmed) || trimmed.includes('\n1.')) {
                  const lines = trimmed.split('\n').filter(line => /^\d+\.\s/.test(line.trim()));
                  return (
                    <ol key={idx} className="list-decimal pl-5 space-y-2.5 my-3 text-[#2D3748]">
                      {lines.map((line, itemIdx) => {
                        const raw = line.trim().replace(/^\d+\.\s*/, '');
                        return <li key={itemIdx} className="leading-relaxed">{renderInlineFormatted(raw)}</li>;
                      })}
                    </ol>
                  );
                }
                return (
                  <p key={idx} className="leading-relaxed">
                    {renderInlineFormatted(para)}
                  </p>
                );
              })}
            </div>

            {/* BOX ESPECIAL: LEIA A OPINIÃO / EDITORIAL (Conforme solicitado pelo leitor) */}
            {(article.slug === 'policia-e-metro-divergem-sobre-danos-apos-ato-pro-lula-na-avenida-paulista' ||
              article.id === 'art-policia-metro-divergem-paulista' ||
              article.id === 'art-4') && (
              <div className="my-8 p-6 bg-gradient-to-r from-[#0B2345] to-[#0E3366] text-white rounded-lg border-2 border-[#FFCC29] shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#FFCC29] text-[#0B2345] text-[11px] font-black uppercase px-2.5 py-0.5 rounded tracking-wider">
                    LEIA A OPINIÃO
                  </span>
                  <span className="text-xs text-white/80 font-bold uppercase tracking-wide">
                    Editorial O Patriota
                  </span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-black text-white leading-snug mb-2">
                  Protesto é direito; depredação é crime, seja de quem for
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-4">
                  O ato de domingo na Avenida Paulista terminou com versões incompletas e divergentes. Leia o posicionamento institucional e editorial de O PATRIOTA sobre a preservação da ordem pública e a igualdade de tratamento para todos os lados.
                </p>
                <button
                  onClick={() => {
                    const opArticle = relatedArticles.find(a => a.slug === 'protesto-e-direito-depredacao-e-crime') ||
                      ({
                        id: 'art-opiniao-protesto-direito-depredacao-crime',
                        slug: 'protesto-e-direito-depredacao-e-crime',
                        title: 'OPINIÃO | Editorial do O PATRIOTA: Protesto é direito; depredação é crime, seja de quem for',
                        subtitle: 'Manifestação pacífica é um direito constitucional fundamental; depredação do patrimônio público é crime inaceitável. Apuração técnica, rigorosa e a mesma regra para todos os lados.',
                        category: 'opiniao',
                        editorialStatus: 'PUBLICADA',
                        accessLevel: 'aberto',
                        author: 'Conselho Editorial O PATRIOTA',
                        publishedAt: '12 de outubro de 2026 às 12:00',
                        readTimeMinutes: 3,
                        imageUrl: 'https://scontent.fpoa13-1.fna.fbcdn.net/v/t39.30808-6/844461567_122099510319508218_8962011006668968197_n.jpg?stp=dst-jpg_tt6&cstp=mx1084x714&ctp=p180x540&_nc_cat=105&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_ohc=hDk0EMtW1w8Q7kNvwFC6Gmx&_nc_oc=AdqonzhRXaH0YEa_3rh9RgNOglth0gqj4oy_K84Za5Zq4v-y0RRjDXxEzruuj_wn8Y7QS8_6MQh0IvbX5uLI8elu&_nc_zt=23&_nc_ht=scontent.fpoa13-1.fna&_nc_gid=4gd88Wwt0riEFMkkB1x-Og&_nc_ss=7b2a8&oh=00_AQND8s6qsaTfjM1AClRbjITi00yqbfKZw8otE2Uxys0_7Q&oe=6AD2CE25',
                      } as Article);
                    onSelectArticle(opArticle);
                  }}
                  className="bg-[#16803C] hover:bg-[#22A447] text-white text-xs sm:text-sm font-black px-5 py-2.5 rounded transition shadow flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>LER O EDITORIAL COMPLETO</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* BOX ESPECIAL: LEIA A REPORTAGEM DOS FATOS (Na página da opinião) */}
            {(article.slug === 'protesto-e-direito-depredacao-e-crime' ||
              article.id === 'art-opiniao-protesto-direito-depredacao-crime') && (
              <div className="my-8 p-6 bg-gradient-to-r from-[#0B2345] to-[#0E3366] text-white rounded-lg border-2 border-[#0B5FFF] shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#0B5FFF] text-white text-[11px] font-black uppercase px-2.5 py-0.5 rounded tracking-wider">
                    APURAÇÃO DOS FATOS
                  </span>
                  <span className="text-xs text-white/80 font-bold uppercase tracking-wide">
                    Reportagem Especial
                  </span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-black text-white leading-snug mb-2">
                  Polícia e Metrô divergem sobre danos após ato pró-Lula na Avenida Paulista
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-4">
                  SSP-SP relata tumulto e pichação durante a dispersão; companhia metroviária informa ausência de registros internos no horário. Confira o confronto detalhado das informações oficiais.
                </p>
                <button
                  onClick={() => {
                    const repArticle = relatedArticles.find(a => a.slug === 'policia-e-metro-divergem-sobre-danos-apos-ato-pro-lula-na-avenida-paulista') ||
                      ({
                        id: 'art-policia-metro-divergem-paulista',
                        slug: 'policia-e-metro-divergem-sobre-danos-apos-ato-pro-lula-na-avenida-paulista',
                        title: 'Polícia e Metrô divergem sobre danos após ato pró-Lula na Avenida Paulista',
                        subtitle: 'A Secretaria da Segurança Pública afirma que a PM registrou tumulto, pichações e depredação durante a dispersão; o Metrô diz não ter registros internos de danos nas estações da região.',
                        category: 'politica',
                        editorialStatus: 'PUBLICADA',
                        accessLevel: 'aberto',
                        author: 'Equipe de Apuração O Patriota',
                        publishedAt: '12 de outubro de 2026 às 11:20',
                        readTimeMinutes: 4,
                        imageUrl: 'https://scontent.fpoa13-1.fna.fbcdn.net/v/t39.30808-6/844461567_122099510319508218_8962011006668968197_n.jpg?stp=dst-jpg_tt6&cstp=mx1084x714&ctp=p180x540&_nc_cat=105&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_ohc=hDk0EMtW1w8Q7kNvwFC6Gmx&_nc_oc=AdqonzhRXaH0YEa_3rh9RgNOglth0gqj4oy_K84Za5Zq4v-y0RRjDXxEzruuj_wn8Y7QS8_6MQh0IvbX5uLI8elu&_nc_zt=23&_nc_ht=scontent.fpoa13-1.fna&_nc_gid=4gd88Wwt0riEFMkkB1x-Og&_nc_ss=7b2a8&oh=00_AQND8s6qsaTfjM1AClRbjITi00yqbfKZw8otE2Uxys0_7Q&oe=6AD2CE25',
                      } as Article);
                    onSelectArticle(repArticle);
                  }}
                  className="bg-[#0B5FFF] hover:bg-[#0047D4] text-white text-xs sm:text-sm font-black px-5 py-2.5 rounded transition shadow flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>LER A REPORTAGEM DOS FATOS</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

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

            {/* Tags Pills */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 pt-4 border-t border-[#D9DEE7] flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#5D6673] uppercase tracking-wider">Tags:</span>
                {article.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium bg-[#F1F3F5] text-[#0B2345] hover:bg-[#0B2345] hover:text-white transition px-3 py-1 rounded-full cursor-pointer"
                  >
                    #{tag.replace(/\s+/g, '')}
                  </span>
                ))}
              </div>
            )}

            {/* Editorial Board Guarantee */}
            <div className="mt-8 p-4 bg-white rounded border border-[#D9DEE7] text-xs text-[#5D6673] flex items-center justify-between">
              <div>
                <strong>O Patriota — Compromisso Editorial:</strong> Todas as informações publicadas passam por revisão humana e apuração documental rigorosa.
              </div>
            </div>

            {/* Reader Debate & Comments Section */}
            <div className="mt-10 pt-8 border-t-2 border-[#0B2345]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#0B5FFF]" />
                  <h3 className="font-serif text-xl font-bold text-[#0B2345]">
                    Debate & Opinião dos Leitores ({comments.length})
                  </h3>
                </div>
                <span className="text-xs text-[#5D6673] font-medium">Moderação Ativa</span>
              </div>

              {/* Call to Action Question Card */}
              <div className="p-4 mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
                <p className="text-xs sm:text-sm font-semibold text-[#0B2345] leading-snug">
                  💬 Você concorda que o patrimônio público deve ser respeitado independentemente de quem organiza a manifestação?
                </p>
                <p className="text-xs text-[#5D6673] mt-1">
                  Deixe sua opinião nos comentários abaixo e participe com respeito e responsabilidade.
                </p>
              </div>

              {/* Comment Submission Form */}
              <form onSubmit={handleAddComment} className="mb-8 p-4 bg-white rounded-lg border border-[#D9DEE7] shadow-2xs space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#0B2345] uppercase mb-1">Seu Nome / Identificação</label>
                    <input
                      type="text"
                      placeholder={currentUser?.name || "Ex: João da Silva (São Paulo/SP)"}
                      value={newCommentAuthor}
                      onChange={(e) => setNewCommentAuthor(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded border border-[#D9DEE7] focus:outline-none focus:border-[#0B5FFF]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#0B2345] uppercase mb-1">Sua Opinião</label>
                  <textarea
                    rows={3}
                    placeholder="Escreva sua opinião com respeito às opiniões divergentes e às leis..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    required
                    className="w-full text-xs p-3 rounded border border-[#D9DEE7] focus:outline-none focus:border-[#0B5FFF]"
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#5D6673]">
                    Comentários moderados conforme os Termos de Uso.
                  </span>
                  <button
                    type="submit"
                    className="bg-[#0B2345] hover:bg-[#0B5FFF] text-white font-bold text-xs px-4 py-2 rounded transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publicar Comentário</span>
                  </button>
                </div>
                {commentSubmitted && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Seu comentário foi registrado com sucesso e está visível no debate!</span>
                  </div>
                )}
              </form>

              {/* Existing Comments List */}
              <div className="space-y-3.5">
                {comments.map((comm) => (
                  <div key={comm.id} className="p-4 bg-white rounded-lg border border-[#D9DEE7] shadow-2xs">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#0B2345] text-white flex items-center justify-center font-bold text-xs">
                          {comm.author.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-[#0B2345] block leading-tight">{comm.author}</span>
                          <span className="text-[10px] text-[#5D6673]">{comm.location ? `${comm.location} • ` : ''}{comm.date}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleLikeComment(comm.id)}
                        className="flex items-center gap-1 text-[11px] text-[#5D6673] hover:text-[#0B5FFF] transition cursor-pointer px-2 py-1 rounded hover:bg-slate-50"
                        title="Concordar com este comentário"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{comm.likes}</span>
                      </button>
                    </div>
                    <p className="text-xs text-[#17202A] leading-relaxed pl-9">
                      {comm.text}
                    </p>
                  </div>
                ))}
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

function renderInlineFormatted(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-[#0B2345]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}
