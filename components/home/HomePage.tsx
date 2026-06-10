"use client";

import { useCallback, useLayoutEffect, useState } from "react";

import { HighlightCircleCursor } from "@/components/shared/HighlightCircleCursor";
import { hasSeenHomeLoader, markHomeLoaderSeen } from "@/lib/home-loader";

import { AboutSection } from "./AboutSection";
import { HomeFooter } from "./HomeFooter";
import { HomeAboutLayoutProvider } from "./HomeAboutLayoutContext";
import { HomeLayoutSelector } from "./HomeLayoutSelector";
import { LoadingScreen } from "./LoadingScreen";

export function HomePage() {
  const [showLoader, setShowLoader] = useState(true);
  const [isRevealed, setIsRevealed] = useState(false);

  useLayoutEffect(() => {
    if (hasSeenHomeLoader()) {
      setShowLoader(false);
      setIsRevealed(true);
    }
  }, []);

  const handleReveal = useCallback(() => {
    setIsRevealed(true);
  }, []);

  const handleDismiss = useCallback(() => {
    markHomeLoaderSeen();
    setShowLoader(false);
  }, []);

  return (
    <div className="bg-paper text-ink">
      {showLoader ? (
        <LoadingScreen onReveal={handleReveal} onDismiss={handleDismiss} />
      ) : null}
      <HomeAboutLayoutProvider>
        <div
          className={isRevealed ? "opacity-100" : "opacity-0"}
          aria-hidden={!isRevealed}
        >
          <HomeLayoutSelector />
          <HighlightCircleCursor className="min-h-svh w-full">
            <AboutSection />
            <HomeFooter />
          </HighlightCircleCursor>
        </div>
      </HomeAboutLayoutProvider>
    </div>
  );
}
