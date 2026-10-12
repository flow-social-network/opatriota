# O Patriota Brasil — guia operacional para IA

## 1. Objetivo

Este documento é o ponto de entrada para uma IA que precise transformar o repositório em um sistema utilizável, seguro e verificável. Ele separa fatos observados, hipóteses e tarefas pendentes. Nenhuma integração deve ser considerada pronta apenas porque existe um arquivo, dependência ou variável de ambiente.

## 2. Fonte de verdade

- Repositório: `flow-social-network/opatriota`
- Branch de referência da auditoria: `main`
- Commit documentado: `6f163f645fba855825b1ac8a6405390fc32c6bcf`
- Frontend: React + Vite em `src/`
- API: handlers serverless em `api/`
- Scripts de auditoria: `scripts/`
- Documentação funcional anterior: `docs/`

Antes de alterar qualquer coisa:

1. Ler `AGENTS.md` da raiz.
2. Confirmar branch, commit e estado do worktree.
3. Ler `package.json`, lockfile, `vite.config.ts`, `vercel.json` e `.env.example`.
4. Mapear o roteador efetivo em `src/app/router/` e os consumidores em `src/`.
5. Ler cada handler de `api/` e suas dependências em `api/_lib/`.
6. Não substituir uma integração real por mock para fazer testes passarem.

## 3. Mapa de execução

### Desenvolvimento

- Instalação: usar o gerenciador indicado pelo `packageManager` ou pelo lockfile.
- Servidor: `npm run dev` conforme o `package.json` observado.
- Frontend: Vite serve o diretório `src/`.
- APIs locais: confirmar no `api-dev-server.ts` ou configuração equivalente antes de testar rotas.

### Produção

- Build: `npm run build`.
- Artefato: confirmar o diretório de saída efetivamente produzido pelo Vite.
- Hospedagem: verificar se o projeto Vercel está configurado para Vite e se os handlers de `api/` estão sendo reconhecidos.
- Não assumir que uma configuração de Next.js, Express ou WordPress se aplica ao runtime atual.

## 4. Ordem segura de implementação

### P0 — bloqueadores de uso

1. Corrigir falhas de build, TypeScript e inicialização.
2. Confirmar roteamento público e fallback de SPA.
3. Confirmar autenticação e autorização no servidor.
4. Validar checkout, doação e webhook em sandbox.
5. Confirmar persistência, migrações e backup antes de dados reais.

### P1 — confiabilidade

1. Testes de contrato dos handlers.
2. Validação de assinatura e idempotência de webhook.
3. Rate limiting, CORS e limites de payload.
4. Observabilidade sem dados pessoais.
5. Testes de indisponibilidade de Mercado Pago, Firebase, fontes e meteorologia.

### P2 — evolução

1. Documentação OpenAPI gerada a partir dos contratos reais.
2. Testes E2E dos fluxos de leitor, assinante, jornalista e administrador.
3. Métricas, alertas e runbooks automatizados.
4. Revisão de retenção, exportação e exclusão de dados LGPD.

## 5. Regras de decisão

- Não confiar no cliente para preço, status de pagamento, papel ou autorização.
- Toda escrita deve validar entrada no servidor e retornar erros previsíveis.
- Todo recurso privado deve ser filtrado pelo usuário/tenant autenticado.
- Todo webhook deve validar autenticidade, timestamp quando aplicável e idempotência.
- Toda publicação editorial deve manter aprovação humana registrada.
- Segredos não podem usar prefixo `VITE_`, entrar no bundle, logs, commits ou documentação.
- Não executar migração destrutiva, deploy de produção ou alteração de provedor sem autorização explícita.
- Não declarar “pronto” sem evidência: comando, commit, ambiente, resultado e data.

## 6. Critério de pronto

Uma funcionalidade só pode ser marcada como pronta quando:

- o caminho feliz funciona em ambiente controlado;
- entradas inválidas e usuário não autorizado falham corretamente;
- o estado persistido pode ser consultado e auditado;
- integrações externas têm timeout, erro e retry definidos;
- o teste correspondente passa;
- não há segredo exposto;
- a documentação do contrato está atualizada;
- o diff foi revisado e o branch foi sincronizado.

## 7. Relatório obrigatório da IA

Ao finalizar uma tarefa, informar:

1. Arquivos alterados.
2. Comportamento implementado ou corrigido.
3. Comandos executados e códigos de saída.
4. Testes de runtime realizados e ambiente utilizado.
5. Integrações verificadas e evidência correspondente.
6. Pendências, riscos e dependências externas.
7. Commit/branch sincronizados.

## 8. Pendências conhecidas

A auditoria documentada não comprovou, por si só, banco de produção, schema, credenciais, deploy Vercel, entrega FCM, publicação Meta, NotebookLM, WordPress operacional ou aprovação integral de autorização em todos os handlers. Esses itens permanecem pendentes até validação com evidência verificável.

Consulte `REMEDIATION_RUNBOOK.md` para os procedimentos e `TRACEABILITY.md` para a matriz de evidências.

> Este arquivo orienta a execução. Não é autorização para acessar produção, alterar dados reais ou publicar conteúdo.

Data da consolidação: 10/10/2026.

---

## Anexo A — checklist rápido antes de editar

- [ ] Entendi qual camada está no escopo.
- [ ] Localizei o consumidor do módulo que será alterado.
- [ ] Preservei contratos públicos existentes.
- [ ] Identifiquei o teste proporcional ao risco.
- [ ] Não estou usando dados falsos para mascarar integração ausente.
- [ ] Sei como reverter a alteração.

## Anexo B — checklist rápido antes de concluir

- [ ] `npm run lint` executado.
- [ ] `npm run build` executado.
- [ ] Scripts de auditoria aplicáveis executados.
- [ ] Fluxo visível verificado no navegador quando aplicável.
- [ ] Logs revisados e sanitizados.
- [ ] Diff revisado.
- [ ] Branch sincronizado.
- [ ] Relatório técnico emitido.
