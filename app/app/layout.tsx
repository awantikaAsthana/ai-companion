"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Sparkles, LogOut } from "lucide-react";
import { CharacterAmbientBackground } from "@/components/characters/character-ambient-background";

interface User {
  id: string;
  email: string;
  name: string | null;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("unauthenticated");
        return res.json();
      })
      .then((data: { user: User }) => setUser(data.user))
      .catch(() => router.replace("/login"));
  }, [router]);

  useEffect(() => {
    if (user) setLoading(false);
  }, [user]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/login");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-[#090405] text-[#F5E9E5]">
        <div className="relative flex h-12 w-12 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C9A46A]/20" />
          <span className="font-serif text-2xl text-[#C9A46A]">✦</span>
        </div>
        <p className="mt-4 font-serif text-sm tracking-widest text-[#BFA8A8] uppercase">
          Entering Ecstasy…
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-dvh bg-[#090405] text-[#F5E9E5]">
      {/* Subtle letter texture & rose ambient framing */}
      <CharacterAmbientBackground />

      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#430D15]/40 bg-[#090405]/80 px-4 py-3 sm:px-8 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <Link
            href="/app"
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <span className="text-sm text-[#C9A46A] transition-transform duration-300 group-hover:rotate-12">
              ✦
            </span>
            <span className="font-serif text-lg tracking-[0.2em] uppercase font-light text-[#F5E9E5]">
              Ecstasy
            </span>
          </Link>

          <nav className="hidden sm:flex items-center gap-2 border-l border-[#430D15]/60 pl-6">
            <Link
              href="/app"
              className={`rounded-full px-4 py-1 text-xs font-medium uppercase tracking-wider transition-all ${
                pathname === "/app"
                  ? "border border-[#C9A46A]/50 bg-[#21080C] text-[#F5E9E5] shadow-[0_0_12px_rgba(201,164,106,0.15)]"
                  : "text-[#BFA8A8] hover:text-[#F5E9E5]"
              }`}
            >
              Sanctuary
            </Link>
            <Link
              href="/app/characters"
              className={`rounded-full px-4 py-1 text-xs font-medium uppercase tracking-wider transition-all ${
                pathname.startsWith("/app/characters")
                  ? "border border-[#C9A46A]/50 bg-[#21080C] text-[#F5E9E5] shadow-[0_0_12px_rgba(201,164,106,0.15)]"
                  : "text-[#BFA8A8] hover:text-[#F5E9E5]"
              }`}
            >
              Companions
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full border border-[#430D15]/60 bg-[#120507]/80 px-3 py-1 text-xs text-[#BFA8A8]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#C9A46A]" />
            <span className="font-medium text-[#F5E9E5]">
              {user?.name ?? user?.email?.split("@")[0]}
            </span>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-1.5 rounded-full border border-[#430D15]/60 bg-[#120507]/60 px-3 py-1.5 text-xs text-[#BFA8A8] transition-all duration-200 hover:border-[#6E0717] hover:bg-[#21080C] hover:text-[#F5E9E5] disabled:cursor-not-allowed disabled:opacity-50"
            title="Log out"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {loggingOut ? "Leaving…" : "Log out"}
            </span>
          </button>
        </div>
      </header>

      <main className="relative z-10 px-4 py-6 sm:px-8 sm:py-10 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
