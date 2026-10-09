import { 
  InstitutionalPage, 
  CategoryDetail, 
  AuthorDetail, 
  SiteMenuConfig,
  ContactSubmission,
  LgpdRequest
} from '../types';

export const INITIAL_PAGES: InstitutionalPage[] = [
  {
    id: 'page-sobre',
    slug: 'sobre-o-patriota',
    title: 'Sobre O Patriota',
    subtitle: 'Nossa história, missão editorial, valores inegociáveis e compromisso com o futuro do Brasil.',
    badge: 'IDENTIDADE EDITORIAL',
    model: 'institucional',
    updatedAt: '08 de outubro de 2026',
    publishedAt: '01 de janeiro de 2026',
    status: 'publicada',
    featuredImage: '/images/hero_congresso.jpg',
    menuLocations: ['footer_col2', 'topbar'],
    author: 'Conselho Editorial O Patriota',
    seo: {
      metaTitle: 'Sobre O Patriota — Informação com Liberdade por um Brasil mais Forte',
      metaDescription: 'Conheça a história, os princípios e a missão do portal O Patriota. Jornalismo independente, defesa das liberdades e rigor na apuração factual.',
      canonicalUrl: 'https://opatriota.com.br/sobre-o-patriota/',
      focusKeywords: ['Sobre O Patriota', 'Jornalismo Independente', 'Brasil', 'Liberdade de Imprensa']
    },
    toc: [
      { id: 'apresentacao', title: '1. Apresentação do Veículo' },
      { id: 'missao', title: '2. Missão Editorial' },
      { id: 'visao', title: '3. Visão de Futuro' },
      { id: 'valores', title: '4. Nossos Valores Fundamentais' },
      { id: 'cobertura', title: '5. Áreas de Cobertura e Abrangência' },
      { id: 'transparencia', title: '6. Compromisso com a Informação e Transparência' },
      { id: 'contatos', title: '7. Contatos Institucionais' }
    ],
    relatedLinks: [
      { label: 'Princípios Editoriais', url: '/principios-editoriais/', description: 'Nosso código ético e diretrizes de apuração.' },
      { label: 'Expediente e Redação', url: '/expediente/', description: 'Conheça os profissionais por trás do jornal.' },
      { label: 'Fontes e Metodologia', url: '/fontes-e-metodologia/', description: 'Como apuramos e checamos informações oficiais.' }
    ],
    content: `
<section id="apresentacao">
  <h2>1. Apresentação do Veículo</h2>
  <p><strong>O PATRIOTA — Notícias, Análise e Opinião</strong> é um veículo de comunicação jornalística independente sediado em Brasília (Distrito Federal), fundado sob a premissa fundamental de que uma sociedade próspera necessita de uma imprensa livre, vigilante e comprometida com a soberania nacional.</p>
  <p>Num cenário marcado por polarizações rasas, desinformação em redes sociais e dependência de narrativas governamentais, <em>O Patriota</em> surge para restituir o valor da apuração documental, do contraditório equilibrado e do respeito pelas tradições cívicas e econômicas que edificaram o Brasil.</p>
</section>

<section id="missao">
  <h2>2. Missão Editorial</h2>
  <p>Nossa missão diária é informar a população brasileira com precisão factual, clareza técnica e coragem cívica, fornecendo elementos consistentes para que cada cidadão compreenda as decisões que afetam sua família, seus negócios, sua segurança e suas liberdades civis.</p>
  <p>Atuamos sob o lema <strong>"Informação com liberdade por um Brasil mais forte"</strong>, guiando nosso trabalho editorial pela separação rigorosa entre notícias verificadas e opiniões identificadas.</p>
</section>

<section id="visao">
  <h2>3. Visão de Futuro</h2>
  <p>Almejamos consolidar <em>O Patriota</em> como o principal portal jornalístico de referência para a cobertura dos Três Poderes da República, da economia produtiva, do agronegócio e da segurança pública no Brasil, combinando tecnologia de ponta, checagem automatizada com curadoria humana e independência financeira sustentada por nossos leitores e assinantes.</p>
</section>

<section id="valores">
  <h2>4. Nossos Valores Fundamentais</h2>
  <ul>
    <li><strong>Soberania Nacional e Patriotismo Cívico:</strong> Orgulho da história, do território e do povo brasileiro, sem subordinação a interesses antinacionais.</li>
    <li><strong>Primazia da Verdade Factual:</strong> Os fatos são sagrados. Nenhuma ideologia pode distorcer a realidade comprovada por documentos, dados públicos e registros oficiais.</li>
    <li><strong>Liberdade de Expressão e de Imprensa:</strong> Defesa incondicional do debate livre de ideias e repúdio a qualquer tentativa de censura prévia ou tutela de consciência.</li>
    <li><strong>Livre Iniciativa e Direito de Propriedade:</strong> Reconhecimento do papel vital do empreendedor, do trabalhador formal e do produtor rural na geração de riqueza.</li>
    <li><strong>Legalidade e Estado Democrático de Direito:</strong> Respeito à Constituição Federal de 1988 e às garantias individuais contra abusos de qualquer autoridade.</li>
  </ul>
</section>

<section id="cobertura">
  <h2>5. Áreas de Cobertura e Abrangência</h2>
  <p>Mantemos cobertura jornalística contínua nos seguintes eixos estratégicos:</p>
  <ul>
    <li><strong>Política Nacional e Congresso:</strong> Acompanhamento diário das comissões, votações em plenário, medidas provisórias e acordos partidários.</li>
    <li><strong>Brasil e Federação:</strong> Notícias sobre os 26 estados e o Distrito Federal, com foco em gestão pública e desenvolvimento regional.</li>
    <li><strong>Economia e Mercado:</strong> Macroeconomia, agronegócio, comércio exterior, política monetária, custo tributário e empreendedorismo.</li>
    <li><strong>Segurança Pública:</strong> Operações policiais, combate ao narcotráfico interestadual, legislação penal e integridade das fronteiras.</li>
    <li><strong>Saúde e Cidadania:</strong> Sistema de saúde, vigilância sanitária, inovação médica e atendimento à família brasileira.</li>
    <li><strong>Agência de Checagem:</strong> Desmontagem de boatos virais com confrontação direta a fontes primárias e diários oficiais.</li>
  </ul>
</section>

<section id="transparencia">
  <h2>6. Compromisso com a Informação e Transparência</h2>
  <p>Não recebemos verbas de publicidade estatal que condicionem nossa linha editorial. Nossos colunistas e repórteres operam sob código de conduta transparente e todas as correções de matérias são publicadas de forma visível e permanente.</p>
</section>

<section id="contatos">
  <h2>7. Contatos Institucionais</h2>
  <p>Para dúvidas institucionais, correspondência com o conselho ou envio de documentações:</p>
  <p><strong>E-mail institucional:</strong> institucional@opatriota.com.br<br />
  <strong>Sede Editorial:</strong> Edifício Centro Empresarial Brasília, Setor Comercial Sul (SCS), Brasília - DF, CEP 70300-900</p>
</section>
`
  },
  {
    id: 'page-expediente',
    slug: 'expediente',
    title: 'Expediente e Redação',
    subtitle: 'Estrutura organizacional, lideranças editoriais e corpo de profissionais do portal.',
    badge: 'TRANSPARÊNCIA CORPORATIVA',
    model: 'institucional',
    updatedAt: '08 de outubro de 2026',
    publishedAt: '01 de janeiro de 2026',
    status: 'publicada',
    featuredImage: '/images/news_opiniao.jpg',
    menuLocations: ['footer_col2'],
    author: 'Diretoria de Redação',
    seo: {
      metaTitle: 'Expediente e Redação — O Patriota',
      metaDescription: 'Conheça o corpo editorial, diretores de redação, editores-chefes e correspondentes responsáveis pelo conteúdo de O Patriota.',
      canonicalUrl: 'https://opatriota.com.br/expediente/'
    },
    toc: [
      { id: 'diretoria', title: '1. Diretoria Executiva e Editorial' },
      { id: 'redacao', title: '2. Chefia de Redação e Editores' },
      { id: 'reportagem', title: '3. Correspondentes e Repórteres' },
      { id: 'checagem', title: '4. Núcleo de Checagem e Auditoria' },
      { id: 'juridico', title: '5. Assessoria Jurídica e Compliance' },
      { id: 'canais', title: '6. Canais Oficiais de Contato' }
    ],
    relatedLinks: [
      { label: 'Sobre O Patriota', url: '/sobre-o-patriota/' },
      { label: 'Fale com a Redação', url: '/contato/' },
      { label: 'Política de Correções', url: '/politica-de-correcoes/' }
    ],
    content: `
<section id="diretoria">
  <h2>1. Diretoria Executiva e Editorial</h2>
  <p><strong>Diretor-Presidente & Publisher:</strong> Dr. Alberto Gonçalves</p>
  <p><strong>Diretora de Operações e Jornalismo:</strong> Mariana Duarte</p>
  <p><strong>Conselho Editorial Consultivo:</strong> Composto por juristas, economistas e jornalistas com dedicação exclusiva à integridade da linha editorial.</p>
</section>

<section id="redacao">
  <h2>2. Chefia de Redação e Editores</h2>
  <p><strong>Editor-Chefe Geral:</strong> Dr. Alberto Gonçalves (Reg. Profissional DRT/DF 14.892)</p>
  <p><strong>Editora Executiva & Revisora Chefe:</strong> Helena Miranda (Reg. Profissional DRT/SP 45.210)</p>
  <p><strong>Editor de Política & Congresso:</strong> Thiago Vasconcellos (Reg. Profissional DRT/DF 19.340)</p>
  <p><strong>Editor de Economia & Mercado:</strong> Equipe Especial de Análise Macroeconômica</p>
  <p><strong>Editor de Segurança Pública:</strong> Roberto Siqueira</p>
</section>

<section id="reportagem">
  <h2>3. Correspondentes e Repórteres</h2>
  <p><strong>Brasília (Congresso Nacional e Esplanada):</strong> Thiago Vasconcellos, Lucas Ferreira</p>
  <p><strong>São Paulo (Faria Lima e Indústria):</strong> Beatriz Albuquerque</p>
  <p><strong>Região Sul e Agronegócio:</strong> Correspondência Integrada de Campo</p>
  <p><strong>Internacional & Geopolítica:</strong> Beatriz Albuquerque</p>
</section>

<section id="checagem">
  <h2>4. Núcleo de Checagem e Auditoria</h2>
  <p><strong>Coordenador de Checagem de Fatos:</strong> Núcleo de Apuração Técnica O Patriota</p>
  <p><strong>Auditoria de Fontes e Dados Públicos:</strong> Equipe de Verificação Primária de Documentos</p>
</section>

<section id="juridico">
  <h2>5. Assessoria Jurídica e Compliance</h2>
  <p><strong>Consultoria Jurídica e Defesa de Imprensa:</strong> Assessoria Externa Credenciada na OAB/DF</p>
  <p><strong>Encarregado de Proteção de Dados (DPO / LGPD):</strong> privacidade@opatriota.com.br</p>
</section>

<section id="canais">
  <h2>6. Canais Oficiais de Contato</h2>
  <p><strong>Pautas e Sugestões:</strong> pauta@opatriota.com.br<br />
  <strong>Correções de Matérias:</strong> correcoes@opatriota.com.br<br />
  <strong>Redação Geral:</strong> redacao@opatriota.com.br<br />
  <strong>Telefone / WhatsApp da Redação:</strong> (61) 3244-8800 (Atendimento em dias úteis das 08h às 19h)</p>
</section>
`
  },
  {
    id: 'page-principios',
    slug: 'principios-editoriais',
    title: 'Princípios Editoriais',
    subtitle: 'Nosso compromisso ético com a verdade, com o contraditório e com a responsabilidade cívica.',
    badge: 'CÓDIGO DE ÉTICA',
    model: 'institucional',
    updatedAt: '08 de outubro de 2026',
    publishedAt: '01 de janeiro de 2026',
    status: 'publicada',
    featuredImage: '/images/news_opiniao.jpg',
    menuLocations: ['footer_col2', 'topbar'],
    author: 'Conselho Editorial',
    seo: {
      metaTitle: 'Princípios Editoriais e Código Ético — O Patriota',
      metaDescription: 'Leia os princípios que regem cada notícia, reportagem e artigo publicado em O Patriota. Independência, precisão e distinção clara entre fato e opinião.',
      canonicalUrl: 'https://opatriota.com.br/principios-editoriais/'
    },
    toc: [
      { id: 'independencia', title: '1. Independência Editorial' },
      { id: 'rigor', title: '2. Rigor na Apuração e Checagem' },
      { id: 'distincao', title: '3. Distinção entre Notícia, Análise e Opinião' },
      { id: 'contraditorio', title: '4. Direito ao Contraditório e Pluralidade' },
      { id: 'correcoes', title: '5. Prontidão na Correção de Falhas' },
      { id: 'publicidade', title: '6. Identificação Transparente de Publicidade' },
      { id: 'fontes', title: '7. Tratamento Ético e Proteção de Fontes' }
    ],
    relatedLinks: [
      { label: 'Fontes e Metodologia', url: '/fontes-e-metodologia/' },
      { label: 'Política de Correções', url: '/politica-de-correcoes/' },
      { label: 'Sobre O Patriota', url: '/sobre-o-patriota/' }
    ],
    content: `
<section id="independencia">
  <h2>1. Independência Editorial</h2>
  <p>A redação de <em>O Patriota</em> opera com autonomia total. Nenhuma autoridade pública, anunciante comercial, partido político ou movimento ideológico detém poder de veto, ingerência prévia ou direcionamento sobre as apurações conduzidas pela nossa equipe.</p>
  <p>Nossos jornalistas não aceitam presentes de valor superior ao limite de cortesia cívica nem participam de coberturas em que haja conflito direto de interesses pessoais.</p>
</section>

<section id="rigor">
  <h2>2. Rigor na Apuração e Checagem</h2>
  <p>Uma informação só adquire o status de notícia quando confirmada por no mínimo duas fontes independentes ou respaldada por documentação oficial insuspeita. Boatos e postagens não verificadas em redes sociais jamais são replicados sem a devida contextualização e confrontação.</p>
</section>

<section id="distincao">
  <h2>3. Distinção entre Notícia, Análise e Opinião</h2>
  <p>A honestidade com o leitor exige categorização transparente:</p>
  <ul>
    <li><strong>Notícia:</strong> Relato impessoal de fatos concretos observados, ouvidos ou documentados, sem juízo moral do repórter.</li>
    <li><strong>Análise:</strong> Contextualização técnica baseada em dados históricos, jurídicos ou macroeconômicos assinada por especialista identificado.</li>
    <li><strong>Opinião / Artigo:</strong> Ponto de vista pessoal do autor sobre determinado tema, expressando suas convicções filosóficas e políticas com assinatura explícita.</li>
  </ul>
</section>

<section id="contraditorio">
  <h2>4. Direito ao Contraditório e Pluralidade</h2>
  <p>Qualquer pessoa, instituição ou autoridade citada em tom crítico ou sob alegações desfavoráveis tem assegurado o direito de manifestação prévia antes da publicação, com prazo razoável para resposta formal. Quando a resposta não for enviada a tempo, isso será registrado de forma explícita na matéria e inserido assim que recebido.</p>
</section>

<section id="correcoes">
  <h2>5. Prontidão na Correção de Falhas</h2>
  <p>Erros não são tolerados nem varridos para debaixo do tapete. Quando um equívoco de fato ocorre, retificamos a matéria prontamente no mesmo link, registrando em nota editorial o que foi alterado e o horário exato da correção.</p>
</section>

<section id="publicidade">
  <h2>6. Identificação Transparente de Publicidade</h2>
  <p>Conteúdos patrocinados, informes publicitários e parcerias comerciais são ostensivamente identificados com as etiquetas <strong>"Informe Publicitário"</strong> ou <strong>"Patrocinado"</strong>, com tipografia e tratamento gráfico distintos do conteúdo editorial independente.</p>
</section>

<section id="fontes">
  <h2>7. Tratamento Ético e Proteção de Fontes</h2>
  <p>O sigilo da fonte jornalística é garantia constitucional (art. 5º, XIV, CF/88) que respeitamos zelosamente. Fontes anônimas só são acolhidas quando sua integridade física ou profissional estiver em risco real e quando a informação for vital para o interesse público e confirmada por provas materiais.</p>
</section>
`
  },
  {
    id: 'page-metodologia',
    slug: 'fontes-e-metodologia',
    title: 'Fontes e Metodologia',
    subtitle: 'Nossos critérios técnicos de apuração, cruzamento documental e verificação primária de fatos.',
    badge: 'MÉTODO JORNALÍSTICO',
    model: 'institucional',
    updatedAt: '08 de outubro de 2026',
    publishedAt: '01 de janeiro de 2026',
    status: 'publicada',
    featuredImage: '/images/factcheck_smartphone.jpg',
    menuLocations: ['footer_col2'],
    author: 'Núcleo de Metodologia Editorial',
    seo: {
      metaTitle: 'Fontes e Metodologia de Apuração — O Patriota',
      metaDescription: 'Descubra como O Patriota seleciona fontes oficiais, verifica dados públicos e utiliza inteligência editorial sob supervisão humana rigorosa.',
      canonicalUrl: 'https://opatriota.com.br/fontes-e-metodologia/'
    },
    toc: [
      { id: 'fontes-oficiais', title: '1. Critérios de Seleção de Fontes' },
      { id: 'cruzamento', title: '2. Cruzamento de Dados e Documentos' },
      { id: 'fontes-anonimas', title: '3. Política para Fontes Protegidas' },
      { id: 'checagem-imagens', title: '4. Verificação Forense de Imagens e Vídeos' },
      { id: 'uso-ia', title: '5. Uso Ético de Inteligência Artificial' },
      { id: 'esteira-humana', title: '6. Supervisão Humana Inegociável' }
    ],
    relatedLinks: [
      { label: 'Princípios Editoriais', url: '/principios-editoriais/' },
      { label: 'Política de Correções', url: '/politica-de-correcoes/' },
      { label: 'Fale com a Redação', url: '/contato/' }
    ],
    content: `
<section id="fontes-oficiais">
  <h2>1. Critérios de Seleção de Fontes</h2>
  <p>Priorizamos fontes primárias comprováveis. Nossa esteira de monitoramento mantém conexão direta com repositórios e diários oficiais:</p>
  <ul>
    <li>Diário Oficial da União (DOU) e Diários Oficiais dos Estados;</li>
    <li>Sistemas legislativos: SILEG/Câmara dos Deputados e SAPL/Senado Federal;</li>
    <li>Bases de dados judiciais: PJe, STF, STJ, TSE e Conselhos Nacionais (CNJ/CNMP);</li>
    <li>Bancos estatísticos governamentais: IBGE, Banco Central do Brasil, IPEA, CAGED e Tesouro Transparente;</li>
    <li>Órgãos de fiscalização e controle externo: Tribunal de Contas da União (TCU) e Controladoria-Geral da União (CGU).</li>
  </ul>
</section>

<section id="cruzamento">
  <h2>2. Cruzamento de Dados e Documentos</h2>
  <p>Antes de emitir qualquer afirmação sobre desvios orçamentários, votações ou índices econômicos, nossa equipe realiza confrontação cruzada entre as notas de assessoria e as tabelas orçamentárias brutas nos sistemas integrados.</p>
</section>

<section id="fontes-anonimas">
  <h2>3. Política para Fontes Protegidas</h2>
  <p>O recurso à fonte oculta é excepcional. O repórter tem a obrigação de revelar a identidade da fonte ao editor-chefe para assegurar sua credibilidade e idoneidade, mantendo-se o sigilo estrito perante o público e terceiros nos termos da lei.</p>
</section>

<section id="checagem-imagens">
  <h2>4. Verificação Forense de Imagens e Vídeos</h2>
  <p>Imagens virais são submetidas a busca reversa, análise de metadados EXIF e checagem de geolocalização e sombras solares para evitar a publicação de fotos descontextualizadas ou manipuladas por ferramentas generativas.</p>
</section>

<section id="uso-ia">
  <h2>5. Uso Ético de Inteligência Artificial</h2>
  <p>Utilizamos sistemas tecnológicos avançados exclusivamente para tarefas auxiliares: monitoramento de feeds oficiais, detecção de duplicidades e sugestão de resumos preliminares. <strong>A inteligência artificial jamais cria fatos, declarações ou fontes</strong> e é terminantemente proibida de redigir matérias desacompanhadas de apuração humana.</p>
</section>

<section id="esteira-humana">
  <h2>6. Supervisão Humana Inegociável</h2>
  <p>Nenhuma matéria é agendada ou publicada sem a leitura atenta, validação de fontes e aprovação final de um jornalista diplomado ou editor de redação com crachá e assinatura editorial.</p>
</section>
`
  },
  {
    id: 'page-correcoes',
    slug: 'politica-de-correcoes',
    title: 'Política de Correções e Erratas',
    subtitle: 'Nossos procedimentos transparentes para acolher apontamentos, retificar dados e atualizar reportagens.',
    badge: 'COMPROMISSO COM A VERDADE',
    model: 'institucional',
    updatedAt: '08 de outubro de 2026',
    publishedAt: '01 de janeiro de 2026',
    status: 'publicada',
    featuredImage: '/images/news_opiniao.jpg',
    menuLocations: ['footer_col2'],
    author: 'Ouvidoria e Diretoria de Redação',
    seo: {
      metaTitle: 'Política de Correções e Erratas — O Patriota',
      metaDescription: 'Saiba como solicitar correções de matérias em O Patriota. Processo transparente de acolhimento, análise editorial e publicação de erratas.',
      canonicalUrl: 'https://opatriota.com.br/politica-de-correcoes/'
    },
    toc: [
      { id: 'comunicar-erro', title: '1. Como Comunicar um Erro' },
      { id: 'avaliacao', title: '2. Avaliação pela Equipe Editorial' },
      { id: 'tipos-correcao', title: '3. Tipos de Correção e Registro' },
      { id: 'direito-resposta', title: '4. Pedidos de Direito de Resposta' },
      { id: 'canais-diretos', title: '5. Canal Exclusivo de Correções' }
    ],
    relatedLinks: [
      { label: 'Fale com a Redação', url: '/contato/' },
      { label: 'Princípios Editoriais', url: '/principios-editoriais/' },
      { label: 'Expediente', url: '/expediente/' }
    ],
    content: `
<section id="comunicar-erro">
  <h2>1. Como Comunicar um Erro</h2>
  <p>Leitores, partes citadas, autoridades ou qualquer cidadão que identifique imprecisão factual, erro de grafia de nome próprio, dado numérico incorreto ou citação fora de contexto podem enviar apontamentos imediatos através de nosso formulário ou pelo e-mail <strong>correcoes@opatriota.com.br</strong>.</p>
  <p>Para agilizar a análise, solicitamos o link da matéria, o trecho específico contestado e, quando aplicável, o documento comprobatório correspondente.</p>
</section>

<section id="avaliacao">
  <h2>2. Avaliação pela Equipe Editorial</h2>
  <p>Todos os pedidos recebidos são protocolados e encaminhados ao repórter autor e ao editor responsável. A checagem é realizada com celeridade e, se confirmada a falha, a retificação entra em produção no mesmo dia.</p>
</section>

<section id="tipos-correcao">
  <h2>3. Tipos de Correção e Registro</h2>
  <ul>
    <li><strong>Atualização Informativa:</strong> Adição de novos dados factuais decorrentes do desenrolar dos fatos. O texto recebe a menção <em>"Atualizado em [data e hora]"</em>.</li>
    <li><strong>Erratas de Fato Relevante:</strong> Quando um dado central é retificado, uma caixa destacada é inserida no topo ou rodapé do texto com a redação: <em>"ERRATA: Diferentemente do publicado anteriormente às 14h, o montante apurado foi de... O texto foi corrigido."</em></li>
    <li><strong>Correções Tipográficas Menores:</strong> Ajustes ortográficos que não alterem o sentido factual são corrigidos diretamente no banco com registro no log de auditoria interno.</li>
  </ul>
</section>

<section id="direito-resposta">
  <h2>4. Pedidos de Direito de Resposta</h2>
  <p>Requerimentos formais de direito de resposta previstos na Lei Federal nº 13.188/2015 são acolhidos pela assessoria jurídica e diretoria de redação, garantindo-se publicação no mesmo destaque e proporção da reportagem originária.</p>
</section>

<section id="canais-diretos">
  <h2>5. Canal Exclusivo de Correções</h2>
  <p><strong>E-mail direto:</strong> correcoes@opatriota.com.br<br />
  <strong>Formulário de Contato:</strong> Selecione o assunto <em>"Correção de Matéria / Errata"</em> na página <a href="/contato/">Fale com a Redação</a>.</p>
</section>
`
  },
  {
    id: 'page-contato',
    slug: 'contato',
    title: 'Fale com a Redação',
    subtitle: 'Envie sugestões de pauta, pedidos de correção, dúvidas institucionais ou fale com nossa equipe.',
    badge: 'ATENDIMENTO AO LEITOR',
    model: 'contato',
    updatedAt: '08 de outubro de 2026',
    publishedAt: '01 de janeiro de 2026',
    status: 'publicada',
    featuredImage: '/images/hero_congresso.jpg',
    menuLocations: ['footer_col2', 'topbar'],
    author: 'Equipe de Atendimento ao Leitor',
    seo: {
      metaTitle: 'Fale com a Redação — Contato Oficial O Patriota',
      metaDescription: 'Entre em contato com a equipe de jornalistas e editores de O Patriota. Envie sugestões de pauta, denúncias e correções com sigilo e rapidez.',
      canonicalUrl: 'https://opatriota.com.br/contato/'
    },
    toc: [
      { id: 'formulario', title: '1. Formulário de Contato Direto' },
      { id: 'departamentos', title: '2. Departamentos e E-mails' },
      { id: 'endereco', title: '3. Endereço Físico e Correspondência' },
      { id: 'sigilo', title: '4. Garantia de Sigilo da Fonte' }
    ],
    relatedLinks: [
      { label: 'Política de Correções', url: '/politica-de-correcoes/' },
      { label: 'Expediente e Redação', url: '/expediente/' },
      { label: 'Gestão de Dados — LGPD', url: '/gestao-de-dados/' }
    ],
    content: `
<section id="formulario">
  <h2>1. Formulário de Contato Direto</h2>
  <p>Utilize o formulário abaixo para enviar sua mensagem diretamente aos editores de plantão. Todas as mensagens são registradas com protocolo de atendimento.</p>
</section>

<section id="departamentos">
  <h2>2. Departamentos e E-mails</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
    <div class="p-3 bg-gray-50 border border-gray-200 rounded">
      <strong>Sugestão de Pauta e Reportagens:</strong><br />
      <span class="text-blue-700">pauta@opatriota.com.br</span>
    </div>
    <div class="p-3 bg-gray-50 border border-gray-200 rounded">
      <strong>Correções e Erratas:</strong><br />
      <span class="text-blue-700">correcoes@opatriota.com.br</span>
    </div>
    <div class="p-3 bg-gray-50 border border-gray-200 rounded">
      <strong>Suporte ao Assinante:</strong><br />
      <span class="text-blue-700">assinante@opatriota.com.br</span>
    </div>
    <div class="p-3 bg-gray-50 border border-gray-200 rounded">
      <strong>Departamento Comercial & Anúncios:</strong><br />
      <span class="text-blue-700">comercial@opatriota.com.br</span>
    </div>
  </div>
</section>

<section id="endereco">
  <h2>3. Endereço Físico e Correspondência</h2>
  <p><strong>Redação Central Brasília:</strong> Setor Comercial Sul (SCS), Quadra 4, Bloco A, Edifício Centro Empresarial Brasília, Salas 601-604 — Asa Sul, Brasília - DF, CEP 70304-900.<br />
  <strong>Telefone Central:</strong> (61) 3244-8800</p>
</section>

<section id="sigilo">
  <h2>4. Garantia de Sigilo da Fonte</h2>
  <p>Se você possui documentos comprobatórios ou informações sigilosas de interesse público relevante e necessita de proteção de identidade, mencione explicitamente na mensagem que solicita proteção da fonte antes do envio de arquivos sensíveis.</p>
</section>
`
  },
  {
    id: 'page-privacidade',
    slug: 'politica-de-privacidade',
    title: 'Política de Privacidade',
    subtitle: 'Como tratamos, protegemos e respeitamos seus dados de acordo com a Lei Geral de Proteção de Dados (LGPD).',
    badge: 'CONFORMIDADE LEGAL',
    model: 'institucional',
    updatedAt: '08 de outubro de 2026',
    publishedAt: '01 de janeiro de 2026',
    status: 'publicada',
    featuredImage: '/images/factcheck_smartphone.jpg',
    menuLocations: ['footer_col3'],
    author: 'Encarregado de Proteção de Dados (DPO)',
    seo: {
      metaTitle: 'Política de Privacidade e Proteção de Dados — O Patriota',
      metaDescription: 'Entenda como O Patriota coleta, armazena e protege seus dados cadastrais em conformidade integral com a Lei 13.709/2018 (LGPD).',
      canonicalUrl: 'https://opatriota.com.br/politica-de-privacidade/'
    },
    toc: [
      { id: 'dados-coletados', title: '1. Quais Dados Coletamos' },
      { id: 'finalidade', title: '2. Finalidades do Tratamento' },
      { id: 'cookies', title: '3. Cookies e Tecnologias de Navegação' },
      { id: 'bases-legais', title: '4. Bases Legais Aplicáveis' },
      { id: 'compartilhamento', title: '5. Compartilhamento e Sigilo' },
      { id: 'direitos-titular', title: '6. Direitos do Titular de Dados' },
      { id: 'contato-dpo', title: '7. Contato do Encarregado (DPO)' }
    ],
    relatedLinks: [
      { label: 'Termos de Uso', url: '/termos-de-uso/' },
      { label: 'Gestão de Dados (LGPD)', url: '/gestao-de-dados/' },
      { label: 'Segurança da Informação', url: '/seguranca-da-informacao/' }
    ],
    content: `
<section id="dados-coletados">
  <h2>1. Quais Dados Coletamos</h2>
  <p>Em conformidade com o princípio da necessidade (art. 6º, III da Lei 13.709/2018 - LGPD), recolhemos apenas os dados estritamente fundamentais para prestação dos serviços jornalísticos:</p>
  <ul>
    <li><strong>Dados de Cadastro de Leitores e Assinantes:</strong> Nome completo, e-mail válido, senha criptografada em padrão bcrypt, e preferência de boletins informativos.</li>
    <li><strong>Dados de Pagamento:</strong> Processados exclusivamente por gateways bancários certificados PCI-DSS. <em>O Patriota não armazena números de cartão de crédito em seus servidores</em>.</li>
    <li><strong>Dados de Navegação:</strong> Endereço IP anonimizado, carimbo de data/hora, tipo de navegador e páginas visitadas para fins de segurança e métricas agregadas.</li>
  </ul>
</section>

<section id="finalidade">
  <h2>2. Finalidades do Tratamento</h2>
  <p>Os dados tratados destinam-se exclusivamente a: autenticação de login na Área do Assinante; entrega de newsletters solicitadas; cumprimento de obrigações legais e regulatórias; e prevenção contra fraudes e ataques cibernéticos.</p>
</section>

<section id="cookies">
  <h2>3. Cookies e Tecnologias de Navegação</h2>
  <p>Utilizamos cookies estritamente necessários para manter sua sessão conectada e lembrar suas preferências de leitura. Não utilizamos cookies de rastreamento invasivo entre sites de terceiros sem seu expresso consentimento.</p>
</section>

<section id="bases-legais">
  <h2>4. Bases Legais Aplicáveis</h2>
  <p>O tratamento apoia-se nas seguintes hipóteses legais previstas no art. 7º da LGPD: execução de contrato (assinaturas); cumprimento de obrigação legal; legítimo interesse do controlador para segurança das redes; e consentimento (newsletters voluntárias).</p>
</section>

<section id="compartilhamento">
  <h2>5. Compartilhamento e Sigilo</h2>
  <p><strong>Não vendemos, alugamos ou comercializamos listas de e-mails de leitores sob nenhuma hipótese.</strong> O compartilhamento com operadores ocorre apenas para processamento de hospedagem e envio transacional de e-mails sob acordos rígidos de confidencialidade.</p>
</section>

<section id="direitos-titular">
  <h2>6. Direitos do Titular de Dados</h2>
  <p>O titular tem direito de confirmação, acesso, correção, anonimização, portabilidade e revogação do consentimento ou eliminação dos dados, que podem ser solicitados a qualquer tempo em nosso canal de Gestão de Dados.</p>
</section>

<section id="contato-dpo">
  <h2>7. Contato do Encarregado (DPO)</h2>
  <p>Para exercer seus direitos ou tirar dúvidas sobre esta política, escreva para nosso Encarregado de Dados:<br />
  <strong>E-mail:</strong> privacidade@opatriota.com.br<br />
  <strong>Prazo de resposta:</strong> Até 15 dias úteis, conforme estipulado pela Autoridade Nacional de Proteção de Dados (ANPD).</p>
</section>
`
  },
  {
    id: 'page-termos',
    slug: 'termos-de-uso',
    title: 'Termos de Uso',
    subtitle: 'Regras de navegação, direitos autorais, responsabilidades e condições de uso do portal.',
    badge: 'CONTRATO DE UTILIZAÇÃO',
    model: 'institucional',
    updatedAt: '08 de outubro de 2026',
    publishedAt: '01 de janeiro de 2026',
    status: 'publicada',
    featuredImage: '/images/news_infraestrutura.jpg',
    menuLocations: ['footer_col3'],
    author: 'Assessoria Jurídica O Patriota',
    seo: {
      metaTitle: 'Termos de Uso do Portal — O Patriota',
      metaDescription: 'Leia os termos e condições que regem a navegação, reprodução de conteúdos, comentários e assinaturas em O Patriota.',
      canonicalUrl: 'https://opatriota.com.br/termos-de-uso/'
    },
    toc: [
      { id: 'aceitacao', title: '1. Aceitação dos Termos' },
      { id: 'propriedade', title: '2. Direitos de Propriedade Intelectual' },
      { id: 'reproducao', title: '3. Diretrizes para Citação e Reprodução' },
      { id: 'comentarios', title: '4. Regras de Conduta e Comentários' },
      { id: 'assinaturas', title: '5. Planos de Assinatura e Cancelamento' },
      { id: 'responsabilidade', title: '6. Limitação de Responsabilidade' },
      { id: 'foro', title: '7. Foro Competente' }
    ],
    relatedLinks: [
      { label: 'Política de Privacidade', url: '/politica-de-privacidade/' },
      { label: 'Gestão de Dados (LGPD)', url: '/gestao-de-dados/' },
      { label: 'Segurança da Informação', url: '/seguranca-da-informacao/' }
    ],
    content: `
<section id="aceitacao">
  <h2>1. Aceitação dos Termos</h2>
  <p>Ao acessar, navegar ou cadastrar-se no portal <em>O PATRIOTA</em> (opatriota.com.br), o usuário declara estar ciente e concordar integralmente com as disposições estabelecidas neste documento e na Política de Privacidade vinculada.</p>
</section>

<section id="propriedade">
  <h2>2. Direitos de Propriedade Intelectual</h2>
  <p>Todo o conteúdo publicado — reportagens, artigos assinados, imagens, logotipos, infográficos, podcasts e códigos — é protegido pela Lei de Direitos Autorais (Lei Federal nº 9.610/1998) e pela legislação internacional de propriedade intelectual. É vedada a cópia integral desautorizada ou raspagem automatizada (scraping) para fins comerciais sem consentimento prévio por escrito.</p>
</section>

<section id="reproducao">
  <h2>3. Diretrizes para Citação e Reprodução</h2>
  <p>É autorizada a citação parcial de reportagens para fins jornalísticos, acadêmicos ou de crítica, desde que atendidos cumulativamente os seguintes requisitos:</p>
  <ul>
    <li>Limite máximo de 2 (dois) parágrafos do texto original;</li>
    <li>Atribuição expressa e destacada: <em>"Fonte: O Patriota"</em>;</li>
    <li>Inclusão de hiperlink direto, funcional e legível apontando para a matéria de origem no portal.</li>
  </ul>
</section>

<section id="comentarios">
  <h2>4. Regras de Conduta e Comentários</h2>
  <p>Nas áreas de interação da comunidade, não são permitidos comentários contendo calúnias, ofensas de cunho discriminatório, incitação a atos violentos ou ilícitos, spam comercial ou dados pessoais de terceiros sem autorização.</p>
</section>

<section id="assinaturas">
  <h2>5. Planos de Assinatura e Cancelamento</h2>
  <p>Os assinantes digitais usufruem dos benefícios contratados pelo período estipulado. O cancelamento pode ser solicitado a qualquer momento diretamente pelo painel <a href="/minha-conta/assinatura">Minha Conta</a>, com encerramento da renovação automática sem multas rescisórias abusivas.</p>
</section>

<section id="responsabilidade">
  <h2>6. Limitação de Responsabilidade</h2>
  <p>Empregamos os melhores esforços para garantir a disponibilidade contínua e a segurança da plataforma, não nos responsabilizando por interrupções temporárias decorrentes de manutenções de infraestrutura de redes mundiais ou eventos de força maior.</p>
</section>

<section id="foro">
  <h2>7. Foro Competente</h2>
  <p>Fica eleito o Foro da Circunscrição Judiciária de Brasília, Distrito Federal, para dirimir eventuais controvérsias oriundas da interpretação destes termos, com renúncia a qualquer outro, por mais privilegiado que seja.</p>
</section>
`
  },
  {
    id: 'page-lgpd',
    slug: 'gestao-de-dados',
    title: 'Gestão de Dados e LGPD',
    subtitle: 'Canal de atendimento direto para exercício de direitos do titular previstos na Lei Federal nº 13.709/2018.',
    badge: 'DIREITOS DO TITULAR',
    model: 'institucional',
    updatedAt: '08 de outubro de 2026',
    publishedAt: '01 de janeiro de 2026',
    status: 'publicada',
    featuredImage: '/images/factcheck_smartphone.jpg',
    menuLocations: ['footer_col3'],
    author: 'Encarregado de Proteção de Dados (DPO)',
    seo: {
      metaTitle: 'Gestão de Dados Pessoais — Canal LGPD O Patriota',
      metaDescription: 'Solicite acesso, retificação ou exclusão de seus dados pessoais em O Patriota. Atendimento oficial conforme a Lei Geral de Proteção de Dados.',
      canonicalUrl: 'https://opatriota.com.br/gestao-de-dados/'
    },
    toc: [
      { id: 'compromisso', title: '1. Compromisso com a Privacidade' },
      { id: 'direitos', title: '2. Seus Direitos sob a LGPD' },
      { id: 'formulario-lgpd', title: '3. Formulário Oficial de Solicitação' },
      { id: 'prazos', title: '4. Prazos e Procedimentos de Resposta' }
    ],
    relatedLinks: [
      { label: 'Política de Privacidade', url: '/politica-de-privacidade/' },
      { label: 'Segurança da Informação', url: '/seguranca-da-informacao/' },
      { label: 'Termos de Uso', url: '/termos-de-uso/' }
    ],
    content: `
<section id="compromisso">
  <h2>1. Compromisso com a Privacidade</h2>
  <p>O portal <em>O PATRIOTA</em> reafirma seu respeito inegociável à autodeterminação informativa de cada leitor. Nossos sistemas são auditados e aderentes às diretrizes da ANPD (Autoridade Nacional de Proteção de Dados).</p>
</section>

<section id="direitos">
  <h2>2. Seus Direitos sob a LGPD</h2>
  <p>Nos termos do artigo 18 da Lei Federal nº 13.709/2018, você pode requerer a qualquer momento:</p>
  <ul>
    <li>Confirmação da existência de tratamento dos seus dados;</li>
    <li>Acesso aos dados pessoais mantidos em nossos cadastros;</li>
    <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
    <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos;</li>
    <li>Eliminação dos dados pessoais tratados com o seu consentimento;</li>
    <li>Revogação do consentimento para envio de newsletters ou comunicações informativas.</li>
  </ul>
</section>

<section id="formulario-lgpd">
  <h2>3. Formulário Oficial de Solicitação</h2>
  <p>Para submeter uma solicitação formal ao nosso Encarregado de Dados, utilize o formulário interativo disponibilizado nesta página.</p>
</section>

<section id="prazos">
  <h2>4. Prazos e Procedimentos de Resposta</h2>
  <p>Após a confirmação de titularidade do requisitante, nossa equipe fornecerá a declaração clara e completa no prazo legal de até 15 (quinze) dias contados a partir da data de solicitação.</p>
  <p><strong>Contato do DPO:</strong> privacidade@opatriota.com.br</p>
</section>
`
  },
  {
    id: 'page-seguranca',
    slug: 'seguranca-da-informacao',
    title: 'Segurança da Informação',
    subtitle: 'Nossos protocolos técnicos para proteção de servidores, dados de leitores e integridade do portal.',
    badge: 'DEFESA CIBERNÉTICA',
    model: 'institucional',
    updatedAt: '08 de outubro de 2026',
    publishedAt: '01 de janeiro de 2026',
    status: 'publicada',
    featuredImage: '/images/news_seguranca.jpg',
    menuLocations: ['footer_col3'],
    author: 'Equipe de Infraestrutura e Segurança de Redes',
    seo: {
      metaTitle: 'Segurança da Informação e Proteção Cibernética — O Patriota',
      metaDescription: 'Conheça as diretrizes de segurança digital, criptografia TLS 1.3 e prevenção contra ameaças adotadas pelo portal O Patriota.',
      canonicalUrl: 'https://opatriota.com.br/seguranca-da-informacao/'
    },
    toc: [
      { id: 'criptografia', title: '1. Criptografia em Trânsito e em Repouso' },
      { id: 'prevencao', title: '2. Prevenção contra Ataques de Negação de Serviço (DDoS)' },
      { id: 'contas', title: '3. Política de Proteção de Contas de Assinantes' },
      { id: 'vulnerabilidades', title: '4. Comunicação Responsável de Vulnerabilidades' },
      { id: 'recomendacoes', title: '5. Orientações de Segurança para o Leitor' }
    ],
    relatedLinks: [
      { label: 'Política de Privacidade', url: '/politica-de-privacidade/' },
      { label: 'Gestão de Dados (LGPD)', url: '/gestao-de-dados/' },
      { label: 'Termos de Uso', url: '/termos-de-uso/' }
    ],
    content: `
<section id="criptografia">
  <h2>1. Criptografia em Trânsito e em Repouso</h2>
  <p>Toda a comunicação entre o seu navegador e nossos servidores é protegida por certificados digitais TLS 1.3 com chaves criptográficas de 2048 bits e cabeçalhos de proteção estrita HSTS (HTTP Strict Transport Security).</p>
  <p>Bancos de dados e credenciais de acesso operam com armazenamento cifrado e algoritmos de derivação de chave de alta resistência contra ataques de força bruta.</p>
</section>

<section id="prevencao">
  <h2>2. Prevenção contra Ataques de Negação de Serviço (DDoS)</h2>
  <p>Nossa infraestrutura conta com anéis de filtragem distribuída e mitigação contra ataques volumétricos, garantindo que o direito do cidadão brasileiro de acessar informações de interesse público permaneça resguardado mesmo sob tentativas de censura digital.</p>
</section>

<section id="contas">
  <h2>3. Política de Proteção de Contas de Assinantes</h2>
  <p>Implementamos bloqueios automáticos temporários contra tentativas repetidas e abusivas de login com senha incorreta, monitoramento de sessões simultâneas anômalas e verificação de integridade.</p>
</section>

<section id="vulnerabilidades">
  <h2>4. Comunicação Responsável de Vulnerabilidades</h2>
  <p>Pesquisadores de segurança que identifiquem potenciais falhas ou brechas técnicas são convidados a notificar nossa equipe de forma confidencial e responsável através do endereço <strong>seguranca@opatriota.com.br</strong> antes de qualquer divulgação pública, respeitando o princípio de divulgação responsável.</p>
</section>

<section id="recomendacoes">
  <h2>5. Orientações de Segurança para o Leitor</h2>
  <ul>
    <li>Nunca compartilhe suas credenciais de acesso à Área do Assinante com terceiros;</li>
    <li>Utilize senhas fortes combinando letras maiúsculas, minúsculas, números e caracteres especiais;</li>
    <li>Verifique sempre se a URL no seu navegador começa exatamente com <code>https://opatriota.com.br</code> antes de digitar qualquer dado;</li>
    <li>A equipe de O Patriota <strong>nunca solicita senhas por telefone, WhatsApp ou mensagens diretas</strong>.</li>
  </ul>
</section>
`
  }
];

