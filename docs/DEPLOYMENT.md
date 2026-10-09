# Guia de Implantação e Produção — O PATRIOTA

## 1. Servidor e Infraestrutura Recomendada
- Ubuntu 22.04 LTS ou 24.04 LTS
- Nginx com HTTP/2 e TLS 1.3
- PHP 8.2-FPM com OPcache habilitado
- MariaDB 10.11 ou MySQL 8.0
- WP-CLI instalado

## 2. Passo a Passo com WP-CLI
```bash
# 1. Ativar o tema oficial
wp theme activate o-patriota

# 2. Ativar o plugin editorial
wp plugin activate o-patriota-editorial

# 3. Executar o cron inicial de fontes
wp cron event run o_patriota_cron_poll_sources
```

## 3. Verificação de Saúde
- Testar a página inicial em dispositivos móveis e desktop.
- Verificar o carregamento do `theme.json` e dos blocos Gutenberg.
- Acessar o menu **O Patriota > Painel Editorial** para confirmar o monitoramento das pautas.
