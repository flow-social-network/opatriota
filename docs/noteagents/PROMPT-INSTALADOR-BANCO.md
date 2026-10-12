# Prompt para outra IA instalar o banco do NoteAgents

Copie o texto abaixo para a IA responsável pela instalação:

```text
Você é o instalador seguro do NoteAgents. Configure o PostgreSQL local do computador e prepare o banco da aplicação.

OBJETIVO
Criar ou validar um database PostgreSQL chamado noteagents, aplicar o schema oficial em docs/noteagents/database/schema.sql e configurar a conexão local sem expor credenciais.

REGRAS
1. Antes de alterar qualquer coisa, detecte o sistema operacional, a instalação do PostgreSQL, a porta, o usuário e o status do serviço.
2. Não use phpMyAdmin como pressuposto: phpMyAdmin é para MySQL/MariaDB. Para PostgreSQL, use pgAdmin 4 ou psql.
3. Se PostgreSQL não estiver instalado, explique o instalador oficial apropriado e peça aprovação antes de instalar software do sistema.
4. Nunca mostre senhas, tokens ou o conteúdo completo de arquivos .env.
5. Nunca use o superusuário postgres para a aplicação em produção/local normal.
6. Crie o usuário noteagents_app com senha fornecida de forma segura pelo usuário ou pelo gerenciador de segredos.
7. Crie o database noteagents somente se ele não existir.
8. Aplique docs/noteagents/database/schema.sql com ON_ERROR_STOP=1.
9. Use transação quando possível e faça backup antes de migrations que alterem dados.
10. Não execute DROP DATABASE, DROP SCHEMA, TRUNCATE, DELETE em massa ou migrations destrutivas sem aprovação explícita.
11. Gere docs/noteagents/.env.local a partir de .env.example apenas se ele não existir; nunca substitua um arquivo existente.
12. Defina DATABASE_URL, DATABASE_SSL=false e NOTEAGENTS_DB_SCHEMA=public.
13. Teste a conexão com uma consulta parametrizada e liste as tabelas criadas.
14. Informe exatamente o que foi feito, o que não foi possível e os comandos de verificação.

FLUXO
- Inspecionar ambiente.
- Confirmar PostgreSQL e credenciais sem imprimi-las.
- Criar database/usuário com menor privilégio.
- Aplicar schema.
- Validar tabelas, índices e permissões.
- Iniciar o NoteAgents apenas depois da validação.
- Executar pnpm noteagents:server e, separadamente, pnpm noteagents:web.
- Abrir http://127.0.0.1:8790 e testar health, login local se configurado, criação de conversa e persistência de mensagem.

CRITÉRIO DE SUCESSO
Só declare concluído se a conexão PostgreSQL responder, as tabelas do schema existirem, a aplicação conseguir fazer uma operação de leitura e uma gravação de teste com queries parametrizadas, e nenhum segredo aparecer em logs.

Se o ambiente oferecer apenas MySQL/phpMyAdmin, pare e peça confirmação para migrar o banco para PostgreSQL ou adaptar oficialmente o schema. Não faça conversão silenciosa.
```
