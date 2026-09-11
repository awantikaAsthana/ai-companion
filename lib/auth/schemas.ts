import { z } from "zod";
import "zod-openapi";

export const signupSchema = z
  .object({
    email: z
      .email()
      .transform((e) => e.toLowerCase())
      .meta({ description: "User email address", example: "user@example.com" }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .meta({ description: "User password (min 8 chars)", example: "example-password" }),
    name: z
      .string()
      .min(1, "Name is required")
      .meta({ description: "Display name", example: "User" }),
  })
  .meta({ id: "SignupRequest" });

export const loginSchema = z
  .object({
    email: z
      .email()
      .transform((e) => e.toLowerCase())
      .meta({ description: "User email address", example: "user@example.com" }),
    password: z
      .string()
      .min(1, "Password is required")
      .meta({ description: "User password", example: "example-password" }),
  })
  .meta({ id: "LoginRequest" });

export const userResponseSchema = z
  .object({
    id: z.string().meta({ description: "User UUID" }),
    email: z.string().meta({ description: "User email" }),
    name: z.string().nullable().meta({ description: "Display name" }),
    createdAt: z.string().meta({ description: "ISO 8601 timestamp" }),
    updatedAt: z.string().meta({ description: "ISO 8601 timestamp" }),
  })
  .meta({ id: "User" });

export const authResponseSchema = z
  .object({
    user: userResponseSchema,
  })
  .meta({ id: "AuthResponse" });

export const errorResponseSchema = z
  .object({
    error: z.string().meta({ description: "Error message" }),
  })
  .meta({ id: "ErrorResponse" });

export type SignupInput = z.output<typeof signupSchema>;
export type LoginInput = z.output<typeof loginSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;

