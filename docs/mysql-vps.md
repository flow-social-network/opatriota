# MySQL na VPS

A API usa uma camada de documentos em `api/_lib/storage.ts`. O Firestore continua ativo por padrão; para habilitar MySQL, configure `DATABASE_PROVIDER=mysql` e `DATABASE_URL` no ambiente do servidor. Não defina essas variáveis na Vercel atual, que deve continuar usando Firestore.

## Preparar a VPS

1. Instale MySQL 8.0 ou superior e crie um banco e um usuário exclusivos para a aplicação.
2. Aplique o schema inicial:

   ```sh
   mysql --defaults-extra-file=/caminho/seguro/mysql-client.cnf opatriota < database/mysql/001_document_store.sql
   ```

3. Configure no ambiente privado do serviço:

   ```dotenv
   DATABASE_PROVIDER=mysql
   DATABASE_URL=mysql://opatriota:SENHA_URL_ENCODED@127.0.0.1:3306/opatriota
   MYSQL_CONNECTION_LIMIT=5
   ```

   Codifique caracteres reservados da senha como percent-encoding. Restrinja o MySQL à rede local da aplicação, mantenha TLS se a conexão sair da VPS e não publique `DATABASE_URL` em variáveis `VITE_*`.

4. Reinicie o serviço e confirme os endpoints de leitura e gravação antes de apontar o domínio para a VPS.

## Até a migração

Mantenha `DATABASE_PROVIDER=firestore` e configure uma conta de serviço Firebase válida no segredo `FIREBASE_SERVICE_ACCOUNT_JSON`. A variável `DATABASE_URL` PostgreSQL/Neon que possa existir no ambiente não é usada por este adaptador.

## Migração de dados

Trocar `DATABASE_PROVIDER` não copia dados. Antes de ativar MySQL em produção, exporte as coleções Firestore utilizadas pela API e importe cada documento para `opatriota_documents`, preservando o nome da coleção, o ID e o objeto JSON. Valide contagens e amostras de leitura antes de direcionar tráfego; mantenha um backup do Firestore até concluir a verificação.