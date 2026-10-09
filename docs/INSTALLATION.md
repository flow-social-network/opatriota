# O PATRIOTA — Guia de Instalação e Implantação

## Requisitos do Ambiente
- **Servidor Web**: Nginx ou Apache com mod_rewrite habilitado.
- **PHP**: 8.0, 8.1 ou 8.2 (com extensões `simplexml`, `curl`, `mbstring`, `openssl`).
- **Banco de Dados**: MariaDB 10.5+ ou MySQL 8.0+.
- **WordPress**: 6.4 ou superior (Full Site Editing nativo).

## Passo a Passo

### 1. Instalação do Tema
1. Copie o diretório `wp-content/themes/o-patriota` para o diretório de temas da sua instalação WordPress:
   ```bash
   cp -r wp-content/themes/o-patriota /caminho/do/wordpress/wp-content/themes/
   ```
2. No painel administrativo do WordPress, acesse **Aparência > Temas** e ative **O Patriota**.

### 2. Instalação do Plugin Editorial
1. Copie o diretório `wp-content/plugins/o-patriota-editorial` para o diretório de plugins:
   ```bash
   cp -r wp-content/plugins/o-patriota-editorial /caminho/do/wordpress/wp-content/plugins/
   ```
2. Acesse **Plugins > Plugins Instalados** e ative **O Patriota Editorial**.
3. O plugin criará automaticamente as tabelas `wp_patriota_sources`, `wp_patriota_raw_items` e `wp_patriota_editorial_history`.

### 3. Configuração Inicial e Fontes
1. No menu lateral, acesse **O Patriota > Central de Fontes**.
2. Clique em "Adicionar Fonte" ou ative as fontes oficiais pré-cadastradas (Senado, Câmara, Agência Brasil).
3. Teste a conexão clicando em "Sincronizar Agora".
