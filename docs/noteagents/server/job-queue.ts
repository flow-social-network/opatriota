import { id, now } from './contracts'
import type { AgentRuntime } from './runtime'
import type { Actor, Project } from './contracts'

export interface Job { id: string; agent: string; prompt: string; status: 'queued' | 'running' | 'completed' | 'failed'; createdAt: string }
export class JobQueue {
  private readonly jobs = new Map<string, Job>()
  async enqueue(runtime: AgentRuntime, agent: string, prompt: string, actor: Actor, project: Project) {
    const job: Job = { id: id('job'), agent, prompt, status: 'queued', createdAt: now() }; this.jobs.set(job.id, job)
    void runtime.execute(agent, prompt, actor, project, async () => false).then(() => { job.status = 'completed' }).catch(() => { job.status = 'failed' })
    return job
  }
  get(jobId: string) { return this.jobs.get(jobId) }
}
