import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/get-user";
import { conversationIdParamSchema } from "@/lib/conversations/schemas";
import { getConversationById } from "@/lib/conversations/service";

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

  const result = await getConversationById(id, user.id);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result.conversation, { status: 200 });
}

