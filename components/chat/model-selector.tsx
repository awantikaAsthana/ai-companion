"use client";

import { useEffect, useState } from "react";
import { Cpu, ChevronDown, Sparkles } from "lucide-react";
import type { ProviderOption } from "@/lib/ai/types";

interface ModelSelectorProps {
  onSelectionChange: (selection: { provider: string; model: string }) => void;
  defaultProvider?: string;
  defaultModel?: string;
}

export function ModelSelector({
  onSelectionChange,
  defaultProvider = "zrok",
  defaultModel = "qwen38-27b",
}: ModelSelectorProps) {
  const [isDev, setIsDev] = useState(false);
  const [providers, setProviders] = useState<ProviderOption[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(defaultProvider);
  const [selectedModel, setSelectedModel] = useState(defaultModel);

  useEffect(() => {
    fetch("/api/ai/models")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        setIsDev(Boolean(data.isDevelopment));
        setProviders(data.providers || []);
        if (data.defaultProvider) setSelectedProvider(data.defaultProvider);
        if (data.defaultModel) setSelectedModel(data.defaultModel);
        onSelectionChange({
          provider: data.defaultProvider || defaultProvider,
          model: data.defaultModel || defaultModel,
        });
      })
      .catch(() => {
        // Fall back to default
      });
  }, []);

  // In production, the model selector is completely hidden
  if (!isDev || providers.length === 0) {
    return null;
  }

  const activeProviderObj = providers.find((p) => p.id === selectedProvider);
  const availableModels = activeProviderObj?.models || [];

  function handleProviderChange(providerId: string) {
    setSelectedProvider(providerId);
    const prov = providers.find((p) => p.id === providerId);
    const newModel =
      prov?.models.find((m) => m.isDefault)?.id ||
      prov?.models[0]?.id ||
      defaultModel;
    setSelectedModel(newModel);
    onSelectionChange({ provider: providerId, model: newModel });
  }

  function handleModelChange(modelId: string) {
    setSelectedModel(modelId);
    onSelectionChange({ provider: selectedProvider, model: modelId });
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#C9A46A]/30 bg-[#120507]/90 px-3 py-1.5 text-xs text-[#F5E9E5] shadow-lg backdrop-blur-md">
      <div className="flex items-center gap-1.5 text-[#C9A46A] font-medium pr-1 border-r border-[#430D15]">
        <Cpu className="h-3.5 w-3.5" />
        <span className="text-[10px] uppercase tracking-wider hidden sm:inline">
          Dev Playground
        </span>
      </div>

      {/* Provider Selector */}
      <div className="flex items-center gap-1">
        <span className="text-[10px] text-[#BFA8A8]">Provider:</span>
        <select
          value={selectedProvider}
          onChange={(e) => handleProviderChange(e.target.value)}
          className="rounded border border-[#430D15] bg-[#090405] px-2 py-0.5 text-xs text-[#F5E9E5] focus:border-[#C9A46A] focus:outline-none"
        >
          {providers.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Model Selector */}
      <div className="flex items-center gap-1">
        <span className="text-[10px] text-[#BFA8A8]">Model:</span>
        <select
          value={selectedModel}
          onChange={(e) => handleModelChange(e.target.value)}
          className="max-w-[200px] truncate rounded border border-[#430D15] bg-[#090405] px-2 py-0.5 text-xs text-[#F5E9E5] focus:border-[#C9A46A] focus:outline-none"
        >
          {availableModels.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

