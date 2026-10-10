# Perfil público e verificação de vínculo jornalístico

## Objetivo
Permitir que empresas, assessorias e entidades consultem um perfil público e confirmem se a redação do O Patriota Brasil reconhece o vínculo editorial daquela pessoa.

## Fluxo de administração
1. Um ADMIN ou CHIEF_EDITOR cria/atualiza o perfil em `PUT /api/admin/journalists/:userId/profile`.
2. A edição deixa o perfil em `PENDING` e remove a confirmação anterior, para que alterações de nome, biografia ou contactos não mantenham uma confirmação antiga.
3. Um responsável autorizado verifica a identidade e o vínculo fora do sistema e regista a referência interna da evidência.
4. Depois de verificar, confirma em `POST /api/admin/journalists/:userId/verify`, opcionalmente com `expiresAt`.
5. Suspensão/revogação é feita por `PATCH /api/admin/journalists/:userId/status` com `SUSPENDED` ou `REVOKED`.
6. Cada alteração é registada em `AuditEvent`.

## Endpoints públicos
- `GET /api/journalists?query=nome-ou-codigo`: só perfis confirmados, ativos e dentro da validade.
- `GET /api/journalists/:slug`: perfil público e até 10 matérias publicadas.
- `/verificar-imprensa`: pesquisa por nome, slug ou código.
- `/imprensa/:slug`: página pública de verificação.

Perfis pendentes, suspensos, revogados, expirados ou ligados a contas desativadas não são devolvidos como confirmados. A ausência de resultado não prova que alguém não seja jornalista; só indica que este registo não confirma vínculo atual com o jornal.

## Limite da declaração
A confirmação certifica exclusivamente o vínculo editorial com O Patriota Brasil. Não é carteira emitida por órgão público e não certifica vínculo com outras entidades. A página não publica documentos pessoais, e-mails privados nem a referência interna usada na verificação.

## Segurança e operações
- Só ADMIN/CHIEF_EDITOR podem gerir perfis e confirmar vínculos.
- O código de credencial é gerado pelo backend; o navegador não escolhe status ou código.
- Alterar dados de perfil invalida a confirmação e exige nova revisão.
- Revogar/suspender invalida imediatamente a consulta pública.
- Aplicar a migração de banco apenas por pipeline autorizado; não foi aplicada a qualquer base de produção nesta alteração.
