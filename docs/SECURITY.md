# Diretrizes de Segurança — O PATRIOTA

## Medidas de Proteção Implementadas

1. **Validação Rigorosa de Entrada & Sanitização**:
   - `sanitize_text_field()`, `esc_url_raw()`, `wp_strip_all_tags()` em todos os campos RSS.
2. **Prevenção de Execução Indevida**:
   - `if ( ! defined( 'ABSPATH' ) ) exit;` em 100% dos arquivos PHP.
3. **Controle de Acesso por Capabilities (RBAC)**:
   - Permissões customizadas: `manage_patriota_sources`, `manage_patriota_editorial_queue`, `manage_patriota_factcheck`, `publish_patriota_news`.
4. **Proteção contra CSRF**:
   - Nonces do WordPress validados em todas as submissões administrativas.
5. **Prevenção de SSRF & XXE**:
   - Validação de endereço IP contra faixas privadas (RFC 1918) e parsing XML restrito a entidades locais (`LIBXML_NONET`).
