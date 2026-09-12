"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Character } from "@/lib/data/characters";

interface CharacterCardProps {
  character: Character;
  featured?: boolean;
}

export function CharacterCard({ character, featured = false }: CharacterCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`group relative flex flex-col justify-end overflow-hidden rounded-2xl border border-[#430D15]/50 bg-[#120507] transition-all duration-500 hover:border-[#C9A46A]/40 hover:shadow-[0_16px_50px_rgba(110,7,23,0.3)] w-full shrink-0 ${
        featured ? "h-[500px] sm:h-[560px]" : "h-[450px] sm:h-[490px]"
      }`}
    >
      {/* Background portrait image with smooth cinematic zoom */}
      {!imageError ? (
        <img
          src={character.image}
          alt={character.name}
          onError={() => {
            if (character.image.endsWith(".webp")) {
              const fallback = character.image.replace(".webp", ".jpg");
              const img = new Image();
              img.onload = () => {};
              img.onerror = () => setImageError(true);
              img.src = fallback;
            } else {
              setImageError(true);
            }
          }}
          className="absolute inset-0 h-full w-full object-cover object-top filter brightness-[0.94] contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-[#21080C] via-[#120507] to-[#090405] flex items-center justify-center">
          <span className="font-serif text-5xl text-[#C9A46A]/40">✦</span>
        </div>
      )}

      {/* Cinematic multi-stop gradient dissolve to seamlessly integrate with dark atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#090405] via-[#090405]/65 via-45% to-transparent opacity-95 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Subtle crimson/wine atmospheric glow on hover */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#6E0717]/25 via-transparent to-[#C9A46A]/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Top Bar: Status indicator & subtle badge */}
      <div className="absolute top-4 sm:top-5 left-4 sm:left-5 right-4 sm:right-5 z-10 flex items-center justify-between">
        {featured ? (
          <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#C9A46A] backdrop-blur-md bg-[#090405]/80 px-2.5 py-1 rounded-full border border-[#C9A46A]/30">
            Featured Presence
          </span>
        ) : <span />}

        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#430D15]/70 bg-[#090405]/80 px-3 py-1 text-[11px] font-medium tracking-wider text-[#F5E9E5] backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C9A46A] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C9A46A]" />
          </span>
          {character.status}
        </span>
      </div>

      {/* Card Content & Action Area */}
      <div className="relative z-10 p-6 sm:p-7 flex flex-col justify-end">
        <div className="flex items-baseline justify-between mb-2">
          <h3
            className={`font-serif font-light text-[#F5E9E5] transition-colors duration-300 group-hover:text-[#F5E9E5] ${
              featured ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"
            }`}
          >
            {character.name}
          </h3>

          <Link
            href="/signup"
            aria-label={`Meet ${character.name}`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#430D15]/80 bg-[#21080C]/85 text-[#F5E9E5] backdrop-blur-md transition-all duration-300 group-hover:border-[#C9A46A] group-hover:bg-[#6E0717] group-hover:text-[#F5E9E5]"
          >
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <p className="text-xs sm:text-sm font-light leading-relaxed text-[#BFA8A8] mb-5 line-clamp-2">
          {character.descriptor}
        </p>

        <Link
          href="/signup"
          className="inline-flex items-center justify-center rounded-full border border-[#430D15]/80 bg-[#120507]/90 py-3 px-5 text-xs font-medium uppercase tracking-[0.16em] text-[#F5E9E5] transition-all duration-300 hover:border-[#C9A46A]/50 hover:bg-[#6E0717]/60 hover:shadow-[0_0_20px_rgba(110,7,23,0.35)]"
        >
          Meet {character.name}
        </Link>
      </div>
    </div>
  );
}
