"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";

import { useScrambleRowActive } from "@/components/shared/SlidingHighlightRows";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ+-/";

type VariantScrambleTextProps = {
  title: string;
  variant: string;
  className?: string;
};

function scrambleFrame(target: string, progress: number): string {
  return target
    .split("")
    .map((char, index) => {
      if (!/[A-Za-z0-9]/.test(char)) return char;

      const settleAt = (index / Math.max(target.length - 1, 1)) * 0.82;
      if (progress >= settleAt) return char;

      return SCRAMBLE_CHARS[
        Math.floor(Math.random() * SCRAMBLE_CHARS.length)
      ]!;
    })
    .join("");
}

function animateScrambleTo(
  target: string,
  onUpdate: (value: string) => void,
  isCancelled: () => boolean,
): Promise<void> {
  return new Promise((resolve) => {
    let frame = 0;
    const maxFrames = 18;

    const interval = window.setInterval(() => {
      if (isCancelled()) {
        window.clearInterval(interval);
        resolve();
        return;
      }

      frame += 1;
      onUpdate(scrambleFrame(target, frame / maxFrames));

      if (frame >= maxFrames) {
        window.clearInterval(interval);
        onUpdate(target);
        resolve();
      }
    }, 35);
  });
}

function scrambleTo(
  target: string,
  setDisplay: (value: string) => void,
  animationGenRef: MutableRefObject<number>,
  animatingRef: MutableRefObject<boolean>,
  reduceMotion: boolean,
) {
  const gen = animationGenRef.current + 1;
  animationGenRef.current = gen;

  if (reduceMotion) {
    setDisplay(target);
    animatingRef.current = false;
    return;
  }

  animatingRef.current = true;
  void animateScrambleTo(
    target,
    (value) => {
      if (animationGenRef.current !== gen) return;
      setDisplay(value);
    },
    () => animationGenRef.current !== gen,
  ).then(() => {
    if (animationGenRef.current !== gen) return;
    animatingRef.current = false;
  });
}

export function VariantScrambleText({
  title,
  variant,
  className = "",
}: VariantScrambleTextProps) {
  const active = useScrambleRowActive();
  const [display, setDisplay] = useState(title);
  const wasActiveRef = useRef(false);
  const animatingRef = useRef(false);
  const animationGenRef = useRef(0);

  useEffect(() => {
    animationGenRef.current += 1;
    animatingRef.current = false;
    setDisplay(title);
  }, [title]);

  useEffect(() => {
    const entered = active && !wasActiveRef.current;
    const left = !active && wasActiveRef.current;
    wasActiveRef.current = active;

    if (!entered && !left) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    scrambleTo(
      left ? title : variant,
      setDisplay,
      animationGenRef,
      animatingRef,
      reduceMotion,
    );
  }, [active, title, variant]);

  return <span className={className}>{display}</span>;
}
