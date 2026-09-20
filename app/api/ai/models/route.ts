import { NextResponse } from "next/server";
import { getProviderOptions, getDefaultAISelection } from "@/lib/ai/models";

export async function GET() {
  const selection = getDefaultAISelection();
  const providers = getProviderOptions();

  return NextResponse.json({
    providers,
    defaultProvider: selection.provider,
    defaultModel: selection.model,
    isDevelopment: selection.isDevelopment,
  });
}

