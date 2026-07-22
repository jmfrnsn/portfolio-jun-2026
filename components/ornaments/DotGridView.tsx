"use client";

import Link from "next/link";
import { useMemo } from "react";

import { ArchiveSourceButton } from "@/components/ornaments/ArchiveSourceButton";
import { OrnamentImage } from "@/components/ornaments/OrnamentImage";
import { formatTextbookFigLabel } from "@/lib/ornaments/catalog-layouts";
import type { OrnamentFigure } from "@/lib/ornaments/figure-catalog";

type DotGridViewProps = {
  figures: OrnamentFigure[];
  isAdmin: boolean;
  onArchiveChange: (sourceId: string, nextArchived: boolean) => void;
};

type ScatterCard = {
  figure: OrnamentFigure;
  left: number; // % of field width
  top: number; // rem
  width: number; // rem
  height: number; // rem
};

/** Deterministic PRNG so scatter stays put across renders. */
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(value: string) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function overlaps(
  a: { left: number; top: number; width: number; height: number },
  b: { left: number; top: number; width: number; height: number },
  fieldWidthRem: number,
) {
  const ax0 = (a.left / 100) * fieldWidthRem;
  const ax1 = ax0 + a.width;
  const ay0 = a.top;
  const ay1 = ay0 + a.height + 2.2; // caption allowance
  const bx0 = (b.left / 100) * fieldWidthRem;
  const bx1 = bx0 + b.width;
  const by0 = b.top;
  const by1 = by0 + b.height + 2.2;

  const pad = 3.25; // rem — keep early scatter from clustering
  return !(
    ax1 + pad <= bx0 ||
    bx1 + pad <= ax0 ||
    ay1 + pad <= by0 ||
    by1 + pad <= ay0
  );
}

/**
 * Scatter plates like a lookbook: wide left% jitter, mixed sizes, push-down
 * on collision so nothing stacks — still reads spontaneous.
 */
function scatterFigures(figures: OrnamentFigure[]): {
  cards: ScatterCard[];
  fieldHeight: number;
} {
  const fieldWidthRem = 72;
  const cards: ScatterCard[] = [];
  let fieldHeight = 24;

  // Prefer a few “lanes” so the cloud spans the page, then jitter hard inside.
  const laneLefts = [4, 18, 34, 52, 68, 82];

  /**
   * First plates get far-apart anchors (not the same corner), so the top of
   * the field reads scattered instead of a tight cluster.
   * [leftMin, leftMax, topMin, topMax]
   */
  const openingAnchors: Array<[number, number, number, number]> = [
    [3, 7, 0.4, 1.6], // top-left
    [64, 80, 0.5, 5], // top-right
    [36, 54, 8, 16], // mid, dropped
    [10, 26, 18, 28], // left, well below #1
    [70, 86, 12, 22], // far right mid
  ];

  figures.forEach((figure, index) => {
    const rand = mulberry32(hashString(figure.source.id) ^ (index * 2654435761));
    const width = 8.5 + rand() * 5.5; // 8.5–14 rem
    const height = 9 + rand() * 7; // 9–16 rem

    let placed: ScatterCard | null = null;

    const anchor = openingAnchors[index];
    if (anchor) {
      const [leftMin, leftMax, topMin, topMax] = anchor;
      const candidate = {
        figure,
        left: leftMin + rand() * (leftMax - leftMin),
        top: topMin + rand() * (topMax - topMin),
        width: Math.min(width, 12.5),
        height: Math.min(Math.max(height, 10), 15),
      };
      const hits = cards.some((card) =>
        overlaps(candidate, card, fieldWidthRem),
      );
      if (!hits) {
        placed = candidate;
      }
    }

    for (let attempt = 0; attempt < 40 && !placed; attempt += 1) {
      // After the opening band, bias away from the far-left lane so #2+
      // don’t re-cluster under the first plate.
      const lanePool =
        index < 6 ? laneLefts.filter((_, i) => i !== 0 || index > 3) : laneLefts;
      const lane = lanePool[Math.floor(rand() * lanePool.length)]!;
      const left = Math.min(
        88 - (width / fieldWidthRem) * 100,
        Math.max(2, lane + (rand() - 0.5) * 16),
      );

      // Wider vertical gaps up top; still noisy further down.
      const top =
        (index < 5 ? 4 : 1) +
        index * (3.4 + rand() * 3.6) +
        (rand() - 0.25) * 12 +
        attempt * 4;

      const candidate = { figure, left, top, width, height };
      const hits = cards.some((card) => overlaps(candidate, card, fieldWidthRem));
      if (!hits) {
        placed = candidate;
      }
    }

    if (!placed) {
      // Fallback: park below everything with a random x.
      const rand2 = mulberry32(hashString(figure.source.id) + 99);
      placed = {
        figure,
        left: 6 + rand2() * 70,
        top: fieldHeight + 2 + rand2() * 4,
        width,
        height,
      };
    }

    cards.push(placed);
    fieldHeight = Math.max(fieldHeight, placed.top + placed.height + 4);
  });

  return { cards, fieldHeight };
}

