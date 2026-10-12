import { useEffect, useRef, useState } from 'react'
import { Paperclip, Send, Settings2, Sparkles, X } from 'lucide-react'
import type { FormEvent } from 'react'

type Model = { id: string; name: string; family: string; context: string; free: boolean }
type Message = { role: 'user' | 'assistant'; content: string; files?: string[] }
type Config = { model?: string; endpoint?: string; configured?: boolean }

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
  const [config, setConfig] = useState<Config>({})
  const [apiKey, setApiKey] = useState('')
  const [endpoint, setEndpoint] = useState('https://integrate.api.nvidia.com/v1')
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: 'Olá. Sou o NoteAgents. Posso criar, editar, testar e publicar seu projeto localmente. Como posso ajudar?' }])
  const [prompt, setPrompt] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [busy, setBusy] = useState(false)
  const [settings, setSettings] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    Promise.all([fetch('/api/models').then(response => response.ok ? response.json() : null), fetch('/api/config').then(response => response.ok ? response.json() : null)])
      .then(([modelData, configData]) => { if (modelData?.models) setModels(modelData.models); if (configData) { setConfig(configData); if (configData.model) setModel(configData.model); if (configData.endpoint) setEndpoint(configData.endpoint) } }).catch(() => undefined)
  }, [])

  async function saveSettings(event: FormEvent) {
    event.preventDefault(); setSaving(true); setSaved('')
    try { const response = await fetch('/api/config', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ model, endpoint, apiKey }) }); if (!response.ok) throw new Error('Não foi possível salvar a configuração.'); const data = await response.json(); setConfig(data); setApiKey(''); setSaved('Configuração salva com segurança no computador.') } catch (error) { setSaved(error instanceof Error ? error.message : 'Erro ao salvar.') } finally { setSaving(false) }
  }

  async function send(event: FormEvent) {
    event.preventDefault(); const text = prompt.trim(); if (!text || busy) return
    const names = files.map(file => file.name); const attachments = await Promise.all(files.map(async file => ({ name: file.name, content: await file.text() }))); setPrompt(''); setFiles([]); setMessages(current => [...current, { role: 'user', content: text, files: names }, { role: 'assistant', content: '' }]); setBusy(true)
    try { const response = await fetch('/api/chat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ prompt: text, model, attachments }) }); if (!response.ok || !response.body) throw new Error('Não foi possível iniciar o chat local.'); const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = ''; while (true) { const result = await reader.read(); if (result.done) break; buffer += decoder.decode(result.value, { stream: true }); const chunks = buffer.split('\n\n'); buffer = chunks.pop() || ''; for (const chunk of chunks) { const line = chunk.split('\n').find(value => value.startsWith('data: ')); if (!line) continue; const data = JSON.parse(line.slice(6)); if (data.token) setMessages(current => current.map((message, index) => index === current.length - 1 ? { ...message, content: message.content + data.token } : message)) } } } catch (error) { setMessages(current => current.map((message, index) => index === current.length - 1 ? { ...message, content: error instanceof Error ? error.message : 'Erro no chat.' } : message)) } finally { setBusy(false) }
  }

  return <main className="noteagents-shell"><aside className="noteagents-sidebar"><div className="noteagents-brand"><span className="noteagents-mark"><Sparkles size={16} /></span><strong>NoteAgents</strong></div><button className="new-chat" onClick={() => setMessages([])}>+ Novo chat</button><div className="sidebar-section"><small>PROJETO LOCAL</small><p>Workspace conectado</p><span>localhost</span></div><div className="sidebar-bottom"><button onClick={() => setSettings(true)}><Settings2 size={16} /> Configurações</button></div></aside><section className="noteagents-main"><header className="noteagents-header"><div><small>CHAT DE DESENVOLVIMENTO</small><h1>Construa com agentes</h1></div><label className="model-picker"><span>Modelo</span><select value={model} onChange={event => setModel(event.target.value)}>{models.filter(item => item.free).map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label></header><div className="messages">{messages.map((message, index) => <article className={`message ${message.role}`} key={`${message.role}-${index}`}><div className="avatar">{message.role === 'assistant' ? <Sparkles size={15} /> : 'Você'}</div><div><p>{message.content || 'Pensando...'}</p>{message.files?.map(file => <small className="file-chip" key={file}><Paperclip size={12} /> {file}</small>)}</div></article>)}</div><form className="composer" onSubmit={send}><input ref={inputRef} value={prompt} onChange={event => setPrompt(event.target.value)} placeholder="Descreva o que você quer construir..." aria-label="Mensagem para o NoteAgents"/><input type="file" multiple hidden id="noteagents-files" onChange={event => setFiles(Array.from(event.target.files || []))}/><label htmlFor="noteagents-files" className="icon-button" title="Anexar arquivos"><Paperclip size={18} /></label><button className="send-button" disabled={busy || !prompt.trim()} aria-label="Enviar mensagem"><Send size={17} /></button></form>{files.length > 0 && <div className="pending-files">{files.map(file => <span key={file.name}><Paperclip size={12} /> {file.name}</span>)}</div>}{settings && <div className="settings-overlay" role="presentation" onMouseDown={event => event.target === event.currentTarget && setSettings(false)}><form className="settings-panel" onSubmit={saveSettings}><div className="settings-title"><div><small>CONFIGURAÇÃO LOCAL</small><h2>Modelos e conexão</h2></div><button type="button" className="close-button" onClick={() => setSettings(false)} aria-label="Fechar configurações"><X size={18} /></button></div><p className="settings-help">Como no editor do GitHub, configure manualmente o modelo, endpoint e a chave. A chave fica no servidor local e nunca é exibida novamente.</p><label>Modelo<select value={model} onChange={event => setModel(event.target.value)}>{models.filter(item => item.free).map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label>Endpoint compatível com OpenAI<input value={endpoint} onChange={event => setEndpoint(event.target.value)} placeholder="https://integrate.api.nvidia.com/v1" /></label><label>Chave API NVIDIA<input type="password" value={apiKey} onChange={event => setApiKey(event.target.value)} placeholder={config.configured ? 'Chave já configurada (digite para substituir)' : 'Cole sua chave NVIDIA'} autoComplete="new-password" /></label><div className="settings-status"><span className={config.configured ? 'status-dot ready' : 'status-dot'} /> {config.configured ? 'Chave configurada no servidor local' : 'Chave ainda não configurada'}</div><button className="save-settings" disabled={saving}>{saving ? 'Salvando...' : 'Salvar configuração'}</button>{saved && <p className="save-feedback" role="status">{saved}</p>}</form></div>}</section></main>
}
