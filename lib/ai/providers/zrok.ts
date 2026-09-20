import type { AIProvider, ChatRequest, ChatResponse } from "../types";

export interface ZrokProviderOptions {
  timeoutMs?: number;
}

export class ZrokProvider implements AIProvider {
  readonly name = "zrok" as const;
  private readonly timeoutMs: number;

  constructor(
    private readonly baseUrl: string,
    private readonly apiKey: string,
    options?: ZrokProviderOptions,
  ) {
    // Default 600s (10 minutes) matching Python timeout=600 for Kaggle GPU generation
    this.timeoutMs = options?.timeoutMs ?? 600000;
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    if (!this.apiKey) {
      throw new Error("ZROK_API_KEY is not configured.");
    }
    if (!this.baseUrl) {
      throw new Error("ZROK_BASE_URL is not configured.");
    }

    const endpoint = `${this.baseUrl.replace(/\/$/, "")}/v1/chat`;
    const startTime = Date.now();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: request.messages,
          temperature: request.temperature ?? 0.7,
        }),
        signal: controller.signal,
      });
    } catch (err: unknown) {
      if (
        controller.signal.aborted ||
        (err instanceof Error && err.name === "AbortError")
      ) {
        console.error("[Zrok Provider Error]", {
          reason: "timeout",
          timeoutMs: this.timeoutMs,
        });
        throw new Error(
          `Zrok provider request timed out after ${Math.round(this.timeoutMs / 1000)} seconds`,
        );
      }
      console.error("[Zrok Provider Error]", {
        reason: "network_error",
        message: err instanceof Error ? err.message : "Unknown error",
      });
      throw new Error("Zrok provider network request failed");
    } finally {
      clearTimeout(timeoutId);
    }

    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      // Drain response body to prevent hanging connections without exposing it in thrown error
      await response.text().catch(() => "");
      console.error("[Zrok Provider Error]", {
        status: response.status,
        statusText: response.statusText,
      });
      throw new Error(
        `Zrok provider request failed with status ${response.status}`,
      );
    }

    const data = await response.json();

    // Extract text content from OpenAI-compatible choices, direct message, or custom response structure
    let content = "";
    if (data.choices && Array.isArray(data.choices) && data.choices.length > 0) {
      const firstChoice = data.choices[0];
      content =
        firstChoice.message?.content ||
        firstChoice.text ||
        "";
    } else if (typeof data.content === "string") {
      content = data.content;
    } else if (typeof data.response === "string") {
      content = data.response;
    } else if (typeof data.message === "string") {
      content = data.message;
    } else if (data.message && typeof data.message.content === "string") {
      content = data.message.content;
    } else if (typeof data.reply === "string") {
      content = data.reply;
    } else if (typeof data.output === "string") {
      content = data.output;
    } else if (typeof data.text === "string") {
      content = data.text;
    } else {
      content = typeof data === "string" ? data : JSON.stringify(data);
    }

    return {
      content: content.trim(),
      model: data.model || request.model || "qwen38-27b",
      provider: "zrok",
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