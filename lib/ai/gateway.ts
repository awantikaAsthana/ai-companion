import { aiConfig, resolveProviderAndModel } from "./config";
import { ZrokProvider } from "./providers/zrok";
import { OpenRouterProvider } from "./providers/openrouter";
import { OllamaProvider } from "./providers/ollama";
import type {
  AIProvider,
  AIProviderName,
  ChatRequest,
  ChatResponse,
} from "./types";

/**
 * Instantiates the appropriate provider adapter with server-side credentials.
 */
export function createProvider(providerName: AIProviderName): AIProvider {
  switch (providerName) {
    case "zrok":
      return new ZrokProvider(aiConfig.zrokBaseUrl, aiConfig.zrokApiKey);

    case "openrouter":
      return new OpenRouterProvider(
        aiConfig.openRouterBaseUrl,
        aiConfig.openRouterApiKey,
      );

    case "ollama":
      return new OllamaProvider(aiConfig.ollamaBaseUrl);

    case "ollama-cloud":
    case "runpod":
    case "lightning":
      throw new Error(
        `AI provider "${providerName}" is reserved for future milestones and not active.`,
      );

    default:
      throw new Error(`Unsupported AI provider: "${providerName}"`);
  }
}

export interface GenerateChatOptions {
  messages: ChatRequest["messages"];
  provider?: string;
  model?: string;
  temperature?: number;
  topP?: number;
  maxTokens?: number;
}

/**
 * AI Gateway:
 * Single centralized entry point for dispatching AI requests across providers.
 */
export async function generateChat(
  options: GenerateChatOptions,
): Promise<ChatResponse> {
  const { provider: resolvedProvider, model: resolvedModel } =
    resolveProviderAndModel(options.provider, options.model);

  const provider = createProvider(resolvedProvider);

  const startTime = Date.now();
  try {
    const response = await provider.chat({
      messages: options.messages,
      model: resolvedModel,
      temperature: options.temperature,
      topP: options.topP,
      maxTokens: options.maxTokens,
    });

    // Observability logging (safe: no secrets, no full message history)
    const totalLatency = Date.now() - startTime;
    console.log("[AI Gateway]", {
      provider: resolvedProvider,
      model: response.model || resolvedModel,
      latencyMs: response.latencyMs ?? totalLatency,
      status: "success",
      tokens: response.tokens,
    });

    return response;
  } catch (error) {
    const totalLatency = Date.now() - startTime;
    console.error("[AI Gateway Failure]", {
      provider: resolvedProvider,
      model: resolvedModel,
      latencyMs: totalLatency,
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
    throw error;
  }
}
