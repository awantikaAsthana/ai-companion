import type { AIProvider, ChatRequest, ChatResponse } from "../types";

/**
 * Placeholder for Lightning AI.
 */
export class LightningProvider implements AIProvider {
  readonly name = "lightning" as const;

  async chat(_request: ChatRequest): Promise<ChatResponse> {
    throw new Error("Lightning AI provider is not implemented yet.");
  }
}
