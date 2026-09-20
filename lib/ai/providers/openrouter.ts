import type { AIProvider, ChatRequest, ChatResponse } from "../types";

export interface OpenRouterProviderOptions {
  timeoutMs?: number;
}

export class OpenRouterProvider implements AIProvider {
  readonly name = "openrouter" as const;
  private readonly timeoutMs: number;

  constructor(
    private readonly baseUrl: string,
    private readonly apiKey: string,
    options?: OpenRouterProviderOptions,
  ) {
    this.timeoutMs = options?.timeoutMs ?? 30000;
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    if (!this.apiKey) {
      throw new Error("OPENROUTER_API_KEY is not configured.");
    }

    const endpoint = `${this.baseUrl.replace(/\/$/, "")}/chat/completions`;
    const startTime = Date.now();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "HTTP-Referer": "https://ecstacy.ai",
          "X-Title": "Ecstacy AI Companion",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: request.model,
          messages: request.messages,
          stream: false,
          ...(request.temperature !== undefined && {
            temperature: request.temperature,
          }),
          ...(request.topP !== undefined && {
            top_p: request.topP,
          }),
          ...(request.maxTokens !== undefined && {
            max_tokens: request.maxTokens,
          }),
        }),
        signal: controller.signal,
      });
    } catch (err: unknown) {
      if (
        controller.signal.aborted ||
        (err instanceof Error && err.name === "AbortError")
      ) {
        console.error("[OpenRouter Provider Error]", {
          reason: "timeout",
          timeoutMs: this.timeoutMs,
        });
        throw new Error(
          `OpenRouter request timed out after ${Math.round(this.timeoutMs / 1000)} seconds`,
        );
      }
      console.error("[OpenRouter Provider Error]", {
        reason: "network_error",
        message: err instanceof Error ? err.message : "Unknown network error",
      });
      throw new Error("OpenRouter network request failed");
    } finally {
      clearTimeout(timeoutId);
    }

    const latencyMs = Date.now() - startTime;

    if (response.status === 429) {
      await response.text().catch(() => "");
      console.error("[OpenRouter Provider Error]", {
        status: 429,
        statusText: "Rate Limit Exceeded",
      });
      throw new Error("OpenRouter rate limit reached. Please wait and try again.");
    }

    if (!response.ok) {
      // Drain response body without propagating upstream content into the thrown error
      await response.text().catch(() => "");
      console.error("[OpenRouter Provider Error]", {
        status: response.status,
        statusText: response.statusText,
      });
      throw new Error(
        `OpenRouter request failed with status ${response.status}`,
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    return {
      content: content.trim(),
      model: data.model || request.model,
      provider: "openrouter",
      latencyMs,
      tokens: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
          }
        : undefined,
    };
  }
}
