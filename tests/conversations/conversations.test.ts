import { describe, it, before, after, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import {
  users,
  sessions,
  characters,
  conversations,
  messages,
} from "../../db/schema.js";
import { hashPassword } from "../../lib/auth/password.js";
import { createSession } from "../../lib/auth/session.js";
import * as ConversationsRoute from "../../app/api/conversations/route.js";
import * as ConversationIdRoute from "../../app/api/conversations/[id]/route.js";
import * as MessagesRoute from "../../app/api/conversations/[id]/messages/route.js";

async function cleanup() {
  await db.delete(messages);
  await db.delete(conversations);
  await db.delete(characters);
  await db.delete(sessions);
  await db.delete(users);
}

async function createTestUser(email: string) {
  const passwordHash = await hashPassword("password-123");
  const [user] = await db
    .insert(users)
    .values({ email, name: "Test User", passwordHash })
    .returning();
  const sessionId = await createSession(user.id);
  return { user, sessionId };
}

async function createTestCharacter(
  creatorId: string,
  visibility: "private" | "public" = "public",
  isPublished = true,
) {
  const [char] = await db
    .insert(characters)
    .values({
      creatorId,
      name: "Test Companion",
      personality: "Empathetic and thoughtful",
      systemPrompt: "You are a test companion. Respond helpfully.",
      visibility,
      isPublished,
    })
    .returning();
  return char;
}

function makeRequest(
  url: string,
  method: string,
  sessionId?: string,
  body?: unknown,
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (sessionId) {
    headers["cookie"] = `session_id=${sessionId}`;
  }
  return new Request(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

describe("Conversations & Chat API", () => {
  const originalFetch = globalThis.fetch;

  before(cleanup);
  beforeEach(async () => {
    await cleanup();

    // Mock fetch for AI provider calls
    globalThis.fetch = (async (url: string, init?: RequestInit) => {
      return new Response(
        JSON.stringify({
          model: "qwen38-27b",
          choices: [
            {
              message: {
                role: "assistant",
                content: "Hello! I am here and listening.",
              },
            },
          ],
          usage: { prompt_tokens: 10, completion_tokens: 8, total_tokens: 18 },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }) as any;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  after(cleanup);

  // 8. Unauthenticated chat
  it("rejects unauthenticated requests with 401", async () => {
    const req1 = makeRequest(
      "http://localhost:3000/api/conversations",
      "POST",
      undefined,
      { characterId: "00000000-0000-0000-0000-000000000000" },
    );
    const res1 = await ConversationsRoute.POST(req1);
    assert.equal(res1.status, 401);

    const req2 = makeRequest(
      "http://localhost:3000/api/conversations/00000000-0000-0000-0000-000000000000/messages",
      "POST",
      undefined,
      { content: "Hello" },
    );
    const res2 = await MessagesRoute.POST(req2, {
      params: Promise.resolve({ id: "00000000-0000-0000-0000-000000000000" }),
    });
    assert.equal(res2.status, 401);
  });

  // 9. Character access authorization
  it("rejects conversation creation with another user's private unpublished character (403)", async () => {
    const { user: owner } = await createTestUser("owner@example.com");
    const { sessionId: visitorSession } = await createTestUser("visitor@example.com");

    const privateChar = await createTestCharacter(
      owner.id,
      "private",
      false, // unpublished
    );

    const req = makeRequest(
      "http://localhost:3000/api/conversations",
      "POST",
      visitorSession,
      { characterId: privateChar.id },
    );
    const res = await ConversationsRoute.POST(req);
    assert.equal(res.status, 403);
    const body = await res.json();
    assert.ok(body.error.includes("Access denied"));
  });

  // 10. Chat request validation
  it("rejects invalid request payload with 400", async () => {
    const { sessionId } = await createTestUser("user-val@example.com");

    const req1 = makeRequest(
      "http://localhost:3000/api/conversations",
      "POST",
      sessionId,
      { characterId: "not-a-uuid" },
    );
    const res1 = await ConversationsRoute.POST(req1);
    assert.equal(res1.status, 400);

    const req2 = makeRequest(
      "http://localhost:3000/api/conversations/00000000-0000-0000-0000-000000000000/messages",
      "POST",
      sessionId,
      { content: "" }, // Empty content
    );
    const res2 = await MessagesRoute.POST(req2, {
      params: Promise.resolve({ id: "00000000-0000-0000-0000-000000000000" }),
    });
    assert.equal(res2.status, 400);
  });

  // 7. Conversation ownership
  it("rejects non-owner attempts to read or post messages to conversation (403)", async () => {
    const { user: userA, sessionId: sessionA } = await createTestUser("user-a@example.com");
    const { sessionId: sessionB } = await createTestUser("user-b@example.com");

    const char = await createTestCharacter(userA.id, "public", true);

    // User A creates conversation
    const createReq = makeRequest(
      "http://localhost:3000/api/conversations",
      "POST",
      sessionA,
      { characterId: char.id },
    );
    const createRes = await ConversationsRoute.POST(createReq);
    assert.equal(createRes.status, 201);
    const conv = await createRes.json();

    // User B tries to get messages from User A's conversation
    const getReq = makeRequest(
      `http://localhost:3000/api/conversations/${conv.id}/messages`,
      "GET",
      sessionB,
    );
    const getRes = await MessagesRoute.GET(getReq, {
      params: Promise.resolve({ id: conv.id }),
    });
    assert.equal(getRes.status, 403);

    // User B tries to post a message to User A's conversation
    const postReq = makeRequest(
      `http://localhost:3000/api/conversations/${conv.id}/messages`,
      "POST",
      sessionB,
      { content: "Intruder message" },
    );
    const postRes = await MessagesRoute.POST(postReq, {
      params: Promise.resolve({ id: conv.id }),
    });
    assert.equal(postRes.status, 403);
  });

  // End-to-end conversation creation and AI chat reply
  it("creates conversation and generates assistant reply via AI Gateway", async () => {
    const { user, sessionId } = await createTestUser("chat-user@example.com");
    const char = await createTestCharacter(user.id, "public", true);

    // 1. Create conversation
    const createReq = makeRequest(
      "http://localhost:3000/api/conversations",
      "POST",
      sessionId,
      { characterId: char.id },
    );
    const createRes = await ConversationsRoute.POST(createReq);
    assert.equal(createRes.status, 201);
    const conv = await createRes.json();
    assert.equal(conv.userId, user.id);
    assert.equal(conv.characterId, char.id);

    // 2. Post user message
    const msgReq = makeRequest(
      `http://localhost:3000/api/conversations/${conv.id}/messages`,
      "POST",
      sessionId,
      {
        content: "Tell me your thoughts.",
        provider: "zrok",
        model: "qwen38-27b",
      },
    );
    const msgRes = await MessagesRoute.POST(msgReq, {
      params: Promise.resolve({ id: conv.id }),
    });
    assert.equal(msgRes.status, 200);
    const msgData = await msgRes.json();

    assert.equal(msgData.userMessage.content, "Tell me your thoughts.");
    assert.equal(msgData.userMessage.role, "user");
    assert.equal(msgData.assistantMessage.content, "Hello! I am here and listening.");
    assert.equal(msgData.assistantMessage.role, "assistant");
    assert.equal(msgData.meta.provider, "zrok");

    // 3. Verify messages are saved in database
    const savedMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conv.id));
    assert.equal(savedMessages.length, 2);
  });

  it("returns 502 and cleans up orphaned user message if AI provider fails", async () => {
    const { user, sessionId } = await createTestUser("ai-failure-user@example.com");
    const char = await createTestCharacter(user.id, "public", true);

    const createReq = makeRequest(
      "http://localhost:3000/api/conversations",
      "POST",
      sessionId,
      { characterId: char.id },
    );
    const createRes = await ConversationsRoute.POST(createReq);
    const conv = await createRes.json();

    // Mock fetch to simulate AI provider failure
    globalThis.fetch = (async () => {
      return new Response("Upstream Server Error", { status: 500 });
    }) as any;

    const msgReq = makeRequest(
      `http://localhost:3000/api/conversations/${conv.id}/messages`,
      "POST",
      sessionId,
      { content: "This should not be orphaned" },
    );
    const msgRes = await MessagesRoute.POST(msgReq, {
      params: Promise.resolve({ id: conv.id }),
    });

    assert.equal(msgRes.status, 502);
    const errData = await msgRes.json();
    assert.equal(
      errData.error,
      "AI provider failed to generate a reply. Please try again later.",
    );

    // Verify NO orphaned message was left in DB
    const savedMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conv.id));
    assert.equal(savedMessages.length, 0);
  });
});

// Force exit after tests since postgres connection pool keeps the process alive
after(() => {
  setTimeout(() => process.exit(0), 100);
});
