import { createTwoFilesPatch } from 'diff'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve, relative, dirname } from 'node:path'
import { mkdir } from 'node:fs/promises'

const root = process.cwd()
const safe = (file: string) => { const path = resolve(root, file); if (relative(root, path).startsWith('..')) throw new Error('WORKSPACE_PATH_FORBIDDEN'); return path }

export async function readEditorFile(file: string) { const path = safe(file); return { file, content: await readFile(path, 'utf8') } }
export async function previewEditorChange(file: string, content: string) { const current = await readEditorFile(file); return createTwoFilesPatch(file, file, current.content, content, '', '') }
export async function applyEditorChange(file: string, content: string, expectedContent?: string) { const path = safe(file); const current = await readFile(path, 'utf8').catch(() => ''); if (expectedContent !== undefined && current !== expectedContent) throw new Error('EDITOR_CONFLICT'); await mkdir(dirname(path), { recursive: true }); await writeFile(path, content, 'utf8'); return { file, bytes: Buffer.byteLength(content), diff: createTwoFilesPatch(file, file, current, content, '', '') } }
