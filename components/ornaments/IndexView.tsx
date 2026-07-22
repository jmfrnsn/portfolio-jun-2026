"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import { ArchiveSourceButton } from "@/components/ornaments/ArchiveSourceButton";
import { OrnamentImage } from "@/components/ornaments/OrnamentImage";
import type { OrnamentFigure } from "@/lib/ornaments/figure-catalog";

type IndexViewProps = {
  figures: OrnamentFigure[];
  isAdmin: boolean;
  onArchiveChange: (sourceId: string, nextArchived: boolean) => void;
};

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

type NavItem = {
  roman: string;
  label: string;
  href: string;
  active?: boolean;
  children?: Array<{ label: string; href: string }>;
};

const NAV_ITEMS: NavItem[] = [
  { roman: "I", label: "Lab", href: "/lab" },
  { roman: "II", label: "Writing", href: "/writing" },
  { roman: "III", label: "Library", href: "/reading" },
  {
    roman: "IV",
    label: "Index",
    href: "/ornaments",
    active: true,
    children: [
      { label: "Specimens", href: "/ornaments" },
      { label: "Sources", href: "/ornaments" },
    ],
  },
  { roman: "V", label: "About", href: "/about" },
  { roman: "VI", label: "Home", href: "/" },
];

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

function specimenBlurb(figure: OrnamentFigure) {
  const fromNotes = figure.source.notes?.trim();
  if (fromNotes) return fromNotes;

  const creator = figure.source.creator || "an anonymous draughtsman";
  const region = figure.source.region || "an unstated region";
  const era = shortEra(figure.source.era);
  return `A ${era.toLowerCase()} plate attributed to ${creator}, from ${region}. Read the contour, the unit of repeat, and the ground reserved around the motif.`;
}

