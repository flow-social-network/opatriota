# O Patriota Brasil — Regras de Desenvolvimento

PROJETO: O PATRIOTA BRASIL

## Regras Fundamentais

1. Antes de alterar arquivos, leia o AGENTS.md da raiz e as instruções do diretório em que trabalhará.
2. Inspecione o código existente antes de propor uma implementação nova.
3. Não recrie funcionalidades já implementadas.
4. Não substitua funcionalidades reais por mocks para declarar uma tarefa concluída.
5. Não altere o frontend durante uma tarefa exclusivamente de backend.
6. Não altere o backend durante uma tarefa exclusivamente de frontend, salvo autorização explícita.
7. Não modifique arquivos fora do escopo atribuído ao agente.
8. Não altere a interface pública de um módulo compartilhado sem avaliar os consumidores existentes.
9. Não modifique contratos compartilhados sem verificar compatibilidade entre frontend e backend.
10. Não exponha credenciais, tokens ou informações pessoais nos logs, commits ou relatórios.
11. Não execute migrações destrutivas nem operações de produção sem autorização expressa.
12. Não conceda permissões administrativas automaticamente.
13. Não permita que agentes de IA aprovem definitivamente o conteúdo editorial.
14. Não publique conteúdo sem autorização e registro de aprovação válidos.
15. Todo módulo novo deve ter responsabilidade definida, contrato claro e testes proporcionais ao risco.
16. Componentes visuais genéricos devem ser reutilizados pela biblioteca compartilhada (packages/ui).
17. Regras de negócio não devem ser duplicadas entre telas.
18. Antes de concluir, execute as verificações aplicáveis (`pnpm lint`, `pnpm build`).
19. Informe quais arquivos foram alterados, quais testes passaram, quais falharam e quais dependências externas ainda bloqueiam a funcionalidade.
20. Não declare uma integração conectada ou uma tarefa concluída sem evidências verificáveis.

## Arquitetura

- Monorepo com pnpm workspaces
- Frontend: React + TypeScript + Vite (`apps/web`)
- Backend: Express + TypeScript (`apps/api`)
- Contratos compartilhados: `packages/contracts`
- UI compartilhada: `packages/ui`
- Núcleo de agentes IA: `core/operational`

## Segurança

- Nunca prefixe segredos com `VITE_`
- Sanitize HTML antes de usar `dangerouslySetInnerHTML`
- Valide autorização no servidor, nunca apenas no cliente
- Webhooks devem validar assinatura HMAC

## Pagamentos

- Gateway principal: Efi Bank (Pix, cartão, boleto)
- Fallback: Mercado Pago
- Coleção única de assinaturas: `subscriptions`
