# PostgreSQL local do NoteAgents

## Observação importante

`phpMyAdmin` é uma ferramenta voltada principalmente para MySQL/MariaDB. Para PostgreSQL, use **pgAdmin 4**, DBeaver ou `psql`. O NoteAgents deve tratar PostgreSQL como banco oficial e não misturar SQL de MySQL com PostgreSQL.

## Pré-requisitos

- PostgreSQL instalado e ativo no computador.
- pgAdmin 4 ou `psql`.
- Node.js 20+ e pnpm.
- Um banco dedicado, por exemplo `noteagents`.
- Um usuário sem privilégios de superusuário para execução normal.

## Criar banco pelo pgAdmin

1. Abra o pgAdmin e conecte ao servidor local.
2. Crie um database chamado `noteagents`.
3. Crie um usuário de aplicação, por exemplo `noteagents_app`.
4. Conceda acesso apenas ao database e ao schema `public`.
5. Execute o arquivo `database/schema.sql` no Query Tool.
6. Verifique as tabelas e índices antes de iniciar o servidor.

## Configuração local

Copie `.env.example` para `.env.local` e preencha:

```env
DATABASE_URL=postgresql://noteagents_app:SENHA@localhost:5432/noteagents
DATABASE_SSL=false
NOTEAGENTS_DB_SCHEMA=public
```

Nunca faça commit de `.env.local`, senhas ou URLs com credenciais.

## Aplicar schema

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f docs/noteagents/database/schema.sql
```

Para uma alteração futura, crie uma migration numerada em `database/migrations/`. Não edite uma migration já aplicada.

## Segurança

- Não use o usuário `postgres` na aplicação.
- Use queries parametrizadas.
- Valide autorização no servidor.
- Faça backup antes de migrations em dados reais.
- Não execute `DROP DATABASE`, `DROP SCHEMA` ou `TRUNCATE` automaticamente.
- Migrações destrutivas exigem aprovação humana explícita.

## Verificação

```sql
select current_database(), current_user;
select table_name from information_schema.tables where table_schema = 'public' order by table_name;
```

Se o usuário realmente precisar de phpMyAdmin, será necessário usar MySQL/MariaDB e adaptar todo o schema; essa não é a configuração recomendada para o NoteAgents.
