<?php
/**
 * Title: Grid de Notícias por Editoria (6 Colunas)
 * Slug: o-patriota/featured-news
 * Categories: o-patriota-editorial
 * Keywords: grid, politica, brasil, economia, seguranca, saude, opiniao
 */
?>
<!-- wp:group {"className":"editorial-grid-row mb-12","layout":{"type":"constrained"}} -->
<div class="wp-block-group editorial-grid-row mb-12">
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

    <!-- Card 1: POLÍTICA -->
    <article class="bg-white border border-[#D9DEE7] rounded overflow-hidden flex flex-col hover:shadow-md transition">
      <div class="relative">
        <span class="absolute top-2 left-2 z-10 bg-[#16803C] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded">
          POLÍTICA
        </span>
        <img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/hero_congresso.jpg' ); ?>" alt="Reforma administrativa" class="w-full h-28 object-cover" />
      </div>
      <div class="p-3 flex-1 flex flex-col justify-between">
        <h4 class="font-serif text-xs font-bold text-[#0B2345] leading-snug mb-2 hover:text-[#0B5FFF]">
          <a href="#">Reforma administrativa volta ao debate no Congresso</a>
        </h4>
        <p class="text-[11px] text-[#5D6673] leading-snug">
          Parlamentares discutem medidas para tornar o Estado mais eficiente e reduzir gastos públicos.
        </p>
      </div>
    </article>

    <!-- Card 2: BRASIL -->
    <article class="bg-white border border-[#D9DEE7] rounded overflow-hidden flex flex-col hover:shadow-md transition">
      <div class="relative">
        <span class="absolute top-2 left-2 z-10 bg-[#16803C] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded">
          BRASIL
        </span>
        <img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/news_infraestrutura.jpg' ); ?>" alt="Investimentos infraestrutura" class="w-full h-28 object-cover" />
      </div>
      <div class="p-3 flex-1 flex flex-col justify-between">
        <h4 class="font-serif text-xs font-bold text-[#0B2345] leading-snug mb-2 hover:text-[#0B5FFF]">
          <a href="#">Investimentos em infraestrutura podem colocar o país em um novo ciclo</a>
        </h4>
        <p class="text-[11px] text-[#5D6673] leading-snug">
          Projetos em rodovias, ferrovias e energia são apontados como essenciais para competitividade.
        </p>
      </div>
    </article>

    <!-- Card 3: ECONOMIA -->
    <article class="bg-white border border-[#D9DEE7] rounded overflow-hidden flex flex-col hover:shadow-md transition">
      <div class="relative">
        <span class="absolute top-2 left-2 z-10 bg-[#0B5FFF] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded">
          ECONOMIA
        </span>
        <img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/news_porto.jpg' ); ?>" alt="Exportações brasileiras" class="w-full h-28 object-cover" />
      </div>
      <div class="p-3 flex-1 flex flex-col justify-between">
        <h4 class="font-serif text-xs font-bold text-[#0B2345] leading-snug mb-2 hover:text-[#0B5FFF]">
          <a href="#">Exportações brasileiras batem recorde e fortalecem o agro</a>
        </h4>
        <p class="text-[11px] text-[#5D6673] leading-snug">
          Crescimento nas vendas externas impulsiona a economia e amplia a geração de empregos.
        </p>
      </div>
    </article>

    <!-- Card 4: SEGURANÇA -->
    <article class="bg-white border border-[#D9DEE7] rounded overflow-hidden flex flex-col hover:shadow-md transition">
      <div class="relative">
        <span class="absolute top-2 left-2 z-10 bg-[#0B2345] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded">
          SEGURANÇA
        </span>
        <img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/news_seguranca.jpg' ); ?>" alt="Ações contra crime" class="w-full h-28 object-cover" />
      </div>
      <div class="p-3 flex-1 flex flex-col justify-between">
        <h4 class="font-serif text-xs font-bold text-[#0B2345] leading-snug mb-2 hover:text-[#0B5FFF]">
          <a href="#">Estados ampliam ações contra o crime organizado</a>
        </h4>
        <p class="text-[11px] text-[#5D6673] leading-snug">
          Novas operações e tecnologia reforçam o combate às facções criminosas em todo o país.
        </p>
      </div>
    </article>

    <!-- Card 5: SAÚDE -->
    <article class="bg-white border border-[#D9DEE7] rounded overflow-hidden flex flex-col hover:shadow-md transition">
      <div class="relative">
        <span class="absolute top-2 left-2 z-10 bg-[#16803C] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded">
          SAÚDE
        </span>
        <img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/news_saude.jpg' ); ?>" alt="Atendimento saúde" class="w-full h-28 object-cover" />
      </div>
      <div class="p-3 flex-1 flex flex-col justify-between">
        <h4 class="font-serif text-xs font-bold text-[#0B2345] leading-snug mb-2 hover:text-[#0B5FFF]">
          <a href="#">Mais brasileiros têm acesso a atendimentos especializados</a>
        </h4>
        <p class="text-[11px] text-[#5D6673] leading-snug">
          Programa de expansão da rede pública reduz filas e melhora o atendimento no SUS.
        </p>
      </div>
    </article>

    <!-- Card 6: OPINIÃO -->
    <article class="bg-white border border-[#D9DEE7] rounded overflow-hidden flex flex-col hover:shadow-md transition">
      <div class="relative">
        <span class="absolute top-2 left-2 z-10 bg-[#FFCC29] text-[#17202A] text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded">
          OPINIÃO
        </span>
        <img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/news_opiniao.jpg' ); ?>" alt="Opinião editorial" class="w-full h-28 object-cover" />
      </div>
      <div class="p-3 flex-1 flex flex-col justify-between">
        <h4 class="font-serif text-xs font-bold text-[#0B2345] leading-snug mb-2 hover:text-[#0B5FFF]">
          <a href="#">O Brasil que queremos para as próximas gerações</a>
        </h4>
        <p class="text-[11px] text-[#5D6673] leading-snug">
          Um olhar sobre os desafios e oportunidades para construir um país mais justo, livre e próspero.
        </p>
      </div>
    </article>

  </div>
</div>
<!-- /wp:group -->
