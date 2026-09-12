"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export function FinalCta() {
  return (
    <section className="relative py-36 sm:py-48 border-t border-[#430D15]/40 overflow-hidden text-center">
      {/* Intense Atmospheric Crimson & Wine Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[650px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#6E0717]/40 via-[#430D15]/20 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-2/3 h-[280px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C9A46A]/12 blur-2xl" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2.5 mb-6">
            <Sparkles className="h-4 w-4 text-[#C9A46A]" />
            <span className="text-xs sm:text-[13px] font-medium uppercase tracking-[0.28em] text-[#C9A46A]">
              BEGIN YOUR STORY
            </span>
          </div>

          <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-[#F5E9E5] mb-7 leading-[1.05]">
            Ready to meet yours?
          </h2>

          <p className="max-w-[42ch] mx-auto text-lg sm:text-xl lg:text-2xl font-light leading-relaxed text-[#BFA8A8] mb-12">
            Create a companion that feels like they were made for you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#6E0717] via-[#8F1025] to-[#6E0717] px-10 sm:px-12 py-4 sm:py-5 text-sm sm:text-base font-medium uppercase tracking-[0.16em] text-[#F5E9E5] shadow-[0_0_35px_rgba(110,7,23,0.5)] transition-all duration-300 hover:shadow-[0_0_55px_rgba(181,30,58,0.7)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Create Your Companion</span>
              <ArrowRight className="ml-3 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
