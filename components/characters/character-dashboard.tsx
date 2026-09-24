"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Plus,
  Compass,
  Users,
  AlertCircle,
  X,
  CheckCircle2,
} from "lucide-react";
import {
  getCharacters,
  createCharacter,
  updateCharacter,
  deleteCharacter,
} from "@/lib/characters/client";
import type {
  CharacterResponse,
  CharacterOwnerResponse,
  CreateCharacterInput,
  UpdateCharacterInput,
} from "@/lib/characters/schemas";
import { CharacterCard } from "./character-card";
import { CharacterForm } from "./character-form";

export function CharacterDashboard() {
  const [characters, setCharacters] = useState<CharacterResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [is401, setIs401] = useState(false);

  // Tab filter: "all" | "discover" | "my"
  const [activeTab, setActiveTab] = useState<"all" | "discover" | "my">("all");

  // Form studio state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] =
    useState<CharacterOwnerResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Feedback notifications
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const router = useRouter();

  async function handleStartChat(character: CharacterResponse) {
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
        setFeedback({
          type: "error",
          message: err.error || "Failed to start conversation",
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "Network error. Please try again.",
      });
    }
  }

  async function loadData() {
    setLoading(true);
    setError(null);
    setIs401(false);

    try {
      const data = await getCharacters();
      setCharacters(data.characters);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load companions.";
      if (message.includes("401") || message.toLowerCase().includes("authenticated")) {
        setIs401(true);
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleOpenCreate() {
    setEditingCharacter(null);
    setIsFormOpen(true);
    setFeedback(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleOpenEdit(character: CharacterOwnerResponse) {
    setEditingCharacter(character);
    setIsFormOpen(true);
    setFeedback(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelForm() {
    setIsFormOpen(false);
    setEditingCharacter(null);
  }

  async function handleFormSubmit(
    data: CreateCharacterInput | UpdateCharacterInput,
  ) {
    setSubmitting(true);
    setFeedback(null);

    try {
      if (editingCharacter) {
        await updateCharacter(editingCharacter.id, data);
        setFeedback({
          type: "success",
          message: `Presence "${data.name ?? editingCharacter.name}" refined successfully.`,
        });
      } else {
        await createCharacter(data as CreateCharacterInput);
        setFeedback({
          type: "success",
          message: `Presence "${data.name}" has been brought to life.`,
        });
      }
      setIsFormOpen(false);
      setEditingCharacter(null);
      await loadData();
    } catch (err) {
      throw err;
    } finally {
      setSubmitting(false);
    }
  }

  async function handleTogglePublish(character: CharacterOwnerResponse) {
    const nextPublished = !character.isPublished;
    try {
      await updateCharacter(character.id, { isPublished: nextPublished });
      setFeedback({
        type: "success",
        message: `"${character.name}" is now ${
          nextPublished ? "published for discovery" : "in private draft"
        }.`,
      });
      await loadData();
    } catch (err) {
      setFeedback({
        type: "error",
        message:
          err instanceof Error
            ? err.message
            : "Failed to update publication status",
      });
    }
  }

  async function handleDelete(id: string) {
    const char = characters.find((c) => c.id === id);
    const charName = char?.name ? `"${char.name}"` : "this companion";
    if (!window.confirm(`Are you certain you wish to dissolve ${charName}?`)) {
      return;
    }

    try {
      await deleteCharacter(id);
      setFeedback({
        type: "success",
        message: "Companion dissolved successfully.",
      });
      await loadData();
    } catch (err) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to delete companion",
      });
    }
  }

  // Split by presence of creatorId (redacted by backend for non-owners)
  const myCharacters = characters.filter(
    (c): c is CharacterOwnerResponse => "creatorId" in c,
  );
  const publicCharacters = characters.filter((c) => !("creatorId" in c));

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Welcome Header */}
      <div className="relative overflow-hidden rounded-3xl border border-[#430D15]/60 bg-gradient-to-b from-[#120507] via-[#0E0406] to-[#090405] p-6 sm:p-10 shadow-[0_16px_50px_rgba(9,4,5,0.8)]">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#6E0717]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[#C9A46A]/10 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.24em] text-[#C9A46A]">
              <span>✦</span> The Sanctuary
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-light text-[#F5E9E5] tracking-wide">
              Companions of Ecstasy
            </h1>
            <p className="text-xs sm:text-sm font-light text-[#BFA8A8] leading-relaxed">
              Explore presences shaped for deep conversation, or sculpt a new companion
              with a voice, soul, and worldview uniquely tailored to yours.
            </p>
          </div>

          {!isFormOpen && (
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[44px] self-start md:self-auto rounded-full border border-[#C9A46A]/60 bg-gradient-to-r from-[#21080C] via-[#6E0717] to-[#21080C] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#F5E9E5] transition-all duration-300 hover:border-[#C9A46A] hover:shadow-[0_0_25px_rgba(110,7,23,0.5)] touch-manipulation"
            >
              <Plus className="h-4 w-4 text-[#C9A46A]" />
              <span>Craft Companion</span>
            </button>
          )}
        </div>
      </div>

      {/* Global Feedback Banner */}
      {feedback && (
        <div
          className={`flex items-center justify-between rounded-xl p-4 text-xs border backdrop-blur-md transition-all ${
            feedback.type === "success"
              ? "bg-emerald-950/40 border-emerald-800/80 text-emerald-200"
              : "bg-rose-950/40 border-rose-800/80 text-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#C9A46A]" />
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="rounded-full p-1 opacity-70 hover:opacity-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Form Studio (Inline Mount) */}
      {isFormOpen && (
        <div className="mb-10">
          <CharacterForm
            initialData={editingCharacter}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
            submitting={submitting}
          />
        </div>
      )}

      {/* Navigation Filter Tabs */}
      {!loading && !error && (
        <div className="flex items-center gap-2 border-b border-[#430D15]/40 pb-4 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => setActiveTab("all")}
            className={`shrink-0 rounded-full px-4 py-2 min-h-[40px] text-xs font-medium transition-all touch-manipulation ${
              activeTab === "all"
                ? "border border-[#C9A46A]/50 bg-[#21080C] text-[#F5E9E5]"
                : "text-[#BFA8A8] hover:text-[#F5E9E5]"
            }`}
          >
            All Presences ({characters.length})
          </button>

          <button
            onClick={() => setActiveTab("discover")}
            className={`shrink-0 rounded-full px-4 py-2 min-h-[40px] text-xs font-medium transition-all touch-manipulation ${
              activeTab === "discover"
                ? "border border-[#C9A46A]/50 bg-[#21080C] text-[#F5E9E5]"
                : "text-[#BFA8A8] hover:text-[#F5E9E5]"
            }`}
          >
            Discover Realm ({publicCharacters.length})
          </button>

          <button
            onClick={() => setActiveTab("my")}
            className={`shrink-0 rounded-full px-4 py-2 min-h-[40px] text-xs font-medium transition-all touch-manipulation ${
              activeTab === "my"
                ? "border border-[#C9A46A]/50 bg-[#21080C] text-[#F5E9E5]"
                : "text-[#BFA8A8] hover:text-[#F5E9E5]"
            }`}
          >
            My Creations ({myCharacters.length})
          </button>
        </div>
      )}

      {/* Unauthenticated Alert (401) */}
      {is401 && (
        <div className="rounded-2xl border border-amber-900/60 bg-amber-950/30 p-6 text-xs text-amber-200">
          <div className="flex items-center gap-2 font-medium text-amber-100">
            <AlertCircle className="h-4 w-4" />
            <span>Session Required</span>
          </div>
          <p className="mt-1 text-[#BFA8A8]">
            Your session has expired. Please{" "}
            <Link href="/login" className="underline text-[#C9A46A] hover:text-white">
              log in again
            </Link>{" "}
            to access your companion sanctuary.
          </p>
        </div>
      )}

      {/* Error State */}
      {!is401 && error && (
        <div className="rounded-2xl border border-rose-900/60 bg-rose-950/30 p-6 text-xs text-rose-200 flex items-center justify-between">
          <div>
            <p className="font-semibold text-rose-100">Sanctuary Sync Error</p>
            <p className="mt-0.5 text-rose-300">{error}</p>
          </div>
          <button
            onClick={loadData}
            className="rounded-full border border-[#430D15] bg-[#21080C] px-4 py-1.5 text-xs text-[#F5E9E5] hover:border-[#C9A46A]"
          >
            Retry Sync
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <span className="font-serif text-3xl text-[#C9A46A] animate-pulse">✦</span>
          <p className="mt-4 font-serif text-xs tracking-widest text-[#BFA8A8] uppercase">
            Loading companions…
          </p>
        </div>
      )}

      {/* Dashboard Sections */}
      {!loading && !error && (
        <div className="space-y-16">
          {/* SECTION 1: Discover Realm */}
          {(activeTab === "all" || activeTab === "discover") && (
            <section className="space-y-6">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] text-[#C9A46A] font-medium">
                    Global Sanctuary
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#F5E9E5]">
                    Discover Presences
                  </h2>
                </div>
                <span className="text-xs text-[#BFA8A8]">
                  {publicCharacters.length}{" "}
                  {publicCharacters.length === 1 ? "companion" : "companions"}
                </span>
              </div>

              {publicCharacters.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#430D15]/80 bg-[#120507]/30 p-12 text-center text-xs text-[#BFA8A8]">
                  <Compass className="h-8 w-8 mx-auto text-[#C9A46A]/40 mb-3" />
                  <p className="font-medium text-[#F5E9E5]">
                    No public companions discovered yet.
                  </p>
                  <p className="mt-1 text-[11px] text-[#BFA8A8]">
                    When you or other creators publish public companions, they will appear here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {publicCharacters.map((char) => (
                    <CharacterCard
                      key={char.id}
                      character={char}
                      onStartChat={handleStartChat}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* SECTION 2: My Creations */}
          {(activeTab === "all" || activeTab === "my") && (
            <section className="space-y-6">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] text-[#C9A46A] font-medium">
                    Personal Circle
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#F5E9E5]">
                    My Companions
                  </h2>
                </div>
                <span className="text-xs text-[#BFA8A8]">
                  {myCharacters.length}{" "}
                  {myCharacters.length === 1 ? "creation" : "creations"}
                </span>
              </div>

              {myCharacters.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#430D15]/80 bg-[#120507]/30 p-12 text-center text-xs text-[#BFA8A8] space-y-4">
                  <Users className="h-8 w-8 mx-auto text-[#C9A46A]/40" />
                  <div>
                    <p className="font-medium text-[#F5E9E5]">
                      Your personal circle is waiting.
                    </p>
                    <p className="mt-1 text-[11px] text-[#BFA8A8]">
                      Craft a companion to explore unique conversations, memory, and intimacy.
                    </p>
                  </div>
                  <button
                    onClick={handleOpenCreate}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A46A]/50 bg-[#21080C] px-5 py-2.5 min-h-[44px] text-xs font-medium text-[#F5E9E5] hover:border-[#C9A46A] touch-manipulation"
                  >
                    <Plus className="h-3.5 w-3.5 text-[#C9A46A]" />
                    <span>Create Your First Companion</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myCharacters.map((char) => (
                    <CharacterCard
                      key={char.id}
                      character={char}
                      onEdit={handleOpenEdit}
                      onDelete={handleDelete}
                      onTogglePublish={handleTogglePublish}
                      onStartChat={handleStartChat}
                    />
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