function SpecimenMeta({ figure }: { figure: OrnamentFigure }) {
  const rows = [
    { label: "Collection", value: figure.source.type },
    { label: "Era", value: shortEra(figure.source.era) },
    { label: "Region", value: figure.source.region },
    { label: "Maker", value: figure.source.creator },
    { label: "Date", value: figure.source.year },
  ].filter((row) => Boolean(row.value?.trim()));

  if (rows.length === 0) return null;

  return (
    <dl className="mb-3 space-y-1 font-sans text-[0.62rem] uppercase tracking-[0.12em] text-ink/45">
      {rows.map((row) => (
        <div key={row.label} className="grid grid-cols-[4.5rem_1fr] gap-2">
          <dt className="text-ink/35">{row.label}</dt>
          <dd className="normal-case tracking-[0.02em] text-ink/65">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
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
  const showMeta = figure.index % 2 === 1;

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="ornament-index-cell group relative flex min-h-0 flex-col px-4 py-5 sm:px-5 sm:py-6"
    >
      <Link
        href={`/ornaments/sources/${figure.source.id}`}
        className="flex min-h-0 flex-1 flex-col"
      >
        <header className="mb-4 flex items-baseline justify-between gap-3">
          <span className="font-serif text-sm tracking-[-0.02em] text-ink/55">
            {toRoman(figure.index)}.
          </span>
          <h2 className="text-right font-sans text-[0.65rem] font-medium uppercase tracking-[0.16em] text-ink">
            {figure.titleLabel}
          </h2>
        </header>

        <div className="relative mx-auto mb-4 aspect-[4/5] w-full max-w-[11rem] overflow-hidden sm:max-w-[12.5rem]">
          {figure.source.imageUrl ? (
            <OrnamentImage
              src={figure.source.imageUrl}
              alt={figure.source.title}
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 14vw"
              className="object-contain grayscale transition-[filter,transform] duration-700 ease-out group-hover:scale-[1.02] group-hover:grayscale-0"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-serif text-xs text-ink/30">
              No image
            </div>
          )}
        </div>

        {showMeta ? <SpecimenMeta figure={figure} /> : null}

        <p className="font-serif text-[0.82rem] leading-[1.55] tracking-[-0.02em] text-ink/70">
          {specimenBlurb(figure)}
        </p>
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

  return (
    <div className="ornament-index relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 -mt-10 mb-[-6rem] bg-paper text-ink sm:-mt-14">
      <div className="mx-auto min-h-svh w-full max-w-[90rem] px-4 pb-36 pt-6 sm:px-6 md:px-8 md:pt-8">
        <header className="grid grid-cols-1 items-start gap-4 border-b border-ink/15 pb-4 sm:grid-cols-[1fr_auto_1fr] sm:gap-6 sm:pb-5">
          <Link
            href="/"
            className="font-sans text-[0.65rem] uppercase tracking-[0.22em] text-ink/70 transition-colors hover:text-ink"
          >
            Jade Franson
          </Link>
          <p className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-ink sm:text-center">
            Index
          </p>
          <p className="max-w-[16rem] font-sans text-[0.58rem] uppercase leading-relaxed tracking-[0.14em] text-ink/45 sm:ml-auto sm:text-right">
            A working catalog of historical ornament drawn for the decorative
            arts.
          </p>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[10.5rem_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[12rem_minmax(0,1fr)]">
          <aside className="flex flex-col justify-between gap-10 lg:min-h-[70vh]">
            <nav aria-label="Site">
              <ul className="space-y-3.5">
                {NAV_ITEMS.map((item) => (
                  <li key={item.roman}>
                    <Link
                      href={item.href}
                      className={`flex items-baseline gap-2.5 font-sans text-[0.68rem] uppercase tracking-[0.16em] transition-colors ${
                        item.active
                          ? "text-ink"
                          : "text-ink/45 hover:text-ink/75"
                      }`}
                    >
                      <span className="w-6 shrink-0 text-ink/35">
                        {item.roman}.
                      </span>
                      <span className="inline-flex items-center gap-2">
                        {item.label}
                        {item.active ? (
                          <span
                            className="inline-block h-1 w-1 rounded-full bg-ink"
                            aria-hidden
                          />
                        ) : null}
                      </span>
                    </Link>
                    {item.children?.length ? (
                      <ul className="mt-2 space-y-1.5 pl-[2.1rem]">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <Link
                              href={child.href}
                              className="font-sans text-[0.6rem] uppercase tracking-[0.14em] text-ink/35 transition-colors hover:text-ink/60"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="hidden space-y-1 font-sans text-[0.58rem] uppercase leading-relaxed tracking-[0.12em] text-ink/35 lg:block">
              <p>San Francisco</p>
              <p>
                <Link href="/about" className="transition-colors hover:text-ink/60">
                  About the studio
                </Link>
              </p>
              <p>
                <Link href="/" className="transition-colors hover:text-ink/60">
                  Return home
                </Link>
              </p>
            </div>
          </aside>

          <div className="min-w-0">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mb-10 md:mb-12"
            >
              <h1 className="text-center font-serif text-[2.35rem] tracking-[-0.04em] text-ink md:text-[2.85rem]">
                IV. Index
              </h1>
              <p className="mx-auto mt-6 max-w-xl font-serif text-[0.95rem] leading-[1.65] tracking-[-0.02em] text-ink/65 md:ml-[28%] md:mr-0 md:max-w-none">
                An index of {count} public-domain ornament{" "}
                {count === 1 ? "specimen" : "specimens"}—friezes, grotesques,
                putti, and botanical scrolls collected for study. Each entry is
                a plate for looking: compare contour, repeat, and reserved
                ground across the field.
              </p>
            </motion.div>

            <div className="ornament-index-grid border-y border-ink/15">
              {figures.map((figure, index) => (
                <SpecimenCell
                  key={figure.source.id}
                  figure={figure}
                  isAdmin={isAdmin}
                  onArchiveChange={onArchiveChange}
                  delay={reduceMotion ? 0 : 0.08 + index * 0.04}
                  reduceMotion={reduceMotion}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
