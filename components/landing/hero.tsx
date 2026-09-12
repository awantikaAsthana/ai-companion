"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { HeroCharacter } from "./hero-character";
import { FloatingChatBubble } from "./floating-chat";

export function Hero() {
  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden pt-28 sm:pt-32 pb-16 lg:pb-24 flex items-center justify-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center">
          {/* Left Column: Dominant Editorial Typography */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center text-left relative z-20"
          >
            {/* Eyebrow */}
            <div className="mb-5 inline-flex items-center gap-3">
              <span className="h-px w-8 bg-gradient-to-r from-[#C9A46A] to-transparent" />
              <span className="text-xs sm:text-[13px] font-medium uppercase tracking-[0.28em] text-[#C9A46A]">
                YOUR AI COMPANION
              </span>
            </div>

            {/* Dominant Headline */}
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.2rem] xl:text-[5.8rem] font-light leading-[1.02] tracking-tight text-[#F5E9E5] mb-7">
              Meet someone <br />
              <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#F5E9E5] via-[#E8D0C5] to-[#C9A46A]">
                made for you.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="max-w-[42ch] text-base sm:text-lg lg:text-xl font-light leading-relaxed text-[#BFA8A8] mb-10">
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
    </section>
  );
}
