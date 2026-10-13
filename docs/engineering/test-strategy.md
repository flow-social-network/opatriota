# Estratégia de testes

## Camadas
- Contratos: schemas e validações de entrada/saída.
- Unidade: transições editoriais, autorização, idempotência e sanitização.
- Integração: API + persistência + webhooks sandbox.
- E2E: navegador real nos três painéis.
- Regressão: rotas, reload, sessão e exportação.

## Evidência mínima
Toda mutação deve confirmar status HTTP, corpo sem segredo e consulta posterior ao backend. Capturas/traces devem ser salvos em `artifacts/qa/<QA_RUN_ID>/` quando o navegador estiver disponível.

## Status
`NOT_RUN`, `RUNNING`, `PASSED`, `FAILED`, `BLOCKED`, `SKIPPED`. Build verde nunca substitui teste funcional.
