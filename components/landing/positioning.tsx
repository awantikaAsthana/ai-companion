"use client";

import { motion } from "framer-motion";

export function Positioning() {
  return (
    <section className="relative py-8 sm:py-14 lg:py-20 overflow-hidden border-t border-[#430D15]/30">
      {/* Soft center ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6E0717]/10 blur-3xl" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#C9A46A] mb-2.5 sm:mb-3 inline-block">
            BEYOND ARTIFICIAL
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-[#F5E9E5] mb-3 sm:mb-5">
            Not another chatbot.
          </h2>

          <p className="max-w-[48ch] mx-auto text-base sm:text-xl font-light leading-relaxed text-[#BFA8A8]">
            Your companion remembers your conversations, understands your
            personality, and grows with the relationship.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

