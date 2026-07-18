"use client";

import { useMemo } from "react";

import { useEditor } from "@/components/editor/EditorContext";

export function EditorShell() {
  const {
    isOpen,
    setIsOpen,
    surfaces,
    selectedSurfaceId,
    setSelectedSurfaceId,
  } = useEditor();
  const selectedSurface = useMemo(() => {
    return (
      surfaces.find((surface) => surface.id === selectedSurfaceId) ??
      surfaces[0] ??
      null
    );
  }, [selectedSurfaceId, surfaces]);

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 cursor-pointer rounded-md border border-ink/10 bg-paper/85 px-3 py-2 font-mono text-[10px] font-extralight uppercase tracking-[0.1em] text-ink/55 shadow-sm backdrop-blur-sm transition-colors hover:border-ink/20 hover:bg-paper hover:text-ink sm:bottom-6 sm:right-6"
      >
        Edit
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="pointer-events-auto absolute left-3 top-3 flex max-h-[calc(100svh-1.5rem)] w-[min(16rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-md border border-ink/10 bg-paper/95 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-ink/10 px-3 py-2">
          <div>
            <p className="font-mono text-[10px] font-extralight uppercase tracking-[0.1em] text-ink/60">
              Editor
            </p>
            <p className="font-serif text-xs tracking-[-0.04375rem] text-ink/45">
              Site canvas
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="cursor-pointer font-mono text-[10px] font-extralight uppercase tracking-[0.1em] text-ink/40 transition-colors hover:text-ink"
          >
            Hide
          </button>
        </div>

        <div className="min-h-0 overflow-y-auto p-2">
          {surfaces.length > 0 ? (
            <div className="grid gap-1">
              {surfaces.map((surface) => {
                const active = selectedSurface?.id === surface.id;
                return (
                  <button
                    key={surface.id}
                    type="button"
                    onClick={() => setSelectedSurfaceId(surface.id)}
                    className={`cursor-pointer rounded-sm border px-2 py-2 text-left transition-colors ${
                      active
                        ? "border-ink bg-ink text-paper"
                        : "border-ink/10 text-ink/65 hover:bg-highlight"
                    }`}
                  >
                    <span className="block font-mono text-[10px] font-extralight uppercase tracking-[0.08em]">
                      {surface.group ?? "Page"}
                    </span>
                    <span className="mt-0.5 block truncate font-serif text-sm tracking-[-0.04375rem]">
                      {surface.title}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="rounded-sm border border-ink/10 p-3 font-mono text-[10px] font-extralight uppercase tracking-[0.08em] text-ink/40">
              No editable layers on this page.
            </p>
          )}
        </div>
      </div>

      <div className="pointer-events-auto absolute right-3 top-3 flex max-h-[calc(100svh-1.5rem)] w-[min(25rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-md border border-ink/10 bg-paper/95 shadow-sm backdrop-blur-sm">
        <div className="border-b border-ink/10 px-3 py-2">
          <p className="font-mono text-[10px] font-extralight uppercase tracking-[0.1em] text-ink/60">
            Properties
          </p>
          <p className="mt-0.5 truncate font-serif text-sm tracking-[-0.04375rem] text-ink">
            {selectedSurface?.title ?? "Nothing selected"}
          </p>
        </div>

        <div className="min-h-0 overflow-y-auto p-3">
          {selectedSurface ? (
            selectedSurface.renderPanel()
          ) : (
            <p className="font-mono text-[10px] font-extralight uppercase tracking-[0.08em] text-ink/40">
              Select an editable layer from the canvas panel.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
