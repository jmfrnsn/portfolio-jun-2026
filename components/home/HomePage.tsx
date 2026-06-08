"use client";

import { useCallback, useState } from "react";

import { AboutSection } from "./AboutSection";
import { ContentsSection } from "./ContentsSection";
import { FooterSection } from "./FooterSection";
import { LoadingScreen } from "./LoadingScreen";

export function HomePage() {
  const [showLoader, setShowLoader] = useState(true);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleReveal = useCallback(() => {
    setIsRevealed(true);
  }, []);

  const handleDismiss = useCallback(() => {
    setShowLoader(false);
  }, []);

  return (
    <div className="bg-paper text-ink">
      {showLoader ? (
        <LoadingScreen onReveal={handleReveal} onDismiss={handleDismiss} />
      ) : null}
      <div
        className={isRevealed ? "opacity-100" : "opacity-0"}
        aria-hidden={!isRevealed}
      >
        <AboutSection />
        <ContentsSection />
        <FooterSection />
      </div>
    </div>
  );
}
