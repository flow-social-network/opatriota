# Matriz de cobertura de rotas e módulos

## Objetivo

Este documento compara o mapa funcional recomendado para o O Patriota Brasil com a implementação real observada no repositório. Ele é uma referência operacional para uma IA completar o sistema sem criar telas fictícias, duplicar regras ou remover funcionalidades válidas.

**Estado da análise:** inventário baseado no código existente e nas rotas efetivamente usadas pelos componentes. A presença de uma rota nesta matriz não significa que todas as operações de backend estejam disponíveis.

## Regras de leitura

- **Implementado:** existe rota/componente e o fluxo está conectado ao estado ou serviço correspondente.
- **Parcial:** existe superfície visual ou navegação, mas há lacunas de persistência, autorização, validação ou operação real.
- **Ausente:** não foi localizada implementação correspondente.
- Nunca marcar pagamentos, faturas, publicação, aprovação ou exclusão como funcionais apenas porque existe um botão.
- Toda operação protegida deve ser autorizada no backend; guards de frontend não são controle de segurança.

## Site público

| Área | Rota observada | Situação | Próxima verificação |
|---|---|---|---|
| Página inicial | `/` | Implementado | Confirmar dados publicados e estados vazios |
| Busca | `/busca` | Implementado | Confirmar paginação, sanitização e origem dos resultados |
| Matéria | `/noticia/:slug` | Implementado | Confirmar artigo inexistente, premium e conteúdo sanitizado |
| Categoria/editoria | `/categoria/:slug` | Implementado | Confirmar slug inválido e filtro de dados reais |
| Verificação/checagem | `/verificacao` | Implementado/parcial | Confirmar contrato de fact-checks |
| Contato | `/contato` | Implementado/parcial | Confirmar persistência e proteção contra abuso |
| LGPD | `/lgpd` | Implementado/parcial | Confirmar registro e atendimento no backend |
| Planos | `/planos` | Implementado/parcial | Não tratar plano como assinatura ativa sem confirmação de pagamento |
| Checkout | `/checkout` | Implementado/parcial | Validar gateway, idempotência e retorno do pagamento |
| Minha conta | `/minha-conta` | Implementado/parcial | Confirmar sessão, assinatura e escopo por usuário |
| Páginas institucionais | rotas derivadas do CMS | Implementado/parcial | Validar lista permitida e conteúdo publicado |

Rotas sugeridas como `/autor/:slug`, `/opiniao`, `/videos`, `/podcasts`, `/receitas`, `/sobre`, `/principios-editoriais`, `/expediente`, `/fontes-e-metodologia`, `/politica-de-correcoes`, `/privacidade`, `/termos-de-uso`, `/seguranca`, `/contrato-de-assinatura` e `/doar` só devem ser adicionadas quando houver contrato de dados e requisito funcional confirmado. Não criar páginas vazias para cumprir contagem.

## Autenticação e áreas privadas

| Área | Rota observada | Situação | Regra |
|---|---|---|---|
| Login do assinante | `/auth/login` | Implementado | Firebase autentica; backend deve validar identidade nas operações |
| Cadastro | `/auth/register` | Implementado | Validar email, senha e criação de perfil real |
| Recuperação do assinante | `/auth/forgot-password` e reset | Implementado | Usar fluxo real de reset; nunca simular sucesso |
| Login administrativo | `/auth/login/admin` | Implementado | Permitir apenas papel administrativo autorizado |
| Login da redação | `/auth/login/redacao` | Implementado | Permitir apenas papéis editoriais autorizados |
| Callback | `/auth/callback` | Implementado | Redirecionar conforme papel retornado pelo backend |
| Painel administrativo | `/admin` | Implementado/parcial | Cada mutação precisa de autorização server-side e auditoria |
| Painel da redação | `/redacao` | Implementado/parcial | Separar permissões de jornalista, revisor, editor e editor-chefe |
| Área do assinante | `/minha-conta` | Implementado/parcial | Isolar dados pelo identificador do usuário autenticado |

## Painel administrativo e redação

Os painéis já possuem superfícies agregadoras, mas o mapa de 25 módulos administrativos e 17 áreas editoriais é um **escopo-alvo**, não evidência de 42 implementações independentes. Antes de criar qualquer módulo, verificar:

1. rota registrada em `src/app/router/routes.tsx`;
2. página realmente renderizada pelo roteador;
3. chamada em `src/services/apiClient.ts` ou serviço equivalente;
4. endpoint correspondente em `api/` ou `backend/`;
5. persistência no Neon ou no armazenamento configurado;
6. autorização por papel e registro de auditoria;
7. estados de carregamento, erro, vazio e sucesso.

### Módulos prioritários para confirmação

- matérias, rascunhos, publicadas e revisão;
- usuários, papéis e permissões;
- pautas, autores, fontes, categorias e tags;
- mídia e arquivos;
- assinantes, assinaturas e pagamentos;
- configurações, integrações, SEO, segurança e logs.

A redação não deve receber acesso às configurações administrativas por conveniência. O administrador pode visualizar funções editoriais quando autorizado, mas a regra deve estar no backend.

## Contratos de dados e bancos

O projeto possui integração Neon e código de armazenamento compatível com mais de uma origem. A documentação de dados deve manter Neon como fonte primária dos painéis administrativo e editorial quando a conexão estiver disponível, sem apagar ou invalidar o adaptador alternativo.

Requisitos obrigatórios:

- preservar os contratos existentes de leitura e escrita;
- selecionar o backend por configuração explícita e observável;
- não copiar segredos para documentação, commits ou logs;
- não alternar silenciosamente entre bancos em uma escrita;
- registrar falha de conexão sem mascarar erro como sucesso;
- manter schema compatível nos bancos usados para contingência;
- executar reconciliação antes de considerar o fallback íntegro;
- aplicar autorização e escopo de usuário em cada consulta protegida.

A senha de qualquer conta administrativa deve ser configurada por canal seguro e armazenada somente como hash pelo provedor de autenticação. Credenciais não pertencem a arquivos `.md`, seeds, SQL versionado ou logs.

## Critérios de aceite para completar o sistema

Uma função só pode ser marcada como pronta quando:

- a rota é acessível pelo roteador correto;
- o frontend usa o contrato de API existente;
- o backend valida entrada, sessão, papel e propriedade do recurso;
- a operação grava e lê dados reais;
- erros de dependência externa são exibidos sem sucesso falso;
- há teste ou verificação proporcional ao risco;
- o fluxo foi exercitado no navegador quando houver comportamento visual;
- `pnpm lint` e `pnpm build` passam, ou a documentação registra o bloqueio exato.

## Próximos passos recomendados

1. Gerar inventário automático de rotas a partir de `routes.tsx`.
2. Gerar inventário de endpoints e compará-lo com `apiClient.ts`.
3. Confirmar o schema vivo do Neon antes de alterar consultas.
4. Testar login dos três perfis sem registrar credenciais em arquivos.
5. Validar operações críticas dos painéis com dados reais de teste controlados.
6. Atualizar `MANIFEST.json` e `TRACEABILITY.md` a cada módulo concluído.
7. Separar explicitamente pendências de produto, código, infraestrutura e segurança.

## Fora de escopo desta matriz

Esta matriz não cria rotas, não inventa dados, não aprova conteúdo editorial e não declara gateway de pagamento ou fallback de banco como disponível sem evidência verificável. Ela serve como contrato de trabalho para a implementação incremental sobre o React/Vite existente.
