# Conformidade visual

## Referência aprovada

O painel deve reproduzir um CMS editorial profissional: fundo claro, cabeçalho e menu azul-marinho, marca O PATRIOTA, navegação lateral agrupada e recolhível, conteúdo denso em cartões e tabelas, ações azuis, estados semânticos e responsividade.

## Checklist

- [x] Cabeçalho sem ocupar a área de conteúdo indevidamente.
- [x] Menu lateral azul-marinho com grupos fecháveis.
- [x] Ícones e badges por grupo/subitem.
- [ ] Todos os 66 destinos do inventário possuem telas operacionais próprias.
- [ ] Todas as ações exibem confirmação de persistência real.
- [ ] Capturas individuais de cada módulo comparadas com as referências.
- [ ] Validação mobile do menu como navegação temporária.
- [ ] Estados vazios, carregamento e erro revisados em todas as telas.

## Evidências

As capturas devem ser salvas em `/tmp/agent-browser/` durante a validação e não são consideradas evidência até que a rota, o estado testado e o resultado estejam registrados junto ao commit.

## Evidência desta etapa

- `2026-10-13`: `pnpm` não está disponível no ambiente; foram executados `tsc --noEmit`, `vite build` e `git diff --check` com sucesso.
- Captura `/tmp/agent-browser/redacao-menu-cms.png`: a rota `/redacao` redirecionou corretamente para `/auth/login/redacao?next=%2Fredacao` sem sessão. A tela do menu autenticado não pôde ser capturada sem credencial de redação.
- O build confirmou o shell editorial compilando, mas não comprova persistência ou autorização de cada módulo.

## Pendências honestas

O mosaico fornecido descreve a abrangência visual, mas não comprova contratos, permissões ou persistência. A existência de uma página genérica não será registrada como implementação completa. Cada pendência deve ser removida por código funcional ou mantida explicitamente nesta lista.
