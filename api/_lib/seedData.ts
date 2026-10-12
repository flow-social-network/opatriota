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
    'art-4': {
      id: 'art-4',
      slug: 'brasil-lidera-em-energia-renovavel-na-america-latina',
      title: 'Brasil lidera em energia renovável na América Latina com avanço solar e eólico',
      subtitle: 'Matriz elétrica atinge 92% de fontes limpas e atrai aportes internacionais recordes.',
      kicker: 'ENERGIA & INOVAÇÃO',
      category: 'brasil',
      tags: ['Energia', 'Sustentabilidade', 'Solar', 'Eólica'],
      content: '<p>Relatório divulgado pela Agência Internacional de Energia destaca o papel central do Brasil na transição energética global, com destaque para parques eólicos e solares do Nordeste.</p>',
      author: 'Roberto Alves',
      authorId: 'usr-roberto',
      authorRole: 'Repórter de Infraestrutura',
      publishedAt: '2026-10-11T16:05:00Z',
      updatedAt: '2026-10-11T16:05:00Z',
      readTimeMinutes: 4,
      imageUrl: '/images/news_infraestrutura.jpg',
      imageCaption: 'Parque de geração de energia solar e eólica.',
      imageCredits: 'Ministério de Minas e Energia',
      sourceName: 'MME / ONS',
      accessLevel: 'aberto',
      editorialStatus: 'PUBLICADA',
      priority: 'normal',
      viewsCount: 14200,
      likesCount: 1320,
      commentsCount: 134,
      sharesCount: 28,
      aiRiskScore: 92,
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
