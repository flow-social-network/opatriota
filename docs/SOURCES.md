# Central de Fontes Oficiais e Feeds RSS — O PATRIOTA

## Diretrizes de Conectividade
A Central de Fontes opera sob os mais rigorosos padrões de segurança e integridade de dados jornalísticos:

1. **Prevenção de SSRF (Server-Side Request Forgery)**:
   - Toda URL de feed submetida é inspecionada pela classe `O_Patriota_Source_Manager`.
   - IPs privados (RFC 1918), `127.0.0.1`, `localhost` e redes de loopback são terminantemente bloqueados.
   - Apenas os esquemas `https` e `http` com porta padrão (443 e 80) são autorizados.

2. **Prevenção contra Ataques XXE (XML External Entity)**:
   - O parser `O_Patriota_Rss_Ingestion` desativa entidades externas via `LIBXML_NONET` e desabilita carregamento recursivo de DTDs.

3. **Fontes Oficiais Homologadas**:
   - **Senado Federal**: `https://www12.senado.leg.br/noticias/feed/todas/rss`
   - **Câmara dos Deputados**: `https://www.camara.leg.br/noticias/rss/ultimas-noticias`
   - **Agência Brasil (EBC)**: `https://agenciabrasil.ebc.com.br/rss/ultimasnoticias/feed.xml`
   - **Supremo Tribunal Federal**: `https://portal.stf.jus.br/rss/noticias.xml`
   - **Ministério da Fazenda**: `https://www.gov.br/fazenda/pt-br/assuntos/noticias/RSS`
