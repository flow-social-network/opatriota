<?php
/**
 * Title: Faixa de Checagem e Newsletter
 * Slug: o-patriota/fact-check-section
 * Categories: o-patriota-factcheck
 * Keywords: checagem, fatos, newsletter, fakenews
 */
?>
<!-- wp:group {"className":"factcheck-newsletter-band bg-white border border-[#D9DEE7] rounded p-6 mb-12 shadow-sm","layout":{"type":"constrained"}} -->
<div class="wp-block-group factcheck-newsletter-band bg-white border border-[#D9DEE7] rounded p-6 mb-12 shadow-sm">
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
    
    <!-- Chamada Checagem (2 cols) -->
    <div class="lg:col-span-2 flex flex-col items-start gap-2 border-r border-[#D9DEE7] pr-4">
      <div class="w-12 h-12 rounded-full bg-[#0B2345] text-white flex items-center justify-center font-bold text-lg">
        🔍
      </div>
      <h3 class="font-serif text-lg font-bold text-[#0B2345] leading-tight">
        FAÇA A CHECAGEM
      </h3>
      <p class="text-xs text-[#5D6673] leading-snug">
        Informação verdadeira fortalece o Brasil. Antes de compartilhar, verifique os fatos.
      </p>
      <a href="/checagem/" class="mt-2 inline-flex items-center gap-1 bg-[#0B2345] hover:bg-[#0B5FFF] text-white text-[11px] font-bold px-3 py-1.5 rounded transition">
        VERIFICAR AGORA →
      </a>
    </div>

    <!-- 3 Cards de Checagem (7 cols) -->
    <div class="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-4 border-r border-[#D9DEE7] pr-4">
      
      <!-- Checagem 1: Falso -->
      <article class="bg-[#F7F8FA] border border-[#D9DEE7] rounded p-3 flex flex-col justify-between">
        <div class="relative mb-2">
          <span class="bg-[#B42318] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded inline-block mb-1">
            FALSO
          </span>
          <img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/factcheck_smartphone.jpg' ); ?>" alt="Checagem Farmácia Popular" class="w-full h-20 object-cover rounded" />
        </div>
        <h5 class="font-serif text-xs font-bold text-[#0B2345] leading-snug">
          <a href="#">É falso que o governo vai acabar com a Farmácia Popular. Confira os documentos.</a>
        </h5>
      </article>

      <!-- Checagem 2: Enganoso -->
      <article class="bg-[#F7F8FA] border border-[#D9DEE7] rounded p-3 flex flex-col justify-between">
        <div class="relative mb-2">
          <span class="bg-[#D97706] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded inline-block mb-1">
            ENGANOSO
          </span>
          <img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/news_opiniao.jpg' ); ?>" alt="Checagem CLT" class="w-full h-20 object-cover rounded" />
        </div>
        <h5 class="font-serif text-xs font-bold text-[#0B2345] leading-snug">
          <a href="#">Não há proposta oficial para extinguir a CLT. Entenda o que diz o plano.</a>
        </h5>
      </article>

      <!-- Checagem 3: Falso -->
      <article class="bg-[#F7F8FA] border border-[#D9DEE7] rounded p-3 flex flex-col justify-between">
        <div class="relative mb-2">
          <span class="bg-[#B42318] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded inline-block mb-1">
            FALSO
          </span>
          <img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/news_economia.jpg' ); ?>" alt="Checagem Pix" class="w-full h-20 object-cover rounded" />
        </div>
        <h5 class="font-serif text-xs font-bold text-[#0B2345] leading-snug">
          <a href="#">É mentira que será criado um novo imposto para o Pix. Veja a apuração.</a>
        </h5>
      </article>

    </div>

    <!-- Newsletter Box (3 cols) -->
    <div class="lg:col-span-3 flex flex-col justify-center pl-2">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-base">✉️</span>
        <h4 class="font-bold text-xs uppercase tracking-wider text-[#0B2345]">RECEBA NOSSA NEWSLETTER</h4>
      </div>
      <p class="text-[11px] text-[#5D6673] mb-3 leading-snug">
        As principais notícias no seu e-mail, sem spam, com responsabilidade.
      </p>
      <form class="flex flex-col gap-2" action="#" method="post">
        <input type="email" placeholder="Seu melhor e-mail..." class="w-full border border-[#D9DEE7] text-xs px-3 py-2 rounded focus:outline-none focus:border-[#0B5FFF]" required />
        <button type="submit" class="w-full bg-[#0B2345] hover:bg-[#0B5FFF] text-white text-xs font-bold py-2 rounded transition">
          INSCREVER-SE →
        </button>
      </form>
    </div>

  </div>
</div>
<!-- /wp:group -->
