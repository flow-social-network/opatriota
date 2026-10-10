# Remediação da auditoria — 10 de outubro de 2026

Branch: `fix/audit-remediation-2026-10-10`

## Alterações incluídas

- Home: volta a ligar as secções de notícias nacionais, cobertura do Rio Grande do Sul e opinião; distingue API não configurada, falha de carregamento e lista de notícias vazia.
- Manchete: a API prioriza matérias marcadas com prioridade editorial alta, depois média, e usa data como desempate.
- Facebook: no máximo três incorporações visíveis, grelha responsiva, carregamento diferido, títulos acessíveis e link para a publicação original.
- API de artigos: lista pública contém apenas artigos publicados; conteúdo de acesso pago é removido dos teasers quando o utilizador não tem nível de acesso suficiente; rota de detalhe aplica a mesma regra.
- API de páginas: consulta individual não revela páginas em rascunho a visitantes públicos.
- Fluxo editorial: alterações de jornalistas às suas próprias matérias devolvem a matéria à revisão e ao estado de rascunho; jornalistas não podem editar matérias de outros autores; exclusão fica restrita a editores.
- Credenciais de autor: removido o selo visual que afirmava que qualquer perfil era “credenciado e auditado” sem uma verificação real associada.
- Push: removidas campanhas fictícias e o histórico local apresentado como se fosse real; o histórico administrativo já utiliza a API.
- Sanitização: fallback sem DOM deixa de tentar sanitizar HTML arbitrário com expressões regulares e passa a escapar o conteúdo; URLs com esquemas ativos são bloqueadas.
- Configuração: `.env.example` agora documenta os fornecedores efetivamente suportados pelo adaptador atual (Firestore ou MySQL).
- Testes: o comando `pnpm test` executa testes reais para publicação, páginas públicas e níveis de assinatura; o workflow GitHub Actions executa testes antes do build.

## Limitações que continuam explícitas

- Não foram alteradas variáveis secretas nem a base de dados de produção.
- Não foi aplicada qualquer migração de produção.
- Não foi feito deploy manual para produção.
- O acesso ao Vercel para logs de runtime tinha devolvido 403 durante a auditoria anterior.
- O CI deste branch deve ser considerado a validação de execução; não se declara sucesso de build/testes antes do resultado do workflow.

## Verificações a realizar no CI

1. `pnpm install --no-frozen-lockfile`
2. `pnpm lint`
3. `pnpm test`
4. `pnpm build`

A configuração da base de dados em Vercel e o estado dos registos reais devem ser confirmados sem expor valores de segredos antes de qualquer promoção para produção.
