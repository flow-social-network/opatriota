import { spawn } from 'node:child_process'
export interface SandboxOptions { cwd: string; command: string; args?: string[]; timeoutMs?: number }
export function runSandbox(options: SandboxOptions) {
  return new Promise<{ code: number | null; stdout: string; stderr: string }>((resolveResult, reject) => { const child = spawn(options.command, options.args || [], { cwd: options.cwd, shell: false, env: { PATH: process.env.PATH, NODE_ENV: 'development' } }); let stdout = ''; let stderr = ''; const timer = setTimeout(() => { child.kill('SIGKILL'); reject(new Error('Sandbox excedeu o tempo limite.')) }, options.timeoutMs || 120_000); child.stdout.on('data', data => { stdout += data }); child.stderr.on('data', data => { stderr += data }); child.on('error', reject); child.on('close', code => { clearTimeout(timer); resolveResult({ code, stdout, stderr }) }) })
}
