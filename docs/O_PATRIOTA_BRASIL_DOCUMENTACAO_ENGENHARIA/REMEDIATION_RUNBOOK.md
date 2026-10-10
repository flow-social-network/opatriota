# Plano de remediação e runbook

## P0 — antes de produção
- [ ] Confirmar autenticação e autorização server-side em cada endpoint administrativo.
- [ ] Validar autenticidade e idempotência de webhooks financeiros.
- [ ] Verificar segredos no código, bundle e logs.
- [ ] Testar isolamento entre usuários e dados privados.
- [ ] Confirmar fluxo de privacidade e proteção de dados.

## P1 — estabilidade
- [ ] Executar lint/typecheck e build no commit correto.
- [ ] Diagnosticar e resolver o 404 da Vercel com logs.
- [ ] Confirmar banco, transações, migrações e backups.
- [ ] Confirmar aprovação humana obrigatória em todos os caminhos editoriais.
- [ ] Adicionar rate limiting e validar CORS.
- [ ] Testar indisponibilidade dos provedores externos.

## P2/P3
- [ ] Logs estruturados e correlation ID.
- [ ] Métricas de latência/erros sem dados pessoais.
- [ ] Testes de contrato para integrações.
- [ ] Documentação automática de endpoints.

## Runbook local
1. Conferir Node e lockfile.
2. Instalar dependências conforme gerenciador definido pelo repositório.
3. Configurar `.env` a partir do exemplo sem copiar segredos de produção.
4. `npm run dev`, `npm run lint`, `npm run build` em ambiente seguro.

## Diagnóstico de pagamento
Conferir log sanitizado, assinatura do webhook, identificador do evento, prevenção de duplicidade e status confirmado no provedor. Não marcar pagamento como pago com base no retorno do browser.

## Diagnóstico Vercel
Verificar domínio, deployment, branch, root directory, build/output, rewrites e logs. Não executar deploy sem autorização.
