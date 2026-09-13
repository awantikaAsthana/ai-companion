import { describe, it, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { users, sessions, characters } from "../../db/schema.js";
import { hashPassword } from "../../lib/auth/password.js";
import { createSession } from "../../lib/auth/session.js";
import {
  createCharacterSchema,
  updateCharacterSchema,
} from "../../lib/characters/schemas.js";
import * as CharactersRoute from "../../app/api/characters/route.js";
import * as CharacterIdRoute from "../../app/api/characters/[id]/route.js";

// ── helpers ──────────────────────────────────────────────────

async function cleanup() {
  await db.delete(characters);
  await db.delete(sessions);
  await db.delete(users);
}

async function createTestUser(
  email = "test-char-user@example.com",
  password = "password-123",
  name = "Character Tester",
) {
  const passwordHash = await hashPassword(password);
  const [user] = await db
    .insert(users)
    .values({ email, name, passwordHash })
    .returning();
  const sessionId = await createSession(user.id);
  return { user, sessionId };
}

function makePostRequest(url: string, sessionId?: string, body?: unknown) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (sessionId) {
    headers["cookie"] = `session_id=${sessionId}`;
  }
  return new Request(url, {
    method: "POST",
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

function makeGetRequest(url: string, sessionId?: string) {
  const headers: Record<string, string> = {};
  if (sessionId) {
    headers["cookie"] = `session_id=${sessionId}`;
  }
  return new Request(url, {
    method: "GET",
    headers,
  });
}

function makePatchRequest(url: string, sessionId?: string, body?: unknown) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (sessionId) {
    headers["cookie"] = `session_id=${sessionId}`;
  }
  return new Request(url, {
    method: "PATCH",
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

function makeDeleteRequest(url: string, sessionId?: string) {
  const headers: Record<string, string> = {};
  if (sessionId) {
    headers["cookie"] = `session_id=${sessionId}`;
  }
  return new Request(url, {
    method: "DELETE",
    headers,
  });
}

// ── schema validation tests ──────────────────────────────────

describe("Character Zod Schemas", () => {
  it("rejects creation without name or systemPrompt", () => {
    const res1 = createCharacterSchema.safeParse({ name: "Elena" });
    assert.equal(res1.success, false);

    const res2 = createCharacterSchema.safeParse({ systemPrompt: "Prompt" });
    assert.equal(res2.success, false);
  });

  it("rejects invalid visibility enum value", () => {
    const res = createCharacterSchema.safeParse({
      name: "Elena",
      systemPrompt: "You are Elena",
      visibility: "publc", // Typo intentionally
    });
    assert.equal(res.success, false);
  });

  it("applies defaults: visibility=private, isPublished=false, interests=[]", () => {
    const res = createCharacterSchema.safeParse({
      name: "Elena",
      systemPrompt: "You are Elena",
    });
    assert.equal(res.success, true);
    if (res.success) {
      assert.equal(res.data.visibility, "private");
      assert.equal(res.data.isPublished, false);
      assert.deepEqual(res.data.interests, []);
    }
  });
});

// ── API route tests ──────────────────────────────────────────

describe("Character API Routes", () => {
  before(cleanup);
  beforeEach(cleanup);
  after(cleanup);

  // ── Authentication enforcement ──
  it("POST /api/characters rejects unauthenticated request with 401", async () => {
    const req = makePostRequest("http://localhost:3000/api/characters", undefined, {
      name: "Elena",
      systemPrompt: "You are Elena",
    });
    const res = await CharactersRoute.POST(req);
    assert.equal(res.status, 401);
  });

  it("GET /api/characters rejects unauthenticated request with 401", async () => {
    const req = makeGetRequest("http://localhost:3000/api/characters");
    const res = await CharactersRoute.GET(req);
    assert.equal(res.status, 401);
  });

  it("GET /api/characters/[id] rejects unauthenticated request with 401", async () => {
    const req = makeGetRequest("http://localhost:3000/api/characters/11111111-1111-1111-1111-111111111111");
    const res = await CharacterIdRoute.GET(req, {
      params: Promise.resolve({ id: "11111111-1111-1111-1111-111111111111" }),
    });
    assert.equal(res.status, 401);
  });

  // ── Validation errors ──
  it("POST /api/characters rejects invalid payload with 400", async () => {
    const { sessionId } = await createTestUser("creator1@example.com");
    const req = makePostRequest("http://localhost:3000/api/characters", sessionId, {
      name: "", // empty name
      systemPrompt: "You are Elena",
    });
    const res = await CharactersRoute.POST(req);
    assert.equal(res.status, 400);
    const json = await res.json();
    assert.ok(json.error);
  });

  it("GET /api/characters/[id] rejects malformed UUID with 400", async () => {
    const { sessionId } = await createTestUser("creator2@example.com");
    const req = makeGetRequest("http://localhost:3000/api/characters/not-a-uuid", sessionId);
    const res = await CharacterIdRoute.GET(req, {
      params: Promise.resolve({ id: "not-a-uuid" }),
    });
    assert.equal(res.status, 400);
  });

  // ── Creation & creatorId derivation ──
  it("POST /api/characters creates character with session-derived creatorId", async () => {
    const { user, sessionId } = await createTestUser("creator3@example.com");
    const fakeCreatorId = "00000000-0000-0000-0000-000000000000";

    const req = makePostRequest("http://localhost:3000/api/characters", sessionId, {
      name: "Elena",
      description: "Poetic and observant",
      systemPrompt: "You are Elena...",
      interests: ["Poetry", "Philosophy"],
      creatorId: fakeCreatorId, // Should be completely ignored
      visibility: "private",
    });
    const res = await CharactersRoute.POST(req);
    assert.equal(res.status, 201);
    const created = await res.json();

    assert.ok(created.id);
    assert.equal(created.name, "Elena");
    assert.equal(created.creatorId, user.id, "creatorId must be set from session, not payload");
    assert.equal(created.systemPrompt, "You are Elena...");
    assert.deepEqual(created.interests, ["Poetry", "Philosophy"]);
    assert.equal(created.visibility, "private");
    assert.equal(created.isPublished, false);
  });

  // ── Access Control & System Prompt Privacy Invariant ──
  it("GET /api/characters/[id] returns full fields including systemPrompt to owner", async () => {
    const { user, sessionId } = await createTestUser("owner@example.com");
    const createReq = makePostRequest("http://localhost:3000/api/characters", sessionId, {
      name: "Private Assistant",
      systemPrompt: "Secret owner instructions",
      visibility: "private",
    });
    const createRes = await CharactersRoute.POST(createReq);
    const char = await createRes.json();

    const getReq = makeGetRequest(`http://localhost:3000/api/characters/${char.id}`, sessionId);
    const getRes = await CharacterIdRoute.GET(getReq, {
      params: Promise.resolve({ id: char.id }),
    });
    assert.equal(getRes.status, 200);
    const body = await getRes.json();
    assert.equal(body.id, char.id);
    assert.equal(body.systemPrompt, "Secret owner instructions", "Owner must receive systemPrompt");
    assert.equal(body.creatorId, user.id, "Owner must receive creatorId");
  });

  it("GET /api/characters/[id] returns 403 when non-owner accesses private character", async () => {
    const { sessionId: ownerSession } = await createTestUser("owner-priv@example.com");
    const { sessionId: otherSession } = await createTestUser("visitor-priv@example.com");

    const createReq = makePostRequest("http://localhost:3000/api/characters", ownerSession, {
      name: "Private Character",
      systemPrompt: "Top secret",
      visibility: "private",
    });
    const createRes = await CharactersRoute.POST(createReq);
    const char = await createRes.json();

    const getReq = makeGetRequest(`http://localhost:3000/api/characters/${char.id}`, otherSession);
    const getRes = await CharacterIdRoute.GET(getReq, {
      params: Promise.resolve({ id: char.id }),
    });
    assert.equal(getRes.status, 403);
  });

  it("GET /api/characters/[id] returns 403 when non-owner accesses public + unpublished character", async () => {
    const { sessionId: ownerSession } = await createTestUser("owner-unpub@example.com");
    const { sessionId: otherSession } = await createTestUser("visitor-unpub@example.com");

    const createReq = makePostRequest("http://localhost:3000/api/characters", ownerSession, {
      name: "Unpublished Public Character",
      systemPrompt: "Secret draft instructions",
      visibility: "public",
      isPublished: false, // public but not published
    });
    const createRes = await CharactersRoute.POST(createReq);
    const char = await createRes.json();

    const getReq = makeGetRequest(`http://localhost:3000/api/characters/${char.id}`, otherSession);
    const getRes = await CharacterIdRoute.GET(getReq, {
      params: Promise.resolve({ id: char.id }),
    });
    assert.equal(getRes.status, 403, "Public but unpublished must be 403 for non-owners");
  });

  it("GET /api/characters/[id] returns character WITHOUT systemPrompt and WITHOUT creatorId to non-owner when public + published", async () => {
    const { sessionId: ownerSession } = await createTestUser("owner-pub@example.com");
    const { sessionId: visitorSession } = await createTestUser("visitor-pub@example.com");

    const createReq = makePostRequest("http://localhost:3000/api/characters", ownerSession, {
      name: "Public Luminary",
      systemPrompt: "CONFIDENTIAL_PROMPT_DO_NOT_LEAK",
      visibility: "public",
      isPublished: true,
      personality: "Warm and inviting",
    });
    const createRes = await CharactersRoute.POST(createReq);
    const char = await createRes.json();

    const getReq = makeGetRequest(`http://localhost:3000/api/characters/${char.id}`, visitorSession);
    const getRes = await CharacterIdRoute.GET(getReq, {
      params: Promise.resolve({ id: char.id }),
    });
    assert.equal(getRes.status, 200);
    const body = await getRes.json();

    assert.equal(body.id, char.id);
    assert.equal(body.name, "Public Luminary");
    assert.equal(body.personality, "Warm and inviting");
    assert.equal("systemPrompt" in body, false, "systemPrompt must NEVER be exposed to non-owners");
    assert.equal("creatorId" in body, false, "creatorId must NEVER be exposed in public responses");
  });

  // ── Update Authorization ──
  it("PATCH /api/characters/[id] allows owner update and rejects non-owner with 403", async () => {
    const { sessionId: ownerSession } = await createTestUser("patch-owner@example.com");
    const { sessionId: otherSession } = await createTestUser("patch-other@example.com");

    const createReq = makePostRequest("http://localhost:3000/api/characters", ownerSession, {
      name: "Original Name",
      systemPrompt: "Original prompt",
      visibility: "private",
    });
    const createRes = await CharactersRoute.POST(createReq);
    const char = await createRes.json();

    // Non-owner attempt
    const failPatchReq = makePatchRequest(
      `http://localhost:3000/api/characters/${char.id}`,
      otherSession,
      { name: "Hacked Name" },
    );
    const failPatchRes = await CharacterIdRoute.PATCH(failPatchReq, {
      params: Promise.resolve({ id: char.id }),
    });
    assert.equal(failPatchRes.status, 403);

    // Owner attempt
    const successPatchReq = makePatchRequest(
      `http://localhost:3000/api/characters/${char.id}`,
      ownerSession,
      { name: "Updated Name", isPublished: true, visibility: "public" },
    );
    const successPatchRes = await CharacterIdRoute.PATCH(successPatchReq, {
      params: Promise.resolve({ id: char.id }),
    });
    assert.equal(successPatchRes.status, 200);
    const updated = await successPatchRes.json();
    assert.equal(updated.name, "Updated Name");
    assert.equal(updated.isPublished, true);
    assert.equal(updated.visibility, "public");
  });

  // ── Delete Authorization ──
  it("DELETE /api/characters/[id] rejects non-owner with 403 and allows owner with 204", async () => {
    const { sessionId: ownerSession } = await createTestUser("del-owner@example.com");
    const { sessionId: otherSession } = await createTestUser("del-other@example.com");

    const createReq = makePostRequest("http://localhost:3000/api/characters", ownerSession, {
      name: "To Be Deleted",
      systemPrompt: "Prompt",
    });
    const createRes = await CharactersRoute.POST(createReq);
    const char = await createRes.json();

    // Non-owner attempt
    const failDelReq = makeDeleteRequest(
      `http://localhost:3000/api/characters/${char.id}`,
      otherSession,
    );
    const failDelRes = await CharacterIdRoute.DELETE(failDelReq, {
      params: Promise.resolve({ id: char.id }),
    });
    assert.equal(failDelRes.status, 403);

    // Owner attempt
    const successDelReq = makeDeleteRequest(
      `http://localhost:3000/api/characters/${char.id}`,
      ownerSession,
    );
    const successDelRes = await CharacterIdRoute.DELETE(successDelReq, {
      params: Promise.resolve({ id: char.id }),
    });
    assert.equal(successDelRes.status, 204);

    // Verify deletion in DB
    const [row] = await db.select().from(characters).where(eq(characters.id, char.id));
    assert.equal(row, undefined);
  });

  // ── List endpoint response strategy & deduplication ──
  it("GET /api/characters returns own characters (with prompt) and public+published characters (without prompt), deduplicated", async () => {
    const { user: userA, sessionId: sessionA } = await createTestUser("user-a@example.com");
    const { user: userB, sessionId: sessionB } = await createTestUser("user-b@example.com");

    // User A: Own private character
    await CharactersRoute.POST(
      makePostRequest("http://localhost:3000/api/characters", sessionA, {
        name: "A's Private Char",
        systemPrompt: "Secret prompt A1",
        visibility: "private",
        isPublished: false,
      }),
    );

    // User A: Own public published character
    await CharactersRoute.POST(
      makePostRequest("http://localhost:3000/api/characters", sessionA, {
        name: "A's Public Published Char",
        systemPrompt: "Secret prompt A2",
        visibility: "public",
        isPublished: true,
      }),
    );

    // User B: Public published character (discoverable by User A)
    await CharactersRoute.POST(
      makePostRequest("http://localhost:3000/api/characters", sessionB, {
        name: "B's Public Published Char",
        systemPrompt: "Secret prompt B1",
        visibility: "public",
        isPublished: true,
      }),
    );

    // User B: Public unpublished character (NOT discoverable by User A)
    await CharactersRoute.POST(
      makePostRequest("http://localhost:3000/api/characters", sessionB, {
        name: "B's Public Draft Char",
        systemPrompt: "Secret prompt B2",
        visibility: "public",
        isPublished: false,
      }),
    );

    // User B: Private character (NOT discoverable by User A)
    await CharactersRoute.POST(
      makePostRequest("http://localhost:3000/api/characters", sessionB, {
        name: "B's Private Char",
        systemPrompt: "Secret prompt B3",
        visibility: "private",
        isPublished: false,
      }),
    );

    // Query list as User A
    const listReq = makeGetRequest("http://localhost:3000/api/characters", sessionA);
    const listRes = await CharactersRoute.GET(listReq);
    assert.equal(listRes.status, 200);
    const listBody = await listRes.json();

    assert.ok(Array.isArray(listBody.characters));
    // User A should see exactly 3 characters:
    // 1. A's Private Char (own)
    // 2. A's Public Published Char (own)
    // 3. B's Public Published Char (public)
    assert.equal(listBody.characters.length, 3);

    // Check no duplicate IDs exist
    const idSet = new Set(listBody.characters.map((c: any) => c.id));
    assert.equal(idSet.size, 3, "All returned characters must have unique IDs");

    // Check ownership formatting
    for (const char of listBody.characters) {
      if (char.name.startsWith("A's")) {
        assert.equal(char.creatorId, userA.id);
        assert.ok(char.systemPrompt, "Own characters in list must include systemPrompt");
      } else if (char.name === "B's Public Published Char") {
        assert.equal("creatorId" in char, false, "Other user's character must redact creatorId");
        assert.equal("systemPrompt" in char, false, "Other user's character must redact systemPrompt");
      } else {
        assert.fail(`Unexpected character in list: ${char.name}`);
      }
    }
  });
});

// ── Database Cascade Deletion ────────────────────────────────

describe("Database FK Cascade: User Deletion", () => {
  before(cleanup);
  after(cleanup);

  it("deletes all characters created by a user when that user is deleted", async () => {
    const { user, sessionId } = await createTestUser("cascade-creator@example.com");

    // Create 2 characters
    const req1 = makePostRequest("http://localhost:3000/api/characters", sessionId, {
      name: "Cascade Char 1",
      systemPrompt: "Prompt 1",
    });
    const res1 = await CharactersRoute.POST(req1);
    const char1 = await res1.json();

    const req2 = makePostRequest("http://localhost:3000/api/characters", sessionId, {
      name: "Cascade Char 2",
      systemPrompt: "Prompt 2",
    });
    const res2 = await CharactersRoute.POST(req2);
    const char2 = await res2.json();

    // Verify both characters exist in DB
    const beforeRows = await db
      .select()
      .from(characters)
      .where(eq(characters.creatorId, user.id));
    assert.equal(beforeRows.length, 2);

    // Delete user from DB
    await db.delete(users).where(eq(users.id, user.id));

    // Verify characters are cascade-deleted by PostgreSQL
    const afterRows = await db
      .select()
      .from(characters)
      .where(eq(characters.creatorId, user.id));
    assert.equal(afterRows.length, 0, "All creator's characters must be cascade deleted");
  });
});

// ── process cleanup ──────────────────────────────────────────
after(() => {
  setTimeout(() => process.exit(0), 100);
});
