"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { ArchiveSourceButton } from "@/components/ornaments/ArchiveSourceButton";
import { IndexListView } from "@/components/ornaments/IndexListView";
import { OrnamentImage } from "@/components/ornaments/OrnamentImage";
import type { OrnamentFigure } from "@/lib/ornaments/figure-catalog";

type IndexViewProps = {
  figures: OrnamentFigure[];
  isAdmin: boolean;
  onArchiveChange: (sourceId: string, nextArchived: boolean) => void;
};

type IndexDisplayMode = "grid" | "list";

const INDEX_DISPLAY_STORAGE_KEY = "ornament-index-display";

function isIndexDisplayMode(value: unknown): value is IndexDisplayMode {
  return value === "grid" || value === "list";
}

const ROMAN = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
  "XIII",
  "XIV",
  "XV",
  "XVI",
  "XVII",
  "XVIII",
  "XIX",
  "XX",
  "XXI",
  "XXII",
  "XXIII",
  "XXIV",
  "XXV",
  "XXVI",
  "XXVII",
  "XXVIII",
  "XXIX",
  "XXX",
] as const;

function toRoman(index: number) {
  return ROMAN[index] ?? String(index + 1);
}

function shortEra(era: string) {
  return (
    era
      .replace(/\s*\([^)]*\)\s*/g, "")
      .replace(/\.$/, "")
      .trim() || "Ornament"
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[3.25rem_minmax(0,1fr)] items-baseline gap-x-2">
      <dt className="font-mono text-[9px] font-extralight uppercase tracking-[0.12em] text-ink/35">
        {label}
      </dt>
      <dd className="truncate font-serif text-[0.8rem] leading-snug tracking-[-0.02em] text-ink/80">
        {value}
      </dd>
    </div>
  );
}

function SpecimenCell({
  figure,
  isAdmin,
  onArchiveChange,
  delay,
  reduceMotion,
}: {
  figure: OrnamentFigure;
  isAdmin: boolean;
  onArchiveChange: (sourceId: string, nextArchived: boolean) => void;
  delay: number;
  reduceMotion: boolean;
}) {
  const era = shortEra(figure.source.era);
  const region = figure.source.region?.trim() || "";
  const year = figure.source.year?.trim() || "";
  const creator = figure.source.creator?.trim() || "";
  const notes = figure.source.notes?.trim() || "";

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="ornament-index-cell group relative flex h-full min-h-0 flex-col"
    >
      <Link
        href={`/ornaments/sources/${figure.source.id}`}
        className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-0"
      >
        <header className="flex items-baseline justify-between gap-3 border-b border-ink/10 px-3.5 py-3 sm:px-4">
          <span className="shrink-0 font-serif text-sm tracking-[-0.02em] text-ink/50">
            {toRoman(figure.index)}.
          </span>
          <h2 className="min-w-0 text-right font-sans text-[0.62rem] font-medium uppercase leading-snug tracking-[0.14em] text-ink">
            <span className="line-clamp-2">{figure.titleLabel}</span>
          </h2>
        </header>

        <div className="relative flex min-h-[11rem] items-center justify-center px-3 py-4 sm:min-h-[13rem] sm:px-4">
          <div className="relative aspect-[4/5] h-full max-h-[16rem] w-full max-w-[11rem]">
            {figure.source.imageUrl ? (
              <OrnamentImage
                src={figure.source.imageUrl}
                alt={figure.source.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                className="object-contain grayscale transition-[filter,transform] duration-700 ease-out group-hover:scale-[1.02] group-hover:grayscale-0"
              />
            ) : (
              <div className="flex h-full items-center justify-center font-serif text-xs text-ink/30">
                No image
              </div>
            )}
          </div>
        </div>

        <footer className="mt-auto border-t border-ink/10 px-3.5 py-3 sm:px-4">
          <dl className="flex flex-col gap-1.5">
            {era ? <MetaRow label="Era" value={era} /> : null}
            {region ? <MetaRow label="Place" value={region} /> : null}
            {year ? <MetaRow label="Date" value={year} /> : null}
            {creator ? <MetaRow label="By" value={creator} /> : null}
          </dl>
          {notes ? (
            <p className="mt-3 line-clamp-2 border-t border-ink/8 pt-2.5 font-serif text-[0.72rem] leading-[1.4] tracking-[-0.02em] text-ink/45">
              {notes}
            </p>
          ) : null}
        </footer>
      </Link>

      {isAdmin ? (
        <div className="absolute right-2 top-2 z-10">
          <ArchiveSourceButton
            sourceId={figure.source.id}
            archived={figure.source.notionStatus === "Archived"}
            onCompleted={(nextArchived) =>
              onArchiveChange(figure.source.id, nextArchived)
            }
          />
        </div>
      ) : null}
    </motion.article>
  );
}

