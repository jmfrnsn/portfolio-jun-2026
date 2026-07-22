"use client";

import Link from "next/link";

import { ArchiveSourceButton } from "@/components/ornaments/ArchiveSourceButton";
import { OrnamentImage } from "@/components/ornaments/OrnamentImage";
import { formatTextbookFigLabel } from "@/lib/ornaments/catalog-layouts";
import type { OrnamentFigure } from "@/lib/ornaments/figure-catalog";

type DraftGridViewProps = {
  figures: OrnamentFigure[];
  isAdmin: boolean;
  onArchiveChange: (sourceId: string, nextArchived: boolean) => void;
};

/** Span footprints in major modules (5 fine units). Cycles for variety. */
const MODULE_SPANS = [
  { cols: 2, rows: 3 },
  { cols: 3, rows: 2 },
  { cols: 2, rows: 2 },
  { cols: 3, rows: 3 },
  { cols: 4, rows: 3 },
  { cols: 2, rows: 4 },
  { cols: 3, rows: 2 },
  { cols: 2, rows: 2 },
] as const;

function spanForIndex(index: number) {
  return MODULE_SPANS[index % MODULE_SPANS.length]!;
}

export function DraftGridView({
  figures,
  isAdmin,
  onArchiveChange,
}: DraftGridViewProps) {
  return (
    <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 -mt-4">
      <div className="ornament-draft-sheet relative mx-auto w-full max-w-[96rem] px-3 pb-16 pt-4 sm:px-5 md:px-8">
        <header className="relative mb-6 max-w-xl px-1">
          <p className="font-mono text-[10px] font-extralight uppercase tracking-[0.14em] text-ink/45">
            Draft sheet · 5-unit module
          </p>
          <h1 className="mt-1 font-serif text-2xl tracking-[-0.05em] text-ink md:text-4xl">
            Plate grid
          </h1>
          <p className="mt-2 font-serif text-sm leading-relaxed tracking-[-0.02em] text-ink/55">
            Specimens snapped to the drafting module—fine units and major
            crosses, plates occupying whole cells.
          </p>
        </header>

        <ul className="ornament-draft-modules">
          {figures.map((figure, index) => {
            const span = spanForIndex(index);
            return (
              <li
                key={figure.source.id}
                className="group relative min-h-0 min-w-0"
                style={{
                  gridColumn: `span ${span.cols}`,
                  gridRow: `span ${span.rows}`,
                }}
              >
                <Link
                  href={`/ornaments/sources/${figure.source.id}`}
                  className="relative flex h-full min-h-0 flex-col border border-ink/15 bg-transparent p-[calc(var(--draft-unit)*0.5)]"
                >
                  <div className="relative min-h-0 flex-1 overflow-hidden">
                    {figure.source.imageUrl ? (
                      <OrnamentImage
                        src={figure.source.imageUrl}
                        alt={figure.source.title}
                        fill
                        sizes={`${span.cols * 10}vw`}
                        className="object-contain object-center p-1"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center font-mono text-[10px] text-ink/35">
                        No image
                      </div>
                    )}
                  </div>
                  <figcaption className="mt-1 shrink-0 border-t border-ink/10 pt-1 font-serif text-[0.75rem] leading-snug tracking-[-0.02em] text-ink">
                    <span className="font-mono text-[0.65rem] uppercase tracking-[0.08em] text-fig">
                      {formatTextbookFigLabel(figure.index)}
                    </span>{" "}
                    <em>{figure.titleLabel}</em>
                  </figcaption>
                </Link>
                {isAdmin ? (
                  <div className="absolute right-1 top-1 z-10">
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
    </div>
  );
}
