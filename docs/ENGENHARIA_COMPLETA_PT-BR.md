# O Patriota Brasil — Manual Completo de Engenharia

**Idioma:** português do Brasil  
**Repositório:** `flow-social-network/opatriota`  
**Branch de referência:** `main`  
**Objetivo:** permitir que uma IA ou uma pessoa engenheira compreenda o sistema real, faça alterações seguras, valide o resultado e entregue o produto sem declarar funcionalidades não comprovadas.

> Este documento é um guia operacional baseado na arquitetura observada no repositório. A presença de um arquivo, endpoint ou componente não prova que a funcionalidade esteja operacional. Toda conclusão de funcionamento deve ter evidência de código executado, teste ou verificação no ambiente.

## 1. Regras de trabalho

Antes de editar:

1. Leia `AGENTS.md` e as instruções do diretório alvo.
2. Verifique branch, `git status`, commits recentes, diff pendente e PR relacionada.
3. Preserve alterações válidas e nunca execute `git reset --hard`, `git clean -fd`, force push ou migração destrutiva.
4. Não misture Vite/React com Next.js sem decisão arquitetural aprovada.
5. Não substitua integrações reais por mocks em produção.
6. Não confie em autorização somente no cliente.
7. Não exponha segredos no frontend, logs, commits ou relatórios.
8. Não publique conteúdo editorial sem aprovação válida e registrada.
9. Não conceda privilégios administrativos automaticamente.
10. Ao finalizar, registre arquivos alterados, verificações, limitações, branch e commit.

## 2. Mapa da arquitetura real

### 2.1 Aplicação executada

A aplicação principal é uma SPA **React + TypeScript + Vite**. O ponto de entrada deve ser confirmado em `index.html` e `src/main.tsx`. O arquivo `src/app/App.tsx` e os módulos em `src/app/router/` podem existir como estrutura parcial; só controlam o produto se forem importados pela cadeia efetiva iniciada em `src/main.tsx`.

Não presumir que `src/app/router/routes.tsx` seja o roteador publicado. A cadeia deve ser traçada assim:

```text
index.html
  -> src/main.tsx
     -> componente raiz importado
        -> roteador efetivamente montado
           -> layouts
              -> páginas
                 -> serviços/API
```

### 2.2 Camadas

| Camada | Local principal | Responsabilidade |
|---|---|---|
| Entrada | `index.html`, `src/main.tsx` | Montar o React e carregar estilos/configuração |
| Interface | `src/components/`, `src/pages/`, `src/app/` | Renderização, interação e estados de UI |
| Estado | `src/app/contexts/` | Sessão, dados editoriais e estado compartilhado |
| Serviços | `src/services/` | Cliente HTTP, Firebase e integrações do frontend |
| API | `api/` | Handlers serverless e validação no servidor |
| Biblioteca de API | `api/_lib/` | Autorização, billing, persistência e utilitários |
| Dados estáticos | `src/data/`, `public/` | Apenas conteúdo explicitamente estático ou de referência |
| Configuração | `package.json`, `vite.config.ts`, `vercel.json` | Build, aliases, funções e deploy |
| Documentação | `docs/` | Contratos, runbooks, auditorias e decisões |

### 2.3 Fluxo de uma funcionalidade

Toda funcionalidade persistente deve ser rastreada nesta ordem:

```text
página -> hook/contexto -> serviço frontend -> endpoint -> validação
       -> autenticação -> autorização -> persistência -> resposta -> UI
```

Se uma etapa não existir, a funcionalidade é incompleta. A tela deve diferenciar carregamento, vazio legítimo, erro de API e integração ausente.

## 3. Organização de código

Use responsabilidades separadas:

```text
src/
  app/                  # composição da aplicação, contextos e roteamento efetivo
  components/           # componentes reutilizáveis e específicos de domínio
  pages/                # páginas acessíveis por rotas
  services/             # clientes HTTP e integrações
  hooks/                # comportamento reutilizável
  types/                # contratos TypeScript
  utils/                # sanitização e utilitários puros
api/
  _lib/                 # autenticação, autorização, billing, armazenamento
  articles/             # operações editoriais, se presentes
  pages/                # páginas CMS, se presentes
  webhooks/             # entradas assinadas de provedores
```

