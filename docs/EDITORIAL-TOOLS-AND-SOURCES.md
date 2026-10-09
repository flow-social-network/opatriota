# O PATRIOTA — Fontes, ferramentas e plugins recomendados

## Objetivo
Esta lista define integrações úteis para apuração, dados públicos, checagem, publicação, segurança e operação. Uma fonte cadastrada não é automaticamente confiável para toda afirmação: cada notícia deve preservar origem, data de coleta, URL original e contexto, e passar por revisão humana.

## 1. Fontes primárias brasileiras

| Fonte | Uso editorial | Integração proposta |
|---|---|---|
| Câmara dos Deputados — Dados Abertos | Projetos de lei, votações, deputados, despesas e comissões | API REST oficial: https://dadosabertos.camara.leg.br/swagger/api.html |
| Portal da Transparência / CGU | Despesas, contratos, licitações, viagens e dados públicos federais | API oficial; requer cadastro/token conforme a documentação: https://portaldatransparencia.gov.br/api-de-dados |
| Senado Federal | Projetos, votações, comissões, senadores e atividade legislativa | Priorizar portal e APIs oficiais publicados pelo Senado; validar limites e termos antes de ativar ingestão |
| TSE | Resultados eleitorais, candidaturas, contas e dados eleitorais | Bases e portais oficiais do TSE; registrar eleição, ano, conjunto de dados e metodologia |
| IBGE | População, indicadores sociais, economia e dados territoriais | APIs e bases oficiais do IBGE; guardar série, unidade, período e data de atualização |
| Banco Central do Brasil | Séries econômicas, indicadores, câmbio e decisões monetárias | API de dados abertos/SGS do BCB; respeitar periodicidade e unidade da série |
| INMET | Alertas e dados meteorológicos oficiais | Usar serviços e publicações oficiais do INMET quando disponíveis; documentar cobertura e atraso |
| Open-Meteo | Previsão meteorológica complementar | API pública conforme termos e atribuição exigidos; não apresentar como medição oficial do INMET |
| Diário Oficial da União / Imprensa Nacional | Atos, nomeações, normas e publicações oficiais | Monitorar publicações e manter link e referência da edição original |
| Planalto / legislação federal | Texto oficial de leis, decretos e atos normativos | Link para texto oficial e data de vigência; não depender de resumo secundário |
| STF, STJ, TSE e tribunais | Decisões, processos e comunicados oficiais | Usar páginas e sistemas oficiais; distinguir decisão, voto, notícia institucional e alegação de parte |
| Defesa Civil e órgãos estaduais/municipais | Alertas locais, emergências e serviços públicos | Cadastro por região e tipo de alerta, com timestamp e confirmação de validade |

### Regras de ingestão
- Preferir APIs documentadas e feeds oficiais; não contornar autenticação, CAPTCHA, paywall ou limites.
- Guardar URL de origem, identificador externo, data de publicação, data de coleta, checksum e versão do parser.
- Normalizar e deduplicar, mas nunca apagar silenciosamente registros que possam ser relevantes para auditoria.
- Guardar apenas o conteúdo necessário para fins editoriais e respeitar direitos autorais, termos de uso, LGPD e políticas de retenção.
- Diferenciar dado primário, release institucional, reportagem secundária, opinião e conteúdo patrocinado.
- Não publicar automaticamente com base apenas em RSS, scraping ou saída de IA.

## 2. Ferramentas de apuração e checagem

- Google Fact Check Explorer: pesquisar se uma alegação ou imagem já foi checada — https://toolbox.google.com/factcheck/explorer
- Google Lens e pesquisa reversa de imagens: localizar versões anteriores e possíveis origens; resultado semelhante não prova autenticidade.
- InVID-WeVerify: apoiar a análise de vídeos e imagens; validar cada fragmento e contexto.
- Wayback Machine: consultar versões arquivadas de páginas públicas — https://web.archive.org/; arquivo não substitui a fonte original.
- Google Search Console: indexação, sitemap, desempenho e problemas técnicos — https://search.google.com/search-console
- Rich Results Test e Schema Markup Validator: testar dados estruturados — https://search.google.com/test/rich-results e https://validator.schema.org/
- OCR e extração de PDF: usar apenas para auxiliar a leitura; exigir conferência visual de números, nomes e tabelas.
- Planilha de evidências: cada afirmação relevante deve ter fonte, trecho, autor da verificação, data e estado (confirmada, contestada, não confirmada).

Observação SEO: a documentação do Google informa que o suporte a ClaimReview nos resultados da Pesquisa está sendo descontinuado, embora a marcação continue suportada no Fact Check Explorer. Implementar ClaimReview apenas quando o conteúdo realmente for uma checagem, com atribuição, metodologia, política de correções e evidências; não prometer rich results.

## 3. Plugins WordPress — somente se o WordPress fizer parte do ambiente implantado

O repositório atual também contém uma aplicação React/Vite. A existência de plugins WordPress no desenho não significa que o WordPress esteja instalado ou que estes plugins devam ser instalados na aplicação Vite.

