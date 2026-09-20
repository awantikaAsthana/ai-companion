"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type {
  ConversationResponse,
  MessageResponse,
} from "@/lib/conversations/schemas";
import { ChatInterface } from "@/components/chat/chat-interface";

export default function ChatConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const conversationId = resolvedParams.id;

  const [conversation, setConversation] = useState<ConversationResponse | null>(
    null,
  );
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConversationData() {
      setLoading(true);
      setError(null);
      try {
        const convRes = await fetch(`/api/conversations/${conversationId}`);
        if (!convRes.ok) {
          const errData = await convRes.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP ${convRes.status}`);
        }
        const convData = await convRes.json();
        setConversation(convData);

        const msgRes = await fetch(
          `/api/conversations/${conversationId}/messages`,
        );
        if (msgRes.ok) {
          const msgData = await msgRes.json();
          setMessages(msgData.messages || []);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load conversation sanctuary",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchConversationData();
  }, [conversationId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-[#F5E9E5]">
        <span className="font-serif text-3xl text-[#C9A46A] animate-pulse">
          ✦
        </span>
        <p className="mt-4 font-serif text-sm tracking-widest text-[#BFA8A8] uppercase">
          Opening Sanctuary…
        </p>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="mx-auto max-w-md py-20 text-center text-[#F5E9E5]">
        <div className="rounded-2xl border border-rose-900/60 bg-[#120507] p-8 space-y-4">
          <span className="font-serif text-4xl text-rose-400">✦</span>
          <h2 className="font-serif text-2xl font-light">Conversation Unavailable</h2>
          <p className="text-xs text-[#BFA8A8] leading-relaxed">
            {error || "This conversation could not be retrieved."}
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 rounded-full border border-[#430D15] bg-[#21080C] px-5 py-2 text-xs text-[#F5E9E5] hover:border-[#C9A46A]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Sanctuary</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-2">
      <ChatInterface
        conversation={conversation}
        initialMessages={messages}
      />
    </div>
  );
}

