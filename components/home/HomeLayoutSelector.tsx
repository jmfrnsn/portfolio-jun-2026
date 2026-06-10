"use client";

import { useEffect, useRef, useState } from "react";

import { HOME_ABOUT_LAYOUTS } from "@/lib/home-about-layout";

import { useHomeAboutLayout } from "./HomeAboutLayoutContext";

export function HomeLayoutSelector() {
  const { layout, setLayout } = useHomeAboutLayout();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const activeLabel =
    HOME_ABOUT_LAYOUTS.find((option) => option.id === layout)?.label ?? layout;

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed bottom-4 left-4 z-50 sm:bottom-6 sm:left-6"
    >
      <div className="pointer-events-auto flex flex-col items-start gap-1.5">
        {open ? (
          <div
            role="tablist"
            aria-label="Home layout comparison"
            className="flex flex-col overflow-hidden rounded-md border border-ink/10 bg-paper/95 shadow-sm backdrop-blur-sm"
          >
            {HOME_ABOUT_LAYOUTS.map((option) => {
              const isActive = layout === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setLayout(option.id);
                    setOpen(false);
                  }}
                  className={`cursor-pointer px-3 py-1.5 text-left font-mono text-[10px] uppercase tracking-[0.08em] transition-colors ${
                    isActive
                      ? "bg-ink text-paper"
                      : "text-ink/60 hover:bg-highlight hover:text-ink"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-haspopup="listbox"
          className="cursor-pointer rounded-md border border-ink/10 bg-paper/80 px-2.5 py-1.5 font-mono text-[10px] font-extralight uppercase tracking-[0.1em] text-ink/45 backdrop-blur-sm transition-colors hover:border-ink/20 hover:bg-paper hover:text-ink/70"
        >
          {activeLabel}
        </button>
      </div>
    </div>
  );
}
