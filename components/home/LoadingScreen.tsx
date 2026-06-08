"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { preloadHomeAssets } from "@/lib/preload-home";

const HERO_IMAGE = "/images/hero-garden.png";
const MIN_DISPLAY_MS = 2400;
const EXIT_MS = 900;

type LoadingScreenProps = {
  onReveal: () => void;
  onDismiss: () => void;
};

type Phase = "enter" | "hold" | "exit";

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function LoadingScreen({ onReveal, onDismiss }: LoadingScreenProps) {
  const [phase, setPhase] = useState<Phase>("enter");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let cancelled = false;
    let dismissTimer: number | undefined;

    if (reduceMotion) {
      setPhase("hold");
    }

    async function run() {
      const minDisplay = reduceMotion ? 600 : MIN_DISPLAY_MS;

      await Promise.all([preloadHomeAssets(), wait(minDisplay)]);

      if (cancelled) return;

      if (reduceMotion) {
        onReveal();
        onDismiss();
        return;
      }

      setPhase("exit");
      onReveal();

      dismissTimer = window.setTimeout(() => {
        if (!cancelled) onDismiss();
      }, EXIT_MS);
    }

    const enterTimer = window.setTimeout(() => {
      if (!cancelled) setPhase("hold");
    }, reduceMotion ? 0 : 1200);

    run();

    return () => {
      cancelled = true;
      window.clearTimeout(enterTimer);
      if (dismissTimer !== undefined) window.clearTimeout(dismissTimer);
    };
  }, [onDismiss, onReveal]);

  return (
    <div
      className={`loading-screen fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-paper ${
        phase === "exit" ? "loading-screen--exit" : ""
      }`}
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading portfolio"
    >
      <div
        className={`loading-screen__image absolute inset-0 ${
          phase === "enter" ? "loading-screen__image--enter" : ""
        }`}
      >
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      <div
        className="loading-screen__scrim absolute inset-0 bg-black/10"
        aria-hidden="true"
      />

      <div
        className={`relative z-10 -rotate-[21.28deg] select-none text-center font-display text-cream ${
          phase !== "enter" ? "loading-screen__name--visible" : ""
        }`}
        aria-hidden="true"
      >
        <p className="loading-screen__name-line text-[clamp(4.5rem,18vw,18rem)] leading-none">
          Jade
        </p>
        <p className="loading-screen__name-line loading-screen__name-line--second text-[clamp(4.5rem,18vw,18rem)] leading-none">
          Franson
        </p>
      </div>

      <div
        className={`loading-screen__progress absolute bottom-10 left-1/2 z-10 h-px w-32 -translate-x-1/2 overflow-hidden bg-cream/25 md:bottom-14 md:w-40 ${
          phase === "hold" ? "loading-screen__progress--active" : ""
        }`}
        aria-hidden="true"
      >
        <span className="loading-screen__progress-bar block h-full origin-left bg-cream" />
      </div>

      <h1 className="sr-only">Jade Franson</h1>
    </div>
  );
}
