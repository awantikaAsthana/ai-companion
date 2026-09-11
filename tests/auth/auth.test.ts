import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { sql, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { users, sessions } from "../../db/schema.js";
import { hashPassword, verifyPassword } from "../../lib/auth/password.js";
import {
  createSession,
  validateSession,
  deleteSession,
} from "../../lib/auth/session.js";

// ── helpers ──────────────────────────────────────────────────

async function cleanup() {
  await db.delete(sessions);
  await db.delete(users);
}

async function createTestUser(
  email = "test@example.com",
  password = "test-password-123",
  name = "Test User",
) {
  const passwordHash = await hashPassword(password);
  const [user] = await db
    .insert(users)
    .values({ email, name, passwordHash })
    .returning();
  return { user, password };
}

// ── password ─────────────────────────────────────────────────

describe("password hashing", () => {
  it("hashes and verifies a correct password", async () => {
    const hash = await hashPassword("my-secure-pass");
    assert.notEqual(hash, "my-secure-pass", "hash must differ from plaintext");
    assert.ok(await verifyPassword(hash, "my-secure-pass"));
  });

  it("rejects an incorrect password", async () => {
    const hash = await hashPassword("correct-password");
    const result = await verifyPassword(hash, "wrong-password");
    assert.equal(result, false);
  });
});

// ── sessions ─────────────────────────────────────────────────

describe("sessions", () => {
  before(cleanup);
  after(cleanup);

  it("creates a session and validates it", async () => {
    const { user } = await createTestUser("session@example.com");
    const sessionId = await createSession(user.id);

    assert.ok(sessionId, "session ID must be returned");

    const result = await validateSession(sessionId);
    assert.ok(result, "session must validate");
    assert.equal(result.user.id, user.id);
    assert.equal(result.user.email, "session@example.com");
    // passwordHash must never appear
    assert.equal(
      "passwordHash" in result.user,
      false,
      "must not expose passwordHash",
    );
  });

  it("rejects an expired session", async () => {
    const { user } = await createTestUser("expired@example.com");

    // Insert an already-expired session
    const [expiredSession] = await db
      .insert(sessions)
      .values({
        userId: user.id,
        expiresAt: new Date(Date.now() - 1000), // 1 second ago
      })
      .returning();

    const result = await validateSession(expiredSession.id);
    assert.equal(result, null, "expired session must return null");
  });

  it("deletes a session", async () => {
    const { user } = await createTestUser("delete-session@example.com");
    const sessionId = await createSession(user.id);

    await deleteSession(sessionId);

    const result = await validateSession(sessionId);
    assert.equal(result, null, "deleted session must return null");
  });
});

// ── signup flow (service layer) ──────────────────────────────

describe("signup flow", () => {
  before(cleanup);
  after(cleanup);

  it("creates a user with hashed password", async () => {
    const { user } = await createTestUser("signup@example.com", "secure-pass");

    assert.ok(user.id);
    assert.equal(user.email, "signup@example.com");
    assert.ok(user.passwordHash, "hash must be stored");
    assert.notEqual(user.passwordHash, "secure-pass");
  });

  it("rejects duplicate email", async () => {
    // First user already created above
    await assert.rejects(
      async () => createTestUser("signup@example.com", "another-pass"),
      (err: unknown) => {
        // Postgres unique violation
        assert.ok(err instanceof Error);
        return true;
      },
    );
  });
});

// ── login flow (service layer) ───────────────────────────────

describe("login flow", () => {
  before(async () => {
    await cleanup();
    await createTestUser("login@example.com", "login-pass-123");
  });
  after(cleanup);

  it("verifies correct credentials", async () => {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, "login@example.com"))
      .limit(1);

    assert.ok(user.passwordHash);
    const valid = await verifyPassword(user.passwordHash, "login-pass-123");
    assert.ok(valid, "correct password must verify");
  });

  it("rejects incorrect password", async () => {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, "login@example.com"))
      .limit(1);

    assert.ok(user.passwordHash);
    const valid = await verifyPassword(user.passwordHash, "wrong-password");
    assert.equal(valid, false);
  });

  it("returns null for non-existent user", async () => {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, "nonexistent@example.com"))
      .limit(1);

    assert.equal(result.length, 0, "user must not exist");
  });
});

// ── session + user cascade ───────────────────────────────────

describe("user deletion cascades to sessions", () => {
  before(cleanup);
  after(cleanup);

  it("deletes sessions when user is deleted", async () => {
    const { user } = await createTestUser("cascade@example.com");
    const sessionId = await createSession(user.id);

    // Verify session exists
    const before_ = await validateSession(sessionId);
    assert.ok(before_, "session must exist before user deletion");

    // Delete user
    await db.delete(users).where(eq(users.id, user.id));

    // Session must be gone (cascade)
    const [row] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId));
    assert.equal(row, undefined, "session must be cascade-deleted");
  });
});

// ── done ─────────────────────────────────────────────────────
// Force exit after tests since the postgres connection keeps the process alive
after(() => {
  setTimeout(() => process.exit(0), 100);
});

