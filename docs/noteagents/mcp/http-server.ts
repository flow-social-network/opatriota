import { createServer } from 'node:http'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { createMcpServer } from './server'

const mcp = createMcpServer()
const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined })
await mcp.connect(transport)

const port = Number(process.env.NOTEAGENTS_MCP_PORT ?? 8792)
createServer(async (req, res) => {
  if (req.url !== '/mcp') { res.statusCode = 404; res.end('Not Found'); return }
  await transport.handleRequest(req, res)
}).listen(port, '127.0.0.1', () => console.error(`NoteAgents MCP HTTP em http://127.0.0.1:${port}/mcp`))
