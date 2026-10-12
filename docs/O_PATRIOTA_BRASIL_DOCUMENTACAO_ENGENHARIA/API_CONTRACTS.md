# Contratos de API — O Patriota Brasil

## Regra de leitura

Este inventário distingue rota identificada de contrato comprovado. Os campos abaixo só podem ser preenchidos como confirmados após leitura do handler, teste local e, quando necessário, teste no sandbox do provedor.

## Handlers identificados

| Handler | Domínio | Contrato a confirmar |
|---|---|---|
| `api/[...path].ts` | rotas agregadas | métodos, caminhos e dispatch interno |
| `api/checkout.ts` | checkout | preço, plano, sessão e retorno |
| `api/plans.ts` | planos | leitura de catálogo e disponibilidade |
| `api/donation.ts` | doações | valor, identificação e confirmação |
| `api/contact-submissions.ts` | contato | validação, anti-spam e persistência |
| `api/privacy-requests.ts` | LGPD | solicitação, autenticação e prazo |
| `api/webhooks/mercadopago.ts` | pagamentos | assinatura, replay e idempotência |
| `api/_lib/billing.ts` | cobrança | regras compartilhadas de billing |

## Contrato mínimo de cada endpoint

Para cada método e caminho, registrar:

- autenticação exigida;
- autorização por papel e recurso;
- parâmetros de path/query;
- schema do body;
- limites de tamanho e cardinalidade;
- resposta de sucesso e status HTTP;
- erros esperados e status HTTP;
- efeitos de persistência;
- chamadas externas;
- idempotência e retry;
- dados pessoais envolvidos;
- teste positivo e teste negativo.

## Convenção recomendada

### Sucesso

```json
{
  "data": {},
  "requestId": "identificador-não-sensível"
}
```

### Erro

```json
{
  "error": {
    "code": "CODIGO_ESTAVEL",
    "message": "Mensagem segura para o cliente"
  },
  "requestId": "identificador-não-sensível"
}
```

Não retornar stack trace, segredo, token, SQL, payload completo de webhook ou dados pessoais desnecessários.

## Regras de billing

1. O servidor recalcula preço e total a partir do catálogo confiável.
2. O cliente não pode decidir que uma cobrança está paga.
3. Checkout deve usar chave de idempotência por intenção de compra.
4. Webhook deve verificar autenticidade antes de alterar assinatura ou pagamento.
5. Eventos repetidos devem ser inofensivos.
6. Mudanças de estado financeiro devem ser auditáveis.
7. Testes financeiros devem usar sandbox e dados não reais.

## Regras de webhook

- Aceitar somente método e content type esperados.
- Validar assinatura conforme documentação atual do provedor.
- Validar identificador e timestamp quando fornecidos.
- Persistir ou reservar o identificador do evento antes do efeito irreversível.
- Responder rapidamente e processar com segurança a repetição.
- Não registrar headers de autorização nem corpo sensível.
- Testar assinatura inválida, evento desconhecido, evento duplicado e timeout do provedor.

## Regras de dados pessoais

- Minimizar coleta.
- Validar e normalizar entradas.
- Aplicar autorização server-side.
- Usar mensagens que não permitam enumeração de contas.
- Definir retenção e exclusão para contato, pagamento e privacidade.
- Registrar somente metadados necessários à auditoria.

## Matriz de testes obrigatória

| Caso | Resultado esperado |
|---|---|
| método não permitido | `405` ou resposta equivalente, sem efeito colateral |
| body inválido | `400`, com código estável |
| credencial ausente | `401` |
| papel insuficiente | `403` |
| recurso inexistente | `404`, sem vazamento |
| recurso de outro usuário | `403` ou `404` conforme política |
| dependência indisponível | erro controlado, sem estado falso |
| repetição idempotente | mesmo resultado, sem duplicação |
| payload acima do limite | rejeição antes do processamento |

## Procedimento para completar o inventário

1. Listar todos os exports HTTP em `api/`.
2. Seguir imports até validação, persistência e integrações.
3. Executar o servidor local sem dados de produção.
4. Testar o caminho feliz e os casos negativos.
5. Registrar evidência em `TRACEABILITY.md`.
6. Atualizar este arquivo somente com contratos observados.

Até essa execução, este documento é um mapa de trabalho e não uma especificação final dos parâmetros de cada rota.
