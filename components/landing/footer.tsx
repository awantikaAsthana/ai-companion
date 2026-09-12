import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-20 border-t border-[#430D15]/60 bg-[#090405] py-16 text-[#BFA8A8]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none"
            aria-label="Ecstasy Home"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#C9A46A]/40 bg-[#21080C] transition-all group-hover:border-[#C9A46A]">
              <Sparkles className="h-3.5 w-3.5 text-[#C9A46A]" />
            </span>
            <span className="font-serif text-xl tracking-wide text-[#F5E9E5] transition-colors group-hover:text-[#C9A46A]">
              Ecstasy
            </span>
          </Link>

          {/* Links */}
          <nav
            aria-label="Footer Navigation"
            className="flex flex-wrap items-center justify-center gap-8 text-xs uppercase tracking-[0.2em]"
          >
            <Link
              href="#characters"
              className="text-[#BFA8A8] transition-colors hover:text-[#F5E9E5]"
            >
              Discover
            </Link>
            <Link
              href="#how-it-works"
              className="text-[#BFA8A8] transition-colors hover:text-[#F5E9E5]"
            >
              How It Works
            </Link>
            <Link
              href="#privacy"
              className="text-[#BFA8A8] transition-colors hover:text-[#F5E9E5]"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-[#BFA8A8] transition-colors hover:text-[#F5E9E5]"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-[#BFA8A8] transition-colors hover:text-[#F5E9E5]"
            >
              Contact
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-xs text-[#BFA8A8]/60">
            &copy; 2026 Ecstasy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
