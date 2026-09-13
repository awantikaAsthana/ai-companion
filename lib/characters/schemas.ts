import { z } from "zod";
import "zod-openapi";

export const characterVisibilitySchema = z
  .enum(["private", "public"])
  .meta({ description: "Visibility of the character", example: "private" });

export const createCharacterSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(100, "Name cannot exceed 100 characters")
      .meta({ description: "Character display name", example: "Elena" }),
    description: z
      .string()
      .max(1000, "Description cannot exceed 1000 characters")
      .nullable()
      .optional()
      .meta({ description: "Short description or bio", example: "Poetic and observant" }),
    avatarUrl: z
      .string()
      .max(2048, "Avatar URL cannot exceed 2048 characters")
      .nullable()
      .optional()
      .meta({ description: "Avatar image URL or path", example: "/characters/character-01.webp" }),
    personality: z
      .string()
      .max(2000, "Personality cannot exceed 2000 characters")
      .nullable()
      .optional()
      .meta({ description: "Personality traits and demeanor", example: "Quietly intoxicating, thoughtful" }),
    interests: z
      .array(z.string().trim().min(1).max(50))
      .max(30, "Cannot exceed 30 interests")
      .default([])
      .meta({ description: "Array of interest tags", example: ["Literature", "Philosophy"] }),
    communicationStyle: z
      .string()
      .max(1000, "Communication style cannot exceed 1000 characters")
      .nullable()
      .optional()
      .meta({ description: "Communication cadence and tone", example: "Intimate and reflective" }),
    relationshipDynamic: z
      .string()
      .max(1000, "Relationship dynamic cannot exceed 1000 characters")
      .nullable()
      .optional()
      .meta({ description: "Relationship dynamic or archetype", example: "Intellectual confidant" }),
    systemPrompt: z
      .string()
      .trim()
      .min(1, "System prompt is required")
      .max(10000, "System prompt cannot exceed 10000 characters")
      .meta({ description: "Core system instructions for character behaviour", example: "You are Elena..." }),
    visibility: characterVisibilitySchema.default("private"),
    isPublished: z
      .boolean()
      .default(false)
      .meta({ description: "Whether the character is published for discovery", example: false }),
  })
  .meta({ id: "CreateCharacterRequest" });

export const updateCharacterSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name cannot be empty")
      .max(100, "Name cannot exceed 100 characters")
      .optional(),
    description: z
      .string()
      .max(1000, "Description cannot exceed 1000 characters")
      .nullable()
      .optional(),
    avatarUrl: z
      .string()
      .max(2048, "Avatar URL cannot exceed 2048 characters")
      .nullable()
      .optional(),
    personality: z
      .string()
      .max(2000, "Personality cannot exceed 2000 characters")
      .nullable()
      .optional(),
    interests: z
      .array(z.string().trim().min(1).max(50))
      .max(30, "Cannot exceed 30 interests")
      .optional(),
    communicationStyle: z
      .string()
      .max(1000, "Communication style cannot exceed 1000 characters")
      .nullable()
      .optional(),
    relationshipDynamic: z
      .string()
      .max(1000, "Relationship dynamic cannot exceed 1000 characters")
      .nullable()
      .optional(),
    systemPrompt: z
      .string()
      .trim()
      .min(1, "System prompt cannot be empty")
      .max(10000, "System prompt cannot exceed 10000 characters")
      .optional(),
    visibility: characterVisibilitySchema.optional(),
    isPublished: z.boolean().optional(),
  })
  .meta({ id: "UpdateCharacterRequest" });

export const characterIdParamSchema = z
  .object({
    id: z.string().uuid("Invalid character ID format").meta({ description: "Character UUID" }),
  })
  .meta({ id: "CharacterIdParam" });

/** Response shape for character owner (includes creatorId and systemPrompt). */
export const characterOwnerResponseSchema = z
  .object({
    id: z.string().uuid().meta({ description: "Character UUID" }),
    creatorId: z.string().uuid().meta({ description: "Owner User UUID" }),
    name: z.string().meta({ description: "Character name" }),
    description: z.string().nullable().meta({ description: "Character description" }),
    avatarUrl: z.string().nullable().meta({ description: "Avatar URL" }),
    personality: z.string().nullable().meta({ description: "Personality description" }),
    interests: z.array(z.string()).meta({ description: "List of interests" }),
    communicationStyle: z.string().nullable().meta({ description: "Communication style" }),
    relationshipDynamic: z.string().nullable().meta({ description: "Relationship dynamic" }),
    systemPrompt: z.string().meta({ description: "System prompt (owner only)" }),
    visibility: characterVisibilitySchema,
    isPublished: z.boolean().meta({ description: "Published status" }),
    createdAt: z.string().meta({ description: "ISO 8601 timestamp" }),
    updatedAt: z.string().meta({ description: "ISO 8601 timestamp" }),
  })
  .meta({ id: "CharacterOwnerResponse" });

/** Response shape for public/discovery (strictly excludes systemPrompt and creatorId). */
export const characterPublicResponseSchema = z
  .object({
    id: z.string().uuid().meta({ description: "Character UUID" }),
    name: z.string().meta({ description: "Character name" }),
    description: z.string().nullable().meta({ description: "Character description" }),
    avatarUrl: z.string().nullable().meta({ description: "Avatar URL" }),
    personality: z.string().nullable().meta({ description: "Personality description" }),
    interests: z.array(z.string()).meta({ description: "List of interests" }),
    communicationStyle: z.string().nullable().meta({ description: "Communication style" }),
    relationshipDynamic: z.string().nullable().meta({ description: "Relationship dynamic" }),
    visibility: characterVisibilitySchema,
    isPublished: z.boolean().meta({ description: "Published status" }),
    createdAt: z.string().meta({ description: "ISO 8601 timestamp" }),
    updatedAt: z.string().meta({ description: "ISO 8601 timestamp" }),
  })
  .meta({ id: "CharacterPublicResponse" });

export const characterListResponseSchema = z
  .object({
    characters: z.array(
      z.union([characterOwnerResponseSchema, characterPublicResponseSchema]),
    ),
  })
  .meta({ id: "CharacterListResponse" });

export type CreateCharacterInput = z.infer<typeof createCharacterSchema>;
export type UpdateCharacterInput = z.infer<typeof updateCharacterSchema>;
export type CharacterOwnerResponse = z.infer<typeof characterOwnerResponseSchema>;
export type CharacterPublicResponse = z.infer<typeof characterPublicResponseSchema>;
export type CharacterResponse = CharacterOwnerResponse | CharacterPublicResponse;
export type CharacterListResponse = z.infer<typeof characterListResponseSchema>;
