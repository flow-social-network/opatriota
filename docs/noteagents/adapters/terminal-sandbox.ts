import { spawn } from 'node:child_process'
import { resolve, relative } from 'node:path'
import type { AgentContext } from '../server/contracts'

const commands = new Set(['pnpm','npm','node','git','npx','tsc','vite','eslint'])
export async function runSandbox(command: string, args: string[], context: AgentContext, timeoutMs = 120_000) {
  if (!commands.has(command)) throw new Error(`Comando não permitido: ${command}`)
  if (!await context.approve(`Executar ${command} ${args.join(' ')}`)) throw new Error('EXECUTION_NOT_APPROVED')
  const cwd = resolve(context.project.root); const output: string[] = []
  return await new Promise<{ code: number | null; stdout: string; stderr: string }>((resolveResult, reject) => {
    const child = spawn(command, args, { cwd, shell: false, env: { PATH: process.env.PATH, NODE_ENV: 'development' }, stdio: ['ignore','pipe','pipe'] })
    const timer = setTimeout(() => { child.kill('SIGTERM'); reject(new Error('SANDBOX_TIMEOUT')) }, timeoutMs)
    child.stdout.on('data', data => output.push(String(data))); child.stderr.on('data', data => output.push(String(data)))
    child.on('error', reject); child.on('close', code => { clearTimeout(timer); resolveResult({ code, stdout: output.join(''), stderr: '' }) })
  })
}

export function assertWorkspacePath(root: string, target: string) { const resolved = resolve(root, target); const rel = relative(resolve(root), resolved); if (rel.startsWith('..') || rel.includes('..' + require('node:path').sep)) throw new Error('WORKSPACE_ESCAPE'); return resolved }

export const sandboxStatus = () => ({ mode: 'process-isolated', shell: false, allowlist: [...commands], network: 'inherited', note: 'Para isolamento forte, executar o runner em container/VM dedicado.' })
