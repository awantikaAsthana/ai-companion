import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  validateSession,
  SESSION_COOKIE_NAME,
} from "@/lib/auth/session";

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 },
    );
  }

  const result = await validateSession(sessionId);
  if (!result) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 },
    );
  }

  return NextResponse.json({ user: result.user });
}

