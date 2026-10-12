import { Article, CategoryDetail, ColumnistProfile, EditorialAgendaItem, EditorialPauta, MediaItem, RssSource } from '../../src/types';

export function getInitialSeedData(): Record<string, Record<string, any>> {
  const articles: Record<string, any> = {
    'art-1': {
      id: 'art-1',
      slug: 'camara-avanca-com-projeto-de-corte-de-gastos',
      title: 'Câmara avança com projeto de corte de gastos e oposição promete obstrução',
      subtitle: 'Proposta segue para análise no Senado e divide opiniões entre governo e oposição.',
      kicker: 'POLÍTICA NACIONAL',
      category: 'politica',
      tags: ['Câmara', 'Gastos Públicos', 'Política', 'Congresso'],
      content: '<p>A Câmara dos Deputados deu um passo importante nesta terça-feira para a aprovação do projeto de corte de gastos, que prevê medidas de contenção fiscal e reestruturação de despesas públicas.</p><p>O texto prevê uma série de medidas com impacto estimado em bilhões nos próximos anos. Líderes partidários debatem os últimos destaques antes do encaminhamento ao Senado Federal.</p>',
      author: 'João Silva',
      authorId: 'usr-joao',
      authorRole: 'Repórter Especial',
      publishedAt: '2026-10-12T14:32:00Z',
      updatedAt: '2026-10-12T14:32:00Z',
      readTimeMinutes: 4,
      imageUrl: '/images/hero_congresso.jpg',
      imageCaption: 'Plenário da Câmara dos Deputados durante deliberação fiscal.',
      imageCredits: 'Agência Câmara',
      sourceName: 'Câmara dos Deputados',
      sourceUrl: 'https://camara.leg.br',
      sourcesConsulted: ['Agência Câmara', 'Ministério da Fazenda'],
      accessLevel: 'aberto',
      editorialStatus: 'EM REVISÃO',
      priority: 'alta',
      reviewNotes: 'Revisão textual em andamento por Mariana Lima.',
      aiRiskScore: 82,
      aiRiskLevel: 'Baixo risco',
      aiChecklist: {
        factualContent: true,
        sourcesVerified: true,
        noMisinformation: true,
        properLanguage: true,
        noLegalRisk: true
      }
    },
    'art-2': {
      id: 'art-2',
      slug: 'economia-brasileira-mostra-sinais-de-recuperacao',
      title: 'Economia brasileira mostra sinais de recuperação sustentada no terceiro trimestre',
      subtitle: 'PIB cresce acima das expectativas com tração do agronegócio e investimentos em infraestrutura.',
      kicker: 'ECONOMIA & MERCADO',
      category: 'economia',
      tags: ['Economia', 'PIB', 'Agronegócio', 'Mercado'],
      content: '<p>Indicadores de atividade divulgados pelo Banco Central e pelo IBGE apontam para um ritmo de crescimento consistente no trimestre, impulsionado pelas exportações agrícolas e pela demanda de serviços.</p>',
      author: 'Ana Costa',
      authorId: 'usr-ana',
      authorRole: 'Correspondente Econômica',
      publishedAt: '2026-10-12T11:15:00Z',
      updatedAt: '2026-10-12T11:15:00Z',
      readTimeMinutes: 5,
      imageUrl: '/images/news_economia.jpg',
      imageCaption: 'Complexo portuário e escoamento de grãos brasileiros.',
      imageCredits: 'Redação O Patriota',
      sourceName: 'IBGE / Banco Central',
      accessLevel: 'aberto',
      editorialStatus: 'EM REDAÇÃO',
      priority: 'normal',
      aiRiskScore: 88,
      aiRiskLevel: 'Baixo risco'
    },
    'art-3': {
      id: 'art-3',
      slug: 'stf-retoma-julgamento-sobre-marco-das-redes-sociais',
      title: 'STF retoma julgamento sobre marco regulatório das redes sociais e responsabilidade de plataformas',
      subtitle: 'Ministros avaliam constitucionalidade do artigo 19 do Marco Civil da Internet.',
      kicker: 'PODER JUDICIÁRIO',
      category: 'brasil',
      tags: ['STF', 'Redes Sociais', 'Marco Civil', 'Justiça'],
      content: '<p>O Supremo Tribunal Federal retomou hoje a análise sobre as diretrizes de responsabilidade de intermediários de internet no Brasil, com transmissão ao vivo pela TV Justiça.</p>',
      author: 'Carlos Mendes',
      authorId: 'usr-carlos',
      authorRole: 'Analista Jurídico',
      publishedAt: '2026-10-12T09:47:00Z',
      updatedAt: '2026-10-12T09:47:00Z',
      readTimeMinutes: 6,
      imageUrl: '/images/factcheck_smartphone.jpg',
      imageCaption: 'Dispositivos móveis e redes de comunicação.',
      imageCredits: 'Redação O Patriota',
      sourceName: 'Supremo Tribunal Federal',
      accessLevel: 'aberto',
      editorialStatus: 'RECEBIDA',
      priority: 'alta',
      aiRiskScore: 78,
      aiRiskLevel: 'Baixo risco'
    },
    'art-video-protestar-direito': {
      id: 'art-video-protestar-direito',
      slug: 'protestar-e-direito-vandalismo-nao',
      title: 'PROTESTAR É DIREITO, VANDALISMO NÃO!',
      subtitle: 'A liberdade de manifestação é um direito fundamental. Mas destruir o patrimônio público não pode ser tratado como algo normal. Exigimos transparência, apuração e o mesmo critério para todos.',
      kicker: 'EDITORIAL EM VÍDEO',
      category: 'politica',
      accessLevel: 'aberto',
      editorialStatus: 'PUBLICADA',
      priority: 'alta',
      videoEmbedUrl: 'https://www.youtube.com/embed/IACLb9V3d6U',
      videoIframeHtml: '<iframe width="918" height="516" src="https://www.youtube.com/embed/IACLb9V3d6U" title="PROTESTAR É DIREITO, VANDALISMO NÃO!" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
      content: `<p>🇧🇷 A liberdade de manifestação é um direito fundamental. Mas destruir o patrimônio público não pode ser tratado como algo normal.</p><p>Após o ato pró-Lula na Avenida Paulista, a Polícia Militar relatou tumulto, pichações e depredação durante a dispersão dos manifestantes. O Metrô, por sua vez, afirmou não ter registros internos de danos nas estações da região.</p><p>Diante das versões divergentes, cobramos transparência, investigação e esclarecimentos. Se houve danos, os responsáveis devem ser identificados e responder por seus atos, conforme a lei.</p><p>⚖️ Nossa posição é clara: responsabilidade individual, provas e o mesmo critério para todos os campos políticos.</p><p>💬 Você concorda que o patrimônio público deve ser respeitado independentemente de quem organiza a manifestação? Deixe sua opinião nos comentários.</p><p>📰 O PATRIOTA — Informação com Liberdade, por um Brasil mais forte!</p>`,
      author: 'Redação O Patriota',
      authorId: 'usr-4',
      authorRole: 'Editorial & Análise Multimídia',
      publishedAt: '2026-10-12T10:00:00Z',
      updatedAt: '2026-10-12T10:15:00Z',
      readTimeMinutes: 2,
      imageUrl: 'https://img.youtube.com/vi/IACLb9V3d6U/hqdefault.jpg',
      imageCaption: 'PROTESTAR É DIREITO, VANDALISMO NÃO! — Assista ao vídeo editorial exclusivo de O Patriota Brasil.',
      imageCredits: 'O Patriota Brasil / YouTube Oficial',
      sourceName: 'Apuração Editorial / PM-SP e Metrô',
      sourceUrl: 'https://www.youtube.com/watch?v=IACLb9V3d6U',
      tags: ['Editorial', 'Liberdade de Manifestação', 'Vandalismo', 'Patrimônio Público', 'Política Brasileira', 'Justiça', 'Brasil'],
      viewsCount: 28400,
      likesCount: 3410,
      commentsCount: 420,
      sharesCount: 195,
      aiRiskScore: 95,
      aiRiskLevel: 'Baixo risco'
    },
    'art-4': {
      id: 'art-4',
      slug: 'policia-e-metro-divergem-sobre-danos-apos-ato-pro-lula-na-avenida-paulista',
      title: 'Polícia e Metrô divergem sobre danos após ato pró-Lula na Avenida Paulista',
      subtitle: 'A Secretaria da Segurança Pública afirma que a PM registrou tumulto, pichações e depredação durante a dispersão; o Metrô diz não ter registros internos de danos nas estações da região.',
      kicker: 'ELEIÇÕES 2026 & SEGURANÇA',
      category: 'politica',
      tags: ['Avenida Paulista', 'Polícia Militar', 'Metrô SP', 'Eleições 2026', 'Manifestações', 'Segurança Pública'],
      content: `SÃO PAULO, 12 de outubro de 2026 — Um ato da campanha do presidente Luiz Inácio Lula da Silva (PT), candidato à reeleição, terminou no domingo (11) na Avenida Paulista com versões diferentes sobre o que ocorreu na dispersão. A Polícia Militar relatou tumulto, pichações e depredação. O Metrô disse que, até o início da noite, não tinha registros internos de vandalismo ou danos nas estações da região.

A divergência não havia sido esclarecida nas informações divulgadas até a publicação desta reportagem. Ela surge a duas semanas do segundo turno, marcado para 25 de outubro, em que Lula enfrenta Flávio Bolsonaro (PL), e em um ambiente polarizado em que episódios assim costumam ser rapidamente usados por ambos os lados.

Em nota enviada por volta das 19h, a Secretaria da Segurança Pública informou que as ocorrências surgiram “durante a dispersão dos manifestantes”. Segundo a PM, os acessos às estações Trianon-Masp (Linha 2-Verde) e Paulista (Linha 4-Amarela) foram bloqueados por ocorrências de depredação e tumulto. Vídeos mostram pessoas, algumas com o rosto coberto, sobre a cobertura de vidro de uma entrada da Trianon-Masp. Há também uma pichação com a frase “Viva a Revolução”, sem indicação de quando foi feita ou por quem.

O Metrô deu outra explicação para o fechamento. A companhia afirmou ter acionado o plano de controle de multidão por causa da grande concentração de pessoas e fechado o acesso à Trianon-Masp até as 16h30. Disse ainda não ter registros internos de danos nas estações da Paulista “no momento”. A ausência de registros até aquele horário não equivale, por si só, a provar que nenhum dano ocorreu.

O ato reuniu movimentos sociais, organizações estudantis e outros grupos. O PT diz ter levado 1 milhão de pessoas à avenida, número não verificado de forma independente. A Folha de S.Paulo informou que houve mobilização em 76 municípios. As fontes consultadas não indicam depredações em escala nacional.

### Perguntas sem resposta
Até a publicação, não estava claro:
• quais estruturas foram de fato danificadas, e em que extensão;
• se há boletins de ocorrência, imagens de câmeras de segurança ou ordens de manutenção que confirmem os danos;
• se algum responsável foi identificado ou detido;
• quem fez as pichações e quando;
• qual seria o custo de eventuais reparos, e quem o arcaria.

As informações divulgadas até agora não permitem atribuir os danos ao conjunto dos participantes, aos organizadores, a partidos ou a integrantes do governo. A presença de lideranças políticas no ato não indica, por si só, participação ou incentivo a atos de vandalismo.

### Posicionamento das lideranças
Até a publicação desta reportagem, não havia manifestação do PT, dos organizadores ou do Palácio do Planalto sobre os relatos da PM nas fontes consultadas. [Se houver confirmação: “A reportagem procurou a campanha de Lula e aguarda retorno.”]

Esta reportagem será atualizada se novos registros oficiais ou imagens verificadas forem divulgados. Com informações de UOL/Agência Estado, CNN Brasil, Agência Brasil, Folha de S.Paulo e ISTOÉ.

### Dois pontos em que a revisão diverge das fontes
Quais estações foram fechadas. A revisão diz que a PM atribuiu o fechamento de Consolação e Trianon-Masp às ocorrências. Nas matérias que encontrei, a PM cita Trianon-Masp e Paulista (Linha 4), e o Estadão/O Liberal diz que Consolação e Brigadeiro ficaram abertas. Segui as minhas fontes.

---

### LEIA A OPINIÃO
**Editorial do O PATRIOTA**
[Protesto é direito; depredação é crime, seja de quem for →](/noticia/protesto-e-direito-depredacao-e-crime)`,
      author: 'Equipe de Apuração O Patriota',
      authorId: 'usr-4',
      authorRole: 'Cobertura Especial Eleições 2026',
      publishedAt: '2026-10-12T11:20:00Z',
      updatedAt: '2026-10-12T11:45:00Z',
      readTimeMinutes: 4,
      imageUrl: 'https://scontent.fpoa13-1.fna.fbcdn.net/v/t39.30808-6/844461567_122099510319508218_8962011006668968197_n.jpg?stp=dst-jpg_tt6&cstp=mx1084x714&ctp=p180x540&_nc_cat=105&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_ohc=hDk0EMtW1w8Q7kNvwFC6Gmx&_nc_oc=AdqonzhRXaH0YEa_3rh9RgNOglth0gqj4oy_K84Za5Zq4v-y0RRjDXxEzruuj_wn8Y7QS8_6MQh0IvbX5uLI8elu&_nc_zt=23&_nc_ht=scontent.fpoa13-1.fna&_nc_gid=4gd88Wwt0riEFMkkB1x-Og&_nc_ss=7b2a8&oh=00_AQND8s6qsaTfjM1AClRbjITi00yqbfKZw8otE2Uxys0_7Q&oe=6AD2CE25',
      imageCaption: 'Ato na Avenida Paulista e dispersão geram divergência entre relatos da PM e da administração do Metrô.',
      imageCredits: 'Redes Sociais / O Patriota',
      sourceName: 'SSP-SP, Metrô-SP, UOL/Agência Estado, CNN Brasil, Folha de S.Paulo',
      sourceUrl: 'https://www.ssp.sp.gov.br',
      sourcesConsulted: ['Secretaria de Segurança Pública de SP (SSP)', 'Companhia do Metropolitano de São Paulo (Metrô)', 'UOL / Agência Estado', 'CNN Brasil', 'Folha de S.Paulo', 'ISTOÉ'],
      accessLevel: 'aberto',
      editorialStatus: 'PUBLICADA',
      priority: 'alta',
      viewsCount: 38200,
      likesCount: 4210,
      commentsCount: 560,
      sharesCount: 142,
      aiRiskScore: 94,
      aiRiskLevel: 'Baixo risco'
    },
    'art-opiniao-protesto-direito-depredacao-crime': {
      id: 'art-opiniao-protesto-direito-depredacao-crime',
      slug: 'protesto-e-direito-depredacao-e-crime',
      title: 'OPINIÃO | Editorial do O PATRIOTA: Protesto é direito; depredação é crime, seja de quem for',
      subtitle: 'Manifestação pacífica é um direito constitucional fundamental; depredação do patrimônio público é crime inaceitável. Apuração técnica, rigorosa e a mesma regra para todos os lados.',
      kicker: 'EDITORIAL O PATRIOTA',
      category: 'opiniao',
      tags: ['Opinião', 'Editorial', 'Avenida Paulista', 'Constituição', 'Ordem Pública', 'Segurança Pública'],
      content: `O ato de domingo na Avenida Paulista terminou com versões incompletas e divergentes, mas uma verdade precisa ser reafirmada de forma categórica e inequívoca: manifestação popular pacífica é um direito constitucional inalienável; depredação do patrimônio público, pichação e violência são crimes, independentemente de quem os cometa ou de qual bandeira empunhe.

A Constituição Cidadã de 1988 assegura no artigo 5º a liberdade de reunião pacífica e a livre manifestação do pensamento. Esse é um pilar da democracia. Contudo, a mesma ordem constitucional estabelece com clareza os limites da legalidade. Destruir acessos de estações de metrô que servem a milhões de trabalhadores que dependem do transporte diariamente não é protesto — é vandalismo inaceitável.

Diante do conflito de informações entre a Secretaria da Segurança Pública e a administração do Metrô de São Paulo, O PATRIOTA exige apuração técnica, rigorosa e transparente. As câmeras de monitoramento, laudos periciais e ordens de serviço devem ser disponibilizados publicamente para esclarecer a verdade dos fatos. Se houve crime e dano, os responsáveis devem ser identificados e punidos na forma da lei, com ampla defesa e devido processo legal.

O Brasil não pode normalizar a relativização da ordem pública ao sabor de conveniências eleitorais. A lei deve ser aplicada com rigor e com a mesma régua moral e jurídica a qualquer manifestação, seja da esquerda, seja da direita. Defender a lei e o patrimônio do povo brasileiro é o nosso compromisso inegociável.

---

### Reportagem Relacionada
**Apuração dos Fatos**
[← Polícia e Metrô divergem sobre danos após ato pró-Lula na Avenida Paulista](/noticia/policia-e-metro-divergem-sobre-danos-apos-ato-pro-lula-na-avenida-paulista)`,
      author: 'Conselho Editorial O PATRIOTA',
      authorId: 'usr-1',
      authorRole: 'Editorial Institucional',
      publishedAt: '2026-10-12T12:00:00Z',
      updatedAt: '2026-10-12T12:15:00Z',
      readTimeMinutes: 3,
      imageUrl: 'https://scontent.fpoa13-1.fna.fbcdn.net/v/t39.30808-6/844461567_122099510319508218_8962011006668968197_n.jpg?stp=dst-jpg_tt6&cstp=mx1084x714&ctp=p180x540&_nc_cat=105&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_ohc=hDk0EMtW1w8Q7kNvwFC6Gmx&_nc_oc=AdqonzhRXaH0YEa_3rh9RgNOglth0gqj4oy_K84Za5Zq4v-y0RRjDXxEzruuj_wn8Y7QS8_6MQh0IvbX5uLI8elu&_nc_zt=23&_nc_ht=scontent.fpoa13-1.fna&_nc_gid=4gd88Wwt0riEFMkkB1x-Og&_nc_ss=7b2a8&oh=00_AQND8s6qsaTfjM1AClRbjITi00yqbfKZw8otE2Uxys0_7Q&oe=6AD2CE25',
      imageCaption: 'Ato na Avenida Paulista: O PATRIOTA defende apuração transparente e igualdade perante a lei.',
      imageCredits: 'Redes Sociais / O Patriota',
      sourceName: 'Conselho Editorial O PATRIOTA',
      sourceUrl: 'https://www.opatriotabrasil.com.br/editorial',
      sourcesConsulted: ['Constituição da República Federativa do Brasil de 1988', 'Código Penal Brasileiro', 'Relatório Técnico SSP-SP', 'Companhia do Metropolitano de SP'],
      accessLevel: 'aberto',
      editorialStatus: 'PUBLICADA',
      priority: 'alta',
      viewsCount: 29500,
      likesCount: 3890,
      commentsCount: 610,
      sharesCount: 310,
      aiRiskScore: 98,
      aiRiskLevel: 'Baixo risco'
    },
    'art-5': {
      id: 'art-5',
      slug: 'entrevista-especial-analisa-cenario-eleitoral',
      title: 'Entrevista: Especialista analisa cenário político e tendências do parlamento',
      subtitle: 'Doutor em ciência política debate correlação de forças e reformas prioritárias.',
      kicker: 'ENTREVISTA EXCLUSIVA',
      category: 'politica',
      tags: ['Entrevista', 'Congresso', 'Análise Política'],
      content: '<p>Em conversa aprofundada com a equipe de reportagem do O Patriota, analistas traçam os possíveis cenários para o próximo biênio legislativo.</p>',
      author: 'Mariana Lima',
      authorId: 'usr-mariana',
      authorRole: 'Revisora Sênior',
      publishedAt: '2026-10-12T14:15:00Z',
      updatedAt: '2026-10-12T14:15:00Z',
      readTimeMinutes: 7,
      imageUrl: '/images/news_opiniao.jpg',
      imageCaption: 'Entrevista concedida à redação de O Patriota em Brasília.',
      imageCredits: 'O Patriota Brasil',
      sourceName: 'Redação',
      accessLevel: 'assinante',
      editorialStatus: 'EM REVISÃO',
      priority: 'normal',
      aiRiskScore: 85,
      aiRiskLevel: 'Baixo risco'
    },
    'art-6': {
      id: 'art-6',
      slug: 'coluna-o-brasil-que-queremos',
      title: 'Coluna: O Brasil que queremos — liberdade econômica e solidez institucional',
      subtitle: 'Artigo semanal sobre soberania republicana e dinamismo da livre iniciativa.',
      kicker: 'COLUNA DA SEMANA',
      category: 'opiniao',
      tags: ['Opinião', 'Liberdade', 'Economia', 'Instituições'],
      content: '<p>Nenhuma nação floresceu sem regras fiscais estáveis e respeito incondicional às garantias fundamentais da propriedade e da livre escolha.</p>',
      author: 'Paulo Vieira',
      authorId: 'usr-paulo',
      authorRole: 'Colunista de Política e Sociedade',
      publishedAt: '2026-10-12T14:08:00Z',
      updatedAt: '2026-10-12T14:08:00Z',
      readTimeMinutes: 5,
      imageUrl: '/images/marcos-vinicius.jpg',
      imageCaption: 'Paulo Vieira, colunista de O Patriota Brasil.',
      imageCredits: 'O Patriota Brasil',
      sourceName: 'Conselho Editorial',
      accessLevel: 'aberto',
      editorialStatus: 'RECEBIDA',
      priority: 'normal',
      aiRiskScore: 90,
      aiRiskLevel: 'Baixo risco'
    }
  };

  const editorialAgenda: Record<string, any> = {
    'ag-1': {
      id: 'ag-1',
      date: '2026-03-26',
      dayLabel: '26',
      monthLabel: 'MAR',
      time: '09:00',
      title: 'Câmara: corte de gastos',
      description: 'Acompanhar votação de destaques no plenário.',
      type: 'Matéria',
      responsible: 'Roberto Alves',
      status: 'em_andamento',
      priority: 'alta'
    },
    'ag-2': {
      id: 'ag-2',
      date: '2026-03-26',
      dayLabel: '26',
      monthLabel: 'MAR',
      time: '10:30',
      title: 'Reforma tributária',
      description: 'Entrevista coletiva no Ministério da Fazenda.',
      type: 'Entrevista',
      responsible: 'Mariana Lima',
      status: 'agendado',
      priority: 'alta'
    },
    'ag-3': {
      id: 'ag-3',
      date: '2026-03-27',
      dayLabel: '27',
      monthLabel: 'MAR',
      time: '14:00',
      title: 'Energia renovável',
      description: 'Lançamento de marco de leilões eólicos e solares.',
      type: 'Reportagem',
      responsible: 'Carlos Mendes',
      status: 'planejado',
      priority: 'normal'
    },
    'ag-4': {
      id: 'ag-4',
      date: '2026-03-27',
      dayLabel: '27',
      monthLabel: 'MAR',
      time: '09:00',
      title: 'Balanço econômico',
      description: 'Fechamento semanal da bolsa e indicadores de câmbio.',
      type: 'Coluna',
      responsible: 'Ana Costa',
      status: 'planejado',
      priority: 'normal'
    }
  };

  const columnists: Record<string, any> = {
    'col-1': {
      id: 'col-1',
      name: 'Paulo Vieira',
      role: 'Política e Sociedade',
      bio: 'Cientista político e ensaísta com foco em reformas de estado e representatividade.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80',
      status: 'Ativo',
      articlesCount: 42,
      email: 'paulo.vieira@opatriota.sbs'
    },
    'col-2': {
      id: 'col-2',
      name: 'Ana Costa',
      role: 'Economia e Mercados',
      bio: 'Especialista em macroeconomia e mercado de capitais no cenário nacional.',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=80',
      status: 'Ativo',
      articlesCount: 58,
      email: 'ana.costa@opatriota.sbs'
    },
    'col-3': {
      id: 'col-3',
      name: 'Carlos Mendes',
      role: 'Direito e Cidadania',
      bio: 'Advogado constitucionalista e analista de decisões dos tribunais superiores.',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
      status: 'Ativo',
      articlesCount: 31,
      email: 'carlos.mendes@opatriota.sbs'
    },
    'col-4': {
      id: 'col-4',
      name: 'Dr. Alberto Gonçalves',
      role: 'Economia Política',
      bio: 'Doutor em Economia e Membro do Conselho Editorial de O Patriota.',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=240&q=80',
      status: 'Ativo',
      articlesCount: 84,
      email: 'alberto.editor@opatriota.sbs'
    }
  };

  const media: Record<string, any> = {
    'med-1': {
      id: 'med-1',
      title: 'Congresso Nacional — Fachada e Cúpulas',
      url: '/images/hero_congresso.jpg',
      type: 'image',
      format: 'JPEG',
      size: '1.4 MB',
      width: 1920,
      height: 1080,
      altText: 'Edifício do Congresso Nacional em Brasília com a bandeira do Brasil.',
      credits: 'Redação O Patriota',
      uploadedAt: '2026-10-09T10:00:00Z'
    },
    'med-2': {
      id: 'med-2',
      title: 'Economia e Finanças',
      url: '/images/news_economia.jpg',
      type: 'image',
      format: 'JPEG',
      size: '980 KB',
      width: 1280,
      height: 720,
      altText: 'Gráficos de mercado financeiro e investimentos produtivos.',
      credits: 'Banco Central',
      uploadedAt: '2026-10-09T10:00:00Z'
    },
    'med-3': {
      id: 'med-3',
      title: 'Infraestrutura e Energia',
      url: '/images/news_infraestrutura.jpg',
      type: 'image',
      format: 'JPEG',
      size: '1.1 MB',
      width: 1280,
      height: 720,
      altText: 'Obras de infraestrutura de transporte e energia.',
      credits: 'Ministério dos Transportes',
      uploadedAt: '2026-10-09T10:00:00Z'
    },
    'med-4': {
      id: 'med-4',
      title: 'Porto de Rio Grande',
      url: '/images/news_porto.jpg',
      type: 'image',
      format: 'JPEG',
      size: '1.2 MB',
      width: 1280,
      height: 720,
      altText: 'Operação portuária de carga e descarga.',
      credits: 'Portos RS',
      uploadedAt: '2026-10-09T10:00:00Z'
    }
  };

  const activities: Record<string, any> = {
    'act-1': {
      id: 'act-1',
      authorName: 'Ana Costa',
      action: 'enviou matéria para revisão',
      timestamp: '14:32',
      articleId: 'art-1',
      type: 'submission'
    },
    'act-2': {
      id: 'act-2',
      authorName: 'IA Editorial',
      action: 'concluiu análise de risco',
      timestamp: '14:20',
      articleId: 'art-1',
      type: 'ai'
    },
    'act-3': {
      id: 'act-3',
      authorName: 'Carlos Mendes',
      action: 'comentou na matéria',
      timestamp: '13:48',
      articleId: 'art-2',
      type: 'comment'
    },
    'act-4': {
      id: 'act-4',
      authorName: 'Redação',
      action: 'Nova pauta adicionada',
      timestamp: '12:15',
      articleId: 'ag-2',
      type: 'pauta'
    },
    'act-5': {
      id: 'act-5',
      authorName: 'IA Studio',
      action: 'Imagem gerada pela IA',
      timestamp: '11:32',
      articleId: 'med-1',
      type: 'ai_image'
    },
    'act-6': {
      id: 'act-6',
      authorName: 'Marcos Vinícius',
      action: 'Matéria aprovada para publicação',
      timestamp: '10:21',
      articleId: 'art-4',
      type: 'approval'
    }
  };

  const systemStatus: Record<string, any> = {
    current: {
      allOperational: true,
      lastCheck: new Date().toISOString(),
      services: [
        { name: 'Sistema da Redação', status: 'Operacional', healthy: true },
        { name: 'Banco de Dados (Neon / MySQL)', status: 'Operacional', healthy: true },
        { name: 'Autenticação (Firebase)', status: 'Operacional', healthy: true },
        { name: 'Publicação no Site', status: 'Operacional', healthy: true },
        { name: 'Integração Facebook', status: 'Operacional', healthy: true },
        { name: 'Serviços de E-mail', status: 'Operacional', healthy: true },
        { name: 'Armazenamento de Mídia', status: 'Operacional', healthy: true }
      ]
    }
  };

  const integrations: Record<string, any> = {
    facebook: { id: 'facebook', name: 'Facebook', connected: true, lastSync: '2026-10-12T10:00:00Z', page: 'O Patriota Brasil' },
    instagram: { id: 'instagram', name: 'Instagram', connected: true, lastSync: '2026-10-12T10:00:00Z', profile: '@journal_opatriota' },
    youtube: { id: 'youtube', name: 'YouTube', connected: true, lastSync: '2026-10-12T09:00:00Z', channel: '@opatriotabrasil' },
    x: { id: 'x', name: 'X (Twitter)', connected: true, lastSync: '2026-10-12T11:00:00Z', handle: '@opatriotabr' },
    neon: { id: 'neon', name: 'Banco Neon PostgreSQL', connected: true, latency: '42ms' },
    firebase: { id: 'firebase', name: 'Firebase Auth & Store', connected: true, latency: '35ms' },
    gemini: { id: 'gemini', name: 'Google Gemini Pro IA', connected: true, model: 'gemini-2.5-flash' }
  };

  return {
    articles,
    editorialAgenda,
    columnists,
    media,
    activities,
    systemStatus,
    integrations
  };
}
