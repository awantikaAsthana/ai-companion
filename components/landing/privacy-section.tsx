"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export function PrivacySection() {
  return (
    <section className="relative py-28 sm:py-36 border-t border-[#430D15]/30">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* Subtle Sanctuary Emblem */}
          <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-full border border-[#C9A46A]/40 bg-[#21080C]/80 shadow-[0_0_25px_rgba(201,164,106,0.18)]">
            <Lock className="h-5 w-5 text-[#C9A46A]" />
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#F5E9E5] mb-6">
            Your conversations stay yours.
          </h2>

          <p className="max-w-[48ch] text-base sm:text-lg lg:text-xl font-light leading-relaxed text-[#BFA8A8] mb-10">
            An intimate world created solely for the two of you. Your shared words,
            vulnerabilities, and late-night thoughts remain encrypted, private, and
            strictly under your control.
          </p>

          <div className="inline-flex items-center gap-4 sm:gap-6 text-xs uppercase tracking-[0.22em] text-[#C9A46A]/80 font-medium">
            <span>Private Sanctuary</span>
            <span>·</span>
            <span>Total Discretion</span>
            <span>·</span>
            <span>Your World</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