Regras:

- Não concentre painéis inteiros em `App.tsx`, `AdminDashboard.tsx` ou no cabeçalho.
- Não duplique regra de negócio entre páginas.
- Componentes compartilhados não devem conhecer detalhes de uma tela específica.
- Serviços não devem renderizar HTML.
- Validação e autorização de escrita pertencem ao backend.
- HTML recebido de usuários ou integrações deve ser sanitizado antes de `dangerouslySetInnerHTML`.
- Ao mover arquivos, atualize todos os imports e valide a cadeia de consumidores.

## 4. Rotas e navegação

### 4.1 Rotas públicas mínimas

Auditar e testar navegação direta, links internos e refresh para:

- início;
- busca;
- matéria;
- categoria;
- autor;
- receitas;
- contato;
- sobre o jornal;
- princípios editoriais;
- expediente;
- fontes e metodologia;
- política de correções;
- privacidade;
- termos de uso;
- segurança da informação;
- planos;
- contrato de assinatura;
- login, cadastro e recuperação de senha, quando existentes.

### 4.2 Rotas privadas

Separar módulos e permissões:

**Administração:** visão geral, usuários, funções, artigos, páginas institucionais, categorias/tags, fontes, anúncios, assinaturas/pagamentos, comentários, notificações, configurações, relatórios e auditoria.

**Redação:** visão geral editorial, matérias, criação, edição, revisão/aprovação, agendamento, categorias/tags, apuração, autores, rascunhos e histórico.

**Assinante:** conta, perfil, assinatura, pagamentos, faturas/histórico, preferências, notificações, segurança e cancelamento, somente quando sustentados por operações reais.

### 4.3 404 e CMS

O componente de página customizada só pode resolver slugs existentes e autorizados. Slug inexistente deve resultar em 404 real, não em conteúdo genérico. A API deve distinguir `404` de `500`, e o frontend não deve converter erro de rede em lista vazia.

## 5. Autenticação e autorização

A autenticação existente é Firebase e não deve ser substituída por um segundo sistema paralelo.

Verificar:

- login e logout;
- persistência e carregamento da sessão;
- expiração;
- recuperação de senha;
- redirecionamento após login;
- estados de carregamento e erro;
- proteção de rotas;
- validação da identidade no backend;
- autorização por função e recurso.

O cliente pode ocultar ações por ergonomia, mas o servidor deve validar token, identidade, função e escopo em toda leitura sensível e em toda escrita. Nunca prefixar segredos com `VITE_`; variáveis públicas devem conter apenas valores seguros para exposição.

### Estados obrigatórios de UI

- `loading`: sessão ou dados ainda não resolvidos;
- `authenticated`: usuário identificado;
- `unauthenticated`: acesso público ou redirecionamento;
- `forbidden`: identidade válida sem permissão;
- `error`: falha de infraestrutura ou serviço.

## 6. Conteúdo editorial

Artigos e páginas devem possuir estados e transições explícitos. Uma sugestão de fluxo é:

```text
rascunho -> revisão -> aprovado -> agendado/publicado
                 \-> rejeitado/retornado
```

A IA pode auxiliar apuração, resumo ou classificação, mas não aprova definitivamente conteúdo editorial. Publicação exige usuário autorizado, registro de aprovação e auditoria.

Para cada artigo, documentar e testar:

- criação, edição e exclusão;
- autor e editor responsáveis;
- categoria, tags e origem;
- status editorial;
- conteúdo premium;
- publicação e agendamento;
- histórico de alterações;
- sanitização de HTML;
- imagens e texto alternativo;
- resposta para público, assinante e usuário sem acesso.

## 7. API e contratos

Para cada endpoint, manter uma ficha com:

```text
Método e caminho
Autenticação
Autorização
Parâmetros e corpo
Validação
Persistência
Integrações externas
Resposta de sucesso
Erros e status HTTP
Idempotência
Teste automatizado
```

