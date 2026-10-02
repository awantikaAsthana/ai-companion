import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  ALLOWED_MEMORY_LIMITS,
  DEFAULT_MEMORY_LIMIT,
  type MemoryMessageLimit,
  type SettingsResponse,
} from "./schemas";

export async function getUserSettings(userId: string): Promise<SettingsResponse> {
  const [user] = await db
    .select({ memoryMessageLimit: users.memoryMessageLimit })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return {
    memoryMessageLimit: user?.memoryMessageLimit ?? DEFAULT_MEMORY_LIMIT,
  };
}

export async function updateUserSettings(
  userId: string,
  memoryMessageLimit: MemoryMessageLimit,
): Promise<SettingsResponse> {
  // Server-side allowlist enforcement
  if (!ALLOWED_MEMORY_LIMITS.includes(memoryMessageLimit)) {
    throw new Error(`Invalid memoryMessageLimit: ${memoryMessageLimit}`);
  }

  const [updated] = await db
    .update(users)
    .set({
      memoryMessageLimit,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning({ memoryMessageLimit: users.memoryMessageLimit });

  return {
    memoryMessageLimit: updated?.memoryMessageLimit ?? DEFAULT_MEMORY_LIMIT,
  };
}
