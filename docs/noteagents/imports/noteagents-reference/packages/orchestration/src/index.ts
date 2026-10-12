import { Result, type Success, type Failure } from "@noteagents/types";
import { loadAgents, type OutputContract, type AgentDefinition } from "@noteagents/agents";
import { NvidiaProvider, type CompletionRequest, type CompletionResponse, type ProviderError, type LLMProvider } from "@noteagents/providers";
import { EvidenceRecord, type ReadinessScore, type OrchestratorConfig } from "@noteagents/types";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { AbortController } from "crypto";
import { registerProvider, getProvider, listRegisteredProviders } from "@noteagents/providers";

const DEFAULT_CONFIG: OrchestratorConfig = {
  maxAttempts: 3,
  timeoutMs: 30000,
  parallelExecution: false,
  autoApprove: false,
  dryRun: true,
};

const CACHE_DIR = ".noteagents/cache";
const FAILURES_DIR = ".noteagents/failures";
const LOCK_DIR = ".noteagents/locks";

export interface ExecutionPlan {
  agent: string;
  task: string;
  dryRun: boolean;
}

export interface ExecutionResult {
  success: boolean;
  agent: string;
  task: string;
  status: "planned" | "executed" | "failed" | "cached";
  evidence?: EvidenceRecord;
  durationMs: number;
  error?: ProviderError;
}

export class AgentRuntime {
  private provider: LLMProvider;
  private config: OrchestratorConfig;
  private executionHistory: Map<string, ExecutionResult>;

  constructor(config: Partial<OrchestratorConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.executionHistory = new Map();

    // Initialize provider
    const apiKey = process.env.NVIDIA_API_KEY || "";
    const model = process.env.NOTEAGENTS_MODEL || "";
    this.provider = new NvidiaProvider(apiKey, model);

    // Ensure directories exist
    this.ensureDirectories();
  }

  private ensureDirectories(): void {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    if (!fs.existsSync(FAILURES_DIR)) {
      fs.mkdirSync(FAILURES_DIR, { recursive: true });
    }
    if (!fs.existsSync(LOCK_DIR)) {
      fs.mkdirSync(LOCK_DIR, { recursive: true });
    }
  }

  private generateCacheKey(agent: string, task: string, context: Record<string, unknown>): string {
    const input = JSON.stringify({ agent, task, context });
    return crypto.createHash("sha256").update(input).digest("hex");
  }

  private getCachePath(hash: string): string {
    return path.join(CACHE_DIR, `${hash}.json`);
  }

  private setCache(hash: string, data: unknown): void {
    const path = this.getCachePath(hash);
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
  }

