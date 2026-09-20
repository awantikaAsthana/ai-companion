import {
  isDevelopmentAI,
  modelRegistry,
  providerOptions,
  aiConfig,
} from "./config";
import type { ModelOption, ProviderOption } from "./types";

export function getProviderOptions(): ProviderOption[] {
  return providerOptions;
}

export function getAllModels(): ModelOption[] {
  return Object.values(modelRegistry).flat();
}

export function getDefaultAISelection() {
  return {
    provider: aiConfig.defaultProvider,
    model: aiConfig.defaultModel,
    isDevelopment: isDevelopmentAI,
  };
}

