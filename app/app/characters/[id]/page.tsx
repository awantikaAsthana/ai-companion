"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  MessageSquare,
  Globe,
  Lock,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  HeartHandshake,
  MessageCircle,
  Compass,
} from "lucide-react";
import {
  getCharacterById,
  updateCharacter,
  deleteCharacter,
} from "@/lib/characters/client";
import type {
  CharacterResponse,
  CharacterOwnerResponse,
} from "@/lib/characters/schemas";
import { CharacterForm } from "@/components/characters/character-form";

export default function CharacterProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const characterId = resolvedParams.id;
  const router = useRouter();

  const [character, setCharacter] = useState<CharacterResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [startingChat, setStartingChat] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleStartConversation() {
    if (!character) return;
    setStartingChat(true);
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId: character.id }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/app/chat/${data.id}`);
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "Failed to initiate conversation");
        setStartingChat(false);
      }
    } catch {
      alert("Network error. Please try again.");
      setStartingChat(false);
    }
  }

  async function loadCharacter() {
    setLoading(true);
    setError(null);
    try {
      const data = await getCharacterById(characterId);
      setCharacter(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Character unavailable");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCharacter();
  }, [characterId]);

  const isOwner = Boolean(character && "creatorId" in character);
  const ownerChar = isOwner ? (character as CharacterOwnerResponse) : null;

  async function handleTogglePublish() {
    if (!ownerChar) return;
    try {
      const updated = await updateCharacter(ownerChar.id, {
        isPublished: !ownerChar.isPublished,
      });
      setCharacter(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update publication status");
    }
  }

  async function handleDelete() {
    if (!ownerChar) return;
    if (!window.confirm(`Are you certain you wish to delete "${ownerChar.name}"?`)) {
      return;
    }
    try {
      await deleteCharacter(ownerChar.id);
      router.push("/app");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete character");
    }
  }

  async function handleFormSubmit(data: any) {
    if (!ownerChar) return;
    setSubmitting(true);
    try {
      const updated = await updateCharacter(ownerChar.id, data);
      setCharacter(updated);
      setIsEditing(false);
    } catch (err) {
      throw err;
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-[#F5E9E5]">
        <span className="font-serif text-3xl text-[#C9A46A] animate-pulse">✦</span>
        <p className="mt-4 font-serif text-sm tracking-widest text-[#BFA8A8] uppercase">
          Summoning Presence…
        </p>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center text-[#F5E9E5]">
        <div className="rounded-2xl border border-rose-900/60 bg-[#120507] p-8">
          <span className="font-serif text-4xl text-rose-400">✦</span>
          <h2 className="mt-4 font-serif text-2xl font-light">Presence Unreachable</h2>
          <p className="mt-2 text-xs text-[#BFA8A8] leading-relaxed">
            {error || "This character cannot be found or is private."}
          </p>
          <div className="mt-6">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 rounded-full border border-[#430D15] bg-[#21080C] px-5 py-2 text-xs text-[#F5E9E5] hover:border-[#C9A46A]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to Sanctuary</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Top Breadcrumb Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/app"
          className="group inline-flex items-center gap-2 text-xs text-[#BFA8A8] hover:text-[#F5E9E5] transition-colors min-h-[38px] touch-manipulation"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Return to Companions</span>
        </Link>

        {isOwner && ownerChar && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleTogglePublish}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#430D15]/80 bg-[#120507] px-3.5 py-2 min-h-[38px] text-xs text-[#BFA8A8] hover:border-[#C9A46A]/50 hover:text-[#F5E9E5] transition-colors touch-manipulation"
            >
              {ownerChar.isPublished ? (
                <>
                  <EyeOff className="h-3.5 w-3.5 text-amber-400" />
                  <span>Unpublish</span>
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Publish</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#430D15]/80 bg-[#120507] px-3.5 py-2 min-h-[38px] text-xs text-[#BFA8A8] hover:border-[#C9A46A]/50 hover:text-[#F5E9E5] transition-colors touch-manipulation"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>{isEditing ? "Close Editor" : "Edit Presence"}</span>
            </button>

            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 rounded-full border border-rose-900/60 bg-rose-950/30 px-3.5 py-2 min-h-[38px] text-xs text-rose-300 hover:bg-rose-900/40 transition-colors touch-manipulation"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Edit Form Modal/Drawer Area if editing */}
      {isEditing && ownerChar && (
        <div className="mb-8">
          <CharacterForm
            initialData={ownerChar}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsEditing(false)}
            submitting={submitting}
          />
        </div>
      )}

      {/* Main Profile Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Portrait Hero */}
        <div className="lg:col-span-5">
          <div className="relative overflow-hidden rounded-3xl border border-[#430D15]/70 bg-[#120507] aspect-[3/4] shadow-[0_20px_60px_rgba(9,4,5,0.9)]">
            {character.avatarUrl ? (
              <img
                src={character.avatarUrl}
                alt={character.name}
                className="h-full w-full object-cover object-top filter brightness-[0.95] contrast-[1.05]"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-[#21080C] to-[#090405]">
                <span className="font-serif text-8xl text-[#C9A46A]/20">✦</span>
              </div>
            )}

            {/* Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#090405] via-[#090405]/40 via-35% to-transparent opacity-90" />

            {/* Status pill on image */}
            <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
              {isOwner ? (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#430D15] bg-[#090405]/80 backdrop-blur-md px-3 py-1 text-xs text-[#BFA8A8]">
                    {character.visibility === "public" ? (
                      <Globe className="h-3 w-3 text-[#C9A46A]" />
                    ) : (
                      <Lock className="h-3 w-3" />
                    )}
                    {character.visibility === "public" ? "Public" : "Private"}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs backdrop-blur-md ${
                      character.isPublished
                        ? "border-emerald-800/80 bg-emerald-950/80 text-emerald-300"
                        : "border-amber-800/80 bg-amber-950/80 text-amber-300"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        character.isPublished ? "bg-emerald-400" : "bg-amber-400"
                      }`}
                    />
                    {character.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#430D15]/80 bg-[#090405]/80 px-3 py-1 text-xs font-medium text-[#F5E9E5] backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C9A46A] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C9A46A]" />
                  </span>
                  Companion Online
                </span>
              )}
            </div>

            {/* Bottom Floating Title Overlay for Mobile */}
            <div className="absolute bottom-6 left-6 right-6 lg:hidden">
              <h1 className="font-serif text-3xl sm:text-4xl text-[#F5E9E5] break-words line-clamp-2 drop-shadow-[0_2px_12px_rgba(9,4,5,1)]">
                {character.name}
              </h1>
            </div>
          </div>
        </div>

        {/* Right Column: Persona & Relationship Story */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-3">
            <div className="hidden lg:block">
              <span className="text-xs uppercase tracking-[0.24em] text-[#C9A46A] font-medium">
                AI Companion
              </span>
              <h1 className="mt-1 font-serif text-5xl lg:text-6xl font-light text-[#F5E9E5]">
                {character.name}
              </h1>
            </div>

            {character.description && (
              <p className="text-base sm:text-lg font-light text-[#E0CECE] leading-relaxed">
                {character.description}
              </p>
            )}
          </div>

          {/* Primary Conversation CTA */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleStartConversation}
              disabled={startingChat}
              className="group flex w-full sm:w-auto min-h-[48px] items-center justify-center gap-3 rounded-full border border-[#C9A46A]/60 bg-gradient-to-r from-[#21080C] via-[#6E0717] to-[#21080C] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#F5E9E5] transition-all duration-300 hover:border-[#C9A46A] hover:shadow-[0_0_30px_rgba(110,7,23,0.6)] disabled:opacity-50 touch-manipulation"
            >
              <MessageSquare className="h-4 w-4 text-[#C9A46A] transition-transform group-hover:scale-110" />
              <span>{startingChat ? "Connecting…" : "Start Conversation"}</span>
            </button>
          </div>

          {/* Curated Details Bento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#430D15]/50">
            {/* Personality Card */}
            {character.personality && (
              <div className="rounded-2xl border border-[#430D15]/60 bg-[#120507]/60 p-5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#C9A46A]">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Personality</span>
                </div>
                <p className="text-xs text-[#F5E9E5] leading-relaxed font-light">
                  {character.personality}
                </p>
              </div>
            )}

            {/* Relationship Dynamic Card */}
            {character.relationshipDynamic && (
              <div className="rounded-2xl border border-[#430D15]/60 bg-[#120507]/60 p-5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#C9A46A]">
                  <HeartHandshake className="h-3.5 w-3.5" />
                  <span>Dynamic</span>
                </div>
                <p className="text-xs text-[#F5E9E5] leading-relaxed font-light">
                  {character.relationshipDynamic}
                </p>
              </div>
            )}

            {/* Communication Style Card */}
            {character.communicationStyle && (
              <div className="rounded-2xl border border-[#430D15]/60 bg-[#120507]/60 p-5 space-y-1.5 sm:col-span-2">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#C9A46A]">
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>Cadence & Tone</span>
                </div>
                <p className="text-xs text-[#F5E9E5] leading-relaxed font-light">
                  {character.communicationStyle}
                </p>
              </div>
            )}
          </div>

          {/* Interests Tags */}
          {character.interests && character.interests.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#BFA8A8]">
                <Compass className="h-3.5 w-3.5 text-[#C9A46A]" />
                <span>Interests & Worldview</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {character.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="rounded-full border border-[#C9A46A]/20 bg-[#21080C]/80 px-3 py-1 text-xs text-[#E0CECE] font-light"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
