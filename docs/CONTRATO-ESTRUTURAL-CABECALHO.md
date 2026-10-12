# CONTRATO ESTRUTURAL DO CABEÇALHO — O PATRIOTA BRASIL

Este contrato é obrigatório para qualquer alteração de layout, publicidade ou navegação.

## Três faixas

1. **Faixa 1 — utilitária cinza:** primeira faixa do portal, fundo `#F4F7FB`, borda `#DDE5EF`, com data, previsão de Taquara/RS, selo INMET, busca e redes sociais no desktop. No mobile mantém data, clima e INMET. É sticky/fixa no topo, ocupa espaço próprio e não pode ser fundida às demais faixas.
2. **Faixa 2 — indicador financeiro:** barra azul-marinho separada, com indicadores recebidos pelo backend e indicação de atualização ou indisponibilidade. Não deve ser incorporada à faixa cinza.
3. **Faixa 3 — jornal:** área branca com logotipo, identidade, navegação e submenus. Deve rolar naturalmente; não usar `fixed` ou `sticky` nesta faixa.

## Posicionamento e responsividade

A Faixa 1 usa `.site-utility-bar` e `data-header-band="utility"`. A Faixa 2 usa `data-header-band="market"` e recebe o offset da faixa fixa no desktop. O conteúdo principal não pode ficar sob a faixa. No mobile, a faixa utilitária compacta preserva a ordem e a faixa principal continua separada.

Espaços publicitários devem ser inseridos no fluxo do conteúdo, com reserva de dimensão, sem alterar offsets, z-index ou o comportamento da Faixa 3.

## Componentes e arquivos

- `src/components/Header.tsx`: implementação das três faixas.
- `src/index.css`: contrato visual de `.site-utility-bar` e do ticker.
- `src/app/layouts/PublicLayout.tsx`: composição do cabeçalho com o conteúdo público.
- `src/components/ads/`: espaços publicitários, sempre fora da estrutura do cabeçalho.

## Proteção

Não remover, fundir, tornar sticky/fixa a Faixa 3, nem trocar a origem das informações sem autorização explícita. Toda alteração no cabeçalho deve executar `pnpm lint`, `pnpm build` e a verificação de estrutura/responsividade no navegador.

## Publicidade

AdSense e campanhas diretas são origens distintas. Uma campanha comercial nunca é ativada automaticamente a partir de uma solicitação. O backend deve validar autorização, registrar auditoria e confirmar a persistência antes de informar sucesso.

## Estado da integração

A infraestrutura de AdSense permanece desativada até receber Publisher ID real, aprovação do domínio e consentimento/configuração de produção. A API comercial registra solicitações em `advertisingInquiries` usando o armazenamento PostgreSQL existente (`opatriota_documents`) quando `DATABASE_URL` aponta para Neon.
