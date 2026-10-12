import { chmod, mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const configPath = resolve(process.env.NOTEAGENTS_CONFIG_PATH || '.noteagents/config.json')
type LocalConfig = { provider: 'NVIDIA NIM'; model?: string; endpoint?: string; apiKey?: string }

export async function readLocalConfig() {
  try { return JSON.parse(await readFile(configPath, 'utf8')) as LocalConfig } catch { return {} as LocalConfig }
}

export async function saveLocalConfig(input: Partial<LocalConfig>) {
  const current = await readLocalConfig()
  const next: LocalConfig = { ...current, ...input, provider: 'NVIDIA NIM' }
  await mkdir(dirname(configPath), { recursive: true })
  await writeFile(configPath, JSON.stringify(next, null, 2), { mode: 0o600 })
  await chmod(configPath, 0o600)
  if (next.apiKey) process.env.API_KEY = next.apiKey
  if (next.model) process.env.NVIDIA_MODEL = next.model
  if (next.endpoint) process.env.NVIDIA_BASE_URL = next.endpoint
  return { provider: next.provider, model: next.model, endpoint: next.endpoint, configured: Boolean(next.apiKey || process.env.API_KEY || process.env.NVIDIA_API_KEY) }
}

export async function publicLocalConfig() {
  const config = await readLocalConfig()
  return { provider: config.provider || 'NVIDIA NIM', model: config.model || process.env.NVIDIA_MODEL, endpoint: config.endpoint || process.env.NVIDIA_BASE_URL, configured: Boolean(config.apiKey || process.env.API_KEY || process.env.NVIDIA_API_KEY) }
}

void readLocalConfig().then(config => { if (config.apiKey) process.env.API_KEY = config.apiKey; if (config.model) process.env.NVIDIA_MODEL = config.model; if (config.endpoint) process.env.NVIDIA_BASE_URL = config.endpoint })
