import { spawn, type ChildProcess } from 'node:child_process'

export class PreviewManager {
  private process?: ChildProcess
  private port?: number
  start(command = 'pnpm dev', port = 3000) { if (this.process) return { port, running: true }; this.port = port; this.process = spawn('/bin/sh', ['-lc', command], { env: { ...process.env, PORT: String(port), BROWSER: 'none' }, stdio: 'pipe' }); this.process.on('exit', () => { this.process = undefined }); return { port, running: true, url: `http://127.0.0.1:${port}` } }
  stop() { this.process?.kill('SIGTERM'); this.process = undefined; return { stopped: true } }
  status() { return { running: Boolean(this.process), port: this.port, url: this.port ? `http://127.0.0.1:${this.port}` : undefined } }
}
export const previewManager = new PreviewManager()
