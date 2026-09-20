import type { AIProvider, ChatRequest, ChatResponse } from "../types";

export class ZrokProvider implements AIProvider {
  readonly name = "zrok" as const;

  constructor(
    private readonly baseUrl: string,
    private readonly apiKey: string,
  ) {}

  async chat(request: ChatRequest): Promise<ChatResponse> {
    if (!this.apiKey) {
      throw new Error("ZROK_API_KEY is not configured.");
    }
    if (!this.baseUrl) {
      throw new Error("ZROK_BASE_URL is not configured.");
    }

    const endpoint = `${this.baseUrl.replace(/\/$/, "")}/v1/chat`;
    const startTime = Date.now();

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: request.model || "qwen38-27b",
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
    });

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
    } else {
      content = JSON.stringify(data);
    }

    return {
      content: content.trim(),
      model: data.model || request.model,
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