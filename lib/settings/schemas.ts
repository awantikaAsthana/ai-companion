import { z } from "zod";
import "zod-openapi";

export const ALLOWED_MEMORY_LIMITS = [20, 30, 40, 50] as const;
export type MemoryMessageLimit = (typeof ALLOWED_MEMORY_LIMITS)[number];
export const DEFAULT_MEMORY_LIMIT: MemoryMessageLimit = 20;

export const updateSettingsSchema = z
  .object({
    memoryMessageLimit: z
      .number()
      .int()
      .refine((v): v is MemoryMessageLimit => ALLOWED_MEMORY_LIMITS.includes(v as MemoryMessageLimit), {
        message: `Must be one of: ${ALLOWED_MEMORY_LIMITS.join(", ")}`,
      })
      .meta({
        description: "Number of recent messages to retain as conversation context (L1)",
        example: 20,
      }),
  })
  .meta({ id: "UpdateSettingsRequest" });

export const settingsResponseSchema = z
  .object({
    memoryMessageLimit: z.number().int().meta({
      description: "Current L1 memory depth setting",
      example: 20,
    }),
  })
  .meta({ id: "SettingsResponse" });

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
export type SettingsResponse = z.infer<typeof settingsResponseSchema>;
