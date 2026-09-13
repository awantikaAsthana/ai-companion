import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/get-user";
import { createCharacterSchema } from "@/lib/characters/schemas";
import {
  createCharacter,
  listCharacters,
} from "@/lib/characters/service";

export async function POST(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createCharacterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.issues },
      { status: 400 },
    );
  }

  const character = await createCharacter(user.id, parsed.data);
  return NextResponse.json(character, { status: 201 });
}

export async function GET(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 },
    );
  }

  const result = await listCharacters(user.id);
  return NextResponse.json(result, { status: 200 });
}

