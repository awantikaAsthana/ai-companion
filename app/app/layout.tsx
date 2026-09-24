"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Sparkles, LogOut, Compass, Users } from "lucide-react";
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

      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#430D15]/40 bg-[#090405]/85 px-4 py-3 sm:px-8 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <Link
            href="/app"
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-90 min-h-[44px]"
            aria-label="Ecstasy Home"
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
              className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-all min-h-[36px] flex items-center ${
                pathname === "/app"
                  ? "border border-[#C9A46A]/50 bg-[#21080C] text-[#F5E9E5] shadow-[0_0_12px_rgba(201,164,106,0.15)]"
                  : "text-[#BFA8A8] hover:text-[#F5E9E5]"
              }`}
            >
              Sanctuary
            </Link>
            <Link
              href="/app/characters"
              className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-all min-h-[36px] flex items-center ${
                pathname.startsWith("/app/characters")
                  ? "border border-[#C9A46A]/50 bg-[#21080C] text-[#F5E9E5] shadow-[0_0_12px_rgba(201,164,106,0.15)]"
                  : "text-[#BFA8A8] hover:text-[#F5E9E5]"
              }`}
            >
              Companions
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 rounded-full border border-[#430D15]/60 bg-[#120507]/80 px-3 py-1.5 text-xs text-[#BFA8A8] max-w-[140px] sm:max-w-[200px]">
            <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9A46A]" />
            <span className="font-medium text-[#F5E9E5] truncate">
              {user?.name ?? user?.email?.split("@")[0]}
            </span>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center justify-center gap-1.5 rounded-full border border-[#430D15]/60 bg-[#120507]/60 px-3 py-2 text-xs text-[#BFA8A8] transition-all duration-200 hover:border-[#6E0717] hover:bg-[#21080C] hover:text-[#F5E9E5] disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] min-w-[44px]"
            title="Log out"
            aria-label="Log out of Ecstasy"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">
              {loggingOut ? "Leaving…" : "Log out"}
            </span>
          </button>
        </div>
      </header>

      <main className="relative z-10 px-4 py-6 sm:px-8 sm:py-10 pb-24 sm:pb-12 max-w-7xl mx-auto">{children}</main>

      {/* Mobile Bottom Navigation Bar with Safe Area Inset */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 sm:hidden border-t border-[#430D15]/60 bg-[#090405]/95 backdrop-blur-xl px-6 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom,0px))] flex items-center justify-around shadow-[0_-8px_30px_rgba(0,0,0,0.8)]"
      >
        <Link
          href="/app"
          className={`flex flex-col items-center gap-1 min-h-[44px] justify-center px-4 transition-colors ${
            pathname === "/app"
              ? "text-[#C9A46A]"
              : "text-[#BFA8A8] hover:text-[#F5E9E5]"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-[11px] font-medium tracking-wider uppercase">
            Sanctuary
          </span>
        </Link>

        <Link
          href="/app/characters"
          className={`flex flex-col items-center gap-1 min-h-[44px] justify-center px-4 transition-colors ${
            pathname.startsWith("/app/characters")
              ? "text-[#C9A46A]"
              : "text-[#BFA8A8] hover:text-[#F5E9E5]"
          }`}
        >
          <Users className="h-4 w-4" />
          <span className="text-[11px] font-medium tracking-wider uppercase">
            Companions
          </span>
        </Link>
      </nav>
    </div>
  );
}
