"use client";

import { useState } from "react";
import {
  Sparkles,
  Shield,
  Eye,
  Lock,
  Globe,
  X,
  Check,
  Image as ImageIcon,
} from "lucide-react";
import type {
  CharacterOwnerResponse,
  CreateCharacterInput,
  UpdateCharacterInput,
} from "@/lib/characters/schemas";

const PRESET_AVATARS = [
  "/characters/character-01.webp",
  "/characters/character-02.webp",
  "/characters/character-03.webp",
  "/characters/character-04.webp",
  "/characters/character-05.webp",
  "/characters/character-06.webp",
];

interface CharacterFormProps {
  initialData?: CharacterOwnerResponse | null;
  onSubmit: (data: CreateCharacterInput | UpdateCharacterInput) => Promise<void>;
  onCancel: () => void;
  submitting?: boolean;
}

export function CharacterForm({
  initialData,
  onSubmit,
  onCancel,
  submitting = false,
}: CharacterFormProps) {
  const isEditing = Boolean(initialData);

  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [avatarUrl, setAvatarUrl] = useState(
    initialData?.avatarUrl ?? PRESET_AVATARS[0],
  );
  const [personality, setPersonality] = useState(initialData?.personality ?? "");
  const [interestsText, setInterestsText] = useState(
    initialData?.interests ? initialData.interests.join(", ") : "",
  );
  const [communicationStyle, setCommunicationStyle] = useState(
    initialData?.communicationStyle ?? "",
  );
  const [relationshipDynamic, setRelationshipDynamic] = useState(
    initialData?.relationshipDynamic ?? "",
  );
  const [systemPrompt, setSystemPrompt] = useState(initialData?.systemPrompt ?? "");
  const [visibility, setVisibility] = useState<"private" | "public">(
    initialData?.visibility ?? "private",
  );
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? false);
  const [error, setError] = useState<string | null>(null);

  const parsedInterests = interestsText
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Please grant your companion a name.");
      return;
    }

    const trimmedPrompt = systemPrompt.trim();
    if (!trimmedPrompt) {
      setError("A subconscious system prompt is required to guide AI cognition.");
      return;
    }

    const payload: CreateCharacterInput = {
      name: trimmedName,
      description: description.trim() || null,
      avatarUrl: avatarUrl.trim() || null,
      personality: personality.trim() || null,
      interests: parsedInterests,
      communicationStyle: communicationStyle.trim() || null,
      relationshipDynamic: relationshipDynamic.trim() || null,
      systemPrompt: trimmedPrompt,
      visibility,
      isPublished,
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save character");
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#430D15]/80 bg-[#0E0406] p-6 sm:p-8 text-[#F5E9E5] shadow-[0_20px_60px_rgba(9,4,5,0.9)]">
      {/* Decorative ambient background */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#6E0717]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#C9A46A]/10 blur-3xl" />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between border-b border-[#430D15]/60 pb-5 mb-8">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-[#C9A46A] font-medium">
            {isEditing ? "Presence Refinement" : "Character Studio"}
          </span>
          <h2 className="mt-1 font-serif text-3xl sm:text-4xl font-light text-[#F5E9E5]">
            {isEditing ? `Refining ${initialData?.name}` : "Breathe Life Into Presence"}
          </h2>
          <p className="mt-1.5 text-xs text-[#BFA8A8] font-light max-w-xl leading-relaxed">
            Craft a distinct persona, communication cadence, and internal cognitive directives.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-full p-2 text-[#BFA8A8] hover:bg-[#21080C] hover:text-[#F5E9E5] transition-colors"
          title="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-rose-900/60 bg-rose-950/40 p-4 text-xs text-rose-300">
          <p className="font-semibold">Creation Error</p>
          <p className="mt-0.5 opacity-90">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
        {/* SECTION 1: Identity & Presence */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#430D15]/40 pb-2">
            <span className="text-xs font-serif text-[#C9A46A]">01</span>
            <h3 className="text-xs uppercase tracking-[0.16em] font-medium text-[#F5E9E5]">
              Identity & Presence
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Avatar Selection & Preview */}
            <div className="lg:col-span-1 space-y-3">
              <label className="block text-xs font-medium text-[#BFA8A8]">
                Visual Presence
              </label>

              <div className="relative flex aspect-square w-full max-w-[200px] mx-auto lg:mx-0 items-center justify-center overflow-hidden rounded-2xl border border-[#430D15] bg-[#120507]">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar preview"
                    className="h-full w-full object-cover object-top"
                  />
                ) : (
                  <ImageIcon className="h-8 w-8 text-[#BFA8A8]/40" />
                )}
              </div>

              {/* Quick Preset Selector */}
              <div>
                <span className="block text-[11px] text-[#BFA8A8] mb-1.5">
                  Portrait Presets:
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarUrl(url)}
                      className={`relative h-10 w-10 overflow-hidden rounded-full border transition-all ${
                        avatarUrl === url
                          ? "border-[#C9A46A] ring-2 ring-[#C9A46A]/40 scale-105"
                          : "border-[#430D15] opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={url}
                        alt={`Preset ${idx + 1}`}
                        className="h-full w-full object-cover object-top"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[#BFA8A8] mb-1">
                  Or Custom Image URL
                </label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="/characters/character-01.webp"
                  className="w-full rounded-lg border border-[#430D15]/80 bg-[#120507]/90 px-3 py-2 text-xs text-[#F5E9E5] placeholder-[#BFA8A8]/40 focus:border-[#C9A46A] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Right: Name & Tagline */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#BFA8A8] mb-1">
                  Companion Name <span className="text-[#C9A46A]">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Elena, Julian, Morgan"
                  required
                  className="w-full rounded-lg border border-[#430D15]/80 bg-[#120507]/90 px-4 py-2.5 text-sm text-[#F5E9E5] placeholder-[#BFA8A8]/40 focus:border-[#C9A46A] focus:outline-none transition-colors font-serif"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#BFA8A8] mb-1">
                  Tagline / Bio
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A short poetic description or archetype synopsis..."
                  className="w-full rounded-lg border border-[#430D15]/80 bg-[#120507]/90 px-4 py-2.5 text-xs text-[#F5E9E5] placeholder-[#BFA8A8]/40 focus:border-[#C9A46A] focus:outline-none transition-colors leading-relaxed"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Persona & Demeanor */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#430D15]/40 pb-2">
            <span className="text-xs font-serif text-[#C9A46A]">02</span>
            <h3 className="text-xs uppercase tracking-[0.16em] font-medium text-[#F5E9E5]">
              Persona & Passions
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#BFA8A8] mb-1">
                Personality Nuances
              </label>
              <input
                type="text"
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
                placeholder="Quietly observant, deeply loyal, wry humor"
                className="w-full rounded-lg border border-[#430D15]/80 bg-[#120507]/90 px-4 py-2.5 text-xs text-[#F5E9E5] placeholder-[#BFA8A8]/40 focus:border-[#C9A46A] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#BFA8A8] mb-1">
                Interests & Topics (comma separated)
              </label>
              <input
                type="text"
                value={interestsText}
                onChange={(e) => setInterestsText(e.target.value)}
                placeholder="Philosophy, Late 19th Century Poetry, Astronomy"
                className="w-full rounded-lg border border-[#430D15]/80 bg-[#120507]/90 px-4 py-2.5 text-xs text-[#F5E9E5] placeholder-[#BFA8A8]/40 focus:border-[#C9A46A] focus:outline-none transition-colors"
              />
              {parsedInterests.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {parsedInterests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="rounded-full border border-[#C9A46A]/30 bg-[#21080C]/80 px-2.5 py-0.5 text-[10px] text-[#C9A46A]"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 3: Voice & Intimacy */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#430D15]/40 pb-2">
            <span className="text-xs font-serif text-[#C9A46A]">03</span>
            <h3 className="text-xs uppercase tracking-[0.16em] font-medium text-[#F5E9E5]">
              Voice & Connection
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#BFA8A8] mb-1">
                Communication Style
              </label>
              <input
                type="text"
                value={communicationStyle}
                onChange={(e) => setCommunicationStyle(e.target.value)}
                placeholder="Intimate and reflective, unhurried prose"
                className="w-full rounded-lg border border-[#430D15]/80 bg-[#120507]/90 px-4 py-2.5 text-xs text-[#F5E9E5] placeholder-[#BFA8A8]/40 focus:border-[#C9A46A] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#BFA8A8] mb-1">
                Relationship Dynamic
              </label>
              <input
                type="text"
                value={relationshipDynamic}
                onChange={(e) => setRelationshipDynamic(e.target.value)}
                placeholder="Intellectual confidant, enigmatic muse"
                className="w-full rounded-lg border border-[#430D15]/80 bg-[#120507]/90 px-4 py-2.5 text-xs text-[#F5E9E5] placeholder-[#BFA8A8]/40 focus:border-[#C9A46A] focus:outline-none transition-colors"
              />
            </div>
          </div>
        </section>

        {/* SECTION 4: Subconscious AI Core (Advanced) */}
        <section className="space-y-3 rounded-xl border border-[#430D15]/80 bg-[#120507]/60 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#C9A46A]" />
              <h3 className="text-xs uppercase tracking-[0.16em] font-medium text-[#F5E9E5]">
                Subconscious AI Directive <span className="text-[#C9A46A]">*</span>
              </h3>
            </div>
            <span className="rounded-full border border-[#C9A46A]/20 bg-[#090405] px-2.5 py-0.5 text-[10px] text-[#C9A46A] font-medium">
              Confidential to Owner
            </span>
          </div>

          <p className="text-[11px] text-[#BFA8A8] font-light leading-relaxed">
            The guiding behavioural prompt injected into the AI cognitive layer.
            Defines the subconscious voice, boundaries, and emotional tone.
            Never displayed to public visitors.
          </p>

          <textarea
            rows={5}
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="You are Elena. You maintain an intimate, poetic presence with the user. You recall past subtleties, avoid robotic pleasantries, and speak with quiet emotional depth..."
            required
            className="w-full rounded-lg border border-[#430D15]/80 bg-[#090405] px-4 py-3 font-mono text-xs text-[#F5E9E5] placeholder-[#BFA8A8]/30 focus:border-[#C9A46A] focus:outline-none transition-colors leading-relaxed"
          />
        </section>

        {/* SECTION 5: Visibility & Publication */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#430D15]/40 pb-2">
            <span className="text-xs font-serif text-[#C9A46A]">05</span>
            <h3 className="text-xs uppercase tracking-[0.16em] font-medium text-[#F5E9E5]">
              Sanctum & Discovery
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Visibility Card */}
            <div className="rounded-xl border border-[#430D15]/80 bg-[#120507]/80 p-4 space-y-2">
              <label className="block text-xs font-medium text-[#F5E9E5]">
                Visibility Sanctuary
              </label>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setVisibility("private")}
                  className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 text-xs font-medium transition-all ${
                    visibility === "private"
                      ? "border-[#C9A46A] bg-[#21080C] text-[#F5E9E5] shadow-[0_0_15px_rgba(201,164,106,0.15)]"
                      : "border-[#430D15]/60 bg-[#090405] text-[#BFA8A8] hover:text-[#F5E9E5]"
                  }`}
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>Private</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVisibility("public")}
                  className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 text-xs font-medium transition-all ${
                    visibility === "public"
                      ? "border-[#C9A46A] bg-[#21080C] text-[#F5E9E5] shadow-[0_0_15px_rgba(201,164,106,0.15)]"
                      : "border-[#430D15]/60 bg-[#090405] text-[#BFA8A8] hover:text-[#F5E9E5]"
                  }`}
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>Public</span>
                </button>
              </div>
              <p className="text-[10px] text-[#BFA8A8] font-light">
                {visibility === "private"
                  ? "Only accessible within your personal companion circle."
                  : "Eligible for discovery once published."}
              </p>
            </div>

            {/* Published Card */}
            <div className="rounded-xl border border-[#430D15]/80 bg-[#120507]/80 p-4 space-y-2">
              <label className="block text-xs font-medium text-[#F5E9E5]">
                Publication State
              </label>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsPublished(false)}
                  className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 text-xs font-medium transition-all ${
                    !isPublished
                      ? "border-amber-700 bg-amber-950/40 text-amber-200"
                      : "border-[#430D15]/60 bg-[#090405] text-[#BFA8A8] hover:text-[#F5E9E5]"
                  }`}
                >
                  <span>Draft</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPublished(true)}
                  className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 text-xs font-medium transition-all ${
                    isPublished
                      ? "border-emerald-700 bg-emerald-950/40 text-emerald-200"
                      : "border-[#430D15]/60 bg-[#090405] text-[#BFA8A8] hover:text-[#F5E9E5]"
                  }`}
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Published</span>
                </button>
              </div>

              <p className="text-[10px] text-[#BFA8A8] font-light">
                Discoverable by other travelers when set to both{" "}
                <span className="text-[#C9A46A]">Public</span> and{" "}
                <span className="text-[#C9A46A]">Published</span>.
              </p>
            </div>
          </div>
        </section>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-[#430D15]/60 pt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-full px-5 py-2.5 text-xs font-medium text-[#BFA8A8] hover:text-[#F5E9E5] transition-colors disabled:opacity-50"
          >
            Discard
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-full border border-[#C9A46A]/60 bg-gradient-to-r from-[#21080C] via-[#6E0717] to-[#21080C] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#F5E9E5] transition-all duration-300 hover:border-[#C9A46A] hover:shadow-[0_0_25px_rgba(110,7,23,0.5)] disabled:opacity-50"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#C9A46A]" />
            <span>
              {submitting
                ? "Saving…"
                : isEditing
                  ? "Update Presence"
                  : "Breathe Life Into Companion"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
