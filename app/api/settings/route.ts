import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/get-user";
import { updateSettingsSchema } from "@/lib/settings/schemas";
import { getUserSettings, updateUserSettings } from "@/lib/settings/service";

export async function GET(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const settings = await getUserSettings(user.id);
  return NextResponse.json(settings, { status: 200 });
}

export async function PATCH(request: Request) {
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

  const parsed = updateSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.issues },
      { status: 400 },
    );
  }

  const settings = await updateUserSettings(user.id, parsed.data.memoryMessageLimit);
  return NextResponse.json(settings, { status: 200 });
}