export function DotGridView({
  figures,
  isAdmin,
  onArchiveChange,
}: DotGridViewProps) {
  const eraList = useMemo(() => {
    const seen = new Set<string>();
    const eras: string[] = [];
    for (const figure of figures) {
      const era = figure.source.era
        .replace(/\s*\([^)]*\)\s*/g, "")
        .replace(/\.$/, "")
        .trim()
        .toUpperCase();
      if (!era || seen.has(era)) continue;
      seen.add(era);
      eras.push(era);
    }
    return eras;
  }, [figures]);

  const { cards, fieldHeight } = useMemo(
    () => scatterFigures(figures),
    [figures],
  );

  return (
    <div className="ornament-dot-sheet relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 pb-16">
      <div className="relative z-10 mb-8 w-full border-b border-ink/10 px-5 pb-6 sm:px-8 md:px-12 lg:px-16">
        <div className="grid w-full grid-cols-1 gap-4 font-mono text-[10px] font-extralight uppercase leading-[1.45] tracking-[0.08em] text-ink/55 sm:grid-cols-12 sm:gap-x-6">
          <div className="sm:col-span-3">
            <p>Historical ornament</p>
            <p>Research catalog</p>
            <p className="mt-2 text-ink/35">Public domain plates</p>
          </div>
          <div className="sm:col-span-2 sm:col-start-5">
            <p>Index</p>
            <p className="mt-2 text-ink/35">Plates / Motifs / Sources</p>
          </div>
          <div className="sm:col-span-5 sm:col-start-8">
            <p className="text-pretty">
              {eraList.length > 0
                ? eraList.join(" / ")
                : "Renaissance / Baroque / Rococo / Modern"}
            </p>
            <p className="mt-2 max-w-md text-pretty text-ink/35">
              Specimens scattered on the lattice — irregular, not a shelf.
            </p>
          </div>
        </div>
      </div>

      <div className="ornament-dot-bleed relative">
        <div
          className="ornament-dot-scatter relative mx-auto w-full max-w-[96rem] px-4 sm:px-6 md:px-10"
          style={{ height: `${fieldHeight}rem` }}
        >
          {cards.map((card) => (
            <article
              key={card.figure.source.id}
              className="group absolute z-[1]"
              style={{
                left: `${card.left}%`,
                top: `${card.top}rem`,
                width: `${card.width}rem`,
              }}
            >
              <Link
                href={`/ornaments/sources/${card.figure.source.id}`}
                className="flex flex-col"
              >
                <div
                  className="ornament-dot-plate relative w-full"
                  style={{ height: `${card.height}rem` }}
                >
                  {card.figure.source.imageUrl ? (
                    <OrnamentImage
                      src={card.figure.source.imageUrl}
                      alt={card.figure.source.title}
                      fill
                      sizes={`${card.width}rem`}
                      blend="normal"
                      className="object-contain object-center"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center font-mono text-[10px] text-ink/30">
                      —
                    </div>
                  )}
                </div>
                <p className="mt-2 max-w-full font-mono text-[9px] font-extralight uppercase leading-snug tracking-[0.1em] text-ink/55">
                  (
                  {formatTextbookFigLabel(card.figure.index).replace(
                    /\.$/,
                    "",
                  )}{" "}
                  {card.figure.titleLabel})
                </p>
              </Link>
              {isAdmin ? (
                <div className="absolute right-0 top-0 z-10">
                  <ArchiveSourceButton
                    sourceId={card.figure.source.id}
                    archived={card.figure.source.notionStatus === "Archived"}
                    onCompleted={(nextArchived) =>
                      onArchiveChange(card.figure.source.id, nextArchived)
                    }
                  />
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
