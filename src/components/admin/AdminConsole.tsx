import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity, BookOpen, Boxes, ChartNoAxesCombined, CircleDollarSign, Database, FileClock,
  HardDrive, LayoutDashboard, Link2, LockKeyhole, LogOut, Menu, MessageSquareText,
  Search, Settings, ShieldCheck, Users, X, RefreshCw, AlertTriangle, CheckCircle2,
  ExternalLink, Bot, CreditCard, Globe, Image, Mail, Server, SlidersHorizontal
} from 'lucide-react';

type Section = 'overview' | 'users' | 'plans' | 'finance' | 'reports' | 'knowledge' | 'integrations' | 'firebase' | 'neon' | 'meta' | 'settings' | 'security' | 'logs' | 'media' | 'backups' | 'support';
type Health = { status: 'checking' | 'ok' | 'error' | 'unknown'; detail: string };

const sections: { id: Section; label: string; icon: React.ElementType; group: string }[] = [
  { id: 'overview', label: 'Visão geral', icon: LayoutDashboard, group: 'Operação' },
  { id: 'users', label: 'Utilizadores e permissões', icon: Users, group: 'Operação' },
  { id: 'plans', label: 'Planos e assinaturas', icon: CreditCard, group: 'Financeiro' },
  { id: 'finance', label: 'Financeiro', icon: CircleDollarSign, group: 'Financeiro' },
  { id: 'reports', label: 'Relatórios e métricas', icon: ChartNoAxesCombined, group: 'Financeiro' },
  { id: 'knowledge', label: 'Base de conhecimento IA', icon: BookOpen, group: 'Inteligência interna' },
  { id: 'integrations', label: 'Integrações', icon: Boxes, group: 'Sistema' },
  { id: 'firebase', label: 'Google / Firebase', icon: ShieldCheck, group: 'Sistema' },
  { id: 'neon', label: 'Neon PostgreSQL', icon: Database, group: 'Sistema' },
  { id: 'meta', label: 'Facebook / Meta', icon: Link2, group: 'Sistema' },
  { id: 'settings', label: 'Configurações gerais', icon: Settings, group: 'Sistema' },
  { id: 'security', label: 'Segurança e acessos', icon: LockKeyhole, group: 'Sistema' },
  { id: 'logs', label: 'Logs e auditoria', icon: FileClock, group: 'Sistema' },
  { id: 'media', label: 'Biblioteca de mídia', icon: Image, group: 'Sistema' },
  { id: 'backups', label: 'Backups e manutenção', icon: HardDrive, group: 'Sistema' },
  { id: 'support', label: 'Suporte e documentação', icon: MessageSquareText, group: 'Sistema' },
];

const titleFor: Record<Section, string> = {
  overview: 'Visão geral do sistema', users: 'Utilizadores e permissões', plans: 'Planos e assinaturas',
  finance: 'Financeiro', reports: 'Relatórios e métricas', knowledge: 'Base de conhecimento interna',
  integrations: 'Centro de integrações', firebase: 'Google / Firebase', neon: 'Neon PostgreSQL',
  meta: 'Facebook / Meta — publicação', settings: 'Configurações gerais', security: 'Segurança e acessos',
  logs: 'Logs e auditoria', media: 'Biblioteca de mídia', backups: 'Backups e manutenção', support: 'Suporte e documentação'
};

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

