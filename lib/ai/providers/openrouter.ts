import type { AIProvider, ChatRequest, ChatResponse } from "../types";

export class OpenRouterProvider implements AIProvider {
  readonly name = "openrouter" as const;

  constructor(
    private readonly baseUrl: string,
    private readonly apiKey: string,
  ) {}

  async chat(request: ChatRequest): Promise<ChatResponse> {
    if (!this.apiKey) {
      throw new Error("OPENROUTER_API_KEY is not configured.");
    }

    const endpoint = `${this.baseUrl.replace(/\/$/, "")}/chat/completions`;
    const startTime = Date.now();

    const response = await fetch(endpoint, {
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
    });

    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(
        `OpenRouter request failed (${response.status}): ${errorText.slice(0, 300)}`,
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