| Necessidade | Opções para avaliação | Regra |
|---|---|---|
| SEO e sitemap | Yoast SEO ou Rank Math | Escolher apenas um; validar compatibilidade com o tema e dados estruturados próprios |
| Segurança e firewall | Wordfence ou Solid Security | Escolher uma solução principal; configurar MFA e alertas |
| Backup e restauração | UpdraftPlus ou backup gerenciado do host | Fazer restauração de teste; não confiar apenas no status de backup |
| Cache e desempenho | Cache do host, LiteSpeed Cache quando suportado, ou solução equivalente | Não ativar vários caches simultaneamente sem testes |
| SMTP e entregabilidade | WP Mail SMTP ou integração SMTP do provedor | Usar domínio autenticado SPF/DKIM/DMARC e testar descadastro |
| Formulários | Plugin enxuto compatível com o fluxo de privacidade | Coletar apenas os dados necessários |
| Acessibilidade | Ferramentas de auditoria automatizada mais testes manuais | Plugin não substitui WCAG, teclado, leitor de tela e revisão editorial |
| Consentimento/cookies | Solução compatível com LGPD e serviços realmente utilizados | Não mostrar consentimento enganoso nem carregar tags não necessárias antes da escolha aplicável |
| Migração/importação | Ferramentas oficiais e importadores com dry-run | Fazer backup e testar em homologação |

Antes de instalar: verificar manutenção recente, versão mínima do PHP/WordPress, compatibilidade, permissões solicitadas, vulnerabilidades conhecidas, política de privacidade, impacto no desempenho e dependências. Evitar plugins abandonados, nulled ou com funções duplicadas.

## 4. Ferramentas do backend

- PostgreSQL/Neon: dados transacionais, artigos, workflow editorial, auditoria e assinaturas.
- MongoDB: documentos semiestruturados de ingestão e extração, sem ser a fonte de verdade de pagamentos.
- pgAdmin ou Neon Console: administração técnica PostgreSQL.
- MongoDB Compass ou Atlas UI: administração técnica MongoDB.
- OpenAPI/Swagger UI: contratos e testes manuais de API; proteger endpoints internos.
- Vitest/Jest ou PHPUnit conforme a camada implementada: testes unitários e de integração.
- Playwright: testes de fluxos reais do portal e painel.
- Sentry ou serviço equivalente: captura de erros sem tokens, dados pessoais ou payloads sensíveis.
- GitHub Actions: lint, testes, verificação de dependências e build.
- Dependabot/Renovate e scanner de dependências: atualização controlada, com revisão e CI.
- Redis e fila de trabalhos: apenas quando houver necessidade real de tarefas demoradas, retries e agendamento; usar idempotência.
- Nginx/servidor gerenciado, TLS, backups, monitoramento e logs estruturados: requisitos operacionais de produção.

## 5. Plugins e integrações próprias do O PATRIOTA

O plugin editorial deve cobrir fontes, importação, fila de triagem, deduplicação, pautas, revisão humana, correções, checagem, trilha de auditoria, sitemap e exportação. Evitar instalar um plugin genérico para duplicar uma função que já seja parte do núcleo editorial.

Módulos recomendados:
1. Source Registry — catálogo de fontes, categoria, endpoint, licença/termos, cadência e estado.
2. Ingestion Worker — coleta segura, timeout, limites, retries e logs.
3. Deduplication Engine — URL canônica, GUID, hash e similaridade; sinaliza, não publica nem descarta sozinho.
4. Editorial Workflow — pauta, apuração, redação, revisão, aprovação, agendamento e correção.
5. Fact-check Dossier — alegação, evidências, links, metodologia, conclusão e revisor.
6. Media Verification — metadados, origem, direitos e notas de verificação.
7. Subscription Connector — Efí, webhooks confirmados pela API, idempotência e auditoria financeira.
8. Observability — estado de fontes, falhas de importação, filas e latência.

## 6. Ordem de implantação

1. Inventariar a infraestrutura real e confirmar se o ambiente de produção é WordPress, React/Vite ou ambos.
2. Cadastrar primeiro as fontes oficiais da Câmara, Portal da Transparência, IBGE, BCB, TSE e Diário Oficial conforme as editorias necessárias.
3. Construir o registro de fontes e a fila de ingestão com revisão humana obrigatória.
4. Adicionar ferramentas de checagem, SEO, acessibilidade, backup e segurança conforme a tecnologia efetivamente implantada.
5. Implementar monitoramento, testes e restauração antes de ampliar a automação.
6. Só então ativar fontes adicionais, plugins e integrações pagas, com revisão de termos, custos e permissões.

## Fontes de referência
- Câmara — API de Dados Abertos: https://dadosabertos.camara.leg.br/swagger/api.html
- Portal da Transparência — API: https://portaldatransparencia.gov.br/api-de-dados
- Google Fact Check Explorer: https://toolbox.google.com/factcheck/explorer
- Google Search Central — ClaimReview: https://developers.google.com/search/docs/appearance/structured-data/factcheck
- Diretório oficial de plugins WordPress: https://wordpress.org/plugins/
- Documentação WordPress sobre plugins: https://wordpress.org/documentation/article/manage-plugins/
