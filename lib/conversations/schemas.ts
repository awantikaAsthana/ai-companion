import { z } from "zod";
import "zod-openapi";

export const createConversationSchema = z
  .object({
    characterId: z
      .string()
      .uuid("Invalid character ID format")
      .meta({
        description: "UUID of the character to converse with",
        example: "123e4567-e89b-12d3-a456-426614174000",
      }),
  })
  .meta({ id: "CreateConversationRequest" });

export const postMessageSchema = z
  .object({
    content: z
      .string()
      .trim()
      .min(1, "Message content cannot be empty")
      .max(10000, "Message content cannot exceed 10000 characters")
      .meta({
        description: "User message content",
        example: "Hello, tell me about your day.",
      }),
    provider: z
      .string()
      .trim()
      .optional()
      .meta({
        description: "Target AI provider (e.g. zrok, openrouter, ollama)",
        example: "zrok",
      }),
    model: z
      .string()
      .trim()
      .optional()
      .meta({
        description: "Target model identifier",
        example: "qwen38-27b",
      }),
  })
  .meta({ id: "PostMessageRequest" });

export const conversationIdParamSchema = z
  .object({
    id: z
      .string()
      .uuid("Invalid conversation ID format")
      .meta({ description: "Conversation UUID" }),
  })
  .meta({ id: "ConversationIdParam" });

export const messageResponseSchema = z
  .object({
    id: z.string().uuid().meta({ description: "Message UUID" }),
    conversationId: z.string().uuid().meta({ description: "Conversation UUID" }),
    role: z.enum(["user", "assistant", "system"]).meta({ description: "Role" }),
    content: z.string().meta({ description: "Message content" }),
    createdAt: z.string().meta({ description: "ISO 8601 timestamp" }),
  })
  .meta({ id: "MessageResponse" });

export const conversationResponseSchema = z
  .object({
    id: z.string().uuid().meta({ description: "Conversation UUID" }),
    userId: z.string().uuid().meta({ description: "User UUID" }),
    characterId: z.string().uuid().meta({ description: "Character UUID" }),
    createdAt: z.string().meta({ description: "ISO 8601 timestamp" }),
    updatedAt: z.string().meta({ description: "ISO 8601 timestamp" }),
    character: z
      .object({
        id: z.string().uuid(),
        name: z.string(),
        avatarUrl: z.string().nullable(),
        description: z.string().nullable(),
      })
      .optional(),
  })
  .meta({ id: "ConversationResponse" });

export const conversationListResponseSchema = z
  .object({
    conversations: z.array(conversationResponseSchema),
  })
  .meta({ id: "ConversationListResponse" });

export const conversationMessagesResponseSchema = z
  .object({
    messages: z.array(messageResponseSchema),
  })
  .meta({ id: "ConversationMessagesResponse" });

export const postMessageResponseSchema = z
  .object({
    userMessage: messageResponseSchema,
    assistantMessage: messageResponseSchema,
    meta: z.object({
      provider: z.string(),
      model: z.string(),
      latencyMs: z.number().optional(),
      tokens: z
        .object({
          promptTokens: z.number().optional(),
          completionTokens: z.number().optional(),
          totalTokens: z.number().optional(),
        })
        .optional(),
    }),
  })
  .meta({ id: "PostMessageResponse" });

export type CreateConversationInput = z.infer<typeof createConversationSchema>;
export type PostMessageInput = z.infer<typeof postMessageSchema>;
export type ConversationResponse = z.infer<typeof conversationResponseSchema>;
export type MessageResponse = z.infer<typeof messageResponseSchema>;
export type PostMessageResponse = z.infer<typeof postMessageResponseSchema>;

