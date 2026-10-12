import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { stdin, stdout } from 'node:process'
import { readFile, readdir } from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'
import { runBrowserTool } from './playwright-tools'
import { inspectWithLsp } from './lsp-tools'

const root = resolve(process.env.NOTEAGENTS_WORKSPACE || process.cwd())
const json = (value: unknown) => JSON.stringify(value)
const tools = [
  { name: 'noteagents.project.inspect', description: 'Inspeciona arquivos do workspace sem alterar dados.', inputSchema: { type: 'object', properties: { path: { type: 'string' } } } },
  { name: 'noteagents.tests.run', description: 'Executa testes autorizados no workspace.', inputSchema: { type: 'object', properties: { command: { type: 'string' } }, required: ['command'] } },
  { name: 'noteagents.browser.open', description: 'Abre uma URL do preview com Playwright.', inputSchema: { type: 'object', properties: { url: { type: 'string' } }, required: ['url'] } },
  { name: 'noteagents.browser.snapshot', description: 'Retorna texto acessível da página aberta.', inputSchema: { type: 'object', properties: {} } },
  { name: 'noteagents.browser.screenshot', description: 'Captura screenshot do preview.', inputSchema: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] } },
  { name: 'noteagents.lsp.diagnostics', description: 'Retorna diagnósticos TypeScript de um arquivo.', inputSchema: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] } },
]
const resources = [{ uri: 'noteagents://workspace', name: 'Workspace', description: 'Arquivos do workspace autorizado.' }, { uri: 'noteagents://capabilities', name: 'Capabilities', description: 'Ferramentas MCP disponíveis.' }]
const prompts = [{ name: 'full_repository_audit', description: 'Auditoria completa com evidências.', arguments: [] }]
function safePath(value: string) { const path = resolve(root, value || '.'); if (path !== root && !path.startsWith(`${root}/`)) throw new Error('WORKSPACE_PATH_FORBIDDEN'); return path }
async function inspect(path = '.') { const absolute = safePath(path); const entries = await readdir(absolute, { withFileTypes: true }); return entries.filter(entry => entry.name !== 'node_modules' && !entry.name.startsWith('.git')).map(entry => relative(root, join(absolute, entry.name))) }
async function call(name: string, args: Record<string, unknown>) {
  if (name === 'noteagents.project.inspect') return inspect(String(args.path || '.'))
  if (name === 'noteagents.browser.open' || name.startsWith('noteagents.browser.')) return runBrowserTool(name, args)
  if (name === 'noteagents.lsp.diagnostics') return inspectWithLsp(safePath(String(args.path)))
  if (name === 'noteagents.tests.run') throw new Error('APPROVAL_REQUIRED: execução de comandos exige aprovação do host')
  throw new Error(`UNKNOWN_TOOL:${name}`)
}
async function handle(request: any) { if (request.method === 'initialize') return { protocolVersion: '2025-06-18', capabilities: { tools: {}, resources: {}, prompts: {} }, serverInfo: { name: 'noteagents-mcp', version: '1.0.0' } }; if (request.method === 'tools/list') return { tools }; if (request.method === 'resources/list') return { resources }; if (request.method === 'prompts/list') return { prompts }; if (request.method === 'resources/read') return { contents: [{ uri: request.params.uri, text: request.params.uri === 'noteagents://capabilities' ? json(tools) : json(await inspect('.')) }] }; if (request.method === 'tools/call') return { content: [{ type: 'text', text: json(await call(request.params.name, request.params.arguments || {})) }] }; throw new Error(`METHOD_NOT_FOUND:${request.method}`) }
function response(id: unknown, result: unknown, error?: unknown) { return JSON.stringify(error ? { jsonrpc: '2.0', id, error: { code: -32000, message: String(error instanceof Error ? error.message : error) } } : { jsonrpc: '2.0', id, result }) }
export async function handleJsonRpcLine(line: string) { const request = JSON.parse(line); try { return response(request.id, await handle(request)) } catch (error) { return response(request.id, null, error) } }
if (process.argv.includes('--stdio')) { let buffer = ''; stdin.setEncoding('utf8'); stdin.on('data', async chunk => { buffer += chunk; const lines = buffer.split('\n'); buffer = lines.pop() || ''; for (const line of lines.filter(Boolean)) stdout.write(`${await handleJsonRpcLine(line)}\n`) }) }
export function createMcpHttpServer() { return createServer(async (req: IncomingMessage, res: ServerResponse) => { if (req.method !== 'POST' || req.url !== '/mcp') { res.statusCode = 404; return res.end() }; let body = ''; req.on('data', chunk => { body += chunk }); req.on('end', async () => { const result = await handleJsonRpcLine(body); res.setHeader('content-type', 'application/json'); res.end(result) }) }) }
if (process.argv.includes('--http')) createMcpHttpServer().listen(Number(process.env.NOTEAGENTS_MCP_PORT || 8788), '127.0.0.1')
export { tools, resources, prompts }
