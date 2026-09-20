import type { AIProviderName, ModelOption, ProviderOption } from "./types";

export const supportedProviders: AIProviderName[] = [
  "zrok",
  "openrouter",
  "ollama",
];

export const isDevelopmentAI =
  process.env.AI_ENV === "development" ||
  process.env.NODE_ENV !== "production";

export const defaultOpenRouterModel =
  process.env.OPENROUTER_MODEL ||
  "cognitivecomputations/dolphin-mistral-24b-venice-edition:free";

export const defaultZrokModel =
  process.env.AI_MODEL || "qwen38-27b";

export const modelRegistry: Record<AIProviderName, ModelOption[]> = {
  zrok: [
    {
      id: "qwen38-27b",
      name: "Qwen 27B (Kaggle)",
      provider: "zrok",
      isDefault: true,
    },
  ],
  openrouter: [
    {
      id: defaultOpenRouterModel,
      name: "Dolphin Mistral 24B (Venice)",
      provider: "openrouter",
      isDefault: true,
    },
    {
      id: "meta-llama/llama-3.3-70b-instruct:free",
      name: "Llama 3.3 70B (Free)",
      provider: "openrouter",
    },
    {
      id: "mistralai/mistral-7b-instruct:free",
      name: "Mistral 7B (Free)",
      provider: "openrouter",
    },
  ],
  ollama: [
    {
      id: "llama3.2",
      name: "Llama 3.2 (Local)",
      provider: "ollama",
      isDefault: true,
    },
    {
      id: "qwen2.5",
      name: "Qwen 2.5 (Local)",
      provider: "ollama",
    },
    {
      id: "mistral",
      name: "Mistral (Local)",
      provider: "ollama",
    },
  ],
  "ollama-cloud": [],
  runpod: [],
  lightning: [],
};

export const providerOptions: ProviderOption[] = [
  {
    id: "zrok",
    name: "Zrok (Kaggle Qwen 27B)",
    models: modelRegistry.zrok,
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    models: modelRegistry.openrouter,
  },
  {
    id: "ollama",
    name: "Ollama (Local)",
    models: modelRegistry.ollama,
  },
];

export const aiConfig = {
  defaultProvider: (process.env.AI_PROVIDER as AIProviderName) || "zrok",
  defaultModel: process.env.AI_MODEL || "qwen38-27b",

  zrokBaseUrl:
    process.env.ZROK_BASE_URL || "https://haew2566oi56.shares.zrok.io",
  zrokApiKey: process.env.ZROK_API_KEY || "",

  openRouterBaseUrl:
    process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
  openRouterApiKey: process.env.OPENROUTER_API_KEY || "",
  openRouterModel: defaultOpenRouterModel,

  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
};

/**
 * Validates and resolves client/server requested provider and model.
 * Enforces server-side allowlist security: client cannot pass arbitrary endpoints or keys.
 */
export function resolveProviderAndModel(
  requestedProvider?: string,
  requestedModel?: string,
): { provider: AIProviderName; model: string } {
  // If in production and provider switching not permitted, force default
  const allowClientOverride = isDevelopmentAI;

  const targetProvider = (
    allowClientOverride && requestedProvider
      ? requestedProvider
      : aiConfig.defaultProvider
  ).toLowerCase() as AIProviderName;

  if (!supportedProviders.includes(targetProvider)) {
    throw new Error(
      `Unsupported or disallowed AI provider: "${requestedProvider}". Allowed providers: ${supportedProviders.join(", ")}`,
    );
  }

  // Resolve model for the resolved provider
  const availableModels = modelRegistry[targetProvider] || [];
  const defaultForProvider =
    availableModels.find((m) => m.isDefault)?.id ||
    availableModels[0]?.id ||
    (targetProvider === "openrouter" ? defaultOpenRouterModel : aiConfig.defaultModel);

  let targetModel = defaultForProvider;

  if (allowClientOverride && requestedModel?.trim()) {
    const candidateModel = requestedModel.trim();
    // Validate candidate model belongs to provider allowlist; reject arbitrary models
    const isKnownModel = availableModels.some((m) => m.id === candidateModel);
    if (isKnownModel) {
      targetModel = candidateModel;
    } else {
      targetModel = defaultForProvider;
    }
  }

  return {
    provider: targetProvider,
    model: targetModel,
  };
}
