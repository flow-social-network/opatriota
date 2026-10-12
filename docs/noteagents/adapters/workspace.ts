import { readFile, writeFile, readdir } from 'node:fs/promises'
import { resolve, relative, dirname } from 'node:path'
import type { WorkspaceAdapter } from '../server/contracts'
export class LocalWorkspace implements WorkspaceAdapter {
  constructor(private readonly root: string) {}
  private path(name: string) { const file = resolve(this.root, name); if (relative(this.root, file).startsWith('..')) throw new Error('Caminho fora do workspace.'); return file }
  read(path: string) { return readFile(this.path(path), 'utf8') }
  async write(path: string, content: string) { const { mkdir } = await import('node:fs/promises'); await mkdir(dirname(this.path(path)), { recursive: true }); await writeFile(this.path(path), content) }
  async list(path = '.') { return (await readdir(this.path(path), { withFileTypes: true })).map(entry => `${path}/${entry.name}`) }
  async diff() { return '' }
}
