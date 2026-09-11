import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  deleteSession,
  SESSION_COOKIE_NAME,
} from "@/lib/auth/session";

export async function POST() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionId) {
    await deleteSession(sessionId);
  }

  cookieStore.delete(SESSION_COOKIE_NAME);

  return NextResponse.json({ success: true });
}

