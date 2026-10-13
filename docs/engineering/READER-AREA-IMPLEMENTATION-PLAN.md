# Plano incremental da Área do Leitor

## Ordem de execução

1. **Navegação e shell** — manter cabeçalho, menu lateral e rotas internas acessíveis por URL.
2. **Jornal Digital** — armazenar edições e páginas como dados estruturados; oferecer visualizador responsivo, sumário, zoom, teclado e links para matérias.
3. **Autorização central** — aplicar no backend a distinção entre leitor gratuito, assinante e apoiador por doação.
4. **Assinaturas e doações** — confirmar pagamentos por webhook assinado, usar idempotência e manter os registros separados.
5. **Recursos pessoais** — persistir favoritos, histórico, newsletter, notificações e preferências por usuário.
6. **Conteúdo multimídia e suporte** — conectar vídeos, podcasts e chamados a dados reais.
7. **Edições e auditoria** — versionar publicação, revisão, aprovação, agendamento e correções.

## Arquivos envolvidos nesta primeira entrega

- `src/components/subscriber/SubscriberPortal.tsx`
- `src/components/subscriber/SubscriberJournalTab.tsx`
- `docs/engineering/READER-AREA-AUDIT.md`
- `docs/engineering/READER-AREA-IMPLEMENTATION-PLAN.md`

## Testes

- Lint e build do frontend.
- Testes de autorização para conteúdo público, assinatura e doação.
- Testes de persistência por usuário.
- Testes de teclado, responsividade e acessibilidade do visualizador.
- Testes de webhook e idempotência de pagamentos.

## Riscos

Não usar PDF ou imagem única como modelo primário do jornal. O PDF pode ser uma saída adicional, mas o visualizador web deve operar com páginas estruturadas e referências às matérias publicadas.
