"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Send,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  MessageSquare,
  Clock,
  Cpu,
} from "lucide-react";
import type {
  ConversationResponse,
  MessageResponse,
  PostMessageResponse,
} from "@/lib/conversations/schemas";
import { ModelSelector } from "./model-selector";

interface ChatInterfaceProps {
  conversation: ConversationResponse;
  initialMessages: MessageResponse[];
}

export function ChatInterface({
  conversation,
  initialMessages,
}: ChatInterfaceProps) {
  const character = conversation.character;
  const [messages, setMessages] = useState<MessageResponse[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Active AI selection from dev model selector
  const [aiSelection, setAiSelection] = useState<{
    provider: string;
    model: string;
  }>({
    provider: "zrok",
    model: "qwen38-27b",
  });

  const [lastMeta, setLastMeta] = useState<PostMessageResponse["meta"] | null>(
    null,
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function handleSendMessage(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const content = input.trim();
    if (!content || sending) return;

    setInput("");
    setError(null);
    setSending(true);

    // Optimistic user message preview
    const tempUserMessage: MessageResponse = {
      id: `temp-${Date.now()}`,
      conversationId: conversation.id,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      const res = await fetch(
        `/api/conversations/${conversation.id}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content,
            provider: aiSelection.provider,
            model: aiSelection.model,
          }),
        },
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      const data: PostMessageResponse = await res.json();

      // Replace optimistic message with actual DB messages
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserMessage.id),
        data.userMessage,
        data.assistantMessage,
      ]);
      setLastMeta(data.meta);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to receive response from companion",
      );
      // Remove temporary message on error
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMessage.id));
      setInput(content); // restore input
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-5xl mx-auto rounded-2xl border border-[#430D15]/50 bg-[#090405] overflow-hidden shadow-2xl">
      {/* Chat Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#430D15]/60 bg-[#120507]/90 px-4 py-3 sm:px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            href="/app"
            className="rounded-full p-1.5 text-[#BFA8A8] hover:bg-[#21080C] hover:text-[#F5E9E5] transition-colors"
            title="Return to Sanctuary"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="flex items-center gap-2.5">
            {character?.avatarUrl ? (
              <img
                src={character.avatarUrl}
                alt={character.name}
                className="h-9 w-9 rounded-full object-cover object-top border border-[#C9A46A]/40"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#430D15] bg-[#21080C] font-serif text-sm text-[#C9A46A]">
                {character?.name?.charAt(0) || "✦"}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-base font-medium text-[#F5E9E5]">
                  {character?.name || "Companion"}
                </h2>
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </div>
              <p className="text-[11px] text-[#BFA8A8] truncate max-w-xs sm:max-w-md font-light">
                {character?.description || "In conversation"}
              </p>
            </div>
          </div>
        </div>

        {/* Development Model Selector */}
        <ModelSelector
          onSelectionChange={setAiSelection}
          defaultProvider={aiSelection.provider}
          defaultModel={aiSelection.model}
        />
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.length === 0 && (
          <div className="py-20 text-center space-y-3">
            <span className="font-serif text-4xl text-[#C9A46A]/40">✦</span>
            <h3 className="font-serif text-xl font-light text-[#F5E9E5]">
              Begin your conversation with {character?.name || "your companion"}
            </h3>
            <p className="text-xs text-[#BFA8A8] font-light max-w-md mx-auto leading-relaxed">
              Speak naturally. Your words are remembered with continuity, depth, and
              presence.
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              {!isUser && (
                <div className="shrink-0 mt-1">
                  {character?.avatarUrl ? (
                    <img
                      src={character.avatarUrl}
                      alt={character.name}
                      className="h-8 w-8 rounded-full object-cover object-top border border-[#C9A46A]/30"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#430D15] bg-[#21080C] font-serif text-xs text-[#C9A46A]">
                      {character?.name?.charAt(0) || "✦"}
                    </div>
                  )}
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? "bg-gradient-to-r from-[#21080C] to-[#6E0717]/80 text-[#F5E9E5] border border-[#C9A46A]/20"
                    : "bg-[#120507] text-[#F5E9E5] border border-[#430D15]/60"
                }`}
              >
                <div className="whitespace-pre-wrap font-light">{msg.content}</div>

                <div className="mt-1.5 flex items-center justify-end gap-2 text-[10px] text-[#BFA8A8]/60">
                  <span>
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {sending && (
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C9A46A]/30 bg-[#120507]">
                <span className="font-serif text-xs text-[#C9A46A] animate-pulse">
                  ✦
                </span>
              </div>
            </div>
            <div className="rounded-2xl border border-[#430D15]/50 bg-[#120507] px-4 py-3 text-xs text-[#BFA8A8] flex items-center gap-2">
              <span className="italic">
                {character?.name || "Companion"} is contemplating…
              </span>
              <span className="flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C9A46A] animate-bounce [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#C9A46A] animate-bounce [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#C9A46A] animate-bounce" />
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error alert if any */}
      {error && (
        <div className="mx-4 mb-2 flex items-center justify-between rounded-xl border border-rose-900/60 bg-rose-950/40 px-3 py-2 text-xs text-rose-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-[11px] underline opacity-80 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Bottom Observability / Model Indicator */}
      {lastMeta && (
        <div className="px-6 py-1 bg-[#120507]/60 border-t border-[#430D15]/30 flex items-center justify-between text-[10px] text-[#BFA8A8]/60">
          <div className="flex items-center gap-2">
            <span className="text-[#C9A46A]">✦ {lastMeta.provider}</span>
            <span>·</span>
            <span>{lastMeta.model}</span>
          </div>
          {lastMeta.latencyMs !== undefined && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{lastMeta.latencyMs}ms</span>
            </div>
          )}
        </div>
      )}

      {/* Bottom Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 sm:p-4 border-t border-[#430D15]/60 bg-[#120507]/90 backdrop-blur-md"
      >
        <div className="relative flex items-center">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${character?.name || "your companion"}… (Press Enter to send)`}
            rows={1}
            disabled={sending}
            className="w-full resize-none rounded-xl border border-[#430D15]/80 bg-[#090405] px-4 py-3 pr-12 text-xs sm:text-sm text-[#F5E9E5] placeholder-[#BFA8A8]/40 focus:border-[#C9A46A] focus:outline-none disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="absolute right-2 rounded-lg p-2 text-[#C9A46A] hover:bg-[#21080C] hover:text-[#F5E9E5] transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
            title="Send Message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