export const INITIAL_CATEGORIES: CategoryDetail[] = [
  {
    id: 'cat-1',
    slug: 'politica',
    name: 'Política Nacional',
    description: 'Cobertura dos bastidores do Congresso Nacional, do Poder Executivo, Judiciário e das decisões fundamentais da República.',
    introText: 'Acompanhe com independência e profundidade a tramitação de projetos de lei, reformas estruturantes e a atuação dos representantes eleitos em Brasília.',
    bannerImage: '/images/hero_congresso.jpg',
    seoTitle: 'Política Nacional — Notícias do Congresso e Governo | O Patriota',
    seoDescription: 'Informações e análises sobre o cenário político brasileiro, tramitações no Senado, na Câmara e decisões do Supremo Tribunal Federal.',
    active: true,
    order: 1
  },
  {
    id: 'cat-2',
    slug: 'brasil',
    name: 'Brasil e Estados',
    description: 'Notícias dos 26 estados e Distrito Federal, obras de integração regional, desenvolvimento metropolitano e federação.',
    introText: 'Um olhar detalhado sobre as forças produtivas de cada região do país, o avanço da infraestrutura viária e a gestão pública municipal e estadual.',
    bannerImage: '/images/news_infraestrutura.jpg',
    seoTitle: 'Brasil e Estados — Obras, Infraestrutura e Regiões | O Patriota',
    seoDescription: 'Acompanhe o desenvolvimento das regiões brasileiras, obras estruturantes, logística e notícias de todos os estados da Federação.',
    active: true,
    order: 2
  },
  {
    id: 'cat-3',
    slug: 'economia',
    name: 'Economia e Mercado',
    description: 'Macroeconomia, agronegócio, comércio exterior, mercado de capitais, empreendedorismo e redução do Custo Brasil.',
    introText: 'Análises sólidas sobre PIB, inflação, taxa Selic, exportações e as reformas necessárias para destravar os investimentos privados no Brasil.',
    bannerImage: '/images/news_economia.jpg',
    seoTitle: 'Economia & Mercado — Agronegócio, PIB e Finanças | O Patriota',
    seoDescription: 'Indicadores financeiros, safra recorde do agro, câmbio, políticas monetárias e o panorama dos negócios nacionais.',
    active: true,
    order: 3
  },
  {
    id: 'cat-4',
    slug: 'seguranca',
    name: 'Segurança Pública',
    description: 'Combate ao crime organizado, operações policiais, vigilância de fronteiras e modernização das forças de segurança.',
    introText: 'Cobertura especializada sobre estratégias integradas das polícias federais e estaduais na defesa da ordem pública e da paz social.',
    bannerImage: '/images/news_seguranca.jpg',
    seoTitle: 'Segurança Pública — Operações, Defesa e Ordem | O Patriota',
    seoDescription: 'Notícias sobre ações policiais de combate às facções, inteligência tática, apreensões e políticas de segurança no país.',
    active: true,
    order: 4
  },
  {
    id: 'cat-5',
    slug: 'saude',
    name: 'Saúde',
    description: 'Avanços na medicina, gestão hospitalar, Farmácia Popular, Sistema Único de Saúde (SUS) e bem-estar da família.',
    introText: 'Informação qualificada sobre programas de vacinação, mutirões de atendimento médico, inovação farmacêutica e saúde preventiva.',
    bannerImage: '/images/news_saude.jpg',
    seoTitle: 'Saúde — SUS, Farmácia Popular e Medicina | O Patriota',
    seoDescription: 'Políticas de saúde pública, atendimento aos cidadãos, Farmácia Popular e avanços científicos a serviço da vida.',
    active: true,
    order: 5
  },
  {
    id: 'cat-6',
    slug: 'opiniao',
    name: 'Artigos e Opinião',
    description: 'Ensaios, colunas e reflexões cívicas de pensadores, juristas e economistas que debatem os rumos do Brasil.',
    introText: 'Espaço aberto ao debate qualificado, à defesa da liberdade de expressão e à valorização das instituições republicanas e da família.',
    bannerImage: '/images/news_opiniao.jpg',
    seoTitle: 'Artigos & Opinião — Colunistas e Ensaios | O Patriota',
    seoDescription: 'Leituras aprofundadas com assinaturas de renome sobre a conjuntura nacional, tradição cívica e liberdade individual.',
    active: true,
    order: 6
  },
  {
    id: 'cat-7',
    slug: 'checagem',
    name: 'Agência de Checagem',
    description: 'Auditoria de fatos virais, desmentido de boatos e verificação rigorosa de alegações com documentos públicos oficiais.',
    introText: 'Nosso núcleo independente examina postagens que circulam em aplicativos de mensagens e declarações de figuras públicas para apontar a verdade factual.',
    bannerImage: '/images/factcheck_smartphone.jpg',
    seoTitle: 'Agência de Checagem — Fatos Verificados e Documentos | O Patriota',
    seoDescription: 'Desmonte de boatos e verificação de alegações públicas com fontes primárias, diários oficiais e provas documentais.',
    active: true,
    order: 7
  },
  {
    id: 'cat-8',
    slug: 'tecnologia',
    name: 'Tecnologia',
    description: 'Inovação aplicada, inteligência artificial soberana, ecossistema de startups, telecomunicações e segurança digital.',
    introText: 'Como a tecnologia e a desregulamentação podem acelerar o ganho de produtividade das empresas brasileiras e melhorar a vida dos cidadãos.',
    bannerImage: '/images/factcheck_smartphone.jpg',
    seoTitle: 'Tecnologia — Inovação, Startups e Transformação Digital | O Patriota',
    seoDescription: 'Notícias do setor de tecnologia, cibersegurança, novas leis digitais e polos tecnológicos no Brasil.',
    active: true,
    order: 8
  },
  {
    id: 'cat-9',
    slug: 'mundo',
    name: 'Mundo',
    description: 'Geopolítica internacional, relações bilaterais do Brasil, comércio exterior e acontecimentos globais de impacto.',
    introText: 'A posição estratégica do Brasil no cenário internacional, blocos econômicos e acontecimentos nos centros de poder mundial.',
    bannerImage: '/images/news_porto.jpg',
    seoTitle: 'Mundo — Geopolítica e Comércio Internacional | O Patriota',
    seoDescription: 'Cobertura dos principais fatos internacionais e seus reflexos na economia e diplomacia brasileira.',
    active: true,
    order: 9
  },
  {
    id: 'cat-10',
    slug: 'cultura',
    name: 'Cultura',
    description: 'Patrimônio histórico nacional, literatura, artes, tradições regionais e valorização da identidade brasileira.',
    introText: 'A riqueza da herança cultural brasileira, preservação de monumentos e celebração das expressões artísticas de cada canto do país.',
    bannerImage: '/images/news_opiniao.jpg',
    seoTitle: 'Cultura — Tradição, História e Artes no Brasil | O Patriota',
    seoDescription: 'Resgate da história nacional, celebrações cívicas, literatura e manifestações culturais autênticas do povo brasileiro.',
    active: true,
    order: 10
  },
  {
    id: 'cat-11',
    slug: 'esportes',
    name: 'Esportes',
    description: 'Futebol nacional, atletas brasileiros em competições internacionais, modalidades olímpicas e formação esportiva de base.',
    introText: 'O talento e a disciplina dos atletas brasileiros nos gramados, pistas, quadras e piscinas pelo Brasil e pelo mundo.',
    bannerImage: '/images/hero_congresso.jpg',
    seoTitle: 'Esportes — Competições e Atletas Brasileiros | O Patriota',
    seoDescription: 'Cobertura dos campeonatos de futebol, conquistas olímpicas e o impacto do esporte na formação dos jovens do país.',
    active: true,
    order: 11
  }
];

