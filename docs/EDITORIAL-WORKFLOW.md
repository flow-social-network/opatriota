# O PATRIOTA — Manual do Fluxo Editorial e Redação

## 1. Estrutura de Papéis da Redação (RBAC)

1. **Jornalista / Repórter (`jornalista`)**:
   - Cria pautas e matérias.
   - Edita seus próprios textos.
   - Salva como Rascunho.
   - Submete matérias para a fila de revisão (`EM REVISÃO`).
   - *Regra Inegociável*: Não possui permissão para aprovar ou publicar a própria matéria.

2. **Revisor Editorial (`revisor`)**:
   - Analisa a adequação gramatical, clareza e citações de fontes primárias.
   - Pode **Aprovar o texto** ou **Devolver para Correção (`CORREÇÕES`)**, exigindo o preenchimento de nota explicativa obrigatória.

3. **Editor de Redação (`editor_redacao`)**:
   - Revisa o mérito jornalístico e os impactos políticos/econômicos.
   - Aprova matérias (`APROVADA`).
   - Define o nível de acesso do conteúdo (`Aberto`, `Assinante` ou `Premium`).

4. **Editor-Chefe (`editor_chefe`)**:
   - Supervisiona a esteira de publicação nacional.
   - Agenda e autoriza a veiculação imediata no portal (`PUBLICADA`).
   - Gerencia a alocação de jornalistas e prioridades da manchete.

5. **Administrador (`administrator`)**:
   - Configurações globais de sistema, chaves de API, planos de assinatura e auditoria integral.

---

## 2. Diagrama de Estados da Matéria

```
                   [ NOVO ARTIGO ]
                          |
                          v
                    [ RASCUNHO ]
                          |
                          v
                   [ EM REVISÃO ]
                   /            \
                  /              \
    (Solicitar Correções)   (Aprovação Independente)
                /                  \
               v                    v
         [ CORREÇÕES ]         [ APROVADA ]
               |                    |
         (Reenviar)                 v
               \------------>  [ AGENDADA ]
                                    |
                                    v
                               [ PUBLICADA ]
```

---

## 3. Assistente de IA na Redação
- **Função Consultiva**: Sugestão de variações de manchetes éticas, análise de legibilidade e identificação de afirmações carentes de fonte primária.
- **Vedação de Criação Fictícia**: A IA é terminantemente proibida de inventar declarações, dados orçamentários ou nomes de fontes.
- **Vedação de Publicação Automática**: A esteira exige intervenção humana ativa em 100% das decisões de publicação.
