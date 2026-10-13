# Inventário de referências visuais — O PATRIOTA

## Referências analisadas

| ID | Referência | Módulo | Elementos observados | Estado |
|---|---|---|---|---|
| REF-01 | `image-svSnUeeD4iDNr8smdMxk4lVIGsXabc.png` | Painel da redação | Menu vertical azul-marinho, logo no topo, categorias recolhíveis, ícones coloridos, subitens e badges | Implementação parcial existente; shell em evolução |
| REF-02 | `image-0ansFMdWydJZB5g4SxEhhml0eKrhld.png` | CMS completo | Mosaico de 51 telas: dashboard, tarefas, notificações, agenda, conteúdo, jornal digital, editorial, multimídia, financeiro, usuários, relatórios e configurações | Referência de inventário; telas individuais precisam validação |
| REF-03 | `image.png` | Menu administrativo | Menu compacto e fechado por categoria, coluna estreita, fundo azul profundo e conteúdo à direita | Menu agrupado existente; itens ainda precisam cobertura completa |
| REF-04 | Referências de autenticação anteriores | Leitor/autenticação | Login independente, cadastro e recuperação sem cabeçalho do painel | Implementado nas rotas `/auth/*` |

## Limitações

As imagens fornecidas nesta conversa incluem uma referência vertical do menu e um mosaico do CMS. O mosaico não permite confirmar todos os campos internos de cada tela; por isso detalhes não legíveis devem ser validados nas referências individuais quando fornecidas. Números exibidos nas imagens são tratados apenas como composição visual, nunca como dados reais.

## Critério de validação

Cada tela deve possuir rota real, estado de carregamento, estado vazio/erro, ação principal e integração com contratos ou indicar explicitamente a dependência ainda não conectada. A validação visual será registrada em `VISUAL-COMPLIANCE.md` após captura no navegador.

## Rotas-base

- Redação: `/redacao` e `/redacao/:section`
- Administração: `/admin` e `/admin/:section`
- Leitor: `/leitor` e `/leitor/:subpage`
- Autenticação: `/auth/login/redacao`, `/auth/login/admin`, `/auth/login`

## Componentes relacionados

- `src/components/AdminDashboard.tsx`
- `src/pages/admin/AdminModulePage.tsx`
- `src/pages/admin/AdminPage.tsx`
- `src/app/router/routes.tsx`
- `src/components/newsroom/*`
- `src/components/subscriber/*`

## Estado da auditoria

O inventário está criado. A conformidade tela a tela permanece em andamento e não deve ser considerada concluída somente pela existência do mosaico.
