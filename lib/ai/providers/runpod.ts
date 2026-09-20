import type { AIProvider, ChatRequest, ChatResponse } from "../types";

/**
 * Placeholder for RunPod.
 */
export class RunPodProvider implements AIProvider {
  readonly name = "runpod" as const;

  async chat(_request: ChatRequest): Promise<ChatResponse> {
    throw new Error("RunPod provider is not implemented yet.");
  }
}
