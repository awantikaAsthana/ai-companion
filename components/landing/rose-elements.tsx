"use client";

import { motion } from "framer-motion";

export function RoseElements() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
    >
      {/* 1. Top-Right Rose Cluster (Cascading from top edge) */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
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
        className="absolute -top-3 right-0 sm:right-2 md:right-8 w-28 sm:w-60 md:w-80 lg:w-[410px] xl:w-[460px] filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] drop-shadow-[0_0_35px_rgba(110,7,23,0.4)] opacity-70 sm:opacity-95"
      >
        <img
          src="/landing/rose-cluster-top.png"
          alt=""
          className="w-full h-auto object-contain select-none transform origin-top-right"
        />
      </motion.div>

      {/* 2. Left Margin Rose Cluster (Flowing along typography edge) */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{
          opacity: 0.92,
          x: [0, 6, 0],
          y: [0, -10, 0],
          rotate: [0, -1.5, 0],
        }}
        transition={{
          opacity: { duration: 1.4, ease: "easeOut", delay: 0.2 },
          x: { duration: 13, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 10, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 15, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute top-[18%] sm:top-[22%] -left-8 sm:-left-6 md:-left-4 lg:left-0 w-24 sm:w-44 md:w-56 lg:w-[260px] xl:w-[290px] filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.95)] drop-shadow-[0_0_30px_rgba(110,7,23,0.35)] opacity-50 sm:opacity-92"
      >
        <img
          src="/landing/rose-cluster-left.png"
          alt=""
          className="w-full h-auto object-contain select-none"
        />
      </motion.div>

      {/* 3. Right Mid Rose (Subtle accent beside character) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: 0.88,
          scale: [1, 1.03, 1],
          y: [0, 12, 0],
          rotate: [0, 2, 0],
        }}
        transition={{
          opacity: { duration: 1.4, ease: "easeOut", delay: 0.4 },
          scale: { duration: 9, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 12, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 16, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute top-[48%] -right-4 sm:-right-2 md:right-0 w-16 sm:w-36 md:w-48 lg:w-[220px] filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] drop-shadow-[0_0_25px_rgba(110,7,23,0.3)] opacity-60 sm:opacity-88"
      >
        <img
          src="/landing/rose-single-right.png"
          alt=""
          className="w-full h-auto object-contain select-none"
        />
      </motion.div>

      {/* 4. Bottom Rose Cluster (Grounding the lower screen margin) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{
          opacity: 0.92,
          y: [0, -8, 0],
          rotate: [0, -1, 0],
        }}
        transition={{
          opacity: { duration: 1.5, ease: "easeOut", delay: 0.3 },
          y: { duration: 14, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 17, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute -bottom-6 sm:-bottom-8 left-[6%] sm:left-[18%] md:left-[24%] lg:left-[28%] w-32 sm:w-64 md:w-80 lg:w-[440px] xl:w-[480px] filter drop-shadow-[0_-15px_35px_rgba(0,0,0,0.95)] drop-shadow-[0_0_35px_rgba(110,7,23,0.4)] opacity-60 sm:opacity-92"
      >
        <img
          src="/landing/rose-cluster-bottom.png"
          alt=""
          className="w-full h-auto object-contain select-none"
        />
      </motion.div>

      {/* 5. Drifting Ambient Velvet Rose Petals */}
      {/* Petal 1 */}
      <motion.div
        animate={{
          y: [-20, 40, -20],
          x: [-10, 15, -10],
          rotate: [0, 45, 0],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[28%] left-[26%] w-8 sm:w-11 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] opacity-60"
      >
        <img
          src="/landing/rose-single-bloom.png"
          alt=""
          className="w-full h-auto scale-50 -rotate-12 blur-[0.4px]"
        />
      </motion.div>

      {/* Petal 2 */}
      <motion.div
        animate={{
          y: [15, -35, 15],
          x: [10, -12, 10],
          rotate: [15, -25, 15],
          opacity: [0.25, 0.65, 0.25],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
        className="absolute top-[65%] right-[22%] w-10 sm:w-14 filter drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)] opacity-50"
      >
        <img
          src="/landing/rose-single-bloom-2.png"
          alt=""
          className="w-full h-auto scale-50 rotate-45 blur-[0.6px]"
        />
      </motion.div>

      {/* Petal 3 - Subtle Foreground Floating Bloom */}
      <motion.div
        animate={{
          y: [-10, 25, -10],
          x: [-5, 8, -5],
          rotate: [-10, 20, -10],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 6,
        }}
        className="absolute top-[75%] left-[8%] w-9 sm:w-12 filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] opacity-40"
      >
        <img
          src="/landing/rose-single-bloom.png"
          alt=""
          className="w-full h-auto scale-[0.4] rotate-90 blur-[0.8px]"
        />
      </motion.div>
    </div>
  );
}
