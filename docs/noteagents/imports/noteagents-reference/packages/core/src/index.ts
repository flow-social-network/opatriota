// @file Core SDK - Type-level infrastructure for NoteAgents
// All exports are interfaces and type aliases for contract-first design
// No value-level exports to avoid isolatedModules redeclare conflicts

// Result Pattern types
export type Success<T> = {
  success: true;
  value: T;
};

export type Failure<E> = {
  success: false;
  error: E;
};

export type Result<T, E> = Success<T> | Failure<E>;

// Agent Definition interface
export interface AgentDefinition {
  identity: string;
  mission: string;
  allowed_tasks: string[];
  forbidden_tasks: string[];
  required_knowledge: string[];
  preferred_tools: string[];
  decision_rules: string;
  workflow: string;
  input_contract: Record<string, unknown>;
  output_contract: Record<string, unknown>;
  quality_gate: string;
}

// Project Analysis interface
export interface ProjectAnalysis {
  project_name: string;
  framework: string;
  language: string;
  database: string;
  framework_version?: string;
  root_path: string;
}

// Workspace State interface
export interface WorkspaceState {
  session_id: string;
  tasks: string[];
  plans: string[];
  project_name: string;
  framework: string;
  started_at: number;
  last_updated: number;
}

// Task Definition interface
export interface TaskDefinition {
  id: string;
  description: string;
  step: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  attempt: number;
  max_attempts: number;
  started_at?: number;
  finished_at?: number;
  duration_ms?: number;
  result?: Result<unknown, string>;
  evidence?: EvidenceRecord[];
}

// Evidence Record interface
export interface EvidenceRecord {
  id: string;
  source: string;
  type: "file" | "terminal" | "build" | "test" | "security" | "api";
  content: string;
  timestamp: number;
  exit_code?: number;
  files_modified?: string[];
  files_created?: string[];
  files_deleted?: string[];
}

// Quality Gate interface
export interface QualityGate {
  name: string;
  passed: boolean;
  score: number;
  findings: Finding[];
  evidence: EvidenceRecord[];
  auto_fix_available: boolean;
}

// Finding interface
export interface Finding {
  id: string;
  category:
    | "architecture"
    | "code-quality"
    | "frontend"
    | "backend"
    | "database"
    | "security"
    | "testing"
    | "infrastructure"
    | "dependencies"
    | "performance"
    | "accessibility"
    | "documentation"
    | "deployment"
    | "observability"
    | "ai-readiness"
    | "market-readiness";
  severity: "critical" | "high" | "medium" | "low" | "info";
  title: string;
  description: string;
  evidence: string[];
  recommendation: string;
  auto_fix_available: boolean;
}

// AI Provider Configuration interface
export interface AIProviderConfig {
  provider:
    | "nvidia"
    | "openai"
    | "anthropic"
    | "google"
    | "ollama"
    | "openrouter";
  model: string;
  base_url?: string;
  capabilities: ("chat" | "vision" | "embeddings" | "structuredOutput" | "toolCalling")[];
}

// Execution Result interface
export interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  duration_ms: number;
  files_affected: string[];
  evidence: EvidenceRecord[];
}

// Pipeline Stage interface
export interface PipelineStage {
  name: string;
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  started_at?: number;
  finished_at?: number;
  duration_ms?: number;
  agent?: string;
  evidence: EvidenceRecord[];
}

// Domain Errors enum
export enum DomainError {
  AGENT_NOT_FOUND = "AGENT_NOT_FOUND",
  TASK_NOT_ALLOWED = "TASK_NOT_ALLOWED",
  VALIDATION_FAILED = "VALIDATION_FAILED",
  EXECUTION_TIMEOUT = "EXECUTION_TIMEOUT",
  KNOWLEDGE_MISSING = "KNOWLEDGE_MISSING",
  INFRASTRUCTURE_ERROR = "INFRASTRUCTURE_ERROR",
  PROVIDER_ERROR = "PROVIDER_ERROR",
  FILE_SYSTEM_ERROR = "FILE_SYSTEM_ERROR",
  DATABASE_ERROR = "DATABASE_ERROR",
}

// Domain Result type
export type DomainResult<T> = Result<T, DomainError>;

// Export all types for consumption by other packages
