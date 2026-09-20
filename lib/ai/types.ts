export type AIProviderName =
  | "zrok"
  | "openrouter"
  | "ollama"
  | "ollama-cloud"
  | "runpod"
  | "lightning";

export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface TokenUsage {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
}

export interface ChatResponse {
  content: string;
  model: string;
  provider: AIProviderName;
  latencyMs?: number;
  tokens?: TokenUsage;
}

export interface AIProvider {
  readonly name: AIProviderName;
  chat(request: ChatRequest): Promise<ChatResponse>;
  stream?(request: ChatRequest): Promise<ReadableStream<string>>;
}

export interface MemoryContext {
  l1Messages: ChatMessage[];
  l2Summary?: string | null;
  l3Memories?: string[];
}

export interface ModelOption {
  id: string;
  name: string;
  provider: AIProviderName;
  isDefault?: boolean;
}

export interface ProviderOption {
  id: AIProviderName;
  name: string;
  models: ModelOption[];
}