Endpoints identificados na árvore/documentação incluem handlers de checkout, planos, doações, contato, solicitações de privacidade, artigos, páginas CMS, webhook do Mercado Pago e o catch-all `api/[...path].ts`. A existência do arquivo não comprova deploy ou operação; testar o caminho publicado e o handler local.

### Contrato HTTP recomendado

- `200`/`201`: operação realizada;
- `204`: operação realizada sem corpo;
- `400`: entrada inválida;
- `401`: ausência ou invalidade de identidade;
- `403`: identidade sem permissão;
- `404`: recurso inexistente ou não acessível;
- `409`: conflito/idempotência;
- `422`: regra de negócio não atendida;
- `429`: limite de requisições;
- `500`: falha inesperada, sem vazar detalhes internos.

Mensagens para o cliente devem ser compreensíveis; logs devem conter contexto técnico sem tokens, senhas, dados pessoais desnecessários ou payloads sensíveis.

## 8. Banco, pagamentos e integrações

Antes de escrever acesso a dados, identificar provedor, schema, migrações, índices, política de retenção e ambiente. Não inventar tabelas ou contratos a partir de nomes de arquivos.

### Assinaturas e pagamentos

- Gateway principal documentado: Efi Bank.
- Fallback documentado: Mercado Pago.
- Coleção lógica única: `subscriptions`.
- Validar preço e quantidade no servidor.
- Recalcular totais com valores confiáveis do servidor.
- Usar idempotência em checkout, cobranças e webhooks.
- Não ativar assinatura apenas por retorno do navegador; a confirmação deve vir do provedor validado.
- Webhooks devem validar assinatura HMAC ou mecanismo oficial, verificar evento duplicado e registrar processamento.
- Não simular pagamento aprovado nem inventar histórico financeiro.

### Integrações externas

Firebase/FCM, fontes/RSS, WordPress, meteorologia, Mercado Pago e Efi devem ter variáveis de ambiente, timeout, tratamento de indisponibilidade, observabilidade e teste de contrato. Se uma integração não estiver configurada, a interface deve informar isso claramente.

## 9. Dados falsos e estados incompletos

Pesquisar por `mock`, `demo`, `fake`, `setTimeout`, sucessos artificiais, handlers vazios e dados hardcoded. Separar dados de teste por ambiente. Nunca usar conteúdo de demonstração para mascarar falha de API, banco, autenticação ou pagamento.

Um botão só pode aparecer como disponível quando sua operação estiver implementada e autorizada. Promessa de sucesso só deve ocorrer depois de resposta positiva do servidor.

## 10. Segurança

Checklist mínimo:

- autenticação e autorização no servidor;
- validação de entrada com esquemas e limites;
- queries parametrizadas;
- sanitização de HTML;
- proteção de webhooks;
- cookies e tokens com atributos seguros;
- CORS e headers coerentes;
- rate limiting em login, recuperação de senha, contato e endpoints de IA;
- logs sem segredos;
- menor privilégio para serviços e funções;
- auditoria de ações administrativas;
- solicitações LGPD com autenticação e rastreabilidade.

## 11. Instalação e ambiente

Ler `package.json`, lockfile e `pnpm-workspace.yaml` antes de instalar dependências. Usar a versão e o gerenciador declarados pelo repositório. Não atualizar dependências em massa.

Variáveis devem ser documentadas por nome, finalidade, ambiente e sensibilidade, nunca pelo valor. O arquivo `.env.example` deve conter nomes e exemplos não secretos. Segredos reais devem permanecer nas configurações do ambiente.

## 12. Validação obrigatória

Executar os scripts reais definidos em `package.json`; não presumir nomes. O mínimo é:

1. instalação/verificação de dependências;
2. lint;
3. TypeScript;
4. testes unitários;
5. testes de serviços e endpoints;
6. build de produção;
7. rotas públicas, privadas e 404;
8. autenticação e autorização;
9. leitura e gravação reais;
10. acesso premium;
11. painéis e responsividade;
12. CI e preview atual.

Classificar cada verificação como `APROVADA`, `FALHOU` ou `NÃO EXECUTADA`, com causa. Build verde não prova que login, pagamentos, banco, webhooks ou deploy estejam funcionais.

