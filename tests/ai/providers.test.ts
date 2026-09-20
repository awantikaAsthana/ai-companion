import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { ZrokProvider } from "../../lib/ai/providers/zrok.js";
import { OpenRouterProvider } from "../../lib/ai/providers/openrouter.js";
import {
  resolveProviderAndModel,
  modelRegistry,
} from "../../lib/ai/config.js";
import { generateChat } from "../../lib/ai/gateway.js";
import { buildCharacterSystemPrompt } from "../../lib/ai/prompts.js";
import { buildChatContext } from "../../lib/ai/context.js";

describe("AI Providers & Gateway", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  // 1. Zrok provider
  it("ZrokProvider sends request with Bearer auth and parses response", async () => {
    let capturedUrl = "";
    let capturedHeaders: Record<string, string> = {};
    let capturedBody: any = null;

    globalThis.fetch = (async (url: string, init?: RequestInit) => {
      capturedUrl = url;
      capturedHeaders = (init?.headers || {}) as Record<string, string>;
      capturedBody = JSON.parse(init?.body as string);

      return new Response(
        JSON.stringify({
          model: "qwen38-27b",
          choices: [
            {
              message: {
                role: "assistant",
                content: "Greetings, I am ready.",
              },
            },
          ],
          usage: {
            prompt_tokens: 15,
            completion_tokens: 8,
            total_tokens: 23,
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }) as any;

    const provider = new ZrokProvider(
      "https://test.shares.zrok.io",
      "test-zrok-key-123",
    );

    const result = await provider.chat({
      model: "qwen38-27b",
      messages: [{ role: "user", content: "Hello!" }],
    });

    assert.equal(capturedUrl, "https://test.shares.zrok.io/v1/chat");
    assert.equal(capturedHeaders["Authorization"], "Bearer test-zrok-key-123");
    assert.equal(capturedHeaders["Content-Type"], "application/json");
    assert.equal(capturedBody.model, "qwen38-27b");
    assert.equal(capturedBody.stream, false);
    assert.equal(result.content, "Greetings, I am ready.");
    assert.equal(result.provider, "zrok");
    assert.equal(result.model, "qwen38-27b");
    assert.equal(result.tokens?.totalTokens, 23);
  });

  // 2. OpenRouter provider
  it("OpenRouterProvider sends request with OpenRouter headers and parses response", async () => {
    let capturedUrl = "";
    let capturedHeaders: Record<string, string> = {};
    let capturedBody: any = null;

    globalThis.fetch = (async (url: string, init?: RequestInit) => {
      capturedUrl = url;
      capturedHeaders = (init?.headers || {}) as Record<string, string>;
      capturedBody = JSON.parse(init?.body as string);

      return new Response(
        JSON.stringify({
          model: "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
          choices: [
            {
              message: {
                role: "assistant",
                content: "I am Dolphin Mistral, at your service.",
              },
            },
          ],
          usage: {
            prompt_tokens: 20,
            completion_tokens: 12,
            total_tokens: 32,
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }) as any;

    const provider = new OpenRouterProvider(
      "https://openrouter.ai/api/v1",
      "test-openrouter-key-456",
    );

    const result = await provider.chat({
      model: "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
      messages: [{ role: "user", content: "Introduce yourself." }],
    });

    assert.equal(capturedUrl, "https://openrouter.ai/api/v1/chat/completions");
    assert.equal(
      capturedHeaders["Authorization"],
      "Bearer test-openrouter-key-456",
    );
    assert.equal(capturedHeaders["HTTP-Referer"], "https://ecstacy.ai");
    assert.equal(result.content, "I am Dolphin Mistral, at your service.");
    assert.equal(result.provider, "openrouter");
  });

  // 3. Provider selection
  it("resolveProviderAndModel correctly resolves requested provider and model", () => {
    const zrokRes = resolveProviderAndModel("zrok", "qwen38-27b");
    assert.equal(zrokRes.provider, "zrok");
    assert.equal(zrokRes.model, "qwen38-27b");

    const openRouterRes = resolveProviderAndModel("openrouter");
    assert.equal(openRouterRes.provider, "openrouter");
    assert.ok(openRouterRes.model.length > 0);
  });

  // 4. Invalid provider
  it("rejects unsupported provider with descriptive error", () => {
    assert.throws(
      () => resolveProviderAndModel("invalid-provider-xyz"),
      /Unsupported or disallowed AI provider/,
    );
  });

  // 5. Invalid model fallback
  it("falls back to default model for provider when invalid model is passed", () => {
    const res = resolveProviderAndModel("zrok", "nonexistent-model");
    assert.equal(res.provider, "zrok");
    assert.equal(res.model, "qwen38-27b");

    // OpenRouter allowlist enforcement: unknown models must resolve to default
    const openRouterRes = resolveProviderAndModel(
      "openrouter",
      "arbitrary-unauthorized/model-name",
    );
    assert.equal(openRouterRes.provider, "openrouter");
    assert.equal(
      openRouterRes.model,
      modelRegistry.openrouter.find((m) => m.isDefault)?.id ||
        modelRegistry.openrouter[0].id,
    );
  });

  // 6. Missing API key handling
  it("ZrokProvider throws clean error without key", async () => {
    const provider = new ZrokProvider("https://test.zrok.io", "");
    await assert.rejects(
      async () => provider.chat({ model: "qwen38-27b", messages: [] }),
      /ZROK_API_KEY is not configured/,
    );
  });

  it("ZrokProvider does not propagate upstream error response body in thrown errors", async () => {
    globalThis.fetch = (async () => {
      return new Response(
        JSON.stringify({
          error: "SENSITIVE_INTERNAL_TRACEBACK_AND_PRIVATE_KAGGLE_KEYS",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }) as any;

    const provider = new ZrokProvider("https://test.zrok.io", "test-key");
    await assert.rejects(
      async () => provider.chat({ model: "qwen38-27b", messages: [] }),
      (err: Error) => {
        // Must NOT leak the upstream body
        assert.ok(!err.message.includes("SENSITIVE_INTERNAL_TRACEBACK"));
        // Must be generic with status code
        assert.ok(err.message.includes("status 500"));
        return true;
      },
    );
  });

  it("OpenRouterProvider throws clean error without key", async () => {
    const provider = new OpenRouterProvider("https://openrouter.ai/api/v1", "");
    await assert.rejects(
      async () => provider.chat({ model: "default", messages: [] }),
      /OPENROUTER_API_KEY is not configured/,
    );
  });

  // Context & Prompt construction
  it("buildCharacterSystemPrompt integrates character traits and memory", () => {
    const prompt = buildCharacterSystemPrompt(
      {
        name: "Elena",
        personality: "Poetic and observant",
        systemPrompt: "You are Elena. Speak with depth.",
        interests: ["Literature", "Philosophy"],
      },
      {
        l1Messages: [],
        l2Summary: "User and Elena spoke about autumn in Paris.",
        l3Memories: ["User loves classical music."],
      },
    );

    assert.ok(prompt.includes("You are Elena. Speak with depth."));
    assert.ok(prompt.includes("Character Name: Elena"));
    assert.ok(prompt.includes("Poetic and observant"));
    assert.ok(prompt.includes("Literature, Philosophy"));
    assert.ok(prompt.includes("User and Elena spoke about autumn in Paris."));
    assert.ok(prompt.includes("User loves classical music."));
  });

  it("buildChatContext prepends system prompt and orders messages chronologically", () => {
    const messages = buildChatContext({
      character: {
        name: "Elena",
        systemPrompt: "System instruction.",
      },
      memory: {
        l1Messages: [
          { role: "user", content: "Hi" },
          { role: "assistant", content: "Hello" },
        ],
      },
      newUserMessage: "How are you?",
    });

    assert.equal(messages.length, 4);
    assert.equal(messages[0].role, "system");
    assert.equal(messages[1].role, "user");
    assert.equal(messages[1].content, "Hi");
    assert.equal(messages[2].role, "assistant");
    assert.equal(messages[2].content, "Hello");
    assert.equal(messages[3].role, "user");
    assert.equal(messages[3].content, "How are you?");
  });
});

