import { db } from "@/db";
import { conversations, messages, characters } from "@/db/schema";
import { eq, and, desc, asc } from "drizzle-orm";
import { memoryService } from "@/lib/ai/memory";
import { buildChatContext } from "@/lib/ai/context";
import { generateChat } from "@/lib/ai/gateway";
import type {
  ConversationResponse,
  MessageResponse,
  PostMessageResponse,
} from "./schemas";

export async function createConversation(
  userId: string,
  characterId: string,
): Promise<
  | { success: true; conversation: ConversationResponse }
  | { success: false; status: 403 | 404; error: string }
> {
  // 1. Verify character exists and is accessible
  const [character] = await db
    .select()
    .from(characters)
    .where(eq(characters.id, characterId))
    .limit(1);

  if (!character) {
    return { success: false, status: 404, error: "Character not found" };
  }

  const isOwner = character.creatorId === userId;
  const isDiscoverable =
    character.visibility === "public" && character.isPublished;

  if (!isOwner && !isDiscoverable) {
    return {
      success: false,
      status: 403,
      error: "Access denied: Character is private and unpublished",
    };
  }

  // 2. Check for existing conversation with this character
  const [existing] = await db
    .select()
    .from(conversations)
    .where(
      and(
        eq(conversations.userId, userId),
        eq(conversations.characterId, characterId),
      ),
    )
    .limit(1);

  if (existing) {
    return {
      success: true,
      conversation: {
        id: existing.id,
        userId: existing.userId,
        characterId: existing.characterId,
        createdAt: existing.createdAt.toISOString(),
        updatedAt: existing.updatedAt.toISOString(),
        character: {
          id: character.id,
          name: character.name,
          avatarUrl: character.avatarUrl,
          description: character.description,
        },
      },
    };
  }

  // 3. Create new conversation
  const [newConv] = await db
    .insert(conversations)
    .values({
      userId,
      characterId,
    })
    .returning();

  return {
    success: true,
    conversation: {
      id: newConv.id,
      userId: newConv.userId,
      characterId: newConv.characterId,
      createdAt: newConv.createdAt.toISOString(),
      updatedAt: newConv.updatedAt.toISOString(),
      character: {
        id: character.id,
        name: character.name,
        avatarUrl: character.avatarUrl,
        description: character.description,
      },
    },
  };
}

export async function listConversations(
  userId: string,
): Promise<ConversationResponse[]> {
  const rows = await db
    .select({
      id: conversations.id,
      userId: conversations.userId,
      characterId: conversations.characterId,
      createdAt: conversations.createdAt,
      updatedAt: conversations.updatedAt,
      charId: characters.id,
      charName: characters.name,
      charAvatar: characters.avatarUrl,
      charDesc: characters.description,
    })
    .from(conversations)
    .innerJoin(characters, eq(conversations.characterId, characters.id))
    .where(eq(conversations.userId, userId))
    .orderBy(desc(conversations.updatedAt));

  return rows.map((r) => ({
    id: r.id,
    userId: r.userId,
    characterId: r.characterId,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    character: {
      id: r.charId,
      name: r.charName,
      avatarUrl: r.charAvatar,
      description: r.charDesc,
    },
  }));
}

export async function getConversationById(
  conversationId: string,
  userId: string,
): Promise<
  | { success: true; conversation: ConversationResponse }
  | { success: false; status: 403 | 404; error: string }
> {
  const [row] = await db
    .select({
      id: conversations.id,
      userId: conversations.userId,
      characterId: conversations.characterId,
      createdAt: conversations.createdAt,
      updatedAt: conversations.updatedAt,
      charId: characters.id,
      charName: characters.name,
      charAvatar: characters.avatarUrl,
      charDesc: characters.description,
    })
    .from(conversations)
    .innerJoin(characters, eq(conversations.characterId, characters.id))
    .where(eq(conversations.id, conversationId))
    .limit(1);

  if (!row) {
    return { success: false, status: 404, error: "Conversation not found" };
  }

  if (row.userId !== userId) {
    return {
      success: false,
      status: 403,
      error: "Forbidden: You do not own this conversation",
    };
  }

  return {
    success: true,
    conversation: {
      id: row.id,
      userId: row.userId,
      characterId: row.characterId,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      character: {
        id: row.charId,
        name: row.charName,
        avatarUrl: row.charAvatar,
        description: row.charDesc,
      },
    },
  };
}

