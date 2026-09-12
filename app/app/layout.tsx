"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string | null;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
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
      // ponytail: no finally needed — redirect handles the unauthenticated case
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
      <div className="flex min-h-dvh items-center justify-center">
        <p className="text-neutral-400 animate-pulse">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh">
      <header className="flex items-center justify-between border-b border-neutral-800 px-4 py-3 sm:px-6">
        <span className="text-sm font-medium text-neutral-200">
          Ecstasy
        </span>
        <div className="flex items-center gap-3">
          <span className="text-sm text-neutral-400">
            {user?.name ?? user?.email}
          </span>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="rounded-md bg-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loggingOut ? "Logging out…" : "Log out"}
          </button>
        </div>
      </header>
      <main className="p-4 sm:p-6">{children}</main>
    </div>
  );
}

