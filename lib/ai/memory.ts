import { db } from "@/db";
import { messages } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import type { ChatMessage, ChatRole, MemoryContext } from "./types";

export interface MemoryService {
  getMemoryContext(
    conversationId: string,
    options?: { l1Limit?: number; excludeMessageIds?: string[] },
  ): Promise<MemoryContext>;
}

export class DatabaseMemoryService implements MemoryService {
  /**
   * Retrieves 3-tier memory context:
   * L1: Recent conversation messages (chronological order)
   * L2: Conversation summary (for extended dialogues)
   * L3: Durable facts and memories
   */
  async getMemoryContext(
    conversationId: string,
    options?: { l1Limit?: number; excludeMessageIds?: string[] },
  ): Promise<MemoryContext> {
    const limit = options?.l1Limit ?? 20;
    const excludeIds = new Set(options?.excludeMessageIds ?? []);

    // Fetch chronological messages for this conversation
    const rows = await db
      .select({
        id: messages.id,
        role: messages.role,
        content: messages.content,
      })
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(asc(messages.createdAt));

    // Exclude specific message IDs (e.g. the just-inserted user message to prevent duplication)
    const filtered = excludeIds.size > 0
      ? rows.filter((r) => !excludeIds.has(r.id))
      : rows;

    // L1: Take the most recent `limit` messages
    const recentRows = filtered.slice(-limit);

    const l1Messages: ChatMessage[] = recentRows.map((r) => ({
      role: (r.role as ChatRole) || "user",
      content: r.content,
    }));

    // L2: Summaries can be retrieved here (hook for M4 background summary worker)
    const l2Summary: string | null = null;

    // L3: Durable user memories (hook for M4 vector/fact memory retrieval)
    const l3Memories: string[] = [];

    return {
      l1Messages,
      l2Summary,
      l3Memories,
    };
  }
}

export const memoryService = new DatabaseMemoryService();
