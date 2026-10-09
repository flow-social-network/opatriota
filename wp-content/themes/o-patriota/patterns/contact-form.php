<?php
/**
 * Title: Formulário de Contato da Redação
 * Slug: o-patriota/contact-form
 * Categories: o-patriota-editorial
 * Keywords: contato, redacao, fale conosco, errata, pauta
 */
?>
<!-- wp:group {"className":"op-contact-form-block","layout":{"type":"constrained"}} -->
<div class="wp-block-group op-contact-form-block">
  <form class="space-y-4" method="post" action="<?php echo esc_url( admin_url('admin-post.php') ); ?>">
    <input type="hidden" name="action" value="o_patriota_submit_contact" />
    <?php wp_nonce_field( 'o_patriota_contact_nonce', 'contact_nonce' ); ?>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-xs font-bold text-[#0B2345] mb-1">Nome Completo *</label>
        <input type="text" name="contact_name" required class="w-full text-xs border border-[#D9DEE7] rounded px-3 py-2.5 focus:outline-none" />
      </div>
      <div>
        <label class="block text-xs font-bold text-[#0B2345] mb-1">E-mail para Contato *</label>
        <input type="email" name="contact_email" required class="w-full text-xs border border-[#D9DEE7] rounded px-3 py-2.5 focus:outline-none" />
      </div>
    </div>

    <div>
      <label class="block text-xs font-bold text-[#0B2345] mb-1">Assunto *</label>
      <select name="contact_subject" class="w-full text-xs border border-[#D9DEE7] rounded px-3 py-2.5 bg-white focus:outline-none">
        <option value="sugestao_pauta">Sugestão de Pauta / Denúncia</option>
        <option value="correcao_materia">Correção de Matéria / Errata</option>
        <option value="duvida_editorial">Dúvida sobre Princípios Editoriais</option>
        <option value="comercial">Anúncios & Parcerias Comerciais</option>
        <option value="institucional">Contato Institucional & Jurídico</option>
      </select>
    </div>

    <div>
      <label class="block text-xs font-bold text-[#0B2345] mb-1">Mensagem *</label>
      <textarea name="contact_message" rows="5" required class="w-full text-xs border border-[#D9DEE7] rounded p-3 focus:outline-none"></textarea>
    </div>

    <button type="submit" class="bg-[#0B2345] hover:bg-[#0B5FFF] text-white text-xs font-bold px-6 py-3 rounded transition">
      Enviar Mensagem para a Redação
    </button>
  </form>
</div>
<!-- /wp:group -->
