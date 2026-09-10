# Architecture

## Initial Architecture

Start as a modular monolith.

Browser
|
v
Next.js
|
+-- Authentication
+-- Characters
+-- Conversations
+-- Memory
+-- AI Gateway
+-- Billing
|
+-- PostgreSQL
+-- Redis

Do not introduce microservices unless there is a demonstrated need.

## AI Gateway

All AI requests go through an internal abstraction.

Target:

ai/
  router.ts
  models.ts
  prompts.ts
  memory.ts
  summarizer.ts
  token-budget.ts
  fallback.ts

The browser must never receive the OpenRouter API key.

## Context

Do not send the entire conversation history by default.

Use:

1. Character definition
2. Relevant memories
3. Conversation summary
4. Recent messages
5. Current message
