import { spawn } from 'node:child_process'
import { URI } from 'vscode-uri'
import { TextDocument } from 'vscode-languageserver-textdocument'
import type { Diagnostic } from 'vscode-languageserver-types'

export type LspDiagnostic = Pick<Diagnostic, 'message' | 'severity' | 'range' | 'source'>
export class LspAdapter {
  async diagnostics(filePath: string, languageId = 'typescript'): Promise<LspDiagnostic[]> {
    const uri = URI.file(filePath).toString(); const text = TextDocument.create(uri, languageId, 1, await (await import('node:fs/promises')).readFile(filePath, 'utf8'))
    const diagnostics: LspDiagnostic[] = []
    if (languageId === 'json') { try { JSON.parse(text.getText()) } catch (error) { diagnostics.push({ message: error instanceof Error ? error.message : 'JSON inválido', severity: 1, source: 'noteagents', range: { start: { line: 0, character: 0 }, end: { line: 0, character: 1 } } }) } }
    return diagnostics
  }
  async typecheck(workspace: string) { return new Promise<{ code: number; output: string }>((resolve) => { const child = spawn('pnpm', ['exec', 'tsc', '--noEmit'], { cwd: workspace, shell: false }); let output = ''; child.stdout.on('data', chunk => { output += chunk }); child.stderr.on('data', chunk => { output += chunk }); child.on('close', code => resolve({ code: code ?? 1, output })) }) }
}
