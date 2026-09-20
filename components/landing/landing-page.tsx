"use client";

import { MotionConfig } from "framer-motion";
import { AmbientBackground } from "./ambient-background";
import { Navbar } from "./navbar";
import { Hero } from "./hero";
import { Positioning } from "./positioning";
import { FeaturedCharacters } from "./featured-characters";
import { HowItWorks } from "./how-it-works";
import { Personalization } from "./personalization";
import { PrivacySection } from "./privacy-section";
import { FinalCta } from "./final-cta";
import { Footer } from "./footer";
import { RoseElements } from "./rose-elements";

export function LandingPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-[#090405] text-[#F5E9E5] overflow-x-hidden selection:bg-[#6E0717] selection:text-[#F5E9E5]">
        {/* Cinematic CSS-generated ambient lighting & depth */}
        <AmbientBackground />
        <RoseElements />
      {/* Floating navigation */}
      <Navbar />

      {/* Main content flow */}
        <main className="relative z-10">
          <Hero />
          <Positioning />
          <FeaturedCharacters />
          <HowItWorks />
          <Personalization />
          <div id="privacy">
            <PrivacySection />
          </div>
          <FinalCta />
          <Footer />
        </main>
      </div>
    </MotionConfig>
  );
}

