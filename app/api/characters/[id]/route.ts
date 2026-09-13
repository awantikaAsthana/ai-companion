import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/get-user";
import {
  characterIdParamSchema,
  updateCharacterSchema,
} from "@/lib/characters/schemas";
import {
  getCharacterById,
  updateCharacter,
  deleteCharacter,
} from "@/lib/characters/service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 },
    );
  }

  const { id } = await context.params;
  const paramParsed = characterIdParamSchema.safeParse({ id });
  if (!paramParsed.success) {
    return NextResponse.json(
      { error: "Invalid character ID format", details: paramParsed.error.issues },
      { status: 400 },
    );
  }

  const result = await getCharacterById(id, user.id);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  return NextResponse.json(result.character, { status: 200 });
}

export async function PATCH(request: Request, context: RouteContext) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 },
    );
  }

  const { id } = await context.params;
  const paramParsed = characterIdParamSchema.safeParse({ id });
  if (!paramParsed.success) {
    return NextResponse.json(
      { error: "Invalid character ID format", details: paramParsed.error.issues },
      { status: 400 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = updateCharacterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.issues },
      { status: 400 },
    );
  }

  const result = await updateCharacter(id, user.id, parsed.data);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  return NextResponse.json(result.character, { status: 200 });
}

export async function DELETE(request: Request, context: RouteContext) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 },
    );
  }

  const { id } = await context.params;
  const paramParsed = characterIdParamSchema.safeParse({ id });
  if (!paramParsed.success) {
    return NextResponse.json(
      { error: "Invalid character ID format", details: paramParsed.error.issues },
      { status: 400 },
    );
  }

  const result = await deleteCharacter(id, user.id);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  return new NextResponse(null, { status: 204 });
}
