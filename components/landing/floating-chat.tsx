"use client";

import { motion } from "framer-motion";

interface ChatBubbleProps {
  message: string;
  delay?: number;
  time?: string;
  className?: string;
  glowColor?: "crimson" | "gold";
}

export function FloatingChatBubble({
  message,
  delay = 0,
  time,
  className = "",
  glowColor = "crimson",
}: ChatBubbleProps) {
  const glowBorder =
    glowColor === "gold"
      ? "border-[#C9A46A]/30 hover:border-[#C9A46A]/50 shadow-[0_8px_32px_rgba(201,164,106,0.12)]"
      : "border-[#6E0717]/40 hover:border-[#B51E3A]/60 shadow-[0_8px_32px_rgba(110,7,23,0.2)]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{
        opacity: 1,
        y: [0, -6, 0],
        scale: 1,
      }}
      transition={{
        opacity: { duration: 0.8, delay },
        scale: { duration: 0.8, delay },
        y: {
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay + 0.2,
        },
      }}
      className={`relative inline-flex items-center gap-2.5 sm:gap-3 max-w-[calc(100vw-3rem)] sm:max-w-none rounded-2xl bg-[#120507]/85 px-3 py-2 sm:px-4 sm:py-2.5 backdrop-blur-xl border transition-all duration-300 ${glowBorder} ${className}`}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#B51E3A] opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#B51E3A]" />
      </span>

      <span className="text-xs sm:text-sm font-light tracking-wide text-[#F5E9E5] truncate sm:whitespace-normal">
        {message}
      </span>

      {time && (
        <span className="text-[10px] uppercase tracking-wider text-[#BFA8A8]/60 shrink-0">
          {time}
        </span>
      )}
    </motion.div>
  );
}

