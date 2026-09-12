"use client";

import { motion } from "framer-motion";

export function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Base deep background */}
      <div className="absolute inset-0 bg-[#090405]" />

      {/* Subtle deep wine radial warmth top-center */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.35, 0.48, 0.35],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-[20%] left-1/2 h-[750px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#430D15]/40 via-[#21080C]/20 to-transparent blur-3xl"
      />

      {/* Atmospheric crimson accent light behind character right/center */}
      <motion.div
        animate={{
          x: [0, 25, 0],
          y: [0, -15, 0],
          opacity: [0.25, 0.38, 0.25],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[10%] right-[-5%] h-[650px] w-[650px] rounded-full bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-[#6E0717]/30 via-[#430D15]/15 to-transparent blur-3xl"
      />

      {/* Subtle champagne warm ambient glow lower left */}
      <motion.div
        animate={{
          x: [0, -20, 0],
          y: [0, 20, 0],
          opacity: [0.08, 0.15, 0.08],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[45%] left-[-10%] h-[550px] w-[550px] rounded-full bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-[#C9A46A]/20 via-[#430D15]/10 to-transparent blur-3xl"
      />

      {/* Deep vignette on edges */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(9,4,5,0.7)_75%,#090405_100%)]" />

      {/* Soft grain / fine noise overlay for photographic luxury texture */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(#F5E9E5 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />
    </div>
  );
}

