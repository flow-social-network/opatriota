# O PATRIOTA — Backend e dados: arquitetura AWS

## Estado desta entrega
Foram adicionados scaffold Express/TypeScript, validação de ambiente, cliente Prisma, health checks e schema PostgreSQL. Isso ainda não é uma API completa nem implantação AWS: autenticação/RBAC, rotas editoriais, ingestão, integração Efí e testes de integração continuam pendentes.

## Arquitetura-alvo
- Frontend React/Vite servido por CDN (CloudFront + S3 ou hospedagem atual).
- API stateless em ECS Fargate atrás de Application Load Balancer. Evitar Kubernetes até existir escala que justifique.
- Neon PostgreSQL como fonte transacional única para usuários, artigos, fontes, workflow, assinaturas, pagamentos e auditoria; TLS e privilégios mínimos.
- MongoDB opcional somente para payloads de ingestão semiestruturados. Não duplicar estado financeiro nem acesso premium.
- S3 para mídia e anexos, bloqueio público por padrão e URLs assinadas.
- SQS + DLQ para ingestão assíncrona quando necessário, com idempotência, retries e alarmes.
- Secrets Manager, IAM task roles, KMS, CloudWatch, WAF e rate limiting.
- GitHub Actions com lint, typecheck, testes, build, análise de dependências e aprovação para produção.

## Modelos relacionais
users, refresh_sessions, categories, articles, article_reviews, sources, ingestion_items, article_sources, fact_checks, fact_check_evidence, subscription_plans, subscriptions, payments, payment_events, audit_events e newsletter_subscribers.

## Invariantes obrigatórias
1. Rotas privadas exigem autenticação e RBAC no servidor; não confiar em userId enviado pelo cliente.
2. Apenas editor autorizado publica; manter revisão e auditoria.
3. Acesso de assinante depende do estado confirmado no PostgreSQL, nunca do redirect do navegador.
4. Webhooks Efí devem seguir a documentação oficial atual, persistir evento, deduplicar, processar transacionalmente e ter reconciliação periódica.
5. Reembolso só altera acesso após confirmação do provedor e aplicação da política; distinguir cancelamento, estorno integral e parcial.
6. Não registrar segredos, tokens ou dados de pagamento em logs.
7. Aplicar rate limiting, validação, sessões revogáveis, MFA administrativo e proteção CSRF quando usar cookies.
8. Alterações de schema via migrations revisadas; backup e restauração testada.

## Execução local
1. Copie server/.env.backend.example para server/.env e configure DATABASE_URL localmente; não versione .env.
2. Instale dependências compatíveis, gere o cliente Prisma e valide o schema.
3. Crie/aplique migration apenas em desenvolvimento ou staging após revisão.
4. Teste /health/live e /health/ready.

## Critérios de produção
- Schema e migrations validados em staging.
- Testes RBAC, workflow, webhook duplicado, eventos fora de ordem e estorno.
- CI verde e nenhum segredo no repositório.
- Alarmes para erros, latência, DLQ, falhas de webhook e divergências de reconciliação.
- Restauração de backup demonstrada e rollback ensaiado.
- Efí homologada em sandbox com contrato de API confirmado.
