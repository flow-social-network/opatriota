import { mkdir, appendFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'

export class KnowledgeVault {
  constructor(private readonly root = process.env.NOTEAGENTS_VAULT || join(process.cwd(), '.noteagents', 'vault')) {}
  async record(title: string, content: string) {
    const safe = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'nota'
    await mkdir(this.root, { recursive: true })
    await appendFile(join(this.root, `${safe}.md`), `\n\n## ${new Date().toISOString()}\n\n${content}\n`, 'utf8')
    return join(this.root, `${safe}.md`)
  }
  async list() { await mkdir(this.root, { recursive: true }); return readdir(this.root) }
}
