import { spawn } from 'node:child_process'

export type NotebookSource = { title: string; url?: string; text?: string }

export class NotebookLmAdapter {
  constructor(private readonly command = process.env.NOTEBOOKLM_COMMAND || 'npx', private readonly args = ['notebooklm-mcp@latest']) {}
  async health() { return { configured: Boolean(process.env.NOTEBOOKLM_ENABLED === 'true'), command: this.command } }
  async start() {
    if (process.env.NOTEBOOKLM_ENABLED !== 'true') throw new Error('NotebookLM está desativado. Defina NOTEBOOKLM_ENABLED=true após autenticar sua conta Google.')
    const child = spawn(this.command, this.args, { stdio: 'inherit', shell: process.platform === 'win32' })
    return { pid: child.pid, transport: 'stdio' as const }
  }
}
