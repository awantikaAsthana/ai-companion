"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface HeroCharacterProps {
  imageSrc?: string;
  altText?: string;
  className?: string;
}

export function HeroCharacter({
  imageSrc = "/hero/hero.webp",
  altText = "Ecstasy — AI Companion",
  className = "",
}: HeroCharacterProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
    >
      {/* Deep Crimson Backlight Core */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#6E0717]/50 via-[#430D15]/25 to-transparent blur-3xl" />

      {/* Warm Champagne Gold Rim Light Accent */}
      <div className="pointer-events-none absolute right-4 top-1/3 h-[420px] w-[360px] rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#C9A46A]/20 via-[#6E0717]/10 to-transparent blur-2xl opacity-60" />

      {/* Floating Ambient Light Dust / Micro-particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.span
          animate={{
            y: [-10, -60, -10],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[20%] top-[40%] h-1 w-1 rounded-full bg-[#C9A46A] blur-[0.5px]"
        />
        <motion.span
          animate={{
            y: [-20, -80, -20],
            opacity: [0.15, 0.5, 0.15],
          }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute right-[25%] top-[30%] h-1.5 w-1.5 rounded-full bg-[#B51E3A] blur-[0.5px]"
        />
        <motion.span
          animate={{
            y: [0, -50, 0],
            opacity: [0.1, 0.35, 0.1],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute left-[45%] top-[65%] h-1 w-1 rounded-full bg-[#F5E9E5] blur-[0.5px]"
        />
      </div>

      {/* Main Character Cinematic Figure */}
      <motion.div
        animate={{
          scale: [1, 1.015, 1],
          y: [0, -4, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative h-[560px] sm:h-[660px] lg:h-[760px] xl:h-[820px] w-full max-w-[640px] flex items-center justify-center overflow-visible"
      >
        {!imageError ? (
          <img
            src={imageSrc}
            alt={altText}
            onError={() => {
              if (imageSrc.endsWith(".webp")) {
                const fallback = imageSrc.replace(".webp", ".jpg");
                const img = new Image();
                img.onload = () => {};
                img.onerror = () => setImageError(true);
                img.src = fallback;
              } else {
                setImageError(true);
              }
            }}
            className="h-full w-full object-cover object-top filter brightness-[0.96] contrast-[1.05]"
            style={{
              /* Feathered dissolve on all edges to eliminate rectangular boundaries */
              maskImage:
                "radial-gradient(ellipse 70% 75% at 52% 40%, black 40%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0.3) 78%, transparent 95%), linear-gradient(to bottom, black 60%, rgba(0,0,0,0.4) 82%, transparent 100%), linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 75% at 52% 40%, black 40%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0.3) 78%, transparent 95%), linear-gradient(to bottom, black 60%, rgba(0,0,0,0.4) 82%, transparent 100%), linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
            }}
          />
        ) : (
          <div className="h-full w-full max-w-[440px] rounded-3xl border border-[#430D15]/40 bg-gradient-to-b from-[#21080C] to-[#090405] p-8 flex flex-col items-center justify-center text-center shadow-2xl">
            <div className="h-28 w-28 rounded-full border border-[#C9A46A]/40 bg-[#430D15]/30 flex items-center justify-center mb-6">
              <span className="font-serif text-3xl text-[#C9A46A]">✦</span>
            </div>
            <p className="font-serif text-3xl text-[#F5E9E5] mb-2">Ecstasy</p>
            <p className="text-xs uppercase tracking-[0.24em] text-[#BFA8A8]">
              Presence In Motion
            </p>
          </div>
        )}

        {/* Deep Bottom Vignette & Fade to Seamlessly Merge with Page */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#090405] via-[#090405]/80 to-transparent" />

        {/* Left Edge Soft Shadow Bleed into Narrative Space */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#090405] to-transparent hidden lg:block" />
      </motion.div>
    </div>
  );
}
