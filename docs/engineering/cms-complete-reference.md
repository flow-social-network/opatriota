# O Patriota — Referência completa do CMS

## Objetivo

O Patriota é uma plataforma editorial para operação de uma empresa jornalística: pauta, apuração, produção, revisão, aprovação, publicação, portal público, jornal digital, audiência, assinaturas e governança administrativa.

## Domínios

| Domínio | Responsabilidade | Não deve ser misturado com |
|---|---|---|
| Redação | pauta, fontes, triagem, apuração, matérias, revisão e publicação | financeiro |
| Portal público | leitura, busca, editorias, páginas, newsletter e anúncios públicos | operação interna |
| Jornal digital | edições, páginas, modelos, fechamento e distribuição | fluxo de notícia diária |
| Mídia | imagens, vídeos, áudio, documentos, créditos e permissões | dados editoriais duplicados |
| Comercial/financeiro | planos, assinaturas, pedidos, pagamentos, doações e estornos | aprovação editorial |
| Administração | usuários, papéis, configurações, integrações e auditoria | decisões editoriais |

## Ciclo de uma matéria

1. Fonte entra na fila editorial.
2. Editor ou repórter faz triagem e registra origem, URL canônica e assunto.
3. Pauta é criada com responsável, editoria, prazo e prioridade.
4. Repórter inicia apuração e registra notas, entrevistas, documentos e evidências.
5. Redator produz título, linha fina, corpo, mídia, legenda, crédito e SEO.
6. Revisão verifica texto, fatos, links, acessibilidade, direitos autorais e segurança.
7. Editor responsável aprova ou devolve com motivo obrigatório.
8. Publicação grava status, horário, autor da aprovação e versão publicada.
9. Correções geram nova versão e evento de auditoria; nunca sobrescrevem silenciosamente a versão publicada.
10. Despublicação exige permissão e motivo.

## Invariantes

- Conteúdo publicado deve ter autor, editoria, título, corpo sanitizado e registro de aprovação.
- IA pode sugerir, nunca aprovar ou publicar.
- Todo registro editorial precisa de `createdAt`, `updatedAt` e responsável.
- Toda ação sensível deve gerar auditoria.
- Dados persistidos da API são fonte principal; seeds servem somente para demonstração controlada e não podem apagar dados reais.
- Financeiro não aparece no fluxo de redação.

## Critério de completude

Uma função somente é considerada pronta quando: possui rota real, validação no servidor, persistência, autorização, estado de erro, estado vazio, teste de contrato, teste de integração e evidência após recarregar a página.
