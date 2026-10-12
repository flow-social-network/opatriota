export const NOTEAGENTS_TOOL_CATALOG = [
  { name: 'filesystem', priority: 'essencial', mode: 'local', permission: 'read/write-approved' },
  { name: 'git', priority: 'essencial', mode: 'local', permission: 'read/write-approved' },
  { name: 'fetch', priority: 'alta', mode: 'remote', permission: 'read' },
  { name: 'memory', priority: 'alta', mode: 'local', permission: 'read/write-approved' },
  { name: 'playwright', priority: 'essencial', mode: 'local', permission: 'browser-approved' },
  { name: 'lsp', priority: 'essencial', mode: 'local', permission: 'read' },
  { name: 'postgresql', priority: 'alta', mode: 'local', permission: 'read/write-approved' },
  { name: 'typescript', priority: 'essencial', mode: 'local', permission: 'execute-approved' },
  { name: 'security-scanners', priority: 'alta', mode: 'local', permission: 'execute-approved' },
  { name: 'deploy', priority: 'alta', mode: 'remote', permission: 'production-approved' },
] as const
