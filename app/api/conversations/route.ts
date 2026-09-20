import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/get-user";
import { createConversationSchema } from "@/lib/conversations/schemas";
import {
  createConversation,
  listConversations,
} from "@/lib/conversations/service";

export async function POST(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createConversationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.issues },
      { status: 400 },
    );
  }

  const result = await createConversation(user.id, parsed.data.characterId);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result.conversation, { status: 201 });
}

export async function GET(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userConversations = await listConversations(user.id);
  return NextResponse.json({ conversations: userConversations }, { status: 200 });
}