### Verificação no navegador

Após alterações visíveis, usar o preview atual com `agent-browser`: abrir rota, aguardar elemento de prontidão, tirar snapshot, interagir e verificar o estado resultante. Para layout, usar viewport desktop e mobile e salvar evidências em `/tmp/agent-browser/`. Não usar screenshot como substituto para teste de autorização.

## 13. CI, Vercel e Git

Verificar workflow em `.github/workflows/`, commit efetivamente publicado e preview correspondente ao commit atual. Preview antigo não é evidência do código atual. Se houver bloqueio de limite, credencial ou serviço externo, registrar a limitação sem declarar sucesso.

Fluxo seguro:

```text
git status -> branch de trabalho -> diagnóstico -> correção
-> testes -> revisão do diff -> commit -> sincronização
```

Não fazer merge na `main`, push forçado ou deploy de produção sem autorização explícita.

## 14. Procedimento para uma IA executar uma tarefa

### Fase A — Diagnóstico

1. Ler `AGENTS.md`.
2. Mapear entrada, roteador e build.
3. Ler os consumidores do módulo afetado.
4. Verificar logs e reproduzir o defeito.
5. Registrar hipótese e evidência.

### Fase B — Plano técnico

Listar defeito, causa, arquivos, dependências, risco e validação. Escolher a menor mudança completa que preserve contratos válidos.

### Fase C — Implementação

Corrigir primeiro compilação e estrutura; depois contrato, autorização, persistência e interface. Não criar segunda implementação para contornar a primeira.

### Fase D — Integração

Testar o caminho inteiro da página até a persistência. Verificar estados de erro, vazio, carregamento e permissão.

### Fase E — Validação e entrega

Executar checks, revisar diff, procurar imports quebrados e mocks indevidos, sincronizar a branch e produzir relatório técnico com evidências e limitações.

## 15. Modelo de relatório final

```markdown
# Relatório técnico — <data>

## Resumo
## Arquitetura confirmada
## Erros encontrados e causas
## Arquivos alterados
## Rotas verificadas
## APIs e integrações verificadas
## Testes
| Verificação | Estado | Evidência | Limitação |
## Build e CI
## Preview
## Segurança e autorização
## Pendências externas
## Branch e commits
```

Não usar "100% funcional" sem evidência completa. Declarar explicitamente o que foi testado, o que falhou e o que depende de credenciais, banco, provedor ou ambiente externo.

## 16. Referências do repositório

- `docs/O_PATRIOTA_BRASIL_DOCUMENTACAO_ENGENHARIA/README.md`
- `docs/O_PATRIOTA_BRASIL_DOCUMENTACAO_ENGENHARIA/ARCHITECTURE.md`
- `docs/O_PATRIOTA_BRASIL_DOCUMENTACAO_ENGENHARIA/AUDIT_REPORT.md`
- `docs/O_PATRIOTA_BRASIL_DOCUMENTACAO_ENGENHARIA/FEATURE_API_INVENTORY.md`
- `docs/O_PATRIOTA_BRASIL_DOCUMENTACAO_ENGENHARIA/SECURITY_AUTH.md`
- `docs/O_PATRIOTA_BRASIL_DOCUMENTACAO_ENGENHARIA/DATABASE_INTEGRATIONS.md`
- `docs/O_PATRIOTA_BRASIL_DOCUMENTACAO_ENGENHARIA/DEPLOYMENT_TESTING.md`
- `docs/O_PATRIOTA_BRASIL_DOCUMENTACAO_ENGENHARIA/REMEDIATION_RUNBOOK.md`
- `docs/O_PATRIOTA_BRASIL_DOCUMENTACAO_ENGENHARIA/TRACEABILITY.md`
- `docs/EDITORIAL-WORKFLOW.md`
- `docs/FRONTEND-BACKEND-CONTRACT.md`
- `docs/SECURITY.md`
- `docs/DEPLOYMENT.md`

Este manual complementa esses documentos. Quando houver conflito, prevalecem `AGENTS.md`, o código executado e as evidências de validação mais recentes.