export const INITIAL_AUTHORS: AuthorDetail[] = [
  {
    id: 'usr-4',
    slug: 'thiago-vasconcellos',
    name: 'Thiago Vasconcellos',
    role: 'Correspondente Político em Brasília',
    bio: 'Jornalista com mais de 15 anos de cobertura ininterrupta no Congresso Nacional e nos palácios de Brasília. Especialista em tramitação orçamentária e processos legislativos.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80',
    credentials: 'DRT/DF 19.340 • Membro da Associação de Correspondentes de Brasília',
    email: 'thiago.vasconcellos@opatriota.com.br',
    social: {
      twitter: 'https://twitter.com/opatriota',
      linkedin: 'https://linkedin.com/company/opatriota'
    }
  },
  {
    id: 'usr-5',
    slug: 'helena-miranda',
    name: 'Helena Miranda',
    role: 'Editora de Revisão e Saúde Pública',
    bio: 'Jornalista diplomada pela USP, com pós-graduação em Gestão de Políticas Públicas. Lidera a equipe de revisão de estilo, checagem documental e cobertura de cidadania.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=80',
    credentials: 'DRT/SP 45.210 • Auditora de Integridade Textual',
    email: 'helena.miranda@opatriota.com.br'
  },
  {
    id: 'usr-6',
    slug: 'alberto-goncalves',
    name: 'Dr. Alberto Gonçalves',
    role: 'Editor-Chefe e Membro do Conselho Editorial',
    bio: 'Doutor em Economia do Desenvolvimento e ensaísta com livros publicados sobre livre mercado, história republicana e soberania nacional. Escreve artigos semanais sobre macroeconomia e reformas.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
    credentials: 'DRT/DF 14.892 • Conselho Editorial O Patriota',
    email: 'alberto.goncalves@opatriota.com.br'
  },
  {
    id: 'usr-7',
    slug: 'roberto-siqueira',
    name: 'Roberto Siqueira',
    role: 'Repórter Especial de Segurança e Defesa',
    bio: 'Especialista em inteligência de fronteiras e segurança pública integrada. Cobertura diária de grandes operações policiais federais e modernização do aparato de defesa civil.',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80',
    credentials: 'DRT/PR 22.810 • Repórter Investigativo',
    email: 'roberto.siqueira@opatriota.com.br'
  },
  {
    id: 'usr-8',
    slug: 'beatriz-albuquerque',
    name: 'Beatriz Albuquerque',
    role: 'Correspondente de Economia e Assuntos Internacionais',
    bio: 'Analista de comércio exterior com foco na inserção do agronegócio e da indústria nacional nos mercados asiático e norte-americano. Cobertura de cúpulas de comércio e geopolítica.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
    credentials: 'DRT/SP 38.109 • Correspondente de Mercado',
    email: 'beatriz.albuquerque@opatriota.com.br'
  }
];

