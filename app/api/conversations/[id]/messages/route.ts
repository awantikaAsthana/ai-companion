import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/get-user";
import {
  conversationIdParamSchema,
  postMessageSchema,
} from "@/lib/conversations/schemas";
import {
  getConversationMessages,
  postMessageAndGenerateReply,
} from "@/lib/conversations/service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await context.params;
  const paramParsed = conversationIdParamSchema.safeParse({ id });
  if (!paramParsed.success) {
    return NextResponse.json(
      { error: "Invalid conversation ID format", details: paramParsed.error.issues },
      { status: 400 },
    );
  }

  const result = await getConversationMessages(id, user.id);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ messages: result.messages }, { status: 200 });
}

export async function POST(request: Request, context: RouteContext) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await context.params;
  const paramParsed = conversationIdParamSchema.safeParse({ id });
  if (!paramParsed.success) {
    return NextResponse.json(
      { error: "Invalid conversation ID format", details: paramParsed.error.issues },
      { status: 400 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = postMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.issues },
      { status: 400 },
    );
  }

  const result = await postMessageAndGenerateReply({
    conversationId: id,
    userId: user.id,
    content: parsed.data.content,
    provider: parsed.data.provider,
    model: parsed.data.model,
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result.data, { status: 200 });
}

