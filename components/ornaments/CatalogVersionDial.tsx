"use client";

import { useEffect, useRef, useState } from "react";

import {
  CATALOG_LAYOUTS,
  type CatalogLayoutId,
} from "@/lib/ornaments/catalog-layouts";

const POSITION_KEY = "ornament-catalog-dial-position";

type DialPosition = { x: number; y: number };

type CatalogVersionDialProps = {
  value: CatalogLayoutId;
  onChange: (next: CatalogLayoutId) => void;
};

function clampPosition(x: number, y: number, width: number, height: number) {
  const pad = 8;
  const maxX = Math.max(pad, window.innerWidth - width - pad);
  const maxY = Math.max(pad, window.innerHeight - height - pad);
  return {
    x: Math.min(maxX, Math.max(pad, x)),
    y: Math.min(maxY, Math.max(pad, y)),
  };
}

function readStoredPosition(): DialPosition | null {
  try {
    const raw = window.localStorage.getItem(POSITION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<DialPosition>;
    if (typeof parsed.x !== "number" || typeof parsed.y !== "number") {
      return null;
    }
    return { x: parsed.x, y: parsed.y };
  } catch {
    return null;
  }
}

export function CatalogVersionDial({
  value,
  onChange,
}: CatalogVersionDialProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [position, setPosition] = useState<DialPosition | null>(null);
  const [dragging, setDragging] = useState(false);

  const active =
    CATALOG_LAYOUTS.find((layout) => layout.id === value) ?? CATALOG_LAYOUTS[0];

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const stored = readStoredPosition();
    const width = panel.offsetWidth;
    const height = panel.offsetHeight;

    if (stored) {
      setPosition(clampPosition(stored.x, stored.y, width, height));
      return;
    }

    // Default: bottom-center
    setPosition(
      clampPosition(
        (window.innerWidth - width) / 2,
        window.innerHeight - height - 24,
        width,
        height,
      ),
    );
  }, []);

  useEffect(() => {
    if (!position) return;
    try {
      window.localStorage.setItem(POSITION_KEY, JSON.stringify(position));
    } catch {
      // ignore
    }
  }, [position]);

  useEffect(() => {
    function onResize() {
      const panel = panelRef.current;
      if (!panel || !position) return;
      setPosition(
        clampPosition(
          position.x,
          position.y,
          panel.offsetWidth,
          panel.offsetHeight,
        ),
      );
    }

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [position]);

  function startDrag(clientX: number, clientY: number) {
    const panel = panelRef.current;
    if (!panel || !position) return;
    dragOffset.current = {
      x: clientX - position.x,
      y: clientY - position.y,
    };
    setDragging(true);
  }

  useEffect(() => {
    if (!dragging) return;

    function onPointerMove(event: PointerEvent) {
      const panel = panelRef.current;
      if (!panel) return;
      setPosition(
        clampPosition(
          event.clientX - dragOffset.current.x,
          event.clientY - dragOffset.current.y,
          panel.offsetWidth,
          panel.offsetHeight,
        ),
      );
    }

    function onPointerUp() {
      setDragging(false);
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [dragging]);

  return (
    <div
      ref={panelRef}
      className="fixed z-50 w-[min(20rem,calc(100vw-1rem))] rounded-md border border-ink/15 bg-paper/95 shadow-sm backdrop-blur-sm"
      style={
        position
          ? { left: position.x, top: position.y }
          : { left: "50%", bottom: 24, transform: "translateX(-50%)" }
      }
    >
      <button
        type="button"
        aria-label="Drag layout dial"
        onPointerDown={(event) => {
          event.preventDefault();
          startDrag(event.clientX, event.clientY);
        }}
        className={`flex w-full cursor-grab items-center justify-between gap-3 border-b border-ink/10 px-3 py-2.5 text-left active:cursor-grabbing ${
          dragging ? "cursor-grabbing bg-highlight/60" : "hover:bg-highlight/40"
        }`}
      >
        <span className="font-mono text-[10px] font-extralight uppercase tracking-[0.12em] text-ink/45">
          Layout dial · drag
        </span>
        <span className="font-serif text-sm tracking-[-0.03em] text-ink">
          {active.label}
        </span>
      </button>

      <div className="grid grid-cols-4 gap-1.5 p-2.5">
        {CATALOG_LAYOUTS.map((layout) => {
          const selected = layout.id === value;
          return (
            <button
              key={layout.id}
              type="button"
              onClick={() => onChange(layout.id)}
              className={`min-h-10 cursor-pointer rounded-sm px-2 py-2 text-center font-mono text-[10px] font-extralight uppercase tracking-[0.08em] transition-colors ${
                selected
                  ? "bg-fig text-paper"
                  : "bg-highlight/70 text-ink/70 hover:bg-highlight hover:text-ink"
              }`}
            >
              {layout.label}
            </button>
          );
        })}
      </div>

      <p className="border-t border-ink/10 px-3 py-2 font-serif text-[0.7rem] leading-snug tracking-[-0.02em] text-ink/50">
        {active.blurb}
      </p>
    </div>
  );
}
