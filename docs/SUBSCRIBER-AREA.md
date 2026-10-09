# O PATRIOTA — Área do Assinante e Paywall

## 1. Rotas do Portal do Assinante (`/minha-conta/*`)

- `/minha-conta`: Painel geral com saudação, resumo da assinatura e matérias salvas.
- `/minha-conta/entrar`: Formulário de autenticação com proteção de rate limiting contra força bruta (máximo de 5 tentativas por IP).
- `/minha-conta/cadastro`: Registro de novos leitores com validação de termos e LGPD.
- `/minha-conta/recuperar-senha`: Emissão de token temporário de redefinição de credenciais.
- `/minha-conta/perfil`: Gestão de dados pessoais (nome, telefone, biografia).
- `/minha-conta/assinatura`: Comparação e migração entre os planos Gratuito, Digital e Premium.
- `/minha-conta/pagamentos`: Histórico de notas fiscais e mensalidades.
- `/minha-conta/favoritos`: Gestão de reportagens salvas para leitura posterior.
- `/minha-conta/notificacoes`: Ativação de alertas de Últimas Notícias, Briefing Diário e Checagens.
- `/minha-conta/privacidade`: Portabilidade e exportação de dados em JSON, além do direito à exclusão definitiva (LGPD Art. 18).

---

## 2. Níveis de Acesso e Paywall no Servidor

O bloqueio de conteúdo é estritamente executado no **backend (servidor)** através do filtro `the_content` em `O_Patriota_Content_Restriction`:

1. **Aberto (`aberto`)**: Acesso público universal irrestrito.
2. **Assinante (`assinante`)**: Apenas assinantes dos planos Digital e Premium, além de membros da redação, recebem o corpo completo do texto.
3. **Premium (`premium`)**: Restrito a membros do plano Patriota Premium.

**Garantia de Segurança**: Para leitores não assinantes, apenas o parágrafo inicial (lead) é enviado ao navegador, seguido do componente de bloqueio. O texto confidencial nunca é transmitido no HTML da página para usuários sem a permissão correspondente.
