# Auditoria de mocks e fallbacks

## Encontrados
- `src/data/mockData.ts`: dados estáticos demonstrativos; não devem alimentar operações de produção.
- `src/data/pagesData.ts`: catálogo/conteúdo estático legado; precisa ser separado da fonte CMS.
- Componentes visuais possuem estados vazios e fallbacks de apresentação legítimos.
- Alguns módulos administrativos exibiam indicadores fixos antes da separação do dashboard; esses números não são evidência de dados reais.

## Política
Não usar localStorage para persistência de negócio. Não mostrar sucesso quando API/banco falhar. Fallback de leitura só é aceitável com indicação explícita de indisponibilidade.

## Próxima auditoria
Pesquisar `TODO`, handlers vazios, `catch` silencioso, arrays estáticos em telas e chamadas sem API; cada ocorrência deve ser classificada como fixture de teste, conteúdo editorial legítimo ou mock indevido.
