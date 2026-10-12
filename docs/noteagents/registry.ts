import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

export type ImportedCapability = { id: string; source: string; kind: 'agent' | 'skill' | 'command' | 'memory' | 'mcp'; path: string; requiresApproval: boolean }

const roots = [
  ['everything-claude-code', 'agents', 'agent'], ['everything-claude-code', 'skills', 'skill'], ['everything-claude-code', 'commands', 'command'],
  ['claude-settings', 'agents', 'agent'], ['claude-settings', 'skills', 'skill'], ['obsidian-mind', '.claude/agents', 'agent'], ['obsidian-mind', '.claude/skills', 'skill'],
  ['agentsys', 'meta/skills', 'skill'], ['notebooklm-mcp', 'src', 'mcp'], ['awesome-claude-skills', '.', 'skill'],
  ['noteagents-reference', 'agents', 'agent'], ['noteagents-reference', 'apps', 'command'], ['awesome-claude-code', 'resources', 'command'],
] as const

export async function discoverImportedCapabilities(importRoot = join(process.cwd(), 'docs/noteagents/imports')): Promise<ImportedCapability[]> {
  const result: ImportedCapability[] = []
  for (const [source, folder, kind] of roots) {
    const absolute = join(importRoot, source, folder)
    let entries: string[]
    try { entries = await readdir(absolute) } catch { continue }
    for (const entry of entries) {
      if (entry.startsWith('.') || entry === 'node_modules') continue
      result.push({ id: `${source}:${folder}:${entry}`, source, kind, path: join(absolute, entry), requiresApproval: kind === 'mcp' || kind === 'command' })
    }
  }
  return result
}

export async function readCapability(capability: ImportedCapability) {
  const index = capability.kind === 'skill' || capability.kind === 'agent' ? join(capability.path, 'SKILL.md') : capability.path
  return readFile(index, 'utf8').catch(() => readFile(capability.path, 'utf8'))
}
