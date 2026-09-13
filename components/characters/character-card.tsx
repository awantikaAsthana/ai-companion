"use client";

import type {
  CharacterResponse,
  CharacterOwnerResponse,
} from "@/lib/characters/schemas";

interface CharacterCardProps {
  character: CharacterResponse;
  onEdit?: (character: CharacterOwnerResponse) => void;
  onDelete?: (id: string) => void;
  onTogglePublish?: (character: CharacterOwnerResponse) => void;
}

export function CharacterCard({
  character,
  onEdit,
  onDelete,
  onTogglePublish,
}: CharacterCardProps) {
  // ponytail: backend redacts creatorId for non-owners, presence indicates ownership
  const isOwner = "creatorId" in character;
  const ownerChar = isOwner ? (character as CharacterOwnerResponse) : null;

  return (
    <div className="flex flex-col justify-between rounded-lg border border-neutral-800 bg-neutral-900/60 p-5 text-neutral-200">
      <div>
        <div className="flex items-start gap-4">
          {character.avatarUrl ? (
            <img
              src={character.avatarUrl}
              alt={character.name}
              className="h-14 w-14 rounded-full border border-neutral-700 object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-neutral-800 bg-neutral-800 text-lg font-medium text-neutral-400">
              {character.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-semibold text-neutral-100 truncate">
                {character.name}
              </h3>
              {isOwner && (
                <>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      character.visibility === "public"
                        ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
                        : "bg-neutral-800 text-neutral-400 border border-neutral-700"
                    }`}
                  >
                    {character.visibility}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      character.isPublished
                        ? "bg-sky-950/80 text-sky-400 border border-sky-800/60"
                        : "bg-amber-950/80 text-amber-400 border border-amber-800/60"
                    }`}
                  >
                    {character.isPublished ? "Published" : "Draft"}
                  </span>
                </>
              )}
            </div>

            {character.description && (
              <p className="mt-1 text-xs text-neutral-400 line-clamp-2">
                {character.description}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-2 text-xs text-neutral-300">
          {character.personality && (
            <div>
              <span className="text-neutral-500 font-medium">Personality: </span>
              <span>{character.personality}</span>
            </div>
          )}

          {character.communicationStyle && (
            <div>
              <span className="text-neutral-500 font-medium">Communication: </span>
              <span>{character.communicationStyle}</span>
            </div>
          )}

          {character.relationshipDynamic && (
            <div>
              <span className="text-neutral-500 font-medium">Dynamic: </span>
              <span>{character.relationshipDynamic}</span>
            </div>
          )}

          {character.interests && character.interests.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {character.interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="rounded bg-neutral-800/80 px-2 py-0.5 text-[11px] text-neutral-400"
                >
                  {interest}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {isOwner && ownerChar && (
        <div className="mt-5 flex items-center justify-between border-t border-neutral-800/80 pt-3 text-xs">
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(ownerChar)}
                className="rounded bg-neutral-800 px-3 py-1 font-medium text-neutral-200 hover:bg-neutral-700"
              >
                Edit
              </button>
            )}
            {onTogglePublish && (
              <button
                onClick={() => onTogglePublish(ownerChar)}
                className="rounded bg-neutral-800 px-3 py-1 font-medium text-neutral-300 hover:bg-neutral-700"
              >
                {ownerChar.isPublished ? "Unpublish" : "Publish"}
              </button>
            )}
          </div>

          {onDelete && (
            <button
              onClick={() => onDelete(ownerChar.id)}
              className="rounded bg-rose-950/40 px-3 py-1 font-medium text-rose-400 hover:bg-rose-900/60 border border-rose-900/40"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
