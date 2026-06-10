"use client";

import { HOME_ABOUT_LAYOUTS } from "@/lib/home-about-layout";

import { useHomeAboutLayout } from "./HomeAboutLayoutContext";

export function HomeLayoutSelector() {
  const { layout, setLayout } = useHomeAboutLayout();

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3"
      aria-hidden={false}
    >
      <div
        role="tablist"
        aria-label="Home layout comparison"
        className="pointer-events-auto flex flex-wrap items-center justify-center gap-1 rounded-full border border-ink/15 bg-paper/90 px-1.5 py-1.5 shadow-sm backdrop-blur-sm"
      >
        {HOME_ABOUT_LAYOUTS.map((option) => {
          const isActive = layout === option.id;

          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setLayout(option.id)}
              className={`rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors ${
                isActive
                  ? "bg-ink text-paper"
                  : "text-ink/70 hover:bg-highlight hover:text-ink"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
