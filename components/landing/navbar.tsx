"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 24);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#090405]/85 backdrop-blur-md border-b border-[#430D15]/40 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "bg-transparent py-5 sm:py-6"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
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

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-8"
          >
            <Link
              href="#characters"
              className="text-xs uppercase tracking-[0.18em] text-[#BFA8A8] transition-colors duration-200 hover:text-[#F5E9E5]"
            >
              Discover
            </Link>
            <Link
              href="#how-it-works"
              className="text-xs uppercase tracking-[0.18em] text-[#BFA8A8] transition-colors duration-200 hover:text-[#F5E9E5]"
            >
              How It Works
            </Link>
            <Link
              href="#connection"
              className="text-xs uppercase tracking-[0.18em] text-[#BFA8A8] transition-colors duration-200 hover:text-[#F5E9E5]"
            >
              Connection
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs uppercase tracking-[0.16em] text-[#BFA8A8] px-3 py-2 transition-colors duration-200 hover:text-[#F5E9E5]"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#6E0717] to-[#8F1025] px-5 py-2 text-xs font-medium uppercase tracking-[0.14em] text-[#F5E9E5] shadow-[0_0_20px_rgba(110,7,23,0.35)] transition-all duration-300 hover:from-[#8F1025] hover:to-[#B51E3A] hover:shadow-[0_0_25px_rgba(181,30,58,0.45)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Create Your Companion
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle Navigation Menu"
            className="sm:hidden flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-[#430D15]/60 bg-[#120507]/90 text-[#F5E9E5] transition-colors hover:border-[#6E0717]"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-[#F5E9E5]" />
            ) : (
              <Menu className="h-5 w-5 text-[#F5E9E5]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="sm:hidden overflow-hidden border-b border-[#430D15]/50 bg-[#090405]/95 backdrop-blur-xl px-6 py-6"
          >
            <nav className="flex flex-col space-y-2">
              <Link
                href="#characters"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center min-h-[44px] text-sm uppercase tracking-[0.16em] text-[#BFA8A8] transition-colors hover:text-[#F5E9E5]"
              >
                Discover
              </Link>
              <Link
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center min-h-[44px] text-sm uppercase tracking-[0.16em] text-[#BFA8A8] transition-colors hover:text-[#F5E9E5]"
              >
                How It Works
              </Link>
              <Link
                href="#connection"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center min-h-[44px] text-sm uppercase tracking-[0.16em] text-[#BFA8A8] transition-colors hover:text-[#F5E9E5]"
              >
                Connection
              </Link>
              <div className="pt-4 border-t border-[#430D15]/50 flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center min-h-[44px] text-xs uppercase tracking-[0.16em] text-[#BFA8A8] border border-[#430D15]/70 rounded-full hover:text-[#F5E9E5]"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center min-h-[44px] text-xs font-medium uppercase tracking-[0.14em] text-[#F5E9E5] bg-gradient-to-r from-[#6E0717] to-[#8F1025] rounded-full shadow-[0_0_15px_rgba(110,7,23,0.4)]"
                >
                  Create Your Companion
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

