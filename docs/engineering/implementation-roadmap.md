# Roadmap de implementação

1. Consolidar dispatcher e contratos de artigos, páginas, mídia e edições.
2. Corrigir sessão/restauração e testes 401/403.
3. Finalizar CRUD persistente de matérias e transições editoriais.
4. Implementar Blob + metadados para biblioteca editorial.
5. Implementar páginas institucionais separadas de páginas de edição.
6. Implementar edição versionada e leitor paginado.
7. Ligar usuários, relatórios, configurações e auditoria a dados reais.
8. Validar assinaturas/webhooks em sandbox.
9. Integrar IA somente com provedor disponível.
10. Executar matriz E2E e promover apenas casos com evidência.

Cada etapa deve terminar com typecheck, build, testes específicos e registro `PASSED`, `FAILED`, `BLOCKED` ou `SKIPPED`.
