"use client";

import { motion } from "framer-motion";

export function AuthBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* Base deep background */}
      <div className="absolute inset-0 bg-[#090405]" />

      {/* Intimate Silhouette Background Image */}
      <div
        className="absolute inset-0 opacity-40 sm:opacity-50 mix-blend-lighten transition-opacity duration-1000 scale-105"
        style={{
          backgroundImage: `url('/auth/login-bg.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Atmospheric handwritten letter cursive layer */}
      <div
        className="absolute inset-0 opacity-[0.14] mix-blend-screen"
        style={{
          backgroundImage: `url('/landing/letter-bg.jpg')`,
          backgroundSize: "640px auto",
          backgroundPosition: "center top",
          backgroundRepeat: "repeat",
          maskImage:
            "radial-gradient(ellipse 90% 80% at 50% 50%, black 20%, rgba(0,0,0,0.6) 65%, transparent 95%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 80% at 50% 50%, black 20%, rgba(0,0,0,0.6) 65%, transparent 95%)",
        }}
      />

      {/* Deep Crimson & Wine Ambient Glow Behind Glassmorphism Card */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.4, 0.55, 0.4],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[550px] w-[550px] sm:h-[680px] sm:w-[680px] rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#6E0717]/45 via-[#430D15]/25 to-transparent blur-3xl"
      />

      {/* Subtle Warm Champagne Glow Accent */}
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-[#C9A46A]/10 blur-3xl" />

      {/* Vignette Overlay: Softly darkening perimeter to frame the card */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(9,4,5,0.6)_55%,#090405_95%)]" />

      {/* --- Rose Framing Elements --- */}
      {/* 1. Top-Right Rose Cluster */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: 0.9,
          y: [0, 8, 0],
          rotate: [0, 1.2, 0],
        }}
        transition={{
          opacity: { duration: 1.2, ease: "easeOut" },
          y: { duration: 12, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 15, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute -top-8 right-0 w-24 sm:w-52 md:w-64 lg:w-[320px] filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.95)] drop-shadow-[0_0_35px_rgba(110,7,23,0.4)] opacity-60 sm:opacity-90"
      >
        <img
          src="/landing/rose-cluster-top.png"
          alt=""
          className="w-full h-auto object-contain"
        />
      </motion.div>

      {/* 2. Bottom-Left Rose Bloom */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{
          opacity: 0.85,
          x: [0, 6, 0],
          y: [0, -8, 0],
          rotate: [-12, -8, -12],
        }}
        transition={{
          opacity: { duration: 1.3, ease: "easeOut", delay: 0.2 },
          x: { duration: 11, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 13, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 14, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute -bottom-6 -left-6 sm:left-4 md:left-8 w-20 sm:w-40 md:w-48 filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] drop-shadow-[0_0_25px_rgba(110,7,23,0.4)] opacity-50 sm:opacity-85"
      >
        <img
          src="/landing/rose-single-bloom.png"
          alt=""
          className="w-full h-auto object-contain"
          style={{
            maskImage:
              "linear-gradient(to top, transparent 0%, black 18%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(to top, transparent 0%, black 18%, black 100%)",
          }}
        />
      </motion.div>

      {/* 3. Drifting Rose Petals */}
      <motion.div
        animate={{
          y: [-15, 25, -15],
          x: [-8, 12, -8],
          rotate: [0, 40, 0],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[22%] left-[18%] w-8 sm:w-10 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
      >
        <img
          src="/landing/rose-single-bloom.png"
          alt=""
          className="w-full h-auto scale-50 -rotate-12 blur-[0.4px]"
        />
      </motion.div>

      <motion.div
        animate={{
          y: [15, -20, 15],
          x: [10, -8, 10],
          rotate: [15, -15, 15],
          opacity: [0.25, 0.65, 0.25],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-[28%] right-[16%] w-9 sm:w-12 filter drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)]"
      >
        <img
          src="/landing/rose-single-bloom-2.png"
          alt=""
          className="w-full h-auto scale-50 rotate-45 blur-[0.5px]"
        />
      </motion.div>
    </div>
  );
}
