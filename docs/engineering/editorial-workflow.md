# Fluxo editorial

Estados contratuais: `RECEBIDA`, `EM TRIAGEM`, `EM APURAÇÃO`, `EM REDAÇÃO`, `EM REVISÃO`, `CORREÇÕES`, `APROVADA`, `AGENDADA`, `PUBLICADA`, `REJEITADA`, `ARQUIVADA`.

O painel `/redacao` é responsável por pauta, apuração, produção, revisão, correções e publicação. O painel `/admin` é governança da plataforma; financeiro permanece administrativo.

Toda transição deve validar papel no backend, registrar auditoria e retornar o novo registro persistido. A assistência de IA, quando configurada, deve produzir sugestão controlada pelo jornalista, nunca publicar automaticamente.

Lacunas atuais: evidência E2E completa de cada transição, histórico/versionamento verificável e publicação em ambiente de teste.
