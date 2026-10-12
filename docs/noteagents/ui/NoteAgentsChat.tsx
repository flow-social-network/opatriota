import { useEffect, useRef, useState } from 'react'
import { Paperclip, Send, Settings2, Sparkles, X } from 'lucide-react'
import type { FormEvent } from 'react'

type Model = { id: string; name: string; family: string; context: string; free: boolean }
type Message = { role: 'user' | 'assistant'; content: string; files?: string[] }

const fallbackModels: Model[] = [
  { id: 'meta/llama-3.1-8b-instruct', name: 'Llama 3.1 8B Instruct', family: 'Llama', context: '128k', free: true },
  { id: 'meta/llama-3.1-70b-instruct', name: 'Llama 3.1 70B Instruct', family: 'Llama', context: '128k', free: true },
  { id: 'mistralai/mistral-7b-instruct-v0.3', name: 'Mistral 7B Instruct', family: 'Mistral', context: '32k', free: true },
  { id: 'google/gemma-2-9b-it', name: 'Gemma 2 9B IT', family: 'Gemma', context: '8k', free: true },
  { id: 'qwen/qwen2.5-72b-instruct', name: 'Qwen 2.5 72B Instruct', family: 'Qwen', context: '128k', free: true },
]

export default function NoteAgentsChat() {
  const [models, setModels] = useState<Model[]>(fallbackModels)
  const [model, setModel] = useState(fallbackModels[0].id)
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: 'Olá. Sou o NoteAgents. Posso criar, editar, testar e publicar seu projeto localmente. Como posso ajudar?' }])
  const [prompt, setPrompt] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [busy, setBusy] = useState(false)
  const [settings, setSettings] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { fetch('/api/models').then(r => r.ok ? r.json() : null).then(data => data?.models && setModels(data.models)).catch(() => undefined) }, [])

  async function send(event: FormEvent) {
    event.preventDefault(); const text = prompt.trim(); if (!text || busy) return
    const names = files.map(file => file.name); const attachments = await Promise.all(files.map(async file => ({ name: file.name, content: await file.text() }))); setPrompt(''); setFiles([]); setMessages(current => [...current, { role: 'user', content: text, files: names }, { role: 'assistant', content: '' }]); setBusy(true)
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ prompt: text, model, attachments }) })
      if (!response.ok || !response.body) throw new Error('Não foi possível iniciar o chat local.')
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = ''
      while (true) { const result = await reader.read(); if (result.done) break; buffer += decoder.decode(result.value, { stream: true }); const chunks = buffer.split('\n\n'); buffer = chunks.pop() || ''; for (const chunk of chunks) { const line = chunk.split('\n').find(value => value.startsWith('data: ')); if (!line) continue; const data = JSON.parse(line.slice(6)); if (data.token) setMessages(current => current.map((message, index) => index === current.length - 1 ? { ...message, content: message.content + data.token } : message)) } }
    } catch (error) { setMessages(current => current.map((message, index) => index === current.length - 1 ? { ...message, content: error instanceof Error ? error.message : 'Erro no chat.' } : message)) } finally { setBusy(false) }
  }

  return <main className="noteagents-shell"><aside className="noteagents-sidebar"><div className="noteagents-brand"><span className="noteagents-mark"><Sparkles size={16} /></span><strong>NoteAgents</strong></div><button className="new-chat" onClick={() => setMessages([])}>+ Novo chat</button><div className="sidebar-section"><small>PROJETO LOCAL</small><p>Workspace conectado</p><span>localhost</span></div><div className="sidebar-bottom"><button onClick={() => setSettings(value => !value)}><Settings2 size={16} /> Configurações</button></div></aside><section className="noteagents-main"><header className="noteagents-header"><div><small>CHAT DE DESENVOLVIMENTO</small><h1>Construa com agentes</h1></div><label className="model-picker"><span>Modelo</span><select value={model} onChange={event => setModel(event.target.value)}>{models.filter(item => item.free).map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label></header><div className="messages">{messages.map((message, index) => <article className={`message ${message.role}`} key={`${message.role}-${index}`}><div className="avatar">{message.role === 'assistant' ? <Sparkles size={15} /> : 'Você'}</div><div><p>{message.content || 'Pensando...'}</p>{message.files?.map(file => <small className="file-chip" key={file}><Paperclip size={12} /> {file}</small>)}</div></article>)}</div><form className="composer" onSubmit={send}><input ref={inputRef} value={prompt} onChange={event => setPrompt(event.target.value)} placeholder="Descreva o que você quer construir..." aria-label="Mensagem para o NoteAgents"/><input type="file" multiple hidden id="noteagents-files" onChange={event => setFiles(Array.from(event.target.files || []))}/><label htmlFor="noteagents-files" className="icon-button" title="Anexar arquivos"><Paperclip size={18} /></label><button className="send-button" disabled={busy || !prompt.trim()} aria-label="Enviar mensagem"><Send size={17} /></button></form>{files.length > 0 && <div className="pending-files">{files.map(file => <span key={file.name}>{file.name}<button type="button" onClick={() => setFiles(current => current.filter(item => item !== file))}><X size={12} /></button></span>)}</div>}{settings && <div className="settings-card"><strong>Configuração local</strong><p>Defina NVIDIA_API_KEY ou API_KEY no arquivo `.env.local` da sua máquina. A chave nunca é exibida no navegador.</p></div>}</section></main>
}
