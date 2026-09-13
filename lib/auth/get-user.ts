import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, validateSession } from "./session";

/**
 * Retrieves the currently authenticated user from session cookie.
 * Supports both Next.js cookies() and request header fallback.
 */
export async function getAuthUser(request?: Request) {
  let sessionId: string | undefined;

  try {
    const cookieStore = await cookies();
    sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  } catch {
    // Outside active Next.js request context (e.g. testing)
  }

  if (!sessionId && request) {
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      const match = cookieHeader.match(
        new RegExp(`(?:^|;\\s*)${SESSION_COOKIE_NAME}=([^;]+)`),
      );
      if (match) {
        sessionId = decodeURIComponent(match[1]);
      }
    }
  }

  if (!sessionId) return null;

  const result = await validateSession(sessionId);
  return result?.user ?? null;
}
