'use client'

import { useRef, useState } from 'react'
import { ArrowUp, Bot, Check, ChevronDown, Copy, FilePlus2, Globe2, ImagePlus, Loader2, MoreHorizontal, Paperclip, Plus, RefreshCw, Share2, Square, Wrench, X } from 'lucide-react'

type ChatMessage = { id: string; role: 'user' | 'assistant'; content: string; createdAt: string }
type Attachment = { id: string; name: string; type: string; size: number; url: string }

const unavailableTools = [
  { label: 'Pesquisa aprofundada', icon: Globe2 },
  { label: 'Busca na web', icon: Globe2 },
  { label: 'MCP', icon: Wrench },
]

function renderMessage(content: string) {
  return content.split(/\n\n+/).map((paragraph, index) => {
    const code = paragraph.match(/^```(\w*)\n([\s\S]*?)```$/)
    if (code) return <pre className="chat-code" key={index}><code>{code[2]}</code><button type="button" aria-label="Copiar código" onClick={() => navigator.clipboard.writeText(code[2])}><Copy size={13} /></button></pre>
    return <p key={index}>{paragraph.split(/(`[^`]+`)/).map((part, partIndex) => part.startsWith('`') ? <code key={partIndex}>{part.slice(1, -1)}</code> : part)}</p>
  })
}

export function ChatPanel() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function addFiles(files: FileList | null) {
    if (!files) return
    const next = Array.from(files).map((file) => ({ id: crypto.randomUUID(), name: file.name, type: file.type || 'arquivo', size: file.size, url: URL.createObjectURL(file) }))
    setAttachments((current) => [...current, ...next].slice(0, 5))
    setMenuOpen(false)
  }

  async function submit(event?: React.FormEvent<HTMLFormElement>, retryContent?: string) {
    event?.preventDefault()
    const content = (retryContent ?? input).trim()
    if (!content || loading) return
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content, createdAt: new Date().toISOString() }
    const nextMessages = retryContent ? messages : [...messages, userMessage]
    if (!retryContent) { setMessages(nextMessages); setInput(''); setAttachments([]) }
    setError(''); setLoading(true)
    const controller = new AbortController(); abortRef.current = controller
    try {
      const response = await fetch('/api/v1/ai/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: controller.signal, body: JSON.stringify({ conversationId: 'default', messages: nextMessages.map(({ role, content: text }) => ({ role, content: text })) }) })
      const result = await response.json() as { success: boolean; data?: { message: { content: string } }; error?: { message?: string } }
      if (!response.ok || !result.success || !result.data) throw new Error(result.error?.message || 'Não foi possível concluir a solicitação.')
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: 'assistant', content: result.data!.message.content, createdAt: new Date().toISOString() }])
    } catch (submitError) {
      if (submitError instanceof DOMException && submitError.name === 'AbortError') return
      setError(submitError instanceof Error ? submitError.message : 'Não foi possível concluir a solicitação.')
    } finally { setLoading(false); abortRef.current = null }
  }

  function stop() { abortRef.current?.abort(); setLoading(false) }
  async function copyMessage(message: ChatMessage) { await navigator.clipboard.writeText(message.content); setCopiedId(message.id); window.setTimeout(() => setCopiedId(null), 1600) }
  async function shareMessage(message: ChatMessage) { if (navigator.share) await navigator.share({ title: 'NoteAgents AI', text: message.content }); else await copyMessage(message) }

  return <section className="chat-panel" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); addFiles(event.dataTransfer.files) }}>
    <header className="chat-header"><div className="chat-title"><span><Bot size={17} /></span><div><b>NoteAgents AI</b><small>Conversa no projeto atual</small></div></div><div className="chat-header-actions"><span className="chat-model"><span className="model-dot" /> NVIDIA <ChevronDown size={13} /></span><span className={`status-pill ${loading ? 'processing' : ''}`}>{loading ? 'Processando' : 'Online'}</span></div></header>
    <div className="chat-messages" aria-live="polite">
      {messages.length === 0 && <div className="chat-empty"><div className="chat-empty-icon"><Bot size={28} /></div><b>Como posso ajudar?</b><span>Descreva uma tarefa, decisão de arquitetura ou problema de código.</span><div className="chat-suggestions"><button type="button" onClick={() => setInput('Analise a arquitetura deste projeto')}>Analisar arquitetura</button><button type="button" onClick={() => setInput('Ajude-me a corrigir um erro')}>Corrigir um erro</button></div></div>}
      {messages.map((message, index) => <article className={`chat-message ${message.role}`} key={message.id}><div className="chat-message-head"><span className="chat-role">{message.role === 'user' ? 'Você' : 'NoteAgents AI'}</span><time>{new Date(message.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</time>{message.role === 'assistant' && <div className="chat-message-actions"><button type="button" aria-label="Copiar resposta" onClick={() => copyMessage(message)}>{copiedId === message.id ? <Check size={13} /> : <Copy size={13} />}</button><button type="button" aria-label="Compartilhar resposta" onClick={() => shareMessage(message)}><Share2 size={13} /></button><button type="button" aria-label="Tentar novamente" onClick={() => submit(undefined, messages[index - 1]?.content)}><RefreshCw size={13} /></button><button type="button" aria-label="Mais opções"><MoreHorizontal size={13} /></button></div>}</div><div className="chat-message-content">{message.role === 'assistant' ? renderMessage(message.content) : <p>{message.content}</p>}</div></article>)}
      {loading && <div className="chat-message assistant"><Loader2 className="spin" size={15} /><span>Processando sua solicitação...</span></div>}
      {error && <div className="chat-error"><span>{error}</span><button type="button" onClick={() => setError('')}><X size={13} /></button></div>}
    </div>
    <form className="chat-composer" onSubmit={submit}><div className="chat-attachments">{attachments.map((attachment) => <div className="chat-attachment" key={attachment.id}>{attachment.type.startsWith('image/') ? <img src={attachment.url} alt="" /> : <FilePlus2 size={14} />}<span>{attachment.name}</span><button type="button" aria-label={`Remover ${attachment.name}`} onClick={() => setAttachments((current) => current.filter((item) => item.id !== attachment.id))}><X size={12} /></button></div>)}</div><div className="chat-input-row"><div className="chat-add-wrap"><button type="button" className="chat-tool-button" aria-label="Adicionar conteúdo" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><Plus size={18} /></button>{menuOpen && <div className="chat-tools-menu"><b>Adicionar</b><button type="button" onClick={() => fileRef.current?.click()}><Paperclip size={15} /> Fotos e arquivos</button><button type="button" onClick={() => setMenuOpen(false)}><FilePlus2 size={15} /> Fontes do projeto <small>Em implementação</small></button><b>Ferramentas</b>{unavailableTools.map(({ label, icon: Icon }) => <button type="button" key={label} onClick={() => setMenuOpen(false)}><Icon size={15} /> {label} <small>Em implementação</small></button>)}</div>}</div><textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); void submit() } }} onPaste={(event) => { const image = Array.from(event.clipboardData.files).find((file) => file.type.startsWith('image/')); if (image) addFiles({ 0: image, length: 1, item: () => image } as unknown as FileList) }} placeholder="Escreva sua mensagem..." rows={1} aria-label="Mensagem" /><div className="chat-composer-actions"><button type="button" className="chat-tool-button" aria-label="Adicionar imagem" onClick={() => fileRef.current?.click()}><ImagePlus size={16} /></button>{loading ? <button type="button" className="chat-send-button stop" aria-label="Cancelar geração" onClick={stop}><Square size={13} /></button> : <button type="submit" className="chat-send-button" aria-label="Enviar mensagem" disabled={!input.trim()}><ArrowUp size={17} /></button>}</div></div><span className="chat-hint">Enter envia · Shift + Enter adiciona uma linha · arraste arquivos para anexar</span><input ref={fileRef} hidden type="file" multiple accept="image/*,.pdf,.txt,.md,.json,.yaml,.yml,.csv,.ts,.tsx,.js,.jsx,.py" onChange={(event) => addFiles(event.target.files)} /></form>
  </section>
}
