import type { AgentEvent } from './contracts'

type Listener = (event: AgentEvent) => void

export class EventBus {
  private readonly listeners = new Set<Listener>()
  subscribe(listener: Listener) { this.listeners.add(listener); return () => this.listeners.delete(listener) }
  publish(event: AgentEvent) { for (const listener of this.listeners) listener(event) }
}
