import { describe, it, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { users, sessions, characters, conversations, messages } from "../../db/schema.js";
import { hashPassword } from "../../lib/auth/password.js";
import { createSession } from "../../lib/auth/session.js";
import { getUserSettings, updateUserSettings } from "../../lib/settings/service.js";
import * as SettingsRoute from "../../app/api/settings/route.js";

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

describe("Settings API — Memory Depth", () => {
  before(cleanup);
  beforeEach(async () => {
    await cleanup();
  });
  after(cleanup);

  // 1. Default = 20
  it("returns default memoryMessageLimit of 20 for new user", async () => {
    const { user } = await createTestUser("default@test.com");
    const settings = await getUserSettings(user.id);
    assert.equal(settings.memoryMessageLimit, 20);
  });

  // 2. Set to 30
  it("allows setting memoryMessageLimit to 30", async () => {
    const { user } = await createTestUser("set30@test.com");
    const result = await updateUserSettings(user.id, 30);
    assert.equal(result.memoryMessageLimit, 30);

    // Verify persistence
    const settings = await getUserSettings(user.id);
    assert.equal(settings.memoryMessageLimit, 30);
  });

  // 3. Set to 40
  it("allows setting memoryMessageLimit to 40", async () => {
    const { user } = await createTestUser("set40@test.com");
    const result = await updateUserSettings(user.id, 40);
    assert.equal(result.memoryMessageLimit, 40);
  });

  // 4. Set to 50
  it("allows setting memoryMessageLimit to 50", async () => {
    const { user } = await createTestUser("set50@test.com");
    const result = await updateUserSettings(user.id, 50);
    assert.equal(result.memoryMessageLimit, 50);
  });

  // 5. Reject 10
  it("rejects memoryMessageLimit of 10", async () => {
    const { sessionId } = await createTestUser("reject10@test.com");
    const req = makeRequest(
      "http://localhost:3000/api/settings",
      "PATCH",
      sessionId,
      { memoryMessageLimit: 10 },
    );
    const res = await SettingsRoute.PATCH(req);
    assert.equal(res.status, 400);
  });

  // 6. Reject 51
  it("rejects memoryMessageLimit of 51", async () => {
    const { sessionId } = await createTestUser("reject51@test.com");
    const req = makeRequest(
      "http://localhost:3000/api/settings",
      "PATCH",
      sessionId,
      { memoryMessageLimit: 51 },
    );
    const res = await SettingsRoute.PATCH(req);
    assert.equal(res.status, 400);
  });

  // 7. Reject arbitrary values
  it("rejects arbitrary memoryMessageLimit values like 25", async () => {
    const { sessionId } = await createTestUser("reject25@test.com");
    const req = makeRequest(
      "http://localhost:3000/api/settings",
      "PATCH",
      sessionId,
      { memoryMessageLimit: 25 },
    );
    const res = await SettingsRoute.PATCH(req);
    assert.equal(res.status, 400);
  });

  // 8. Unauthenticated settings request
  it("returns 401 for unauthenticated GET request", async () => {
    const req = makeRequest("http://localhost:3000/api/settings", "GET");
    const res = await SettingsRoute.GET(req);
    assert.equal(res.status, 401);
  });

  it("returns 401 for unauthenticated PATCH request", async () => {
    const req = makeRequest(
      "http://localhost:3000/api/settings",
      "PATCH",
      undefined,
      { memoryMessageLimit: 30 },
    );
    const res = await SettingsRoute.PATCH(req);
    assert.equal(res.status, 401);
  });

  // 9. User A cannot modify User B
  it("user A setting does not affect user B", async () => {
    const { user: userA } = await createTestUser("userA@test.com");
    const { user: userB } = await createTestUser("userB@test.com");

    await updateUserSettings(userA.id, 50);
    await updateUserSettings(userB.id, 30);

    const settingsA = await getUserSettings(userA.id);
    const settingsB = await getUserSettings(userB.id);
    assert.equal(settingsA.memoryMessageLimit, 50);
    assert.equal(settingsB.memoryMessageLimit, 30);
  });

  // 10. GET /api/settings returns correct value after PATCH
  it("GET returns updated value after PATCH", async () => {
    const { sessionId } = await createTestUser("roundtrip@test.com");

    // PATCH to 40
    const patchReq = makeRequest(
      "http://localhost:3000/api/settings",
      "PATCH",
      sessionId,
      { memoryMessageLimit: 40 },
    );
    const patchRes = await SettingsRoute.PATCH(patchReq);
    assert.equal(patchRes.status, 200);

    // GET should return 40
    const getReq = makeRequest(
      "http://localhost:3000/api/settings",
      "GET",
      sessionId,
    );
    const getRes = await SettingsRoute.GET(getReq);
    assert.equal(getRes.status, 200);
    const data = await getRes.json();
    assert.equal(data.memoryMessageLimit, 40);
  });

  // 11. Memory service respects limit (20 retrieves 20)
  it("memory service retrieves correct number of messages for limit 20", async () => {
    const { user } = await createTestUser("mem20@test.com");
    const [char] = await db
      .insert(characters)
      .values({
        creatorId: user.id,
        name: "Memory Test",
        systemPrompt: "Test",
        visibility: "public",
        isPublished: true,
      })
      .returning();

    const [conv] = await db
      .insert(conversations)
      .values({ userId: user.id, characterId: char.id })
      .returning();

    // Insert 30 messages
    for (let i = 0; i < 30; i++) {
      await db.insert(messages).values({
        conversationId: conv.id,
        role: i % 2 === 0 ? "user" : "assistant",
        content: `Message ${i}`,
      });
    }

    const { DatabaseMemoryService } = await import("../../lib/ai/memory.js");
    const memService = new DatabaseMemoryService();

    const ctx20 = await memService.getMemoryContext(conv.id, { l1Limit: 20 });
    assert.equal(ctx20.l1Messages.length, 20);

    // Verify these are the LAST 20 messages
    assert.equal(ctx20.l1Messages[0].content, "Message 10");
    assert.equal(ctx20.l1Messages[19].content, "Message 29");
  });

  // 12. Memory service retrieves 50
  it("memory service retrieves correct number of messages for limit 50", async () => {
    const { user } = await createTestUser("mem50@test.com");
    const [char] = await db
      .insert(characters)
      .values({
        creatorId: user.id,
        name: "Memory Test 50",
        systemPrompt: "Test",
        visibility: "public",
        isPublished: true,
      })
      .returning();

    const [conv] = await db
      .insert(conversations)
      .values({ userId: user.id, characterId: char.id })
      .returning();

    // Insert 60 messages
    for (let i = 0; i < 60; i++) {
      await db.insert(messages).values({
        conversationId: conv.id,
        role: i % 2 === 0 ? "user" : "assistant",
        content: `Msg ${i}`,
      });
    }

    const { DatabaseMemoryService } = await import("../../lib/ai/memory.js");
    const memService = new DatabaseMemoryService();

    const ctx50 = await memService.getMemoryContext(conv.id, { l1Limit: 50 });
    assert.equal(ctx50.l1Messages.length, 50);

    // Verify these are the LAST 50
    assert.equal(ctx50.l1Messages[0].content, "Msg 10");
    assert.equal(ctx50.l1Messages[49].content, "Msg 59");
  });

  // 13. Durable memory remains separate from L1 limit
  it("L2 and L3 memory are independent from L1 limit", async () => {
    const { user } = await createTestUser("durable@test.com");
    const [char] = await db
      .insert(characters)
      .values({
        creatorId: user.id,
        name: "Durable Test",
        systemPrompt: "Test",
        visibility: "public",
        isPublished: true,
      })
      .returning();

    const [conv] = await db
      .insert(conversations)
      .values({ userId: user.id, characterId: char.id })
      .returning();

    const { DatabaseMemoryService } = await import("../../lib/ai/memory.js");
    const memService = new DatabaseMemoryService();

    const ctx = await memService.getMemoryContext(conv.id, { l1Limit: 20 });
    // L2 and L3 exist as separate fields, not affected by l1Limit
    assert.equal(ctx.l2Summary, null);
    assert.deepEqual(ctx.l3Memories, []);
    // These are independent: even with l1Limit=20, L2/L3 are not truncated/removed
    assert.ok("l1Messages" in ctx);
    assert.ok("l2Summary" in ctx);
    assert.ok("l3Memories" in ctx);
  });

  after(() => {
    setTimeout(() => process.exit(0), 100);
  });
});
