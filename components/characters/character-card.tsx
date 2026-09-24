"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Edit3,
  Globe,
  Lock,
  Trash2,
  ArrowUpRight,
  Eye,
  EyeOff,
  MessageSquare,
} from "lucide-react";
import type {
  CharacterResponse,
  CharacterOwnerResponse,
} from "@/lib/characters/schemas";

interface CharacterCardProps {
  character: CharacterResponse;
  onEdit?: (character: CharacterOwnerResponse) => void;
  onDelete?: (id: string) => void;
  onTogglePublish?: (character: CharacterOwnerResponse) => void;
  onStartChat?: (character: CharacterResponse) => void;
}

export function CharacterCard({
  character,
  onEdit,
  onDelete,
  onTogglePublish,
  onStartChat,
}: CharacterCardProps) {
  const [imageError, setImageError] = useState(false);
  const isOwner = "creatorId" in character;
  const ownerChar = isOwner ? (character as CharacterOwnerResponse) : null;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#430D15]/50 bg-[#120507] transition-all duration-500 hover:border-[#C9A46A]/40 hover:shadow-[0_16px_50px_rgba(110,7,23,0.3)] h-[440px] sm:h-[480px]">
      {/* Background Image / Portrait */}
      {character.avatarUrl && !imageError ? (
        <img
          src={character.avatarUrl}
          alt={character.name}
          onError={() => setImageError(true)}
          className="absolute inset-0 h-full w-full object-cover object-top filter brightness-[0.92] contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-[#21080C] via-[#120507] to-[#090405] flex flex-col items-center justify-center">
          <span className="font-serif text-6xl text-[#C9A46A]/20">✦</span>
        </div>
      )}

      {/* Cinematic multi-stop gradient overlay for typography contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#090405] via-[#090405]/75 via-50% to-[#090405]/20 opacity-95 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Subtle wine atmospheric glow on hover */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#6E0717]/25 via-transparent to-[#C9A46A]/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Top Bar: Status Badges / Visibility */}
      <div className="relative z-10 flex items-center justify-between p-4 sm:p-5">
        {isOwner ? (
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium tracking-wide backdrop-blur-md border ${
                character.visibility === "public"
                  ? "border-[#C9A46A]/30 bg-[#090405]/80 text-[#C9A46A]"
                  : "border-[#430D15]/80 bg-[#090405]/80 text-[#BFA8A8]"
              }`}
            >
              {character.visibility === "public" ? (
                <Globe className="h-3 w-3 text-[#C9A46A]" />
              ) : (
                <Lock className="h-3 w-3" />
              )}
              {character.visibility === "public" ? "Public" : "Private"}
            </span>

            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium tracking-wide backdrop-blur-md border ${
                character.isPublished
                  ? "border-emerald-800/60 bg-emerald-950/70 text-emerald-300"
                  : "border-amber-800/60 bg-amber-950/70 text-amber-300"
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
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#430D15]/70 bg-[#090405]/80 px-2.5 py-0.5 text-[11px] font-medium tracking-wider text-[#F5E9E5] backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C9A46A] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C9A46A]" />
            </span>
            Available
          </span>
        )}

        <Link
          href={`/app/characters/${character.id}`}
          aria-label={`View profile of ${character.name}`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#430D15]/80 bg-[#21080C]/80 text-[#F5E9E5] backdrop-blur-md transition-all duration-300 hover:border-[#C9A46A] hover:bg-[#6E0717] hover:text-[#F5E9E5]"
        >
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      {/* Card Body & Details */}
      <div className="relative z-10 p-5 sm:p-6 flex flex-col justify-end">
        <Link href={`/app/characters/${character.id}`} className="group/title block">
          <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#F5E9E5] transition-colors duration-200 group-hover/title:text-[#C9A46A] truncate">
            {character.name}
          </h3>
        </Link>

        {character.description && (
          <p className="mt-1 text-xs text-[#BFA8A8] line-clamp-2 leading-relaxed font-light">
            {character.description}
          </p>
        )}

        {/* Traits & Dynamic Chips */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {character.personality && (
            <span className="rounded-full border border-[#430D15]/60 bg-[#21080C]/70 px-2.5 py-0.5 text-[10px] text-[#E0CECE] font-light">
              {character.personality}
            </span>
          )}
          {character.relationshipDynamic && (
            <span className="rounded-full border border-[#C9A46A]/20 bg-[#090405]/70 px-2.5 py-0.5 text-[10px] text-[#C9A46A] font-light">
              {character.relationshipDynamic}
            </span>
          )}
          {character.interests?.slice(0, 2).map((interest, idx) => (
            <span
              key={idx}
              className="rounded-full border border-neutral-800 bg-neutral-900/60 px-2 py-0.5 text-[10px] text-[#A69393]"
            >
              {interest}
            </span>
          ))}
        </div>

        {/* Action Controls */}
        <div className="mt-5 pt-3 border-t border-[#430D15]/40 flex items-center justify-between gap-2">
          <Link
            href={`/app/characters/${character.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#F5E9E5] hover:text-[#C9A46A] transition-colors min-h-[38px] touch-manipulation"
          >
            <span>View Profile</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>

          {isOwner && ownerChar ? (
            <div className="flex items-center gap-1.5">
              {onTogglePublish && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onTogglePublish(ownerChar);
                  }}
                  title={ownerChar.isPublished ? "Unpublish" : "Publish"}
                  className="flex h-9 min-h-[36px] items-center gap-1 rounded-full border border-[#430D15]/80 bg-[#120507]/90 px-3 text-[11px] font-medium text-[#BFA8A8] transition-all hover:border-[#C9A46A]/50 hover:text-[#F5E9E5] touch-manipulation"
                >
                  {ownerChar.isPublished ? (
                    <>
                      <EyeOff className="h-3 w-3 text-amber-400" />
                      <span className="hidden sm:inline">Unpublish</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-3 w-3 text-emerald-400" />
                      <span className="hidden sm:inline">Publish</span>
                    </>
                  )}
                </button>
              )}

              {onEdit && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onEdit(ownerChar);
                  }}
                  title="Edit Character"
                  className="flex h-9 w-9 min-h-[36px] min-w-[36px] items-center justify-center rounded-full border border-[#430D15]/80 bg-[#120507]/90 text-[#BFA8A8] transition-all hover:border-[#C9A46A]/50 hover:text-[#F5E9E5] touch-manipulation"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
              )}

              {onDelete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete(ownerChar.id);
                  }}
                  title="Delete Character"
                  className="flex h-9 w-9 min-h-[36px] min-w-[36px] items-center justify-center rounded-full border border-rose-950/60 bg-rose-950/30 text-rose-400 transition-all hover:border-rose-800 hover:bg-rose-900/40 hover:text-rose-200 touch-manipulation"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onStartChat?.(character)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A46A]/40 bg-[#21080C]/80 px-3.5 py-1.5 min-h-[38px] text-[11px] font-medium text-[#F5E9E5] transition-all duration-300 hover:border-[#C9A46A] hover:bg-[#6E0717] touch-manipulation"
            >
              <MessageSquare className="h-3 w-3 text-[#C9A46A]" />
              <span>Connect</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
