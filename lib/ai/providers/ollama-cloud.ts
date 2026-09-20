import type { AIProvider, ChatRequest, ChatResponse } from "../types";

/**
 * Placeholder for Ollama Cloud.
 */
export class OllamaCloudProvider implements AIProvider {
  readonly name = "ollama-cloud" as const;

  constructor(
    private readonly apiKey: string,
    private readonly baseUrl = "https://cloud.ollama.com",
  ) {}

  async chat(_request: ChatRequest): Promise<ChatResponse> {
    throw new Error("Ollama Cloud provider is not implemented yet.");
  }
}
