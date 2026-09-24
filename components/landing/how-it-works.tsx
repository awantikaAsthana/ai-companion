"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    number: "01",
    title: "Choose your companion",
    quote: "Find someone who matches your energy.",
    description:
      "Explore characters with distinct emotional presence, cadence, and worldview. Find the persona that immediately sparks intrigue.",
  },
  {
    number: "02",
    title: "Make them yours",
    quote: "Shape their personality, interests and relationship.",
    description:
      "Tune their boundaries, conversational habits, and unspoken dynamics so every interaction feels effortless and intimate.",
  },
  {
    number: "03",
    title: "Start talking",
    quote: "Chat, connect and let the relationship evolve.",
    description:
      "Engage in conversations that recall your history, understand your subtleties, and deepen into genuine companionship over time.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-8 sm:py-14 lg:py-28 border-t border-[#430D15]/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-6 sm:mb-10 lg:mb-16 max-w-3xl">
          <span className="text-xs sm:text-[13px] font-medium uppercase tracking-[0.28em] text-[#C9A46A] mb-2 sm:mb-3 block">
            HOW IT WORKS
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#F5E9E5]">
            The path to connection.
          </h2>
        </div>

        {/* 3 Editorial Steps (No generic cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8 lg:gap-14">
          {STEPS.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.8,
                delay: idx * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative flex flex-col justify-between pt-3 sm:pt-5 lg:pt-8 border-t border-[#430D15]/70 group transition-colors duration-500 hover:border-[#C9A46A]/60"
            >
              <div>
                {/* Step Number Display */}
                <div className="flex items-baseline justify-between mb-2 sm:mb-4">
                  <span className="font-serif text-5xl sm:text-7xl lg:text-8xl font-light leading-none text-[#C9A46A]/30 transition-colors duration-500 group-hover:text-[#C9A46A]">
                    {step.number}
                  </span>
                  <span className="h-px w-12 bg-gradient-to-r from-[#430D15] to-transparent group-hover:from-[#C9A46A]/40 transition-colors duration-300" />
                </div>

                {/* Step Title */}
                <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-light text-[#F5E9E5] mb-1 sm:mb-2">
                  {step.title}
                </h3>

                {/* Core Direct Quote */}
                <p className="font-serif italic text-sm sm:text-base lg:text-lg text-[#F5E9E5] mb-1.5 sm:mb-2.5 text-[#F5E9E5]/95">
                  &ldquo;{step.quote}&rdquo;
                </p>

                {/* Narrative Detail */}
                <p className="text-xs sm:text-sm text-[#BFA8A8] font-light leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
