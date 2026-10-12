import { spawn } from 'node:child_process'
import { resolve, relative } from 'node:path'

export interface CommandResult { command: string; cwd: string; exitCode: number | null; stdout: string; stderr: string; timedOut: boolean }

export class TerminalSandbox {
  constructor(private readonly root = process.cwd()) {}

  private cwd(path = '.') {
    const resolved = resolve(this.root, path)
    if (relative(this.root, resolved).startsWith('..')) throw new Error('WORKSPACE_PATH_FORBIDDEN')
    return resolved
  }

  run(command: string, options: { cwd?: string; timeoutMs?: number; env?: Record<string, string> } = {}) {
    if (!command.trim()) throw new Error('COMMAND_REQUIRED')
    const cwd = this.cwd(options.cwd)
    const timeoutMs = Math.min(Math.max(options.timeoutMs ?? 30_000, 100), 120_000)
    return new Promise<CommandResult>((resolveResult, reject) => {
      const child = spawn('/bin/sh', ['-lc', command], { cwd, env: { PATH: process.env.PATH, HOME: process.env.HOME, ...options.env }, stdio: ['ignore', 'pipe', 'pipe'] })
      let stdout = ''; let stderr = ''; let timedOut = false
      child.stdout.on('data', chunk => { stdout += chunk.toString(); if (stdout.length > 1_000_000) child.kill('SIGKILL') })
      child.stderr.on('data', chunk => { stderr += chunk.toString(); if (stderr.length > 1_000_000) child.kill('SIGKILL') })
      const timer = setTimeout(() => { timedOut = true; child.kill('SIGTERM'); setTimeout(() => child.kill('SIGKILL'), 500) }, timeoutMs)
      child.on('error', reject)
      child.on('close', exitCode => { clearTimeout(timer); resolveResult({ command, cwd, exitCode, stdout, stderr, timedOut }) })
    })
  }
}

export const terminalSandbox = new TerminalSandbox()
export default terminalSandbox
