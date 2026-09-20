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
      id: "qwen/qwen3.8-27b:free",
      name: "Qwen 3.8 27B (Free)",
      provider: "openrouter",
    },
    {
      id: "mistralai/mistral-7b-instruct:free",
      name: "Mistral 7B (Free)",
      provider: "openrouter",
    },
    {
      id: "poolside/laguna-s-2.1:free",
      name: "Laguna S 2.1 (Free)",
      provider: "openrouter",
    },
    {
      id: "nvidia/nemotron-3.5-lightning:free",
      name: "Nemotron 3.5 Lightning (Free)",
      provider: "openrouter",
    },
  ],
  ollama: [
    {
      id: "qwen3-coder:480b-cloud",
      name: "Qwen 3 Coder 480B (Cloud)",
      provider: "ollama",
      isDefault: true,
    },
    {
      id: "treyleo16/kimi-k3",
      name: "Kimi K3 (Ollama)",
      provider: "ollama",
    },
    {
      id: "gpt-oss:120b-cloud",
      name: "GPT-OSS 120B (Cloud)",
      provider: "ollama",
    },
    {
      id: "gpt-oss:20b-cloud",
      name: "GPT-OSS 20B (Cloud)",
      provider: "ollama",
    },
    {
      id: "deepseek-v3.1:671b-cloud",
      name: "DeepSeek V3.1 671B (Cloud)",
      provider: "ollama",
    },
  ],
  "ollama-cloud": [
    {
      id: "qwen3-coder:480b-cloud",
      name: "Qwen 3 Coder 480B (Cloud)",
      provider: "ollama-cloud",
      isDefault: true,
    },
    {
      id: "treyleo16/kimi-k3",
      name: "Kimi K3 (Ollama)",
      provider: "ollama-cloud",
    },
    {
      id: "gpt-oss:120b-cloud",
      name: "GPT-OSS 120B (Cloud)",
      provider: "ollama-cloud",
    },
    {
      id: "gpt-oss:20b-cloud",
      name: "GPT-OSS 20B (Cloud)",
      provider: "ollama-cloud",
    },
    {
      id: "deepseek-v3.1:671b-cloud",
      name: "DeepSeek V3.1 671B (Cloud)",
      provider: "ollama-cloud",
    },
  ],
  runpod: [],
  lightning: [],
};

export const providerOptions: ProviderOption[] = [
  {
    id: "ollama",
    name: "Ollama (Cloud / Local)",
    models: modelRegistry.ollama,
  },
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
