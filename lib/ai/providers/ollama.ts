import type { AIProvider, ChatRequest, ChatResponse } from "../types";

export class OllamaProvider implements AIProvider {
  readonly name = "ollama" as const;

  constructor(private readonly baseUrl: string) {}

  async chat(request: ChatRequest): Promise<ChatResponse> {
    const endpoint = `${this.baseUrl.replace(/\/$/, "")}/api/chat`;
    const startTime = Date.now();

    const response = await fetch(endpoint, {
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
    });

    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(
        `Ollama request failed (${response.status}): ${body.slice(0, 300)}`,
      );
    }

    const data = await response.json();
    const content = data.message?.content || "";

    return {
      content: content.trim(),
      model: data.model || request.model,
      provider: "ollama",
      latencyMs,
      tokens: data.prompt_eval_count || data.eval_count
        ? {
            promptTokens: data.prompt_eval_count,
            completionTokens: data.eval_count,
            totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
          }
        : undefined,
    };
  }
}
