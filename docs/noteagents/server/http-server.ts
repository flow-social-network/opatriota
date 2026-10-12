import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import type { Actor, Project } from './contracts'
import { NvidiaProvider } from '../integrations/nvidia'
import { streamChat } from './chat-service'
import { AgentRuntime } from './runtime'
import { createAgents } from '../agents/catalog'
import { createBuiltinTools } from '../tools/builtins'

const runtime = new AgentRuntime(); createAgents().forEach(runtime.registerAgent.bind(runtime)); createBuiltinTools().forEach(runtime.registerTool.bind(runtime))
const project: Project = { id: 'local', name: 'NoteAgents Workspace', root: process.cwd(), ownerId: 'local-owner', createdAt: new Date().toISOString() }
const actor: Actor = { id: 'local-owner', role: 'owner', projectId: project.id }
const approve = async (reason: string) => process.env.NOTEAGENTS_AUTO_APPROVE === 'true' && reason.length > 0
const json = (res: ServerResponse, status: number, data: unknown) => { res.statusCode = status; res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(data)) }
const body = async (req: IncomingMessage) => { let raw = ''; for await (const chunk of req) raw += chunk; return raw ? JSON.parse(raw) : {} }

export const server = createServer(async (req, res) => {
  try {
    if (req.url === '/health') return json(res, 200, { status: 'ok', service: 'noteagents' })
    if (req.url === '/api/agents' && req.method === 'GET') return json(res, 200, createAgents().map(agent => ({ name: agent.name, description: agent.description })))
    if (req.url === '/api/runs' && req.method === 'GET') return json(res, 200, runtime.listRuns(project.id))
    if (req.url === '/api/runs' && req.method === 'POST') { const input = await body(req); const run = await runtime.execute(String(input.agent || 'orchestrator'), String(input.prompt || ''), actor, project, async () => false); return json(res, 201, run) }
    if (req.url === '/api/chat' && req.method === 'POST') {
      const input = await body(req); const prompt = String(input.prompt || '').trim(); if (!prompt) return json(res, 400, { error: 'PROMPT_REQUIRED' })
      res.statusCode = 200; res.setHeader('content-type', 'text/event-stream'); res.setHeader('cache-control', 'no-cache'); res.setHeader('connection', 'keep-alive')
      try { for await (const token of streamChat(runtime, new NvidiaProvider(), prompt, actor, project, async () => false)) res.write(`data: ${JSON.stringify({ token })}\\n\\n`); res.write('event: done\\ndata: {}\\n\\n'); res.end() } catch (error) { res.write(`event: error\\ndata: ${JSON.stringify({ error: error instanceof Error ? error.message : 'LLM_ERROR' })}\\n\\n`); res.end() }
      return
    }
    json(res, 404, { error: 'NOT_FOUND' })
  } catch (error) { json(res, 500, { error: error instanceof Error ? error.message : 'INTERNAL_ERROR' }) }
})

if (process.argv[1]?.endsWith('http-server.ts')) server.listen(Number(process.env.NOTEAGENTS_PORT || 8787), '127.0.0.1')
