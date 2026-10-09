# O PATRIOTA — Arquitetura de Software e Especificação Técnica

## 1. Visão Geral
O PATRIOTA é um portal jornalístico profissional projetado para alta vazão editorial (50 a 100 matérias/dia), estruturado sobre o WordPress (FSE - Full Site Editing Block Theme) e apoiado pelo plugin proprietário **O Patriota Editorial**.

## 2. Diagrama de Arquitetura

```
+-------------------------------------------------------------+
|                          CLIENTES                           |
|       Desktop / Tablet / Mobile (Responsive Web / PWA)      |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                 CAMADA DE APRESENTAÇÃO (THEME)              |
| - Block Theme (theme.json v3)                               |
| - Design System Oficial (Azul-Marinho #0B2345, Verde #16803C)|
| - Tipografia Editorial Serif + Sans-Serif Legível           |
| - Block Patterns Jornalísticos (Hero 3-col, Grid 6-col)     |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|             CAMADA EDITORIAL (PLUGIN O PATRIOTA)            |
| - Central de Fontes Oficiais (RSS/Atom)                     |
| - Ingestão Segura com Prevenção XXE & SSRF                  |
| - Motor de Deduplicação em 5 Camadas (URL, GUID, Hash, etc) |
| - Esteira Editorial (Recebida -> Apuração -> Redação -> Rev)|
| - Agência de Checagem (ClaimReview Schema.org)              |
| - Trilha de Auditoria e Histórico Imutável                  |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                     CORE DO WORDPRESS                       |
| - Posts, Categorias, Mídia, Usuários, REST API              |
| - wp_posts / wp_postmeta                                    |
| - Tabelas customizadas: wp_patriota_sources, raw_items      |
+-------------------------------------------------------------+
```

## 3. As 5 Camadas de Deduplicação
1. **Camada 1 (URL Canônica Normalizada)**: Remove parâmetros UTM, tracking tokens e compara a URL limpa.
2. **Camada 2 (Identificador RSS / GUID)**: Verifica chave única atribuída pelo veículo emissor.
3. **Camada 3 (Hash do Título Normalizado)**: SHA-256 do texto limpo em minúsculas e sem pontuação.
4. **Camada 4 (Similaridade Textual em Janela de 72h)**: Algoritmo de proximidade de Levenshtein/similar_text com gatilho em 82% para alerta editorial.
5. **Camada 5 (Triagem Humana Obrigatória)**: Nenhuma notícia é publicada sem intervenção e validação de um editor humano.
