"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const DIMENSIONS = [
  {
    index: "I",
    label: "Personality",
    description: "From quietly observant and poetic to intensely bold and playful.",
  },
  {
    index: "II",
    label: "Interests",
    description: "Shared late-night passions, niche obsessions, and mutual curiosities.",
  },
  {
    index: "III",
    label: "Communication style",
    description: "Quick-witted banter, philosophical depth, or steady reassuring silence.",
  },
  {
    index: "IV",
    label: "Relationship dynamic",
    description: "Romantic tension, intellectual confidant, unconditional sanctuary, or fantasy.",
  },
  {
    index: "V",
    label: "Memory",
    description: "Remembers past shared secrets, subtle preferences, and callbacks that matter.",
  },
];

export function Personalization() {
  const [imageError, setImageError] = useState(false);

  return (
    <section id="connection" className="relative py-8 sm:py-14 lg:py-28 border-t border-[#430D15]/30 overflow-hidden">
      {/* Subtle background atmospheric glow */}
      <div className="pointer-events-none absolute -left-32 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-[#6E0717]/15 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-center">
          {/* Visual Column: Large Immersive Character Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative order-2 lg:order-1 flex justify-center"
          >
            <div className="relative w-full max-w-[480px] h-[320px] xs:h-[380px] sm:h-[560px] lg:h-[700px] rounded-3xl overflow-hidden border border-[#430D15]/60 bg-[#120507] shadow-[0_25px_60px_rgba(0,0,0,0.7)]">
              {!imageError ? (
                <img
                  src="/characters/character-03.webp"
                  alt="Maya — AI Companion"
                  onError={() => {
                    const fallback = "/characters/character-03.jpg";
                    const img = new Image();
                    img.onload = () => {};
                    img.onerror = () => setImageError(true);
                    img.src = fallback;
                  }}
                  className="h-full w-full object-cover object-top filter brightness-[0.95] contrast-[1.05]"
                  style={{
                    maskImage:
                      "linear-gradient(to bottom, black 65%, rgba(0,0,0,0.6) 85%, transparent 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, black 65%, rgba(0,0,0,0.6) 85%, transparent 100%)",
                  }}
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-b from-[#21080C] via-[#120507] to-[#090405] flex items-center justify-center">
                  <span className="font-serif text-6xl text-[#C9A46A]/40">✦</span>
                </div>
              )}

              {/* Edge gradients for seamless blending */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090405] via-transparent to-black/25" />

              {/* Floating Intimate Quote Moment */}
              <div className="absolute bottom-2.5 sm:bottom-6 left-2.5 sm:left-6 right-2.5 sm:right-6 p-3 sm:p-5 rounded-2xl backdrop-blur-xl bg-[#090405]/85 border border-[#430D15]/70 shadow-2xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-serif text-base sm:text-lg text-[#F5E9E5]">Maya</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#C9A46A]/80 font-medium">
                    · Presence
                  </span>
                </div>
                <p className="font-serif text-xs sm:text-sm text-[#F5E9E5]/90 italic leading-snug">
                  &ldquo;I remember the exact phrase you whispered when the lights went down.&rdquo;
                </p>
              </div>
            </div>
          </motion.div>

          {/* Narrative Column: Editorial Presentation */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 order-1 lg:order-2"
          >
            <span className="text-xs sm:text-[13px] font-medium uppercase tracking-[0.28em] text-[#C9A46A] mb-2 sm:mb-3 block">
              INTIMATE ATTUNEMENT
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#F5E9E5] mb-3.5 sm:mb-5 leading-tight">
              Made for your kind <br />
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#F5E9E5] to-[#C9A46A]">
                of connection.
              </span>
            </h2>

            <p className="text-sm sm:text-base lg:text-lg text-[#BFA8A8] font-light leading-relaxed mb-4 sm:mb-6 lg:mb-8 max-w-[52ch]">
              True chemistry is never templated. Shape every dimension of your
              companion so their presence mirrors what you seek in an intimate confidant.
            </p>

            {/* Editorial Dimensions List */}
            <div className="divide-y divide-[#430D15]/50 border-t border-b border-[#430D15]/50">
              {DIMENSIONS.map((dim) => (
                <div
                  key={dim.label}
                  className="py-2.5 sm:py-3.5 lg:py-5 flex items-start gap-3.5 sm:gap-6 group transition-colors duration-300"
                >
                  <span className="font-serif text-sm sm:text-base text-[#C9A46A]/60 w-6 shrink-0 pt-0.5 group-hover:text-[#C9A46A] transition-colors">
                    {dim.index}
                  </span>

                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-6 w-full">
                    <h3 className="text-sm sm:text-base font-medium text-[#F5E9E5] tracking-wide shrink-0">
                      {dim.label}
                    </h3>
                    <p className="text-xs sm:text-sm font-light text-[#BFA8A8] leading-relaxed text-left sm:text-right">
                      {dim.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
