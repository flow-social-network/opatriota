# SEO Técnico e Dados Estruturados — O PATRIOTA

## 1. Schema.org NewsArticle & ClaimReview
O portal implementa marcações JSON-LD semânticas para indexação em tempo real pelo Google Notícias e Fact Check Explorer:

- **NewsArticle**:
  - Título, data de publicação, data de modificação, autor verificado, créditos de fotografia e editoria.
- **ClaimReview**:
  - Inserido automaticamente em matérias da editoria **Checagem**.
  - `claimReviewed`: A declaração exata analisada.
  - `reviewRating`: Escala de 1 a 5 com `alternateName` (Verdadeiro, Falso, Enganoso, Fora de Contexto).
  - `author`: O Patriota — Checagem de Fatos.

## 2. OpenGraph e Twitter Cards
- Meta tags `og:title`, `og:description`, `og:image`, `og:type` (`news`), e `twitter:card` (`summary_large_image`).
- URLs canônicas automáticas sem parâmetros de rastreamento (`utm_*`).