export async function getConversationMessages(
  conversationId: string,
  userId: string,
): Promise<
  | { success: true; messages: MessageResponse[] }
  | { success: false; status: 403 | 404; error: string }
> {
  // Check ownership
  const convCheck = await getConversationById(conversationId, userId);
  if (!convCheck.success) {
    return convCheck;
  }

  const rows = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(asc(messages.createdAt));

  return {
    success: true,
    messages: rows.map((m) => ({
      id: m.id,
      conversationId: m.conversationId,
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
      createdAt: m.createdAt.toISOString(),
    })),
  };
}

export interface PostMessageParams {
  conversationId: string;
  userId: string;
  content: string;
  provider?: string;
  model?: string;
}

export async function postMessageAndGenerateReply(
  params: PostMessageParams,
): Promise<
  | { success: true; data: PostMessageResponse }
  | { success: false; status: 400 | 403 | 404 | 502; error: string }
> {
  const { conversationId, userId, content, provider, model } = params;

  // 1. Verify ownership and get character reference
  const [conv] = await db
    .select({
      id: conversations.id,
      userId: conversations.userId,
      characterId: conversations.characterId,
    })
    .from(conversations)
    .where(eq(conversations.id, conversationId))
    .limit(1);

  if (!conv) {
    return { success: false, status: 404, error: "Conversation not found" };
  }

  if (conv.userId !== userId) {
    return {
      success: false,
      status: 403,
      error: "Forbidden: You do not own this conversation",
    };
  }

  // 2. Load character
  const [char] = await db
    .select()
    .from(characters)
    .where(eq(characters.id, conv.characterId))
    .limit(1);

  if (!char) {
    return {
      success: false,
      status: 404,
      error: "Associated character not found",
    };
  }

  // 3. Save incoming user message
  const [userMsg] = await db
    .insert(messages)
    .values({
      conversationId,
      role: "user",
      content,
    })
    .returning();

  // 4. Load memory context (L1/L2/L3)
  // Exclude the just-inserted user message by ID so it isn't duplicated
  // (buildChatContext will append newUserMessage separately)
  const memory = await memoryService.getMemoryContext(conversationId, {
    l1Limit: 20,
    excludeMessageIds: [userMsg.id],
  });

  // 5. Build full prompt context
  const fullContextMessages = buildChatContext({
    character: {
      name: char.name,
      personality: char.personality,
      interests: char.interests,
      communicationStyle: char.communicationStyle,
      relationshipDynamic: char.relationshipDynamic,
      systemPrompt: char.systemPrompt,
    },
    memory,
    newUserMessage: content,
  });

  // 6. Execute AI Gateway call
  let aiResponse;
  try {
    aiResponse = await generateChat({
      messages: fullContextMessages,
      provider,
      model,
    });
  } catch (error) {
    console.error("[Conversations Service AI Error]", {
      conversationId,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    // Clean up the newly inserted user message so we don't leave an orphaned message in history
    await db
      .delete(messages)
      .where(eq(messages.id, userMsg.id))
      .catch(() => {});

    return {
      success: false,
      status: 502,
      error: "AI provider failed to generate a reply. Please try again later.",
    };
  }

  // 7. Save assistant message
  const [assistantMsg] = await db
    .insert(messages)
    .values({
      conversationId,
      role: "assistant",
      content: aiResponse.content,
    })
    .returning();

  // 8. Update conversation timestamp
  await db
    .update(conversations)
    .set({ updatedAt: new Date() })
    .where(eq(conversations.id, conversationId));

  return {
    success: true,
    data: {
      userMessage: {
        id: userMsg.id,
        conversationId: userMsg.conversationId,
        role: "user",
        content: userMsg.content,
        createdAt: userMsg.createdAt.toISOString(),
      },
      assistantMessage: {
        id: assistantMsg.id,
        conversationId: assistantMsg.conversationId,
        role: "assistant",
        content: assistantMsg.content,
        createdAt: assistantMsg.createdAt.toISOString(),
      },
      meta: {
        provider: aiResponse.provider,
        model: aiResponse.model,
        latencyMs: aiResponse.latencyMs,
        tokens: aiResponse.tokens,
      },
    },
  };
}

