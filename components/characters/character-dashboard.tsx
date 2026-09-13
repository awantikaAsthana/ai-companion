"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

  // Form modal/inline state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] =
    useState<CharacterOwnerResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  async function loadData() {
    setLoading(true);
    setError(null);
    setIs401(false);

    try {
      const data = await getCharacters();
      setCharacters(data.characters);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load characters.";
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
  }

  function handleOpenEdit(character: CharacterOwnerResponse) {
    setEditingCharacter(character);
    setIsFormOpen(true);
    setFeedback(null);
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
          message: `Character "${data.name ?? editingCharacter.name}" updated successfully.`,
        });
      } else {
        await createCharacter(data as CreateCharacterInput);
        setFeedback({
          type: "success",
          message: `Character "${data.name}" created successfully.`,
        });
      }
      setIsFormOpen(false);
      setEditingCharacter(null);
      await loadData();
    } catch (err) {
      throw err; // Form will display it
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
        message: `Character "${character.name}" is now ${
          nextPublished ? "published" : "unpublished"
        }.`,
      });
      await loadData();
    } catch (err) {
      setFeedback({
        type: "error",
        message:
          err instanceof Error
            ? err.message
            : "Failed to update published status",
      });
    }
  }

  async function handleDelete(id: string) {
    // ponytail: native window.confirm check
    if (!window.confirm("Delete this character?")) return;

    try {
      await deleteCharacter(id);
      setFeedback({
        type: "success",
        message: "Character deleted successfully.",
      });
      await loadData();
    } catch (err) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to delete character",
      });
    }
  }

  // ponytail: partition by backend presence of creatorId
  const myCharacters = characters.filter(
    (c): c is CharacterOwnerResponse => "creatorId" in c,
  );
  const publicCharacters = characters.filter((c) => !("creatorId" in c));

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-neutral-100">
            Character Management
          </h1>
          <p className="mt-1 text-xs text-neutral-400">
            M2 Temporary testing interface for character creation, publishing, and discovery.
          </p>
        </div>

        {!isFormOpen && (
          <button
            onClick={handleOpenCreate}
            className="self-start rounded bg-neutral-100 px-4 py-2 text-xs font-semibold text-neutral-950 hover:bg-neutral-200 transition-colors"
          >
            Create Character
          </button>
        )}
      </div>

      {/* Global feedback banner */}
      {feedback && (
        <div
          className={`flex items-center justify-between rounded p-3 text-xs border ${
            feedback.type === "success"
              ? "bg-emerald-950/40 border-emerald-800 text-emerald-300"
              : "bg-rose-950/40 border-rose-800 text-rose-300"
          }`}
        >
          <span>{feedback.message}</span>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs underline opacity-80 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Form area (create / edit) */}
      {isFormOpen && (
        <div className="mb-8">
          <CharacterForm
            initialData={editingCharacter}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
            submitting={submitting}
          />
        </div>
      )}

      {/* Auth failure (401) */}
      {is401 && (
        <div className="rounded border border-amber-800/80 bg-amber-950/40 p-4 text-xs text-amber-300">
          <p className="font-semibold">Authentication Required</p>
          <p className="mt-1">
            Your session is missing or expired.{" "}
            <Link href="/login" className="underline font-medium hover:text-white">
              Log in to continue
            </Link>
            .
          </p>
        </div>
      )}

      {/* Error state */}
      {!is401 && error && (
        <div className="rounded border border-rose-800/80 bg-rose-950/40 p-4 text-xs text-rose-300 flex items-center justify-between">
          <span>Unable to load characters: {error}</span>
          <button
            onClick={loadData}
            className="rounded bg-neutral-800 px-3 py-1 font-medium text-neutral-200 hover:bg-neutral-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="py-12 text-center text-xs text-neutral-500 animate-pulse">
          Loading characters...
        </div>
      )}

      {/* Characters Content */}
      {!loading && !error && (
        <div className="space-y-10">
          {/* SECTION 1: My Characters */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-neutral-200">
                My Characters
                <span className="ml-2 text-xs font-normal text-neutral-500">
                  ({myCharacters.length})
                </span>
              </h2>
            </div>

            {myCharacters.length === 0 ? (
              <div className="rounded border border-dashed border-neutral-800 p-8 text-center text-xs text-neutral-500">
                No characters yet. Click &quot;Create Character&quot; to add one.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myCharacters.map((char) => (
                  <CharacterCard
                    key={char.id}
                    character={char}
                    onEdit={handleOpenEdit}
                    onDelete={handleDelete}
                    onTogglePublish={handleTogglePublish}
                  />
                ))}
              </div>
            )}
          </section>

          {/* SECTION 2: Public Characters */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-neutral-200">
                Public Characters
                <span className="ml-2 text-xs font-normal text-neutral-500">
                  ({publicCharacters.length})
                </span>
              </h2>
            </div>

            {publicCharacters.length === 0 ? (
              <div className="rounded border border-dashed border-neutral-800 p-8 text-center text-xs text-neutral-500">
                No public characters available.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {publicCharacters.map((char) => (
                  <CharacterCard key={char.id} character={char} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
