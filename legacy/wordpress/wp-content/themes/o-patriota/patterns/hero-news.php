<?php
/**
 * Title: Destaque Principal (3 Colunas)
 * Slug: o-patriota/hero-news
 * Categories: o-patriota-editorial
 * Keywords: hero, manchete, politica, congresso
 */
?>
<!-- wp:group {"className":"hero-news-grid mb-12","layout":{"type":"constrained"}} -->
<div class="wp-block-group hero-news-grid mb-12">
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
    
    <!-- Coluna 1: Manchete Principal (4 cols) -->
    <div class="lg:col-span-4 flex flex-col justify-between h-full pr-2">
      <div>
        <span class="text-xs font-bold tracking-wider uppercase text-[#0B5FFF] mb-2 block">
          POLÍTICA NACIONAL
        </span>
        <h2 class="font-serif text-3xl md:text-4xl font-bold leading-tight text-[#0B2345] mb-4 hover:text-[#0B5FFF] transition-colors">
          <a href="/congresso-avanca-em-propostas-para-gerar-empregos-e-reduzir-o-custo-do-trabalho/">
            Congresso avança em propostas para gerar empregos e reduzir o custo do trabalho
          </a>
        </h2>
        <p class="text-sm text-[#5D6673] leading-relaxed mb-6 font-normal">
          Projetos em discussão no Parlamento buscam modernizar a legislação, estimular a economia e ampliar oportunidades para os brasileiros, mantendo os direitos trabalhistas.
        </p>
      </div>
      <div>
        <a href="/congresso-avanca-em-propostas-para-gerar-empregos-e-reduzir-o-custo-do-trabalho/" class="inline-flex items-center gap-2 bg-[#0B2345] hover:bg-[#0B5FFF] text-white text-xs font-bold px-5 py-2.5 rounded transition">
          LER MATÉRIA COMPLETA <span>→</span>
        </a>
      </div>
    </div>

    <!-- Coluna 2: Foto Central em Destaque (5 cols) -->
    <div class="lg:col-span-5 relative group overflow-hidden rounded shadow-sm border border-[#D9DEE7]">
      <div class="absolute top-3 left-3 z-10 bg-[#16803C] text-white text-[11px] font-bold px-2.5 py-1 uppercase tracking-wider rounded">
        BRASIL
      </div>
      <img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/hero_congresso.jpg' ); ?>" alt="Congresso Nacional em Brasília" class="w-full h-[380px] object-cover group-hover:scale-105 transition-transform duration-500" />
      <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 text-white">
        <p class="text-xs leading-snug font-medium text-white/90">
          Propostas em análise no Congresso Nacional podem impactar diretamente o mercado de trabalho nos próximos anos.
        </p>
      </div>
    </div>

    <!-- Coluna 3: Notícias Laterais Empilhadas (3 cols) -->
    <div class="lg:col-span-3 flex flex-col gap-4 border-l lg:pl-6 border-[#D9DEE7]">
      <!-- Item 1: Economia -->
      <article class="flex gap-3 items-start pb-4 border-b border-[#D9DEE7]">
        <div class="flex-1">
          <span class="text-[11px] font-bold text-[#0B5FFF] uppercase tracking-wider block mb-1">ECONOMIA</span>
          <h4 class="font-serif text-sm font-bold text-[#0B2345] leading-snug mb-1 hover:text-[#0B5FFF]">
            <a href="/pib-mostra-sinais-de-recuperacao/">PIB mostra sinais de recuperação e reforça expectativa de crescimento</a>
          </h4>
          <p class="text-[11px] text-[#5D6673] leading-tight line-clamp-2">
            Setores de serviços e agronegócio puxam alta e indicam um segundo semestre mais positivo.
          </p>
        </div>
        <img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/news_economia.jpg' ); ?>" alt="Economia PIB" class="w-20 h-16 object-cover rounded shrink-0" />
      </article>

      <!-- Item 2: Segurança -->
      <article class="flex gap-3 items-start pb-4 border-b border-[#D9DEE7]">
        <div class="flex-1">
          <span class="text-[11px] font-bold text-[#0B5FFF] uppercase tracking-wider block mb-1">SEGURANÇA</span>
          <h4 class="font-serif text-sm font-bold text-[#0B2345] leading-snug mb-1 hover:text-[#0B5FFF]">
            <a href="/operacao-integrada-combate-faccoes/">Operação integrada combate facções em quatro estados</a>
          </h4>
          <p class="text-[11px] text-[#5D6673] leading-tight line-clamp-2">
            Ação reúne forças federais e estaduais para desarticular o crime organizado e reduzir a violência.
          </p>
        </div>
        <img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/news_seguranca.jpg' ); ?>" alt="Segurança Integrada" class="w-20 h-16 object-cover rounded shrink-0" />
      </article>

      <!-- Item 3: Saúde -->
      <article class="flex gap-3 items-start">
        <div class="flex-1">
          <span class="text-[11px] font-bold text-[#0B5FFF] uppercase tracking-wider block mb-1">SAÚDE</span>
          <h4 class="font-serif text-sm font-bold text-[#0B2345] leading-snug mb-1 hover:text-[#0B5FFF]">
            <a href="/farmacia-popular-atende-milhoes/">Farmácia Popular segue como um dos maiores programas sociais do país</a>
          </h4>
          <p class="text-[11px] text-[#5D6673] leading-tight line-clamp-2">
            Mais de 24 milhões de brasileiros foram beneficiados em 2026, segundo dados do Ministério da Saúde.
          </p>
        </div>
        <img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/news_saude.jpg' ); ?>" alt="Saúde Pública" class="w-20 h-16 object-cover rounded shrink-0" />
      </article>
    </div>

  </div>
</div>
<!-- /wp:group -->
