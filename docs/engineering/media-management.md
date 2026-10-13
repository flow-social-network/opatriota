# Gestão de mídia

Arquivos binários devem usar o Blob configurado; metadados devem ser persistidos no backend: nome, título, legenda, crédito, fonte, alt text, tipo, tamanho, autor, associação e status.

O upload administrativo de anúncios já usa validação de data URL e Blob em `api/[...path].ts`. Isso não prova que a biblioteca editorial de mídia esteja completa.

A biblioteca editorial precisa suportar upload, URL externa permitida, seleção existente, substituição, remoção, associação a artigo/edição e entrega segura. Arquivos privados não devem expor URL direta; usar rota autenticada de entrega.

Lacuna: contrato editorial único de mídia e teste persistente de upload/reabertura ainda devem ser implementados/verificados.
