-- O Patriota Brasil: eventos técnicos de audiência agregáveis.
-- Retenção recomendada: remover eventos brutos após 90 dias por job operacional.
CREATE TABLE IF NOT EXISTS public.portal_events (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL CHECK (event_type IN ('page_view', 'session_start', 'auth_login', 'signup_completed', 'subscription_started', 'unauthorized_access')),
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  session_key TEXT NOT NULL,
  visitor_kind TEXT NOT NULL DEFAULT 'anonymous' CHECK (visitor_kind IN ('anonymous', 'authenticated', 'subscriber', 'admin')),
  user_id TEXT,
  page_path TEXT NOT NULL CHECK (char_length(page_path) <= 2048),
  page_title TEXT,
  category TEXT,
  article_id TEXT,
  referrer_host TEXT,
  campaign_source TEXT,
  device_type TEXT NOT NULL DEFAULT 'unknown' CHECK (device_type IN ('desktop', 'mobile', 'tablet', 'unknown')),
  browser TEXT,
  operating_system TEXT,
  user_agent_hash TEXT,
  ip_hash TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS portal_events_occurred_at_idx ON public.portal_events (occurred_at DESC);
CREATE INDEX IF NOT EXISTS portal_events_type_time_idx ON public.portal_events (event_type, occurred_at DESC);
CREATE INDEX IF NOT EXISTS portal_events_page_time_idx ON public.portal_events (page_path, occurred_at DESC);
CREATE INDEX IF NOT EXISTS portal_events_session_time_idx ON public.portal_events (session_key, occurred_at DESC);
CREATE TABLE IF NOT EXISTS public.portal_event_dedup (
  deduplication_key TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS portal_event_dedup_created_at_idx ON public.portal_event_dedup (created_at);

-- Retenção operacional: executar diariamente fora do horário de pico.
-- DELETE FROM public.portal_events WHERE occurred_at < NOW() - INTERVAL '90 days';
-- DELETE FROM public.portal_event_dedup WHERE created_at < NOW() - INTERVAL '2 days';

COMMENT ON TABLE public.portal_events IS 'Eventos técnicos de audiência; não armazenar senhas, tokens ou conteúdo de formulários.';
COMMENT ON COLUMN public.portal_events.ip_hash IS 'Hash/anonimização para segurança e deduplicação; não é identificação exata do visitante.';