export const INITIAL_MENU_CONFIG: SiteMenuConfig = {
  mainNav: [
    { id: 'm-1', label: 'Política', url: '/categoria/politica', type: 'categoria' },
    { id: 'm-2', label: 'Brasil', url: '/categoria/brasil', type: 'categoria' },
    { id: 'm-3', label: 'Economia', url: '/categoria/economia', type: 'categoria' },
    { id: 'm-4', label: 'Segurança', url: '/categoria/seguranca', type: 'categoria' },
    { id: 'm-5', label: 'Saúde', url: '/categoria/saude', type: 'categoria' },
    { id: 'm-6', label: 'Opinião', url: '/categoria/opiniao', type: 'categoria' },
    { id: 'm-7', label: 'Checagem', url: '/checagem', type: 'custom' },
    { id: 'm-8', label: 'Tecnologia', url: '/categoria/tecnologia', type: 'categoria' },
    { id: 'm-9', label: 'Mundo', url: '/categoria/mundo', type: 'categoria' },
    { id: 'm-10', label: 'Cultura', url: '/categoria/cultura', type: 'categoria' },
    { id: 'm-11', label: 'Esportes', url: '/categoria/esportes', type: 'categoria' }
  ],
  topBar: [
    { id: 'tb-1', label: 'Sobre O Patriota', url: '/sobre-o-patriota', type: 'pagina' },
    { id: 'tb-2', label: 'Princípios Editoriais', url: '/principios-editoriais', type: 'pagina' },
    { id: 'tb-3', label: 'Expediente', url: '/expediente', type: 'pagina' },
    { id: 'tb-4', label: 'Planos de Assinatura', url: '/planos', type: 'pagina' },
    { id: 'tb-5', label: 'Fale com a Redação', url: '/contato', type: 'pagina' }
  ],
  footerCol1: [
    { id: 'fc1-1', label: 'Política Nacional', url: '/categoria/politica', type: 'categoria' },
    { id: 'fc1-2', label: 'Brasil e Estados', url: '/categoria/brasil', type: 'categoria' },
    { id: 'fc1-3', label: 'Economia e Mercado', url: '/categoria/economia', type: 'categoria' },
    { id: 'fc1-4', label: 'Segurança Pública', url: '/categoria/seguranca', type: 'categoria' },
    { id: 'fc1-5', label: 'Saúde', url: '/categoria/saude', type: 'categoria' },
    { id: 'fc1-6', label: 'Artigos e Opinião', url: '/categoria/opiniao', type: 'categoria' },
    { id: 'fc1-7', label: 'Agência de Checagem', url: '/checagem', type: 'custom' }
  ],
  footerCol2: [
    { id: 'fc2-1', label: 'Sobre O Patriota', url: '/sobre-o-patriota', type: 'pagina' },
    { id: 'fc2-2', label: 'Expediente e Redação', url: '/expediente', type: 'pagina' },
    { id: 'fc2-3', label: 'Princípios Editoriais', url: '/principios-editoriais', type: 'pagina' },
    { id: 'fc2-4', label: 'Fontes e Metodologia', url: '/fontes-e-metodologia', type: 'pagina' },
    { id: 'fc2-5', label: 'Política de Correções', url: '/politica-de-correcoes', type: 'pagina' },
    { id: 'fc2-6', label: 'Fale com a Redação', url: '/contato', type: 'pagina' }
  ],
  footerCol3: [
    { id: 'fc3-1', label: 'Política de Privacidade', url: '/politica-de-privacidade', type: 'pagina' },
    { id: 'fc3-2', label: 'Termos de Uso', url: '/termos-de-uso', type: 'pagina' },
    { id: 'fc3-3', label: 'Gestão de Dados (LGPD)', url: '/gestao-de-dados', type: 'pagina' },
    { id: 'fc3-4', label: 'Segurança da Informação', url: '/seguranca-da-informacao', type: 'pagina' },
    { id: 'fc3-5', label: 'Área do Assinante (/minha-conta)', url: '/minha-conta', type: 'custom' },
    { id: 'fc3-6', label: 'Acesso da Redação (/redacao)', url: '/redacao', type: 'custom' }
  ]
};