export const AdminConsole: React.FC<{ onBack: () => void; onLogout: () => void }> = ({ onBack, onLogout }) => {
  const [active, setActive] = useState<Section>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [health, setHealth] = useState<Health>({ status: 'checking', detail: 'A consultar API…' });
  const [dbHealth, setDbHealth] = useState<Health>({ status: 'unknown', detail: 'Ainda não verificado' });
  const [knowledgeQuestion, setKnowledgeQuestion] = useState('');
  const [knowledgeAnswer, setKnowledgeAnswer] = useState('');
  const [knowledgeBusy, setKnowledgeBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [settings, setSettings] = useState({ portalName: 'O Patriota Brasil', timezone: 'America/Sao_Paulo', language: 'pt-BR', maintenance: false });
  const [maintenanceSaved, setMaintenanceSaved] = useState(false);

  const visibleSections = useMemo(() => sections.filter(s => s.label.toLowerCase().includes(query.toLowerCase())), [query]);

  const checkHealth = async () => {
    setHealth({ status: 'checking', detail: 'A consultar API…' });
    try {
      const response = await fetch(`${API_BASE.replace(/\/api$/, '')}/health/live`, { credentials: 'include' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setHealth({ status: 'ok', detail: 'API respondeu corretamente' });
    } catch {
      setHealth({ status: 'error', detail: 'API indisponível ou URL não configurada' });
    }
    try {
      const response = await fetch(`${API_BASE.replace(/\/api$/, '')}/health/ready`, { credentials: 'include' });
      const body = await response.json();
      setDbHealth(response.ok ? { status: 'ok', detail: body?.dependencies?.postgres === 'ok' ? 'PostgreSQL acessível' : 'API pronta' } : { status: 'error', detail: 'Banco indisponível ou API não pronta' });
    } catch {
      setDbHealth({ status: 'error', detail: 'Não foi possível verificar o banco' });
    }
  };

  useEffect(() => { void checkHealth(); }, []);

  const askKnowledge = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!knowledgeQuestion.trim()) return;
    setKnowledgeBusy(true);
    setKnowledgeAnswer('');
    try {
      const response = await fetch(`${API_BASE}/knowledge/ask`, {
        method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: knowledgeQuestion.trim(), audience: 'admin' })
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body?.error?.message || 'O serviço interno de conhecimento ainda não está configurado no backend.');
      setKnowledgeAnswer(body?.data?.answer || 'O serviço respondeu sem conteúdo.');
    } catch (error) {
      setKnowledgeAnswer(error instanceof Error ? error.message : 'Não foi possível consultar a base interna.');
    } finally { setKnowledgeBusy(false); }
  };

  const StatusLine = ({ name, value }: { name: string; value: Health }) => (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-4 last:border-0">
      <div className="flex min-w-0 items-start gap-3">
        <span className={`mt-1 h-2.5 w-2.5 rounded-full ${value.status === 'ok' ? 'bg-emerald-500' : value.status === 'checking' ? 'bg-amber-400' : value.status === 'error' ? 'bg-red-500' : 'bg-slate-300'}`} />
        <div><p className="font-semibold text-slate-800">{name}</p><p className="mt-1 text-sm text-slate-500">{value.detail}</p></div>
      </div>
      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${value.status === 'ok' ? 'bg-emerald-50 text-emerald-700' : value.status === 'error' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>{value.status === 'ok' ? 'Operacional' : value.status === 'checking' ? 'Verificando' : value.status === 'error' ? 'Atenção' : 'Pendente'}</span>
    </div>
  );

  const InfoCard = ({ icon: Icon, label, description, status = 'Pendente' }: { icon: React.ElementType; label: string; description: string; status?: string }) => (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3"><span className="rounded-lg bg-blue-50 p-2.5 text-blue-700"><Icon className="h-5 w-5" /></span><span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">{status}</span></div>
      <h3 className="mt-4 font-bold text-slate-900">{label}</h3><p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
    </article>
  );

  const renderContent = () => {
    if (active === 'overview') return <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[['API', health.status === 'ok' ? 'Online' : health.status === 'checking' ? 'Verificando' : 'Indisponível', Activity], ['PostgreSQL', dbHealth.status === 'ok' ? 'Conectado' : dbHealth.status === 'checking' ? 'Verificando' : 'Não confirmado', Database], ['Login', 'Google', ShieldCheck], ['Assistente interno', 'Configuração necessária', Bot]].map(([label, value, Icon]) => <div key={String(label)} className="rounded-xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><span className="text-sm text-slate-500">{String(label)}</span><span className="rounded-lg bg-blue-50 p-2 text-blue-700"><Icon className="h-5 w-5" /></span></div><p className="mt-3 text-xl font-extrabold text-slate-900">{String(value)}</p><p className="mt-1 text-xs text-slate-500">Estado consultado ou configuração declarada</p></div>)}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-5"><div className="mb-2 flex items-center justify-between"><h2 className="font-bold text-slate-900">Saúde dos serviços</h2><button onClick={() => void checkHealth()} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold"><RefreshCw className="h-4 w-4" /> Verificar</button></div><StatusLine name="Backend HTTP" value={health} /><StatusLine name="Neon / PostgreSQL" value={dbHealth} /><StatusLine name="Firebase Admin / validação de identidade" value={{ status: 'unknown', detail: 'Requer configuração e teste no backend' }} /><StatusLine name="Meta Graph API / publicação" value={{ status: 'unknown', detail: 'Requer OAuth, permissões e token de Página' }} /><StatusLine name="Base de conhecimento IA" value={{ status: 'unknown', detail: 'Requer indexação, armazenamento e provedor de modelo' }} /></section>
        <section className="rounded-xl border border-slate-200 bg-white p-5"><h2 className="font-bold text-slate-900">Próximas configurações</h2><p className="mt-1 text-sm text-slate-500">O painel não considera integração configurada apenas por existir uma variável no .env.</p><div className="mt-4 space-y-3">{[['1','Confirmar ambiente e conexão Neon'],['2','Validar identidade Google no backend e mapear papéis'],['3','Configurar serviço de conhecimento e indexar fontes autorizadas'],['4','Configurar OAuth Meta e testar publicação em Página de teste'],['5','Executar migrações em banco de homologação e validar backups']].map(([n,t]) => <div key={n} className="flex gap-3 rounded-lg bg-slate-50 p-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">{n}</span><p className="pt-1 text-sm text-slate-700">{t}</p></div>)}</div></section>
      </div>
    </div>;

    if (active === 'knowledge') return <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
      <section className="rounded-xl border border-slate-200 bg-white p-6"><div className="flex items-center gap-3"><span className="rounded-xl bg-blue-50 p-3 text-blue-700"><BookOpen className="h-6 w-6" /></span><div><h2 className="text-lg font-bold">Notebook interno — conhecimento com fontes</h2><p className="text-sm text-slate-500">Assistente para jornalistas, editores, utilizadores e administração.</p></div></div><div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-900">Objetivo: consultar documentos autorizados, produzir respostas com referências às fontes, resumir arquivos e apoiar a redação. O assistente não aprova nem publica matérias e deve respeitar as permissões de cada utilizador.</div><form onSubmit={askKnowledge} className="mt-5 space-y-3"><label className="block text-sm font-semibold text-slate-700" htmlFor="knowledge-question">Pergunta à base interna</label><textarea id="knowledge-question" value={knowledgeQuestion} onChange={e => setKnowledgeQuestion(e.target.value)} rows={4} placeholder="Ex.: resume os documentos desta pauta e lista as fontes que sustentam cada afirmação…" className="w-full rounded-lg border border-slate-300 p-3 text-sm outline-none focus:border-blue-600" /><button disabled={knowledgeBusy || !knowledgeQuestion.trim()} className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-3 text-sm font-bold text-white disabled:opacity-50"><Bot className="h-4 w-4" />{knowledgeBusy ? 'A consultar…' : 'Consultar assistente interno'}</button></form>{knowledgeAnswer && <div className="mt-5 whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700" role="status">{knowledgeAnswer}</div>}</section>
      <div className="space-y-4"><InfoCard icon={Users} label="Acesso por função" description="Separar os espaços de leitor, jornalista, revisor, editor e administrador. Nenhum utilizador pode consultar documentos privados sem permissão." /><InfoCard icon={Search} label="Pesquisa com fontes (RAG)" description="Indexação de documentos e trechos com referência, data, autor e nível de acesso." /><InfoCard icon={LockKeyhole} label="Privacidade e auditoria" description="Não expor documentos sensíveis ao modelo sem autorização. Registar consultas administrativas e respeitar retenção configurada." /><InfoCard icon={Bot} label="Provedor de IA" description="A integração do modelo precisa ser definida por segredo no backend; não expor chaves no browser." /></div>
    </div>;

    const configs: Partial<Record<Section, { icon: React.ElementType; label: string; description: string; status?: string }[]>> = {
      users: [{icon:Users,label:'Contas e papéis',description:'Leitor, jornalista, revisor, editor-chefe e administrador. A gestão exige endpoints de servidor protegidos.'},{icon:ShieldCheck,label:'Convites e desativação',description:'Criar convites, suspender contas e revogar sessões por meio de operações auditadas.'}],
      plans: [{icon:CreditCard,label:'Catálogo de planos',description:'Planos, preços e limites de assinatura armazenados no PostgreSQL.'},{icon:CircleDollarSign,label:'Provedor de pagamento',description:'EFI configurável no servidor; webhooks devem validar assinatura e idempotência.'}],
      finance: [{icon:CircleDollarSign,label:'Receitas e pagamentos',description:'Exibir apenas valores lidos de pagamentos confirmados pelo backend.'},{icon:FileClock,label:'Conciliação e reembolsos',description:'Operações financeiras devem ter trilha de auditoria e permissão específica.'}],
      reports: [{icon:ChartNoAxesCombined,label:'Analytics',description:'Ligar Google Analytics/Meta Insights e indicar período, fonte e última sincronização.'},{icon:Activity,label:'Relatórios de operação',description:'Relatórios extraídos dos dados reais; sem métricas de demonstração.'}],
      integrations: [{icon:ShieldCheck,label:'Google / Firebase',description:'Login Google no cliente e validação do token e papel no servidor.'},{icon:Database,label:'Neon PostgreSQL',description:'Base principal do backend. Connection string apenas no ambiente do servidor.'},{icon:Link2,label:'Facebook / Meta',description:'OAuth de publicação separado do login. Token cifrado no backend.'},{icon:Bot,label:'IA / Notebook interno',description:'Provedor de modelo e indexação de documentos internos.'}],
      firebase: [{icon:ShieldCheck,label:'Firebase Authentication',description:'Provedor de login: Google. Facebook não deve ser habilitado como login.'},{icon:LockKeyhole,label:'Firebase Admin SDK',description:'Validação de ID token, revogação e sincronização segura do utilizador no backend.'}],
      neon: [{icon:Database,label:'PostgreSQL / Neon',description:'Conexão, estado de prontidão e migrações Prisma.'},{icon:HardDrive,label:'Backups e recuperação',description:'Definir retenção, teste de restauração e plano de recuperação.'}],
      meta: [{icon:Link2,label:'Conexão OAuth da Página',description:'Vincular a Página permitida, validar state/callback e guardar tokens cifrados.'},{icon:Image,label:'Prévia com marca do jornal',description:'Gerar cópia de distribuição com marca O Patriota Brasil e link canónico da matéria aprovada.'},{icon:ChartNoAxesCombined,label:'Métricas Meta',description:'Buscar insights apenas com permissões aprovadas; mostrar falhas de sincronização.'}],
      settings: [{icon:Settings,label:'Identidade e domínio',description:'Nome do portal, domínio canónico, idioma, fuso horário e dados institucionais.'},{icon:Mail,label:'Notificações',description:'Configurar e-mail e avisos internos no backend.'}],
      security: [{icon:LockKeyhole,label:'Sessões e papéis',description:'RBAC validado no servidor; a lista de e-mails do frontend não é uma fronteira de segurança.'},{icon:ShieldCheck,label:'Proteções',description:'Rate limit, CORS, cookies seguros, rotação de segredos e política de incidentes.'}],
      logs: [{icon:FileClock,label:'Auditoria',description:'Eventos de autenticação, mudanças de permissão, publicações e operações financeiras.'},{icon:AlertTriangle,label:'Erros operacionais',description:'Exibir eventos sanitizados sem tokens, senhas ou conteúdo pessoal desnecessário.'}],
      media: [{icon:Image,label:'Biblioteca de mídia',description:'Ficheiros, licenças, metadados, marca d’água e regras de acesso.'}],
      backups: [{icon:HardDrive,label:'Backups',description:'Criar e testar backups no ambiente de servidor; não declarar sucesso sem confirmação do provedor.'},{icon:Server,label:'Manutenção',description:'Estado de API, base e filas. Ações destrutivas exigem confirmação explícita.'}],
      support: [{icon:MessageSquareText,label:'Central de ajuda',description:'Documentação técnica, diagnóstico e abertura de chamados.'},{icon:ExternalLink,label:'Documentação de integrações',description:'Consultar o guia interno de configuração Firebase, Neon e Meta.'}]
    };
    const cards = configs[active] || [];
    return <div className="space-y-5"><div className="rounded-xl border border-slate-200 bg-white p-5"><div className="flex items-center gap-3"><SlidersHorizontal className="h-5 w-5 text-blue-700" /><div><h2 className="font-bold text-slate-900">Estado de configuração</h2><p className="mt-1 text-sm text-slate-500">Os cartões descrevem requisitos de integração. A ligação real depende do backend, permissões e credenciais do ambiente.</p></div></div></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{cards.map((c) => <InfoCard key={c.label} {...c} />)}</div>{active === 'settings' && <section className="rounded-xl border border-slate-200 bg-white p-5"><h2 className="font-bold">Preferências desta sessão</h2><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Nome do portal<input className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-normal" value={settings.portalName} onChange={e=>{setSettings({...settings,portalName:e.target.value});setMaintenanceSaved(false)}} /></label><label className="text-sm font-semibold">Fuso horário<select className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-normal" value={settings.timezone} onChange={e=>{setSettings({...settings,timezone:e.target.value});setMaintenanceSaved(false)}}><option>America/Sao_Paulo</option><option>UTC</option></select></label></div><p className="mt-3 text-xs text-amber-700">Estas preferências ainda são locais à sessão. Persistência deve ser feita por endpoint administrativo antes de serem consideradas configurações globais.</p><button onClick={()=>setMaintenanceSaved(true)} className="mt-4 rounded-lg bg-blue-700 px-4 py-3 text-sm font-bold text-white">Validar preferências</button>{maintenanceSaved && <p className="mt-3 text-sm text-emerald-700">Validadas localmente; ainda não gravadas no servidor.</p>}</section>}</div>;
  };

  return <div className="min-h-screen bg-slate-50 text-slate-800">
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6">
      <div className="flex items-center gap-3"><button aria-label="Abrir menu" onClick={()=>setSidebarOpen(!sidebarOpen)} className="rounded-lg p-2 hover:bg-slate-100 lg:hidden">{sidebarOpen?<X className="h-5 w-5"/>:<Menu className="h-5 w-5"/>}</button><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B2345] text-[#FFCC29]"><Globe className="h-6 w-6"/></div><div><p className="text-sm font-extrabold tracking-wide text-[#0B2345]">O PATRIOTA BRASIL</p><p className="text-xs text-slate-500">Centro de administração técnica</p></div></div>
      <div className="flex items-center gap-2"><span className="hidden rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-800 sm:inline">Acesso administrativo</span><button onClick={onBack} className="hidden rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold sm:inline">Portal</button><button onClick={onLogout} className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold hover:bg-slate-200"><LogOut className="h-4 w-4"/>Sair</button></div>
    </header>
    <div className="mx-auto flex max-w-[1600px]">
      <aside className={`${sidebarOpen?'block':'hidden'} fixed inset-y-16 left-0 z-20 w-72 overflow-y-auto border-r border-slate-200 bg-white p-4 lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-4rem)] lg:shrink-0`}>
        <div className="mb-4 rounded-xl bg-slate-50 p-3"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Administração</p><p className="mt-1 text-sm font-bold text-slate-900">Configuração do sistema</p></div>
        <label className="relative mb-4 block"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar seção…" className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm"/></label>
        {[...new Set(visibleSections.map(s=>s.group))].map(group=><div key={group} className="mb-4"><p className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">{group}</p><nav className="space-y-1">{visibleSections.filter(s=>s.group===group).map(s=>{const Icon=s.icon;return <button key={s.id} onClick={()=>{setActive(s.id);setSidebarOpen(false);}} className={`flex min-h-10 w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${active===s.id?'bg-blue-700 text-white shadow-sm':'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}><Icon className="h-4 w-4 shrink-0"/><span>{s.label}</span></button>})}</nav></div>)}
        <button onClick={onBack} className="mt-2 flex min-h-10 w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100"><ExternalLink className="h-4 w-4"/>Voltar ao portal</button>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8"><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[.16em] text-blue-700">Painel administrativo</p><h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">{titleFor[active]}</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">Gestão central do portal, infraestrutura, utilizadores, financeiro e conhecimento interno.</p></div><div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600"><span className={`h-2 w-2 rounded-full ${health.status==='ok'?'bg-emerald-500':'bg-amber-500'}`}/>{health.status==='ok'?'API verificada':'Estado da API não confirmado'}</div></div>{notice && <div role="status" className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">{notice}</div>}{renderContent()}<footer className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-4 text-xs text-slate-400"><span>O Patriota Brasil · Administração</span><span>Indicadores reais só aparecem quando fornecidos pelos serviços conectados.</span></footer></main>
    </div>
  </div>;
};
