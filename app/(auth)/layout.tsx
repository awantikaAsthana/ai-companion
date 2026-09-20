import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";
import { AuthBackground } from "@/components/auth/auth-background";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full bg-[#090405] text-[#F5E9E5] overflow-x-hidden flex flex-col justify-between selection:bg-[#6E0717] selection:text-[#F5E9E5]">
      {/* Cinematic Ambient Background with Silhouette Photo, Letter Texture & Roses */}
      <AuthBackground />

      {/* Top Header Navigation */}
      <header className="relative z-20 w-full px-6 py-6 sm:px-10 flex items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-2.5 focus:outline-none"
          aria-label="Ecstasy Home"
        >
          <span className="relative flex h-7 w-7 items-center justify-center rounded-full border border-[#C9A46A]/30 bg-[#21080C]/80 transition-all duration-300 group-hover:border-[#C9A46A]/60 group-hover:shadow-[0_0_15px_rgba(201,164,106,0.3)]">
            <Sparkles className="h-3.5 w-3.5 text-[#C9A46A] transition-transform duration-300 group-hover:scale-110" />
          </span>
          <span className="font-serif text-xl tracking-wide text-[#F5E9E5] transition-colors duration-300 group-hover:text-[#C9A46A]">
            Ecstasy
          </span>
        </Link>

        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-xs font-light tracking-[0.16em] uppercase text-[#BFA8A8] transition-colors duration-300 hover:text-[#C9A46A]"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Return Home</span>
        </Link>
      </header>

      {/* Main Glassmorphism Form Container */}
      <main className="relative z-20 flex flex-1 items-center justify-center px-4 py-8 sm:py-12">
        {children}
      </main>

      {/* Subtle Bottom Footer Info */}
      <footer className="relative z-20 w-full px-6 py-5 text-center text-[11px] text-[#BFA8A8]/60">
        <span>Private conversations. Your companion. Your world.</span>
      </footer>
    </div>
  );
}