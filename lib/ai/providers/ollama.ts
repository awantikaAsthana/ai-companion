import type { AIProvider, ChatRequest, ChatResponse } from "../types";

export interface OllamaProviderOptions {
  timeoutMs?: number;
}

export class OllamaProvider implements AIProvider {
  readonly name = "ollama" as const;
  private readonly timeoutMs: number;

  constructor(
    private readonly baseUrl: string,
    options?: OllamaProviderOptions,
  ) {
    this.timeoutMs = options?.timeoutMs ?? 60000;
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    if (!this.baseUrl) {
      throw new Error("OLLAMA_BASE_URL is not configured.");
    }

    const endpoint = `${this.baseUrl.replace(/\/$/, "")}/api/chat`;
    const startTime = Date.now();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: request.model,
          messages: request.messages,
          stream: false,
          options: {
            ...(request.temperature !== undefined && {
              temperature: request.temperature,
            }),
            ...(request.topP !== undefined && {
              top_p: request.topP,
            }),
            ...(request.maxTokens !== undefined && {
              num_predict: request.maxTokens,
            }),
          },
        }),
        signal: controller.signal,
      });
    } catch (err: unknown) {
      if (
        controller.signal.aborted ||
        (err instanceof Error && err.name === "AbortError")
      ) {
        console.error("[Ollama Provider Error]", {
          reason: "timeout",
          timeoutMs: this.timeoutMs,
        });
        throw new Error(
          `Ollama request timed out after ${Math.round(this.timeoutMs / 1000)} seconds`,
        );
      }
      console.error("[Ollama Provider Error]", {
        reason: "network_error",
        message: err instanceof Error ? err.message : "Connection failed",
      });
      throw new Error(
        `Unable to connect to Ollama at ${this.baseUrl}. Please verify Ollama is running.`,
      );
    } finally {
      clearTimeout(timeoutId);
    }

    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      await response.text().catch(() => "");
      console.error("[Ollama Provider Error]", {
        status: response.status,
        statusText: response.statusText,
      });
      throw new Error(`Ollama request failed with status ${response.status}`);
    }

    const data = await response.json();
    const content = data.message?.content || "";

    return {
      content: content.trim(),
      model: data.model || request.model,
      provider: "ollama",
      latencyMs,
      tokens:
        data.prompt_eval_count || data.eval_count
          ? {
              promptTokens: data.prompt_eval_count,
              completionTokens: data.eval_count,
              totalTokens:
                (data.prompt_eval_count || 0) + (data.eval_count || 0),
            }
          : undefined,
    };
  }
}
