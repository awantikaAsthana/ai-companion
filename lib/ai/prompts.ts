import type { MemoryContext } from "./types";

export interface CharacterPromptData {
  name: string;
  personality?: string | null;
  interests?: string[] | null;
  communicationStyle?: string | null;
  relationshipDynamic?: string | null;
  systemPrompt: string;
}

/**
 * Builds the centralized AI system prompt combining character traits,
 * confidential system prompt, and L2/L3 memory context.
 */
export function buildCharacterSystemPrompt(
  character: CharacterPromptData,
  memory?: MemoryContext,
): string {
  const sections: string[] = [];

  // 1. Authoritative core system instructions
  sections.push(character.systemPrompt.trim());

  // 2. Persona grounding
  const traits: string[] = [];
  traits.push(`Character Name: ${character.name}`);
  if (character.personality) {
    traits.push(`Personality & Demeanor: ${character.personality}`);
  }
  if (character.communicationStyle) {
    traits.push(`Communication Style & Cadence: ${character.communicationStyle}`);
  }
  if (character.relationshipDynamic) {
    traits.push(`Relationship Dynamic: ${character.relationshipDynamic}`);
  }
  if (character.interests && character.interests.length > 0) {
    traits.push(`Interests & Passions: ${character.interests.join(", ")}`);
  }

  sections.push(`[Character Identity]\n${traits.join("\n")}`);

  // 3. Behavioral immersion rules
  sections.push(
    `[Immersion & Emotional Presence]\n` +
      `- Stay entirely in character as ${character.name} at all times.\n` +
      `- Never refer to yourself as an AI, assistant, or large language model.\n` +
      `- Embrace natural conversational cadence matching your communication style.\n` +
      `- Maintain deep emotional continuity and intimacy.`,
  );

  // 4. L2 Memory: Conversation Summary (if present)
  if (memory?.l2Summary) {
    sections.push(
      `[Persistent Memory: Conversation Summary]\n${memory.l2Summary.trim()}`,
    );
  }

  // 5. L3 Memory: Durable Facts About User (if present)
  if (memory?.l3Memories && memory.l3Memories.length > 0) {
    const memoryList = memory.l3Memories.map((m) => `- ${m}`).join("\n");
    sections.push(
      `[Persistent Memory: Facts Known About User]\n${memoryList}`,
    );
  }

  return sections.join("\n\n");
}
