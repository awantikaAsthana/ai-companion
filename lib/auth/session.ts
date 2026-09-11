import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";

export const SESSION_COOKIE_NAME = "session_id";
export const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE,
};

export async function createSession(userId: string): Promise<string> {
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);
  const [session] = await db
    .insert(sessions)
    .values({ userId, expiresAt })
    .returning({ id: sessions.id });
  return session.id;
}

/** Returns safe user (no passwordHash) + session, or null if expired/missing. */
export async function validateSession(sessionId: string) {
  const result = await db
    .select({
      sessionId: sessions.id,
      sessionExpiresAt: sessions.expiresAt,
      userId: users.id,
      userEmail: users.email,
      userName: users.name,
      userCreatedAt: users.createdAt,
      userUpdatedAt: users.updatedAt,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.id, sessionId), gt(sessions.expiresAt, new Date())))
    .limit(1);

  if (result.length === 0) return null;

  const row = result[0];
  return {
    user: {
      id: row.userId,
      email: row.userEmail,
      name: row.userName,
      createdAt: row.userCreatedAt.toISOString(),
      updatedAt: row.userUpdatedAt.toISOString(),
    },
  };
}

export async function deleteSession(sessionId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

