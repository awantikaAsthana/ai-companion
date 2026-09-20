"use client";

import { motion } from "framer-motion";

export function CharacterAmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* 1. Subtle Handwritten Letter Texture */}
      <div className="absolute inset-0 bg-[url('/landing/letter-bg.jpg')] bg-cover bg-center opacity-[0.08] mix-blend-screen filter contrast-125" />

      {/* Soft Vignette Mask over Letter Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_25%,rgba(9,4,5,0.92)_100%)]" />

      {/* 2. Wine/Crimson Ambient Atmosphere Glows */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(110,7,23,0.18),transparent_70%)] blur-3xl" />
      <div className="absolute top-1/3 -left-40 h-[450px] w-[450px] rounded-full bg-[#6E0717]/12 blur-3xl" />
      <div className="absolute bottom-1/4 -right-40 h-[450px] w-[450px] rounded-full bg-[#C9A46A]/8 blur-3xl" />

      {/* 3. Rose Decorative Corner Elements */}
      {/* Top-Right Framing Rose Cluster */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{
          opacity: 0.65,
          y: [0, 6, 0],
          rotate: [0, 0.8, 0],
        }}
        transition={{
          opacity: { duration: 1.5, ease: "easeOut" },
          y: { duration: 12, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 16, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute -top-4 -right-6 sm:right-0 w-36 sm:w-52 md:w-64 lg:w-72 filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] drop-shadow-[0_0_25px_rgba(110,7,23,0.3)] opacity-60"
      >
        <img
          src="/landing/rose-cluster-top.png"
          alt=""
          className="w-full h-auto object-contain"
        />
      </motion.div>

      {/* Bottom-Left Framing Rose Cluster */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{
          opacity: 0.55,
          x: [0, 4, 0],
          y: [0, -6, 0],
          rotate: [0, -1, 0],
        }}
        transition={{
          opacity: { duration: 1.6, ease: "easeOut", delay: 0.2 },
          x: { duration: 14, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 11, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 18, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute -bottom-6 -left-8 sm:-left-4 w-40 sm:w-56 md:w-72 lg:w-80 filter drop-shadow-[0_-15px_30px_rgba(0,0,0,0.9)] drop-shadow-[0_0_25px_rgba(110,7,23,0.25)] opacity-50"
      >
        <img
          src="/landing/rose-cluster-bottom.png"
          alt=""
          className="w-full h-auto object-contain"
        />
      </motion.div>

      {/* 4. Subtle Drifting Velvet Rose Petals */}
      {/* Petal 1: Top-Left Floating Petal */}
      <motion.div
        animate={{
          y: [-12, 18, -12],
          x: [-6, 10, -6],
          rotate: [0, 20, 0],
          opacity: [0.25, 0.45, 0.25],
        }}
        transition={{
          duration: 13,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[20%] left-[8%] w-8 sm:w-10 filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]"
      >
        <img
          src="/landing/rose-single-bloom.png"
          alt=""
          className="w-full h-auto scale-75 -rotate-12 blur-[0.3px]"
        />
      </motion.div>

      {/* Petal 2: Mid-Right Subtle Bloom Accent */}
      <motion.div
        animate={{
          y: [12, -20, 12],
          x: [8, -8, 8],
          rotate: [15, -15, 15],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-[55%] right-[6%] w-9 sm:w-11 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
      >
        <img
          src="/landing/rose-single-bloom-2.png"
          alt=""
          className="w-full h-auto scale-75 rotate-45 blur-[0.4px]"
        />
      </motion.div>
    </div>
  );
}

