import { db } from "@/db";
import { characters } from "@/db/schema";
import { eq, and, or, desc } from "drizzle-orm";
import type {
  CreateCharacterInput,
  UpdateCharacterInput,
  CharacterOwnerResponse,
  CharacterPublicResponse,
  CharacterListResponse,
} from "./schemas";

function formatOwnerResponse(row: typeof characters.$inferSelect): CharacterOwnerResponse {
  return {
    id: row.id,
    creatorId: row.creatorId,
    name: row.name,
    description: row.description,
    avatarUrl: row.avatarUrl,
    personality: row.personality,
    interests: row.interests ?? [],
    communicationStyle: row.communicationStyle,
    relationshipDynamic: row.relationshipDynamic,
    systemPrompt: row.systemPrompt,
    visibility: row.visibility,
    isPublished: row.isPublished,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function formatPublicResponse(row: typeof characters.$inferSelect): CharacterPublicResponse {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    avatarUrl: row.avatarUrl,
    personality: row.personality,
    interests: row.interests ?? [],
    communicationStyle: row.communicationStyle,
    relationshipDynamic: row.relationshipDynamic,
    visibility: row.visibility,
    isPublished: row.isPublished,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function createCharacter(
  creatorId: string,
  input: CreateCharacterInput,
): Promise<CharacterOwnerResponse> {
  const [created] = await db
    .insert(characters)
    .values({
      creatorId,
      name: input.name,
      description: input.description ?? null,
      avatarUrl: input.avatarUrl ?? null,
      personality: input.personality ?? null,
      interests: input.interests ?? [],
      communicationStyle: input.communicationStyle ?? null,
      relationshipDynamic: input.relationshipDynamic ?? null,
      systemPrompt: input.systemPrompt,
      visibility: input.visibility ?? "private",
      isPublished: input.isPublished ?? false,
    })
    .returning();

  return formatOwnerResponse(created);
}

export async function getCharacterById(
  characterId: string,
  currentUserId: string,
): Promise<
  | { success: true; character: CharacterOwnerResponse | CharacterPublicResponse; isOwner: boolean }
  | { success: false; status: 403 | 404; error: string }
> {
  const [character] = await db
    .select()
    .from(characters)
    .where(eq(characters.id, characterId))
    .limit(1);

  if (!character) {
    return { success: false, status: 404, error: "Character not found" };
  }

  // Owner check
  if (character.creatorId === currentUserId) {
    return {
      success: true,
      character: formatOwnerResponse(character),
      isOwner: true,
    };
  }

  // Non-owner security invariant: must be both public AND published
  if (character.visibility === "public" && character.isPublished === true) {
    return {
      success: true,
      character: formatPublicResponse(character),
      isOwner: false,
    };
  }

  // Private or unpublished character viewed by non-owner
  return {
    success: false,
    status: 403,
    error: "Access denied: Character is private",
  };
}

export async function listCharacters(
  currentUserId: string,
): Promise<CharacterListResponse> {
  const rows = await db
    .select()
    .from(characters)
    .where(
      or(
        eq(characters.creatorId, currentUserId),
        and(eq(characters.visibility, "public"), eq(characters.isPublished, true)),
      ),
    )
    .orderBy(desc(characters.createdAt));

  // Deduplicate by ID and format according to ownership
  const seen = new Set<string>();
  const characterList: (CharacterOwnerResponse | CharacterPublicResponse)[] = [];

  for (const row of rows) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);

    if (row.creatorId === currentUserId) {
      characterList.push(formatOwnerResponse(row));
    } else {
      characterList.push(formatPublicResponse(row));
    }
  }

  return { characters: characterList };
}

export async function updateCharacter(
  characterId: string,
  currentUserId: string,
  input: UpdateCharacterInput,
): Promise<
  | { success: true; character: CharacterOwnerResponse }
  | { success: false; status: 403 | 404; error: string }
> {
  const [character] = await db
    .select()
    .from(characters)
    .where(eq(characters.id, characterId))
    .limit(1);

  if (!character) {
    return { success: false, status: 404, error: "Character not found" };
  }

  if (character.creatorId !== currentUserId) {
    return {
      success: false,
      status: 403,
      error: "Forbidden: You are not the creator of this character",
    };
  }

  // Build clean update object (creatorId is never updatable)
  const updateValues: Partial<typeof characters.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (input.name !== undefined) updateValues.name = input.name;
  if (input.description !== undefined) updateValues.description = input.description;
  if (input.avatarUrl !== undefined) updateValues.avatarUrl = input.avatarUrl;
  if (input.personality !== undefined) updateValues.personality = input.personality;
  if (input.interests !== undefined) updateValues.interests = input.interests;
  if (input.communicationStyle !== undefined) updateValues.communicationStyle = input.communicationStyle;
  if (input.relationshipDynamic !== undefined) updateValues.relationshipDynamic = input.relationshipDynamic;
  if (input.systemPrompt !== undefined) updateValues.systemPrompt = input.systemPrompt;
  if (input.visibility !== undefined) updateValues.visibility = input.visibility;
  if (input.isPublished !== undefined) updateValues.isPublished = input.isPublished;

  const [updated] = await db
    .update(characters)
    .set(updateValues)
    .where(eq(characters.id, characterId))
    .returning();

  return {
    success: true,
    character: formatOwnerResponse(updated),
  };
}

export async function deleteCharacter(
  characterId: string,
  currentUserId: string,
): Promise<
  | { success: true }
  | { success: false; status: 403 | 404; error: string }
> {
  const [character] = await db
    .select()
    .from(characters)
    .where(eq(characters.id, characterId))
    .limit(1);

  if (!character) {
    return { success: false, status: 404, error: "Character not found" };
  }

  if (character.creatorId !== currentUserId) {
    return {
      success: false,
      status: 403,
      error: "Forbidden: You are not the creator of this character",
    };
  }

  await db.delete(characters).where(eq(characters.id, characterId));
  return { success: true };
}