export function IndexView({
  figures,
  isAdmin,
  onArchiveChange,
}: IndexViewProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const count = figures.length;
  const [display, setDisplay] = useState<IndexDisplayMode>("grid");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(INDEX_DISPLAY_STORAGE_KEY);
      if (isIndexDisplayMode(stored)) setDisplay(stored);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(INDEX_DISPLAY_STORAGE_KEY, display);
    } catch {
      // ignore
    }
  }, [display]);

  const eraList = useMemo(() => {
    const seen = new Set<string>();
    const eras: string[] = [];
    for (const figure of figures) {
      const era = shortEra(figure.source.era).toUpperCase();
      if (!era || seen.has(era)) continue;
      seen.add(era);
      eras.push(era);
    }
    return eras;
  }, [figures]);

  return (
    <div className="ornament-index relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 pb-10">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full border-b border-ink/10 px-5 pb-6 sm:px-8 md:px-12 lg:px-16"
      >
        <div
          className="absolute right-5 top-0 flex border border-ink/15 sm:right-8 md:right-12 lg:right-16"
          role="group"
          aria-label="Index display"
        >
          {(
            [
              { id: "grid", label: "Grid" },
              { id: "list", label: "List" },
            ] as const
          ).map((option) => {
            const selected = display === option.id;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setDisplay(option.id)}
                className={`cursor-pointer px-3 py-1.5 font-mono text-[10px] font-extralight uppercase tracking-[0.12em] transition-colors ${
                  selected
                    ? "bg-ink text-paper"
                    : "bg-paper text-ink/55 hover:bg-highlight/70 hover:text-ink"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="grid w-full grid-cols-1 gap-4 pt-10 font-mono text-[10px] font-extralight uppercase leading-[1.45] tracking-[0.08em] text-ink/55 sm:grid-cols-12 sm:gap-x-6 sm:pt-0">
          <div className="sm:col-span-3">
            <p>Historical ornament</p>
            <p>Research catalog</p>
            <p className="mt-2 text-ink/35">Public domain plates</p>
          </div>
          <div className="sm:col-span-2 sm:col-start-5">
            <p>Index</p>
            <p className="mt-2 text-ink/35">
              {count} {count === 1 ? "specimen" : "specimens"}
            </p>
          </div>
          <div className="sm:col-span-5 sm:col-start-8 sm:pr-28">
            <p className="text-pretty">
              {eraList.length > 0
                ? eraList.join(" / ")
                : "Renaissance / Baroque / Rococo / Modern"}
            </p>
            <p className="mt-2 max-w-md text-pretty text-ink/35">
              Plates for looking — compare contour, repeat, and reserved ground
              across the field.
            </p>
          </div>
        </div>
      </motion.div>

      {display === "list" ? (
        <IndexListView
          figures={figures}
          isAdmin={isAdmin}
          onArchiveChange={onArchiveChange}
        />
      ) : (
        <div className="ornament-index-grid">
          {figures.map((figure, index) => (
            <SpecimenCell
              key={figure.source.id}
              figure={figure}
              isAdmin={isAdmin}
              onArchiveChange={onArchiveChange}
              delay={reduceMotion ? 0 : Math.min(0.08 + index * 0.03, 0.9)}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>
      )}
    </div>
  );
}
