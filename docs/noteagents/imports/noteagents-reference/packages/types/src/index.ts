export type Success<T> = {
  success: true;
  value: T;
};

export type Failure<E> = {
  success: false;
  error: E;
};

export type Result<T, E> = Success<T> | Failure<E>;

export interface ProjectAnalysis {
  project_name: string;
  framework: string;
  language: string;
  database: string;
  framework_version?: string;
}

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

export interface AuditFinding {
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
  autoFixAvailable: boolean;
}

export interface EvidenceRecord {
  id: string;
  source: string;
  type: "file" | "terminal" | "build" | "test" | "security" | "api";
  content: string;
  timestamp: number;
}

export interface ReadinessScore {
  overall: number;
  categories: Record<
    "architecture" | "frontend" | "backend" | "database" | "security" | "tests" | "infrastructure" | "documentation" | "observability" | "performance" | "accessibility" | "deployment" | "market-readiness",
    number
  >;
  blockers: number;
  lastChecked: number;
}

export interface OrchestratorConfig {
  maxAttempts?: number;
  timeoutMs?: number;
  parallelExecution?: boolean;
  autoApprove?: boolean;
  dryRun?: boolean;
}

export interface StateManagerState {
  session_id: string;
  tasks: string[];
  plans: string[];
  project_name: string;
  framework: string;
  started_at: number;
  last_updated: number;
}