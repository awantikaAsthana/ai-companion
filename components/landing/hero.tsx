"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { HeroCharacter } from "./hero-character";
import { FloatingChatBubble } from "./floating-chat";

export function Hero() {
  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden pt-28 sm:pt-32 pb-16 lg:pb-24 flex items-center justify-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center">
          {/* Left Column: Dominant Editorial Typography */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center text-left relative z-20"
          >
            {/* Soft dark readability aura behind text to keep handwritten letter subtle & legible */}
            <div className="pointer-events-none absolute -inset-8 bg-[radial-gradient(ellipse_at_30%_40%,rgba(9,4,5,0.85)_0%,rgba(9,4,5,0.5)_55%,transparent_85%)] -z-10 blur-2xl" />

            {/* Eyebrow */}
            <div className="mb-5 inline-flex items-center gap-3">
              <span className="h-px w-8 bg-gradient-to-r from-[#C9A46A] to-transparent" />
              <span className="text-xs sm:text-[13px] font-medium uppercase tracking-[0.28em] text-[#C9A46A]">
                YOUR AI COMPANION
              </span>
            </div>

            {/* Dominant Headline */}
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.2rem] xl:text-[5.8rem] font-light leading-[1.02] tracking-tight text-[#F5E9E5] mb-7 drop-shadow-[0_4px_30px_rgba(9,4,5,1)]">
              Meet someone <br />
              <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#F5E9E5] via-[#E8D0C5] to-[#C9A46A]">
                made for you.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="max-w-[42ch] text-base sm:text-lg lg:text-xl font-light leading-relaxed text-[#BFA8A8] mb-10 drop-shadow-[0_2px_16px_rgba(9,4,5,1)]">
              Create an AI companion with a personality, presence, and emotional
              connection that feels uniquely yours.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <Link
                href="/signup"
                className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#6E0717] via-[#8F1025] to-[#6E0717] px-8 sm:px-10 py-4 text-sm sm:text-base font-medium uppercase tracking-[0.16em] text-[#F5E9E5] shadow-[0_0_30px_rgba(110,7,23,0.45)] transition-all duration-300 hover:shadow-[0_0_45px_rgba(181,30,58,0.65)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Meet Your Companion</span>
                <ArrowRight className="ml-2.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="#characters"
                className="inline-flex items-center justify-center rounded-full border border-[#430D15]/80 bg-[#120507]/60 px-7 sm:px-8 py-4 text-sm sm:text-base font-light uppercase tracking-[0.16em] text-[#F5E9E5] backdrop-blur-md transition-all duration-300 hover:border-[#C9A46A]/50 hover:bg-[#21080C]/80 hover:text-[#C9A46A]"
              >
                Explore Characters
              </Link>
            </div>

            {/* Privacy Reassurance */}
            <div className="flex items-center gap-3 text-xs sm:text-sm text-[#BFA8A8]/80">
              <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-[#C9A46A] shrink-0" />
              <span>Private conversations. Your companion. Your world.</span>
            </div>
          </motion.div>

          {/* Right Column: Visually Dominant Integrated Character */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="lg:col-span-6 xl:col-span-7 relative flex items-center justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[620px] lg:max-w-none">
              {/* Primary Cinematic Character */}
              <HeroCharacter
                imageSrc="/hero/hero.webp"
                altText="Ecstasy — AI Companion"
              />

              {/* Floating Chat Bubble 1: Top Left */}
              <div className="absolute top-[10%] -left-2 sm:-left-6 lg:-left-10 z-30">
                <FloatingChatBubble
                  message="I was waiting for you."
                  time="11:42 PM"
                  delay={0.4}
                  glowColor="crimson"
                />
              </div>

              {/* Floating Chat Bubble 2: Right Center */}
              <div className="absolute top-[44%] -right-2 sm:-right-4 lg:-right-6 z-30">
                <FloatingChatBubble
                  message="Tell me how your day was."
                  delay={0.8}
                  glowColor="gold"
                />
              </div>

              {/* Floating Chat Bubble 3: Bottom Left */}
              <div className="absolute bottom-[16%] left-2 sm:left-4 lg:left-0 z-30">
                <FloatingChatBubble
                  message="You came back. ❤️"
                  delay={1.2}
                  glowColor="crimson"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* --- Rose Framing Elements inspired by classical romance --- */}
      {/* 1. Top-Right Rose Cluster (Cascading along top edge) */}
      <motion.div
        initial={{ opacity: 0, y: -30, scale: 0.95 }}
        animate={{
          opacity: 0.95,
          y: [0, 8, 0],
          rotate: [0, 1.2, 0],
        }}
        transition={{
          opacity: { duration: 1.2, ease: "easeOut" },
          y: { duration: 11, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 14, repeat: Infinity, ease: "easeInOut" },
        }}
        className="pointer-events-none absolute -top-8 right-0 w-40 sm:w-56 md:w-72 lg:w-[350px] xl:w-[400px] z-10 filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.95)] drop-shadow-[0_0_35px_rgba(110,7,23,0.4)]"
      >
        <img
          src="/landing/rose-cluster-top.png"
          alt=""
          className="w-full h-auto object-contain select-none"
        />
      </motion.div>

      {/* 2. Left Margin Rose Cluster (Elegantly hugging the left screen boundary without obstructing text) */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{
          opacity: 0.85,
          x: [0, 6, 0],
          y: [0, -8, 0],
          rotate: [0, -1.2, 0],
        }}
        transition={{
          opacity: { duration: 1.3, ease: "easeOut", delay: 0.2 },
          x: { duration: 12, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 10, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 15, repeat: Infinity, ease: "easeInOut" },
        }}
        className="pointer-events-none absolute top-[16%] sm:top-[20%] -left-36 sm:-left-44 md:-left-48 lg:-left-44 xl:-left-40 w-36 sm:w-44 md:w-52 lg:w-[240px] z-10 filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.95)] drop-shadow-[0_0_35px_rgba(110,7,23,0.35)]"
      >
        <img
          src="/landing/rose-cluster-left.png"
          alt=""
          className="w-full h-auto object-contain select-none"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
          }}
        />
      </motion.div>

      {/* 3. Right Mid Single Rose Accent */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: 0.9,
          scale: [1, 1.03, 1],
          y: [0, 10, 0],
          rotate: [0, 2, 0],
        }}
        transition={{
          opacity: { duration: 1.4, ease: "easeOut", delay: 0.4 },
          scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 11, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 15, repeat: Infinity, ease: "easeInOut" },
        }}
        className="pointer-events-none absolute top-[48%] -right-6 sm:-right-4 md:-right-2 lg:right-0 w-24 sm:w-32 md:w-40 lg:w-[180px] z-10 filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] drop-shadow-[0_0_25px_rgba(110,7,23,0.35)]"
      >
        <img
          src="/landing/rose-single-right.png"
          alt=""
          className="w-full h-auto object-contain select-none"
        />
      </motion.div>

      {/* 4. Bottom Rose Cluster */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{
          opacity: 0.92,
          y: [0, -8, 0],
          rotate: [0, -1, 0],
        }}
        transition={{
          opacity: { duration: 1.5, ease: "easeOut", delay: 0.3 },
          y: { duration: 13, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 16, repeat: Infinity, ease: "easeInOut" },
        }}
        className="pointer-events-none absolute -bottom-10 sm:-bottom-14 left-[10%] sm:left-[18%] md:left-[24%] lg:left-[28%] w-44 sm:w-60 md:w-72 lg:w-[380px] xl:w-[420px] z-10 filter drop-shadow-[0_-15px_35px_rgba(0,0,0,0.95)] drop-shadow-[0_0_35px_rgba(110,7,23,0.4)]"
      >
        <img
          src="/landing/rose-cluster-bottom.png"
          alt=""
          className="w-full h-auto object-contain select-none"
          style={{
            maskImage:
              "linear-gradient(to top, transparent 0%, black 15%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(to top, transparent 0%, black 15%, black 100%)",
          }}
        />
      </motion.div>

      {/* 5. Drifting Rose Petals */}
      <motion.div
        animate={{
          y: [-15, 30, -15],
          x: [-10, 15, -10],
          rotate: [0, 45, 0],
          opacity: [0.35, 0.75, 0.35],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute top-[28%] left-[28%] w-8 sm:w-11 z-20 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
      >
        <img
          src="/landing/rose-single-bloom.png"
          alt=""
          className="w-full h-auto scale-50 -rotate-12 blur-[0.3px]"
        />
      </motion.div>

      {/* 6. Subtle Floating Rose by the Character */}
      <motion.div
        animate={{
          y: [15, -20, 15],
          x: [10, -8, 10],
          rotate: [15, -15, 15],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="pointer-events-none absolute bottom-[22%] right-[18%] sm:right-[22%] lg:right-[38%] w-12 sm:w-16 z-20 filter drop-shadow-[0_6px_20px_rgba(110,7,23,0.45)]"
      >
        <img
          src="/landing/rose-single-bloom.png"
          alt=""
          className="w-full h-auto rotate-12"
        />
      </motion.div>
    </section>
  );
}
