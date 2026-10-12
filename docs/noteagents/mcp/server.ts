import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { readFile } from 'node:fs/promises'
import { resolve, relative } from 'node:path'
import { chromium } from 'playwright'

const workspace = resolve(process.env.NOTEAGENTS_WORKSPACE ?? process.cwd())
export const createMcpServer = () => {
const server = new McpServer({ name: 'noteagents', version: '1.0.0' })
const safePath = (value: string) => { const target = resolve(workspace, value); if (relative(workspace, target).startsWith('..')) throw new Error('PATH_OUTSIDE_WORKSPACE'); return target }

server.registerResource('workspace-file', 'workspace:///{path}', { description: 'Arquivo somente leitura do workspace' }, async (uri) => {
  const path = decodeURIComponent(uri.pathname).replace(/^\//, '')
  return { contents: [{ uri: uri.href, mimeType: 'text/plain', text: await readFile(safePath(path), 'utf8') }] }
})
server.registerTool('workspace_list', { description: 'Lista arquivos do workspace', inputSchema: { path: z.string().default('.') } }, async ({ path }) => { const items = await (await import('node:fs/promises')).readdir(safePath(path), { withFileTypes: true }); return { content: [{ type: 'text', text: items.map(item => `${item.isDirectory() ? 'dir' : 'file'} ${item.name}`).join('\n') }] } })
server.registerTool('browser_open', { description: 'Abre uma URL no navegador Playwright', inputSchema: { url: z.string().url() } }, async ({ url }) => { const browser = await chromium.launch({ headless: true }); const page = await browser.newPage(); await page.goto(url, { waitUntil: 'domcontentloaded' }); const title = await page.title(); const text = (await page.locator('body').innerText()).slice(0, 4000); await browser.close(); return { content: [{ type: 'text', text: JSON.stringify({ url, title, text }) }] } })
server.registerTool('browser_screenshot', { description: 'Captura screenshot de uma URL', inputSchema: { url: z.string().url(), path: z.string().default('/tmp/noteagents.png') } }, async ({ url, path }) => { const browser = await chromium.launch({ headless: true }); const page = await browser.newPage({ viewport: { width: 1440, height: 900 } }); await page.goto(url, { waitUntil: 'networkidle' }); await page.screenshot({ path, fullPage: true }); await browser.close(); return { content: [{ type: 'text', text: `Screenshot salvo em ${path}` }] } })
server.registerPrompt('implement', { description: 'Prompt padrão de implementação segura', argsSchema: { request: z.string() } }, ({ request }) => ({ messages: [{ role: 'user', content: { type: 'text', text: `Inspecione o workspace, implemente com mudanças mínimas, valide com LSP, testes e Playwright. Pedido: ${request}` } }] }))

return server
}

if (process.env.NOTEAGENTS_MCP_MODE !== 'http') {
  const server = createMcpServer()
  await server.connect(new StdioServerTransport())
}
