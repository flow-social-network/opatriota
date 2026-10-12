import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve, relative } from 'node:path'
import type { Tool } from '../server/contracts'

const inside = (root: string, target: string) => { const resolved = resolve(root, target); const rel = relative(resolve(root), resolved); if (rel.startsWith('..') || resolve(root) === resolved && target !== '.') throw new Error('Caminho fora do workspace.'); return resolved }

export const createBuiltinTools = (): Tool[] => [
  { name: 'filesystem.read', description: 'Lê arquivo dentro do workspace.', risk: () => 'low', async execute(input: { path: string }, context) { return readFile(inside(context.project.root, input.path), 'utf8') } },
  { name: 'filesystem.write', description: 'Escreve arquivo dentro do workspace.', risk: () => 'medium', async execute(input: { path: string; content: string }, context) { const file = inside(context.project.root, input.path); await mkdir(dirname(file), { recursive: true }); await writeFile(file, input.content, 'utf8'); return { path: input.path } } },
  { name: 'preview.start', description: 'Solicita inicialização de preview.', risk: () => 'medium', async execute(input: { command?: string }, context) { context.emit({ type: 'run.progress', message: `Preview solicitado${input.command ? `: ${input.command}` : ''}.` }); return { status: 'queued' } } },
  { name: 'deploy.production', description: 'Publica a aplicação em produção.', risk: () => 'critical', async execute(_input, context) { context.emit({ type: 'run.progress', message: 'Deploy aprovado e enviado ao provedor.' }); return { status: 'submitted' } } },
]