  private getCacheData(hash: string): unknown | null {
    const path = this.getCachePath(hash);
    if (!fs.existsSync(path)) return null;

    try {
      const data = fs.readFileSync(path, "utf-8");
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  private async acquireLock(lockName: string, timeoutMs: number = 30000): Promise<boolean> {
    const lockPath = path.join(LOCK_DIR, `${lockName}.lock`);
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
      try {
        // Try to create the lock file atomically
        const fd = fs.openSync(lockPath, "wx"); // "wx" fails if file exists
        fs.writeSync(fd, `{ "pid": ${process.pid}, "timestamp": ${Date.now()} }`);
        fs.closeSync(fd);
        return true;
      } catch {
        // Lock exists, check if it's stale
        try {
          const lockData = JSON.parse(fs.readFileSync(lockPath, "utf-8"));
          const lockAge = Date.now() - lockData.timestamp;
          // If lock is older than timeout, consider it stale
          if (lockAge > timeoutMs) {
            // Remove stale lock and retry
            fs.unlinkSync(lockPath);
            continue;
          }
          // Lock is still valid, wait and retry
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch {
          // Can't read lock, retry
          continue;
        }
      }
    }
    return false;
  }

  private releaseLock(lockName: string): void {
    const lockPath = path.join(LOCK_DIR, `${lockName}.lock`);
    try {
      fs.unlinkSync(lockPath);
    } catch {
      // Lock already released or doesn't exist
    }
  }

  async plan(execution: ExecutionPlan): Promise<ExecutionResult> {
    const { agent, task, dryRun = true } = execution;
    const config = this.config;

    // Validate agent exists
    const agentResult = this.validateAgent(agent);
    if (!agentResult.success) {
      return {
        success: false,
        agent,
        task,
        status: "failed",
        durationMs: 0,
        error: { type: "invalid_response", message: agentResult.error?.message || "Agent not found", retryable: false },
      };
    }

    // Check if dryRun is default (true) - if so, just plan without executing
    if (dryRun && config.dryRun !== false) {
      return {
        success: true,
        agent,
        task,
        status: "planned",
        durationMs: 0,
      };
    }

    // For actual execution, check permissions, cache, etc.
    return this.execute(agent, task, config);
  }

  private validateAgent(agentId: string): Result<AgentDefinition, Error> {
    const agents = loadAgents();
    if (!agents.success) {
      return { success: false, error: agents.error! };
    }

    const agent = agents.value.find((a) => a.identity === agentId);
    if (!agent) {
      return { success: false, error: new Error(`Agent ${agentId} not found`) };
    }

    return { success: true, value: agent.definition };
  }

  private async execute(agentId: string, task: string, config: OrchestratorConfig): Promise<ExecutionResult> {
    const startTime = Date.now();

    // Acquire lock for this execution
    const lockAcquired = await this.acquireLock(`${agentId}:${task}`);
    if (!lockAcquired) {
      return {
        success: false,
        agent: agentId,
        task,
        status: "failed",
        durationMs: Date.now() - startTime,
        error: { type: "invalid_response", message: "Could not acquire lock", retryable: false },
      };
    }

    try {
      // Validate agent
      const agentResult = this.validateAgent(agentId);
      if (!agentResult.success) {
        return {
          success: false,
          agent: agentId,
          task,
          status: "failed",
          durationMs: Date.now() - startTime,
          error: agentResult.error,
        };
      }

      // Check permissions
      const permissionsCheck = this.checkPermissions(agentId, task);
      if (!permissionsCheck.success) {
        // Generate evidence for refusal
        const evidence: EvidenceRecord = {
          id: crypto.randomUUID(),
          source: "agent_runtime",
          type: "security",
          content: `Agent ${agentId} refused task: ${permissionsCheck.error?.message || "permission denied"}`,
          timestamp: Date.now(),
        };

        // Record failure
        this.recordFailure(agentId, task, permissionsCheck.error);

        return {
          success: false,
          agent: agentId,
          task,
          status: "failed",
          durationMs: Date.now() - startTime,
          error: permissionsCheck.error,
          evidence,
        };
      }

      // Check cache
      const cacheKey = this.generateCacheKey(agentId, task, {});
      const cached = this.getCacheData(cacheKey);
      if (cached) {
        return {
          success: true,
          agent: agentId,
          task,
          status: "cached",
          durationMs: Date.now() - startTime,
          evidence: cached as EvidenceRecord,
        };
      }

      // Execute via LLM provider
      const completionRequest: CompletionRequest = {
        messages: [
          { role: "system", content: `You are ${agentId}, an autonomous agent. Task: ${task}` },
          { role: "user", content: task },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      };

      let result: Result<CompletionResponse, ProviderError>;
      let attempt = 0;

      while (attempt < config.maxAttempts) {
        attempt++;
        result = await this.provider.complete(completionRequest);

        if (result.success) {
          // Success - cache the result
          const evidence: EvidenceRecord = {
            id: crypto.randomUUID(),
            source: "agent_runtime",
            type: "api",
            content: `LLM response for task: ${task}`,
            timestamp: Date.now(),
          };

          this.setCache(cacheKey, {
            ...result.value,
            evidence: [{ ...evidence, content: `LLM response for: ${task}` }],
          });

          return {
            success: true,
            agent: agentId,
            task,
            status: "executed",
            durationMs: Date.now() - startTime,
            evidence,
          };
        }

        // Check if we should retry
        if (result.error?.retryable && attempt < config.maxAttempts) {
          // Exponential backoff
          const backoffMs = Math.pow(2, attempt) * 1000;
          await new Promise((resolve) => setTimeout(resolve, backoffMs));
          continue;
        }

        // Final failure - record and return
        const evidence: EvidenceRecord = {
          id: crypto.randomUUID(),
          source: "agent_runtime",
          type: "api",
          content: `LLM failed after ${attempt} attempts: ${result.error?.message || "unknown error"}`,
          timestamp: Date.now(),
        };

        this.recordFailure(agentId, task, result.error);

        return {
          success: false,
          agent: agentId,
          task,
          status: "failed",
          durationMs: Date.now() - startTime,
          error: result.error,
          evidence,
        };
      }

      // Should not reach here, but just in case
      return {
        success: false,
        agent: agentId,
        task,
        status: "failed",
        durationMs: Date.now() - startTime,
        error: { type: "invalid_response", message: "Max attempts exceeded", retryable: false },
      };
    } finally {
      this.releaseLock(agentId);
    }
  }

  private checkPermissions(agentId: string, task: string): Result<{ success: boolean }, Error> {
    const agents = loadAgents();
    if (!agents.success) {
      return { success: false, error: agents.error! };
    }

    const agent = agents.value.find((a) => a.identity === agentId);
    if (!agent) {
      return { success: false, error: new Error(`Agent ${agentId} not found`) };
    }

    const definition = agent.definition;

    // Check if task is in forbidden_tasks
    if (definition.forbidden_tasks.includes(task)) {
      return {
        success: false,
        error: { type: "invalid_response", message: `Task "${task}" is forbidden for agent ${agentId}`, message: `Task "${task}" is forbidden for agent ${agentId}`, retryable: false },
      };
    }

    // Check if task is in allowed_tasks (if specified)
    if (definition.allowed_tasks.length > 0 && !definition.allowed_tasks.includes(task)) {
      return {
        success: false,
        error: { type: "invalid_response", message: `Task "${task}" is not in allowed tasks for agent ${agentId}`, retryable: false },
      };
    }

    return { success: true };
  }

  private recordFailure(agentId: string, task: string, error?: ProviderError): void {
    const failureRecord = {
      agent: agentId,
      task,
      error: error ? { type: error.type, message: error.message } : undefined,
      timestamp: Date.now(),
    };

    const failurePath = path.join(FAILURES_DIR, `${agentId}:${task}.json`);
    try {
      fs.writeFileSync(failurePath, JSON.stringify(failureRecord, null, 2));
    } catch {
      // Fail silently - can't record failure
    }
  }
}

// Export singleton instance for convenience
export const runtime = new AgentRuntime();

export function createRuntime(config: Partial<OrchestratorConfig>): AgentRuntime {
  return new AgentRuntime(config);
}