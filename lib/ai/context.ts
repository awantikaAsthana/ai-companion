import type { ChatMessage, MemoryContext } from "./types";
import {
  buildCharacterSystemPrompt,
  type CharacterPromptData,
} from "./prompts";

export interface ContextBuilderParams {
  character: CharacterPromptData;
  memory: MemoryContext;
  newUserMessage: string;
}

/**
 * Context Builder:
 * Assembles the full LLM prompt context by combining:
 * 1. System prompt (character personality + instructions + L2/L3 memory)
 * 2. L1 Recent conversation history
 * 3. Incoming user message
 */
export function buildChatContext(params: ContextBuilderParams): ChatMessage[] {
  const { character, memory, newUserMessage } = params;

  // 1. Generate system prompt
  const systemPromptContent = buildCharacterSystemPrompt(character, memory);
  const systemMessage: ChatMessage = {
    role: "system",
    content: systemPromptContent,
  };

  // 2. Add recent messages (L1)
  const conversationMessages = [...memory.l1Messages];

  // 3. Append current user message
  conversationMessages.push({
    role: "user",
    content: newUserMessage,
  });

  return [systemMessage, ...conversationMessages];
}