export const INITIAL_CONTACT_SUBMISSIONS: ContactSubmission[] = [
  {
    id: 'sub-1',
    date: '08/10/2026 14:22',
    name: 'Carlos Alberto Meneses',
    email: 'carlos.meneses@empresa.com.br',
    phone: '(61) 98111-2233',
    subject: 'sugestao_pauta',
    message: 'Gostaria de sugerir uma pauta sobre o impacto positivo da nova rota de escoamento hidroviário pelo Rio Tapajós para as cooperativas de grãos do Centro-Oeste.',
    status: 'em_analise'
  },
  {
    id: 'sub-2',
    date: '07/10/2026 16:45',
    name: 'Juliana Silveira',
    email: 'juliana.silveira@advogados.org.br',
    subject: 'correcao_materia',
    articleRef: 'congresso-avanca-em-propostas-para-gerar-empregos',
    message: 'No segundo parágrafo da matéria do PL trabalhista, o número correto do projeto em tramitação é 4.218/2026 e não 4.215. Segue o link da Mesa Diretora para confirmação.',
    status: 'respondido'
  }
];

export const INITIAL_LGPD_REQUESTS: LgpdRequest[] = [
  {
    id: 'lgpd-1',
    date: '06/10/2026 10:15',
    name: 'Renato Faria Souza',
    email: 'renato.faria@email.com.br',
    requestType: 'revogacao_consentimento',
    details: 'Solicito a revogação do consentimento para recebimento de boletins promocionais mantendo apenas minha assinatura digital ativa.',
    status: 'concluido'
  }
];
