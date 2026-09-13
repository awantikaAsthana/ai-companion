"use client";

import { useState } from "react";
import type {
  CharacterOwnerResponse,
  CreateCharacterInput,
  UpdateCharacterInput,
} from "@/lib/characters/schemas";

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
  const [avatarUrl, setAvatarUrl] = useState(initialData?.avatarUrl ?? "");
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Name is required.");
      return;
    }

    const trimmedPrompt = systemPrompt.trim();
    if (!trimmedPrompt) {
      setError("System prompt is required.");
      return;
    }

    // ponytail: comma-separated string split & trimmed
    const interests = interestsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: CreateCharacterInput = {
      name: trimmedName,
      description: description.trim() || null,
      avatarUrl: avatarUrl.trim() || null,
      personality: personality.trim() || null,
      interests,
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
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-neutral-800 bg-neutral-900 p-6 text-neutral-200"
    >
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-5">
        <h2 className="text-base font-semibold text-neutral-100">
          {isEditing ? `Edit "${initialData?.name}"` : "Create Character"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-neutral-400 hover:text-neutral-200"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded bg-rose-950/50 border border-rose-800/60 p-3 text-xs text-rose-300">
          {error}
        </div>
      )}

      <div className="space-y-4 text-xs">
        <div>
          <label className="block mb-1 font-medium text-neutral-300">
            Name <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Elena"
            required
            className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-200 focus:border-neutral-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-neutral-300">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Poetic and observant companion"
            className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-200 focus:border-neutral-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-neutral-300">
            Avatar URL
          </label>
          <input
            type="text"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="/characters/character-01.webp or https://..."
            className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-200 focus:border-neutral-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium text-neutral-300">
              Personality
            </label>
            <input
              type="text"
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              placeholder="Thoughtful, quiet, intellectual"
              className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-200 focus:border-neutral-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-neutral-300">
              Interests (comma separated)
            </label>
            <input
              type="text"
              value={interestsText}
              onChange={(e) => setInterestsText(e.target.value)}
              placeholder="Literature, Philosophy, Midnight Walks"
              className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-200 focus:border-neutral-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium text-neutral-300">
              Communication Style
            </label>
            <input
              type="text"
              value={communicationStyle}
              onChange={(e) => setCommunicationStyle(e.target.value)}
              placeholder="Intimate and reflective"
              className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-200 focus:border-neutral-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-neutral-300">
              Relationship Dynamic
            </label>
            <input
              type="text"
              value={relationshipDynamic}
              onChange={(e) => setRelationshipDynamic(e.target.value)}
              placeholder="Intellectual confidant"
              className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-200 focus:border-neutral-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium text-neutral-300">
            System Prompt <span className="text-rose-400">*</span>
          </label>
          <textarea
            rows={4}
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="You are Elena. You speak with quiet introspection..."
            required
            className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 font-mono text-xs text-neutral-200 focus:border-neutral-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded border border-neutral-800 bg-neutral-950/60 p-3">
          <div>
            <label className="block mb-1 font-medium text-neutral-300">
              Visibility
            </label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as "private" | "public")}
              className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-neutral-200 focus:border-neutral-500 focus:outline-none"
            >
              <option value="private">Private (Only you)</option>
              <option value="public">Public</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium text-neutral-300">
              Published Status
            </label>
            <select
              value={isPublished ? "true" : "false"}
              onChange={(e) => setIsPublished(e.target.value === "true")}
              className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-neutral-200 focus:border-neutral-500 focus:outline-none"
            >
              <option value="false">Draft (Unpublished)</option>
              <option value="true">Published</option>
            </select>
            <p className="mt-1 text-[11px] text-neutral-500">
              Discoverable only when both Public AND Published.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 border-t border-neutral-800 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded px-4 py-2 text-xs font-medium text-neutral-400 hover:text-neutral-200 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-neutral-100 px-4 py-2 text-xs font-semibold text-neutral-950 hover:bg-neutral-200 disabled:opacity-50"
        >
          {submitting
            ? "Saving…"
            : isEditing
              ? "Update Character"
              : "Create Character"}
        </button>
      </div>
    </form>
  );
}
