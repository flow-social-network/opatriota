export type { Result } from "@noteagents/types";

export interface CompletionRequest {
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface CompletionResponse {
  id: string;
  choices: Array<{ message: { role: string; content: string }; index: number; finish_reason: string }>;
  usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}

export type ProviderErrorType = "auth" | "rate_limit" | "model_gone" | "timeout" | "network" | "invalid_response";

export interface ProviderError {
  type: ProviderErrorType;
  message: string;
  retryable: boolean;
}

export interface LLMProvider {
  name: string;
  complete(req: CompletionRequest): Promise<Result<CompletionResponse, ProviderError>>;
  listModels(): Promise<string[]>;
}

export const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

export class NvidiaProvider {
  readonly name = "nvidia";
  private abortController: AbortController | null = null;

  constructor(
    private apiKey: string = process.env.NVIDIA_API_KEY || "",
    private model: string = process.env.NOTEAGENTS_MODEL || ""
  ) {
    if (!this.apiKey) {
      console.warn("NVIDIA_API_KEY not set");
    }
    if (!this.model) {
      console.warn("NOTEAGENTS_MODEL not set");
    }
  }

  async complete(req: CompletionRequest): Promise<Result<CompletionResponse, ProviderError>> {
    if (!this.model && !process.env.NOTEAGENTS_MODEL) {
      const models = await this.listModels();
      if (models.length === 0) {
        return {
          success: false,
          error: {
            type: "invalid_response",
            message: "No models available and NOTEAGENTS_MODEL not set",
            retryable: false,
          },
        };
      }
    }

    this.abortController = new AbortController();
    const timeoutMs = process.env.NOTEAGENTS_TIMEOUT_MS
      ? parseInt(process.env.NOTEAGENTS_TIMEOUT_MS)
      : 30000;
    this.abortController.signal!.timeout = timeoutMs;

    try {
      const response = await fetch(NVIDIA_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(req),
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        return this.handleErrorResponse(response);
      }

      const data = (await response.json()) as CompletionResponse;
      return { success: true, value: data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async listModels(): Promise<string[]> {
    if (!this.apiKey) {
      return [];
    }

    try {
      const response = await fetch("https://integrate.api.nvidia.com/v1/models", {
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      if (data.data && Array.isArray(data.data)) {
        return (data.data as Array<{ id: string }>).map((m: { id: string }) => m.id);
      }
      return [];
    } catch {
      return [];
    }
  }

  private handleErrorResponse(response: Response): Promise<Result<CompletionResponse, ProviderError>> {
    const status = response.status;
    const errorMessage = response.statusText || `(HTTP ${status})`;

    if (status === 401 || status === 403) {
      return Promise.resolve({
        success: false,
        error: {
          type: "auth",
          message: `Unauthorized (${status})`,
          retryable: false,
        },
      });
    }

    if (status === 404) {
      return Promise.resolve({
        success: false,
        error: {
          type: "model_gone",
          message: `Model not found (${status})`,
          retryable: false,
        },
      });
    }

    if (status === 410) {
      return Promise.resolve({
        success: false,
        error: {
          type: "model_gone",
          message: "Model retired (410 Gone)",
          retryable: false,
        },
      });
    }

    if (status === 429) {
      return Promise.resolve({
        success: false,
        error: {
          type: "rate_limit",
          message: `Rate limit exceeded (${status})`,
          retryable: true,
        },
      });
    }

    if (status >= 500) {
      return Promise.resolve({
        success: false,
        error: {
          type: "network",
          message: `Server error (${status})`,
          retryable: true,
        },
      });
    }

    return Promise.resolve({
      success: false,
      error: {
        type: "invalid_response",
        message: `HTTP ${status}: ${errorMessage}`,
        retryable: false,
      },
    });
  }

  private handleError(error: any): Promise<Result<CompletionResponse, ProviderError>> {
    if (error.name === "AbortError" || error.name === "TimeoutError") {
      return Promise.resolve({
        success: false,
        error: {
          type: "timeout",
          message: "Request timeout",
          retryable: false,
        },
      });
    }

    if (error.cause?.code === "ECONNREFUSED" || error.cause?.code === "EHOSTUNREACH") {
      return Promise.resolve({
        success: false,
        error: {
          type: "network",
          message: "Network connection error",
          retryable: true,
        },
      });
    }

    return Promise.resolve({
      success: false,
      error: {
        type: "invalid_response",
        message: error.message || "Unknown error",
        retryable: false,
      },
    });
  }
}

// Provider registry
const providers = new Map<string, LLMProvider>();

export function registerProvider(provider: LLMProvider): void {
  providers.set(provider.name, provider);
}

export function getProvider(name: string): LLMProvider | undefined {
  return providers.get(name);
}

export function listRegisteredProviders(): string[] {
  return Array.from(providers.keys());
}