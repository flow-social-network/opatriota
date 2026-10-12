# Checklist operacional de prontidão

## Antes do desenvolvimento

- [ ] Branch e commit registrados.
- [ ] `AGENTS.md` lido.
- [ ] Node, package manager e lockfile compatíveis.
- [ ] Variáveis locais criadas a partir de exemplo, sem segredos de produção.
- [ ] Serviços externos identificados e ambiente sandbox escolhido.

## Antes do merge

- [ ] TypeScript/lint passa.
- [ ] Build de produção passa.
- [ ] Testes unitários e scripts de auditoria aplicáveis passam.
- [ ] Rotas públicas carregam diretamente e após refresh.
- [ ] Rotas protegidas rejeitam sessão ausente e papel insuficiente.
- [ ] Formulários validam entradas inválidas.
- [ ] Estados de carregamento, vazio e erro estão visíveis.
- [ ] Nenhum mock substitui operação real.
- [ ] Segredos não aparecem em código, bundle, logs ou diff.
- [ ] Diff revisado por arquivo.

## Antes de produção

- [ ] Deployment de preview validado por navegador.
- [ ] Domínio e fallback SPA confirmados.
- [ ] Variáveis de produção conferidas sem expor valores.
- [ ] Banco, migrações, índices e backups confirmados.
- [ ] Webhook configurado com assinatura e URL corretas.
- [ ] Checkout e doação testados em sandbox.
- [ ] Alertas para erro de pagamento configurados.
- [ ] Rate limiting e CORS revisados.
- [ ] Política de privacidade e solicitações LGPD testadas.
- [ ] Aprovação editorial humana registrada.
- [ ] Plano de rollback conhecido.

## Validação pós-deploy

1. Abrir a página inicial.
2. Abrir diretamente uma rota pública.
3. Recarregar a rota pública.
4. Verificar console e erros de rede.
5. Exercitar autenticação em conta de teste.
6. Exercitar apenas operações de sandbox.
7. Confirmar logs sanitizados e métricas.
8. Registrar URL, deployment, commit, horário e resultado.

## Incidente 404

Verificar, nesta ordem:

1. deployment associado ao domínio;
2. status de produção;
3. branch e commit implantados;
4. root directory;
5. framework preset Vite;
6. comando de build;
7. output directory;
8. fallback/rewrite de SPA;
9. função `api/` reconhecida;
10. logs do deployment e DNS.

Não corrigir 404 adicionando redirects aleatórios antes de confirmar o erro nos logs.

## Incidente de pagamento

- Não alterar manualmente status para “pago” com base no browser.
- Capturar somente `requestId`, evento e status sanitizados.
- Confirmar assinatura do webhook.
- Verificar duplicidade por identificador do evento.
- Conferir estado no provedor sandbox.
- Reprocessar somente com procedimento idempotente.
- Registrar a decisão e o responsável humano.

## Evidência mínima

Cada execução deve registrar: comando ou ação, ambiente, commit, data/hora, resultado, código de saída quando aplicável e observações. Valores de segredo e dados pessoais devem ser omitidos.
