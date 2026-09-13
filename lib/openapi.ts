import { createDocument } from "zod-openapi";
import { z } from "zod";
import "zod-openapi";
import {
  signupSchema,
  loginSchema,
  authResponseSchema,
  errorResponseSchema,
} from "@/lib/auth/schemas";
import {
  createCharacterSchema,
  updateCharacterSchema,
  characterIdParamSchema,
  characterOwnerResponseSchema,
  characterPublicResponseSchema,
  characterListResponseSchema,
} from "@/lib/characters/schemas";

const validationErrorSchema = z
  .object({
    error: z.string(),
    details: z.array(z.record(z.string(), z.unknown())).optional(),
  })
  .meta({ id: "ValidationError" });

export const openApiDocument = createDocument({
  openapi: "3.1.0",
  info: {
    title: "AI Companion API",
    version: "1.0.0",
    description: "API for the AI Companion platform",
  },
  paths: {
    "/api/auth/signup": {
      post: {
        tags: ["Auth"],
        summary: "Create a new account",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: signupSchema },
          },
        },
        responses: {
          "201": {
            description: "Account created",
            content: {
              "application/json": { schema: authResponseSchema },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": { schema: validationErrorSchema },
            },
          },
          "409": {
            description: "Email already registered",
            content: {
              "application/json": { schema: errorResponseSchema },
            },
          },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Log in with email and password",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: loginSchema },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
            content: {
              "application/json": { schema: authResponseSchema },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": { schema: validationErrorSchema },
            },
          },
          "401": {
            description: "Invalid credentials",
            content: {
              "application/json": { schema: errorResponseSchema },
            },
          },
        },
      },
    },
    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Log out and invalidate session",
        responses: {
          "200": {
            description: "Logged out",
            content: {
              "application/json": {
                schema: z.object({ success: z.boolean() }),
              },
            },
          },
        },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current authenticated user",
        responses: {
          "200": {
            description: "Authenticated user",
            content: {
              "application/json": { schema: authResponseSchema },
            },
          },
          "401": {
            description: "Not authenticated",
            content: {
              "application/json": { schema: errorResponseSchema },
            },
          },
        },
      },
    },
    "/api/characters": {
      post: {
        tags: ["Characters"],
        summary: "Create a new character",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: createCharacterSchema },
          },
        },
        responses: {
          "201": {
            description: "Character created successfully",
            content: {
              "application/json": { schema: characterOwnerResponseSchema },
            },
          },
          "400": {
            description: "Validation error or invalid JSON",
            content: {
              "application/json": { schema: validationErrorSchema },
            },
          },
          "401": {
            description: "Not authenticated",
            content: {
              "application/json": { schema: errorResponseSchema },
            },
          },
        },
      },
      get: {
        tags: ["Characters"],
        summary: "List characters (creator's characters + public published characters)",
        responses: {
          "200": {
            description: "List of accessible characters",
            content: {
              "application/json": { schema: characterListResponseSchema },
            },
          },
          "401": {
            description: "Not authenticated",
            content: {
              "application/json": { schema: errorResponseSchema },
            },
          },
        },
      },
    },
    "/api/characters/{id}": {
      get: {
        tags: ["Characters"],
        summary: "Get character by ID",
        requestParams: {
          path: characterIdParamSchema,
        },
        responses: {
          "200": {
            description: "Character details",
            content: {
              "application/json": {
                schema: z
                  .union([characterOwnerResponseSchema, characterPublicResponseSchema])
                  .meta({ id: "CharacterDetailsResponse" }),
              },
            },
          },
          "400": {
            description: "Invalid character ID format",
            content: {
              "application/json": { schema: validationErrorSchema },
            },
          },
          "401": {
            description: "Not authenticated",
            content: {
              "application/json": { schema: errorResponseSchema },
            },
          },
          "403": {
            description: "Forbidden: character is private",
            content: {
              "application/json": { schema: errorResponseSchema },
            },
          },
          "404": {
            description: "Character not found",
            content: {
              "application/json": { schema: errorResponseSchema },
            },
          },
        },
      },
      patch: {
        tags: ["Characters"],
        summary: "Update character (creator only)",
        requestParams: {
          path: characterIdParamSchema,
        },
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: updateCharacterSchema },
          },
        },
        responses: {
          "200": {
            description: "Character updated successfully",
            content: {
              "application/json": { schema: characterOwnerResponseSchema },
            },
          },
          "400": {
            description: "Validation error or invalid JSON",
            content: {
              "application/json": { schema: validationErrorSchema },
            },
          },
          "401": {
            description: "Not authenticated",
            content: {
              "application/json": { schema: errorResponseSchema },
            },
          },
          "403": {
            description: "Forbidden: Not creator of character",
            content: {
              "application/json": { schema: errorResponseSchema },
            },
          },
          "404": {
            description: "Character not found",
            content: {
              "application/json": { schema: errorResponseSchema },
            },
          },
        },
      },
      delete: {
        tags: ["Characters"],
        summary: "Delete character (creator only)",
        requestParams: {
          path: characterIdParamSchema,
        },
        responses: {
          "204": {
            description: "Character deleted successfully",
          },
          "400": {
            description: "Invalid character ID format",
            content: {
              "application/json": { schema: validationErrorSchema },
            },
          },
          "401": {
            description: "Not authenticated",
            content: {
              "application/json": { schema: errorResponseSchema },
            },
          },
          "403": {
            description: "Forbidden: Not creator of character",
            content: {
              "application/json": { schema: errorResponseSchema },
            },
          },
          "404": {
            description: "Character not found",
            content: {
              "application/json": { schema: errorResponseSchema },
            },
          },
        },
      },
    },
  },
});
