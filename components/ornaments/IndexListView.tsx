"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ArchiveSourceButton } from "@/components/ornaments/ArchiveSourceButton";
import { OrnamentImage } from "@/components/ornaments/OrnamentImage";
import type { OrnamentFigure } from "@/lib/ornaments/figure-catalog";

type IndexListViewProps = {
  figures: OrnamentFigure[];
  isAdmin: boolean;
  onArchiveChange: (sourceId: string, nextArchived: boolean) => void;
};

function shortEra(era: string) {
  return (
    era
      .replace(/\s*\([^)]*\)\s*/g, "")
      .replace(/\.$/, "")
      .trim() || "—"
  );
}

function cellText(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "—";
}

export function IndexListView({
  figures,
  isAdmin,
  onArchiveChange,
}: IndexListViewProps) {
  const [activeId, setActiveId] = useState<string | null>(
    figures[0]?.source.id ?? null,
  );

  useEffect(() => {
    if (figures.length === 0) {
      setActiveId(null);
      return;
    }
    if (!activeId || !figures.some((figure) => figure.source.id === activeId)) {
      setActiveId(figures[0]!.source.id);
    }
  }, [activeId, figures]);

  const active =
    figures.find((figure) => figure.source.id === activeId) ?? figures[0] ?? null;

  return (
    <div className="ornament-index-list">
      <div className="ornament-index-list-frame">
        <div className="ornament-index-list-main">
          <div className="ornament-index-list-cols" aria-hidden="true">
            <span />
            <span />
            <span>Title</span>
            <span>Era</span>
            <span className="max-lg:hidden">Place</span>
            <span className="max-md:hidden">Type</span>
            <span>Year</span>
            <span className="max-xl:hidden">By</span>
            <span />
          </div>

          <ul className="ornament-index-list-rows" role="list">
            {figures.map((figure) => {
              const selected = figure.source.id === active?.source.id;

              return (
                <li
                  key={figure.source.id}
                  className={`ornament-index-list-row group relative ${
                    selected ? "is-active" : ""
                  }`}
                  onMouseEnter={() => setActiveId(figure.source.id)}
                  onFocusCapture={() => setActiveId(figure.source.id)}
                >
                  <Link
                    href={`/ornaments/sources/${figure.source.id}`}
                    className="ornament-index-list-link"
                    aria-current={selected ? "true" : undefined}
                  >
                    <span className="ornament-index-list-mark" aria-hidden>
                      <span
                        className={`ornament-index-list-dot ${
                          selected ? "is-filled" : ""
                        }`}
                      />
                    </span>

                    <span className="ornament-index-list-thumb">
                      {figure.source.imageUrl ? (
                        <OrnamentImage
                          src={figure.source.imageUrl}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="block h-full w-full bg-ink/5" />
                      )}
                    </span>

                    <span className="ornament-index-list-title">
                      {figure.titleLabel}
                    </span>
                    <span className="ornament-index-list-meta">
                      {shortEra(figure.source.era)}
                    </span>
                    <span className="ornament-index-list-meta max-lg:hidden">
                      {cellText(figure.source.region)}
                    </span>
                    <span className="ornament-index-list-meta max-md:hidden">
                      {cellText(figure.source.type)}
                    </span>
                    <span className="ornament-index-list-meta">
                      {cellText(figure.source.year)}
                    </span>
                    <span className="ornament-index-list-meta max-xl:hidden truncate">
                      {cellText(figure.source.creator)}
                    </span>
                    <span
                      className="ornament-index-list-arrow"
                      aria-hidden
                    >
                      {selected ? "→" : ""}
                    </span>
                  </Link>

                  {isAdmin ? (
                    <div className="absolute right-2 top-1/2 z-10 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                      <ArchiveSourceButton
                        sourceId={figure.source.id}
                        archived={figure.source.notionStatus === "Archived"}
                        onCompleted={(nextArchived) =>
                          onArchiveChange(figure.source.id, nextArchived)
                        }
                      />
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>

        <aside className="ornament-index-list-preview" aria-live="polite">
          <p className="ornament-index-list-preview-label">Preview</p>
          {active ? (
            <Link
              href={`/ornaments/sources/${active.source.id}`}
              className="ornament-index-list-preview-inner"
            >
              <div className="relative min-h-0 flex-1">
                {active.source.imageUrl ? (
                  <OrnamentImage
                    src={active.source.imageUrl}
                    alt={active.source.title}
                    fill
                    sizes="(max-width: 1024px) 40vw, 28vw"
                    className="object-contain"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center font-serif text-xs text-ink/35">
                    No image
                  </div>
                )}
              </div>
              <p className="mt-3 shrink-0 font-mono text-[9px] font-extralight uppercase tracking-[0.12em] text-ink/45">
                {active.titleLabel}
                {active.source.year ? ` · ${active.source.year}` : ""}
              </p>
            </Link>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
