"use client";

import { motion } from "framer-motion";
import { CHARACTERS } from "@/lib/data/characters";
import { CharacterCard } from "./character-card";

export function FeaturedCharacters() {
  const [featuredChar, secondChar, ...remainingChars] = CHARACTERS;

  return (
    <section id="characters" className="relative py-28 sm:py-36 border-t border-[#430D15]/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="mb-16 sm:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-xs sm:text-[13px] font-medium uppercase tracking-[0.28em] text-[#C9A46A] mb-3 block">
              DISCOVER CONNECTIONS
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#F5E9E5]">
              Someone worth meeting.
            </h2>
          </motion.div>

          <p className="max-w-[42ch] text-base sm:text-lg font-light text-[#BFA8A8] leading-relaxed">
            Every persona is crafted with emotional depth, distinct cadence, and
            genuine nuance.
          </p>
        </div>

        {/* Desktop Editorial Showcase / Mobile Horizontal Rail */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 overflow-x-auto snap-x snap-mandatory md:overflow-visible pb-6 md:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
          {/* Row 1 — Primary Prominent Character (7 cols on lg) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-[84vw] sm:w-[360px] md:w-auto lg:col-span-7 shrink-0 snap-center"
          >
            <CharacterCard character={featuredChar} featured />
          </motion.div>

          {/* Row 1 — Secondary Companion (5 cols on lg) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-[84vw] sm:w-[360px] md:w-auto lg:col-span-5 shrink-0 snap-center"
          >
            <CharacterCard character={secondChar} />
          </motion.div>

          {/* Row 2 — 4 Companion Portraits (3 cols each on lg) */}
          {remainingChars.map((char, index) => (
            <motion.div
              key={char.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.7,
                delay: 0.12 + index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="w-[84vw] sm:w-[360px] md:w-auto lg:col-span-3 shrink-0 snap-center"
            >
              <CharacterCard character={char} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
