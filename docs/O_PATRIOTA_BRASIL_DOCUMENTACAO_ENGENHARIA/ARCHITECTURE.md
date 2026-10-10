# Arquitetura observada

```mermaid
flowchart TD
  U[Leitor / jornalista / administrador] --> WEB[React + Vite]
  WEB --> API[Handlers serverless em api/]
  API --> BILL[api/_lib/billing.ts]
  API --> MP[Webhook Mercado Pago]
  WEB --> FCM[Firebase/FCM - operação não verificada]
  WP[WordPress descrito no README] -. ligação operacional não confirmada .-> WEB
  API --> DB[Persistência - provedor/schema não confirmados]
```

## Camadas
- Interface: `src/App.tsx`, `src/components/`, `public/`.
- API: `api/[...path].ts`, `checkout.ts`, `plans.ts`, `donation.ts`, `contact-submissions.ts`, `privacy-requests.ts`, `webhooks/mercadopago.ts`.
- Lógica de cobrança: `api/_lib/billing.ts`.
- Configuração: `.env.example`, `package.json`, `.github/workflows/validate.yml`.
- WordPress: o README descreve tema FSE e plugin editorial; a instalação real e a comunicação com a API precisam ser confirmadas.

## Fluxo HTTP conceitual
```mermaid
sequenceDiagram
 participant B as Browser
 participant F as Frontend
 participant A as API
 participant X as Persistência/serviço externo
 B->>F: Navega
 F->>A: Requisição
 A->>A: Validar entrada e autorização (por confirmar por rota)
 A->>X: Operação
 X-->>A: Resultado
 A-->>F: Resposta
 F-->>B: Renderização
```

O diagrama mostra camadas identificadas, não prova que todos os serviços estão conectados.
