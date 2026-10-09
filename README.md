# O PATRIOTA — Portal Jornalístico Profissional

> **"INFORMAÇÃO COM LIBERDADE POR UM BRASIL MAIS FORTE."**
> Notícia • Análise • Opinião • Brasil • Sempre

O PATRIOTA é um portal digital de notícias de cobertura nacional, estruturado sobre WordPress FSE (Full Site Editing) com plugin editorial avançado de ingestão de fontes, deduplicação em 5 camadas, checagem de fatos com ClaimReview Schema.org e redação integrada.

---

## Estrutura do Repositório

```
/
├── wp-content/
│   ├── themes/
│   │   └── o-patriota/           # Tema WordPress FSE Oficial
│   │       ├── style.css         # Identidade, design tokens CSS
│   │       ├── theme.json        # Paleta, fontes, presets de bloco
│   │       ├── functions.php     # Bootstrap do tema
│   │       ├── templates/        # Templates FSE (front-page, single, etc.)
│   │       ├── parts/            # Cabeçalho, ticker, rodapé, newsletter
│   │       ├── patterns/         # Padrões editoriais (Hero 3-col, Grid 6-col)
│   │       └── inc/              # Módulos PHP (setup, assets, acessibilidade)
│   └── plugins/
│       └── o-patriota-editorial/ # Plugin Editorial Avançado
│           ├── o-patriota-editorial.php
│           ├── includes/         # Classes do motor (Fontes, RSS, Deduplicação, Fila)
│           └── admin/            # Painel editorial da redação
├── docs/                         # Documentação completa de engenharia
│   ├── ARCHITECTURE.md           # Arquitetura detalhada
│   ├── INSTALLATION.md           # Guia de implantação em servidor
│   └── EDITORIAL-WORKFLOW.md     # Fluxo da esteira de redação
├── src/                          # Aplicação interativa ao vivo (Port 3000)
│   ├── components/               # Componentes visuais fiéis à referência
│   └── App.tsx                   # Portal vivo + Painel editorial + Exportador ZIP
└── package.json
```

---

## Funcionalidades em Destaque

1. **Composição Fiel à Referência**:
   - Cabeçalho institucional com citação e princípios editoriais.
   - Navegação completa por editorias com botão verde "APOIE O JORNAL".
   - Ticker de "Últimas Notícias" atualizado em tempo real.
   - Bloco nobre em 3 colunas (Manchete + Imagem de Brasília + Notícias Laterais).
   - Seção de 6 cartões temáticos (Política, Brasil, Economia, Segurança, Saúde, Opinião).
   - Faixa de Checagem ("FAÇA A CHECAGEM") com dossiês e caixa de Newsletter.
   - Rodapé institucional patriótico com 4 pilares: Notícia, Análise, Opinião, Brasil.

2. **Engenharia Editorial & Serviços Cívicos**:
   - **Previsão do Tempo Dinâmica das 27 Capitais**: Integração direta com a base meteorológica oficial do **INMET (Instituto Nacional de Meteorologia — [portal.inmet.gov.br](https://portal.inmet.gov.br/))**, cobrindo todas as capitais das 5 regiões com temperatura ao vivo, mínima/máxima, umidade, vento, pressão atmosférica, índice UV e projeção para 4 dias.
   - Central de fontes com proteção contra SSRF e injeção XXE.
   - Motor de deduplicação em 5 camadas com algoritmo fonético e similaridade textual.
   - Fluxo de trabalho que garante a **publicação humana obrigatória**.
   - Marcação Schema.org NewsArticle e ClaimReview para Google News e Fact Check Tools.
   - Exportador integrado em 1 clique para download dos pacotes ZIP prontos para instalação no WordPress.

---

## 🔒 Separação de Interfaces & Endereços de Acesso (Rotas Internas e Privadas)

Conforme as diretrizes editoriais do jornal, **os painéis de trabalho interno não são expostos publicamente na navegação do leitor**. O site público do leitor contém apenas os conteúdos jornalísticos abertos, editoriais e páginas de transparência.

Os acessos aos ambientes restritos e painéis operacionais são documentados a seguir:

| Ambiente / Módulo | Rota / Endereço | Perfil Autorizado | Finalidade |
|---|---|---|---|
| **Site Público do Jornal** | `/` | Público em Geral | Homepage, editorias, reportagens e busca |
| **Área do Leitor / Assinante** | `/minha-conta` | Assinantes Cadastrados | Dashboard do leitor, réplica PDF, acervo e gestão de assinatura |
| **Painel Privado da Redação** | `/redacao` | Jornalistas, Editores e Revisores | Esteira de produção jornalística, checagem e fila de revisão |
| **Backoffice WordPress / Fontes** | `/admin` ou `/wp-admin` | Editor-Chefe e Administrador | Central Nacional de Fontes Oficiais, deduplicação e gerador ZIP |

### Contas de Acesso para Demonstração e Auditoria

No ambiente da aplicação, o acesso pode ser verificado através das credenciais:

1. **Jornalista / Repórter**:
   - E-mail: `thiago.jornalista@opatriota.com.br`
   - Função: Criação de pautas, apuração e envio para revisão na esteira editorial.
2. **Editor-Chefe / Administrador**:
   - Acesso irrestrito à Central de Fontes Oficiais, triagem de feeds RSS e exportação do tema/plugin WordPress.
3. **Assinante Digital**:
   - E-mail: `mariana.duarte@exemplo.com.br`
   - Acesso liberado aos dossiês exclusivos e réplicas digitais em `/minha-conta`.

