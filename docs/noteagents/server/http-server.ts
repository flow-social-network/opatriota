import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import type { Actor, Project } from './contracts'
import { NvidiaProvider } from '../integrations/nvidia'
import { streamChat } from './chat-service'
import { AgentRuntime } from './runtime'
import { createAgents } from '../agents/catalog'
import { createBuiltinTools } from '../tools/builtins'
import { discoverImportedCapabilities } from '../registry'
import { KnowledgeVault } from '../adapters/knowledge-vault'
import { NotebookLmAdapter } from '../adapters/notebooklm'
import { databaseHealth } from './postgres'
import { getOrCreateLocalProject, listProjects, saveMessage, saveRun } from './repository'
import { publicLocalConfig, saveLocalConfig } from './config'

const runtime = new AgentRuntime(); createAgents().forEach(runtime.registerAgent.bind(runtime)); createBuiltinTools().forEach(runtime.registerTool.bind(runtime))
let project: Project | undefined
const actor: Actor = { id: 'local-owner', role: 'owner', projectId: '' }
const approve = async (reason: string) => process.env.NOTEAGENTS_AUTO_APPROVE === 'true' && reason.length > 0
const json = (res: ServerResponse, status: number, data: unknown) => { res.statusCode = status; res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(data)) }
const body = async (req: IncomingMessage) => { let raw = ''; for await (const chunk of req) raw += chunk; return raw ? JSON.parse(raw) : {} }

export const server = createServer(async (req, res) => {
  try {
    project ??= await getOrCreateLocalProject()
    const currentProject = project
    actor.projectId = currentProject.id
    if (req.url === '/health') return json(res, 200, { status: 'ok', service: 'noteagents', database: await databaseHealth() })
    if (req.url === '/api/projects' && req.method === 'GET') return json(res, 200, await listProjects())
    if (req.url === '/api/agents' && req.method === 'GET') return json(res, 200, createAgents().map(agent => ({ name: agent.name, description: agent.description })))
    if (req.url === '/api/capabilities' && req.method === 'GET') return json(res, 200, await discoverImportedCapabilities())
    if (req.url === '/api/knowledge' && req.method === 'GET') return json(res, 200, await new KnowledgeVault().list())
    if (req.url === '/api/notebooklm/health' && req.method === 'GET') return json(res, 200, await new NotebookLmAdapter().health())
    if (req.url === '/api/models' && req.method === 'GET') { const { NVIDIA_FREE_MODELS } = await import('../integrations/nvidia'); return json(res, 200, { provider: 'NVIDIA NIM', models: NVIDIA_FREE_MODELS }) }
    if (req.url === '/api/config' && req.method === 'GET') return json(res, 200, await publicLocalConfig())
    if (req.url === '/api/config' && req.method === 'POST') { const input = await body(req); return json(res, 200, await saveLocalConfig({ model: typeof input.model === 'string' ? input.model : undefined, endpoint: typeof input.endpoint === 'string' ? input.endpoint : undefined, apiKey: typeof input.apiKey === 'string' && input.apiKey.trim() ? input.apiKey.trim() : undefined })) }
    if (req.url === '/api/runs' && req.method === 'GET') return json(res, 200, runtime.listRuns(currentProject.id))
    if (req.url === '/api/runs' && req.method === 'POST') { const input = await body(req); const run = await runtime.execute(String(input.agent || 'orchestrator'), String(input.prompt || ''), actor, currentProject, approve); await saveRun(run); return json(res, 201, run) }
    if (req.url === '/api/chat' && req.method === 'POST') {
      const input = await body(req); const prompt = String(input.prompt || '').trim(); if (!prompt) return json(res, 400, { error: 'PROMPT_REQUIRED' })
      const model = String(input.model || process.env.NVIDIA_MODEL || 'meta/llama-3.1-8b-instruct')
      const attachments = Array.isArray(input.attachments) ? input.attachments : []
      for (const attachment of attachments) { if (typeof attachment?.name !== 'string' || typeof attachment?.content !== 'string') continue; const safeName = attachment.name.replace(/[^a-zA-Z0-9._-]/g, '_'); const { mkdir, writeFile } = await import('node:fs/promises'); await mkdir('.noteagents/uploads', { recursive: true }); await writeFile(`.noteagents/uploads/${safeName}`, attachment.content, 'utf8') }
      res.statusCode = 200; res.setHeader('content-type', 'text/event-stream'); res.setHeader('cache-control', 'no-cache'); res.setHeader('connection', 'keep-alive')
      try { let response = ''; await saveMessage(currentProject.id, 'user', prompt, model, attachments); for await (const token of streamChat(runtime, new NvidiaProvider(undefined, model), prompt, actor, currentProject, approve)) { response += token; res.write(`data: ${JSON.stringify({ token })}\\n\\n`) }; await saveMessage(currentProject.id, 'assistant', response, model); res.write('event: done\\ndata: {}\\n\\n'); res.end() } catch (error) { res.write(`event: error\\ndata: ${JSON.stringify({ error: error instanceof Error ? error.message : 'LLM_ERROR' })}\\n\\n`); res.end() }
      return
    }
    json(res, 404, { error: 'NOT_FOUND' })
  } catch (error) { json(res, 500, { error: error instanceof Error ? error.message : 'INTERNAL_ERROR' }) }
})

if (process.argv[1]?.endsWith('http-server.ts')) server.listen(Number(process.env.NOTEAGENTS_PORT || 8787), '127.0.0.1')
