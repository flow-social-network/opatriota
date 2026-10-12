import { z } from "zod";
import { Result } from "@noteagents/types";
import fs from "fs";
import path from "path";

const AGENTS_DIR = path.resolve(__dirname, "..", "..", "agents");

const agentDefinitionSchema = z.object({
  identity: z.string(),
  mission: z.string(),
  allowed_tasks: z.array(z.string()),
  forbidden_tasks: z.array(z.string()),
  required_knowledge: z.array(z.string()),
  preferred_tools: z.array(z.string()),
  decision_rules: z.string(),
  workflow: z.string(),
  input_contract: z.object({
    required: z.record(z.string()),
    optional: z.record(z.object({ default: z.any(), description: z.string() })),
    validation: z.string(),
  }),
  output_contract: z.object({
    result_type: z.string(),
    summary: z.string(),
    evidence: z.array(z.any()),
    status: z.enum(["success", "partial", "failure"]),
  }),
  quality_gate: z.string(),
});

const outputContractSchema = z.object({
  status: z.enum(["SUCCESS", "FAILED"]),
  changes: z.array(z.string()),
  tests: z.array(z.string()),
  remaining_errors: z.array(z.string()),
});

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

export interface LoadedAgent {
  identity: string;
  definition: AgentDefinition;
}

export interface OutputContract {
  status: "SUCCESS" | "FAILED";
  changes: string[];
  tests: string[];
  remaining_errors: string[];
}

export function loadAgents(): Result<LoadedAgent[], Error> {
  try {
    const files = fs.readdirSync(AGENTS_DIR);
    const jsonFiles = files.filter((f: string) => f.endsWith(".json"));

    const loadedAgents: LoadedAgent[] = [];

    for (const file of jsonFiles) {
      const filePath = path.join(AGENTS_DIR, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");

      let parsed: unknown;
      try {
        parsed = JSON.parse(fileContent);
      } catch (parseError: unknown) {
        return {
          success: false,
          error: new Error(`Invalid JSON in file ${file}: ${(parseError as Error).message}`),
        };
      }

      const validationResult = agentDefinitionSchema.safeParse(parsed);

      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(
          (err: { path: string[]; message: string }) => `${err.path.join(".")}: ${err.message}`
        );
        return {
          success: false,
          error: new Error(`Invalid agent definition in ${file}: ${errors.join(", ")}`),
        };
      }

      loadedAgents.push({
        identity: (parsed as AgentDefinition).identity,
        definition: parsed as AgentDefinition,
      });
    }

    return { success: true, value: loadedAgents };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

export function validateOutputContract(
  data: unknown
): Result<OutputContract, Error> {
  const result = outputContractSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      error: new Error(
        `Invalid output contract: ${result.error.errors.map((e: { message: string }) => e.message).join(", ")}`
      ),
    };
  }

  return { success: true, value: result.value as OutputContract };
}

export function parseOutputContract(
  data: unknown
): { status: "SUCCESS" | "FAILED"; changes: string[]; tests: string[]; remaining_errors: string[] } {
  const result = validateOutputContract(data);

  if (!result.success) {
    return {
      status: "FAILED",
      changes: [],
      tests: [],
      remaining_errors: [result.error.message],
    };
  }

  return {
    status: result.value.status,
    changes: result.value.changes,
    tests: result.value.tests,
    remaining_errors: result.value.remaining_errors,
  };
}