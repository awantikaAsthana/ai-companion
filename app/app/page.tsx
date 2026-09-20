"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MessageSquare,
  Sparkles,
  ArrowRight,
  Compass,
  Users,
  Clock,
  Plus,
} from "lucide-react";
import type { ConversationResponse } from "@/lib/conversations/schemas";
import type { CharacterResponse } from "@/lib/characters/schemas";

export default function AppHome() {
  const router = useRouter();
  const [conversations, setConversations] = useState<ConversationResponse[]>([]);
  const [characters, setCharacters] = useState<CharacterResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingChatWithId, setStartingChatWithId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [convRes, charRes] = await Promise.all([
          fetch("/api/conversations"),
          fetch("/api/characters"),
        ]);

        if (convRes.ok) {
          const convData = await convRes.json();
          setConversations(convData.conversations || []);
        }

        if (charRes.ok) {
          const charData = await charRes.json();
          setCharacters(charData.characters || []);
        }
      } catch {
        // Handled via empty states
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function handleStartConversation(characterId: string) {
    setStartingChatWithId(characterId);
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/app/chat/${data.id}`);
      }
    } catch {
      setStartingChatWithId(null);
    }
  }

  return (
    <div className="space-y-12 pb-16">
      {/* Editorial Hero Header */}
      <div className="relative pt-2 pb-6 sm:pb-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#6E0717]/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#C9A46A]/8 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#430D15]/40 pb-8 sm:pb-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.26em] text-[#C9A46A]">
              <span className="text-[10px]">✦</span> The Sanctuary
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#F5E9E5] tracking-tight">
              Companions of Ecstasy
            </h1>
            <p className="text-xs sm:text-sm font-light text-[#BFA8A8] leading-relaxed max-w-xl">
              Select a companion to enter into conversation, or craft a new presence tailored to your desire.
            </p>
          </div>

          <Link
            href="/app/characters"
            className="inline-flex items-center gap-2 self-start md:self-auto rounded-full border border-[#C9A46A]/50 bg-gradient-to-r from-[#21080C] via-[#430D15] to-[#21080C] px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[#F5E9E5] transition-all duration-300 hover:border-[#C9A46A] hover:shadow-[0_0_25px_rgba(201,164,106,0.15)] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 text-[#C9A46A]" />
            <span>Craft Companion</span>
          </Link>
        </div>
      </div>

      {loading && (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <span className="font-serif text-3xl text-[#C9A46A] animate-pulse">
            ✦
          </span>
          <p className="mt-4 font-serif text-xs tracking-widest text-[#BFA8A8] uppercase">
            Synchronizing Sanctuary…
          </p>
        </div>
      )}

      {!loading && (
        <>
          {/* Active Conversations Section */}
          {conversations.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#C9A46A]" />
                <h2 className="font-serif text-xl sm:text-2xl font-light text-[#F5E9E5]">
                  Active Conversations
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {conversations.map((conv) => (
                  <Link
                    key={conv.id}
                    href={`/app/chat/${conv.id}`}
                    className="group flex items-center justify-between rounded-2xl border border-[#430D15]/60 bg-[#120507] p-4 transition-all duration-300 hover:border-[#C9A46A]/40 hover:bg-[#1A070A]"
                  >
                    <div className="flex items-center gap-3">
                      {conv.character?.avatarUrl ? (
                        <img
                          src={conv.character.avatarUrl}
                          alt={conv.character.name}
                          className="h-11 w-11 rounded-full object-cover object-top border border-[#C9A46A]/30"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#430D15] bg-[#21080C] font-serif text-sm text-[#C9A46A]">
                          {conv.character?.name?.charAt(0) || "✦"}
                        </div>
                      )}

                      <div>
                        <h3 className="font-serif text-base font-medium text-[#F5E9E5] group-hover:text-[#C9A46A] transition-colors">
                          {conv.character?.name || "Companion"}
                        </h3>
                        <p className="text-[11px] text-[#BFA8A8] font-light">
                          Active thread · Updated{" "}
                          {new Date(conv.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-full p-2 text-[#BFA8A8] group-hover:text-[#F5E9E5] transition-colors">
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Available Companions Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-[#C9A46A]" />
              <h2 className="font-serif text-xl sm:text-2xl font-light text-[#F5E9E5]">
                Available Companions
              </h2>
            </div>

            {characters.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#430D15]/80 bg-[#120507]/30 p-12 text-center text-xs text-[#BFA8A8] space-y-2">
                <Users className="h-8 w-8 mx-auto text-[#C9A46A]/40 mb-2" />
                <p className="font-medium text-[#F5E9E5]">
                  No companions found in this realm yet.
                </p>
                <p className="text-[11px] text-[#BFA8A8]">
                  Characters created or published will appear here ready to converse.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {characters.map((char) => (
                  <div
                    key={char.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#430D15]/60 bg-[#120507] p-5 transition-all duration-500 hover:border-[#C9A46A]/40 hover:shadow-[0_16px_50px_rgba(110,7,23,0.3)] min-h-[220px]"
                  >
                    <div>
                      <div className="flex items-start gap-3.5">
                        {char.avatarUrl ? (
                          <img
                            src={char.avatarUrl}
                            alt={char.name}
                            className="h-14 w-14 rounded-full object-cover object-top border border-[#C9A46A]/30 shrink-0"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#430D15] bg-[#21080C] font-serif text-lg text-[#C9A46A] shrink-0">
                            {char.name.charAt(0)}
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif text-xl font-light text-[#F5E9E5] truncate">
                            {char.name}
                          </h3>
                          {char.description && (
                            <p className="mt-1 text-xs text-[#BFA8A8] font-light line-clamp-2 leading-relaxed">
                              {char.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Traits chips */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {char.personality && (
                          <span className="rounded-full border border-[#430D15]/60 bg-[#21080C]/70 px-2.5 py-0.5 text-[10px] text-[#E0CECE] font-light">
                            {char.personality}
                          </span>
                        )}
                        {char.relationshipDynamic && (
                          <span className="rounded-full border border-[#C9A46A]/20 bg-[#090405]/70 px-2.5 py-0.5 text-[10px] text-[#C9A46A] font-light">
                            {char.relationshipDynamic}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-6 pt-3 border-t border-[#430D15]/40 flex items-center justify-between">
                      <span className="text-[11px] text-[#BFA8A8]/70">
                        {char.visibility === "public" ? "Public" : "Private"}
                      </span>

                      <button
                        onClick={() => handleStartConversation(char.id)}
                        disabled={startingChatWithId === char.id}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A46A]/50 bg-gradient-to-r from-[#21080C] to-[#6E0717]/80 px-4 py-1.5 text-xs font-medium text-[#F5E9E5] transition-all hover:border-[#C9A46A] hover:shadow-[0_0_15px_rgba(110,7,23,0.4)] disabled:opacity-50"
                      >
                        <MessageSquare className="h-3.5 w-3.5 text-[#C9A46A]" />
                        <span>
                          {startingChatWithId === char.id
                            ? "Entering…"
                            : "Start Conversation"}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
