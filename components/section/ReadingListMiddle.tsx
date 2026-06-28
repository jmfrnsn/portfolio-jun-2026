"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { getBookCoverUrl } from "@/lib/book-cover";
import {
  READING_LIST_2025,
  READING_LIST_2026,
  type ReadingEntry2025,
  type ReadingEntry2026,
  type ReadingYear,
} from "@/lib/reading-list";

const COVER_WIDTHS = [
  "min(20rem, 46vw)",
  "min(14rem, 34vw)",
  "min(18rem, 42vw)",
  "min(12rem, 30vw)",
  "min(16rem, 38vw)",
] as const;

type MiddleEntry = {
  name: string;
  leftLabel: string;
  rightLabel: string;
};

function formatIndex(index: number): string {
  return `${String(index + 1).padStart(2, "0")}.`;
}

function mapEntries2026(entries: ReadingEntry2026[]): MiddleEntry[] {
  return entries.map((entry) => ({
    name: entry.name,
    leftLabel: entry.name,
    rightLabel: entry.started.replace(/, \d{4}$/, ""),
  }));
}

function mapEntries2025(entries: ReadingEntry2025[]): MiddleEntry[] {
  return entries.map((entry) => ({
    name: entry.name,
    leftLabel: entry.name,
    rightLabel: entry.genre,
  }));
}

function BookCoverImage({ title, author }: { title: string; author: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative aspect-[4/5] w-full">
      {failed ? (
        <div
          className="h-full w-full bg-ink/[0.06]"
          role="img"
          aria-label={`${title} by ${author}`}
        />
      ) : (
        <Image
          src={getBookCoverUrl(title)}
          alt={`${title} by ${author}`}
          fill
          sizes="(max-width: 768px) 46vw, 320px"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

function MiddleRow({
  entry,
  index,
  author,
}: {
  entry: MiddleEntry;
  index: number;
  author: string;
}) {
  const reduceMotion = useReducedMotion();
  const coverWidth = COVER_WIDTHS[index % COVER_WIDTHS.length]!;
  const delay = index * 0.04;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-6 py-1 sm:gap-x-12 lg:gap-x-20">
      <p className="font-serif text-sm italic leading-snug tracking-[-0.02em] text-ink sm:text-base">
        <span className="text-ink/55">{formatIndex(index)}</span> {entry.leftLabel}
      </p>

      <motion.div
        className="shrink-0"
        style={{ width: coverWidth }}
        initial={reduceMotion ? false : { opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                type: "spring",
                stiffness: 110,
                damping: 20,
                delay,
              }
        }
      >
        <BookCoverImage title={entry.name} author={author} />
      </motion.div>

      <p className="text-right font-serif text-sm italic leading-snug tracking-[-0.02em] text-ink sm:text-base">
        {entry.rightLabel}
      </p>
    </div>
  );
}

type ReadingListMiddleProps = {
  year: ReadingYear;
};

export function ReadingListMiddle({ year }: ReadingListMiddleProps) {
  const is2026 = year === "2026";
  const rawEntries = is2026 ? READING_LIST_2026 : READING_LIST_2025;
  const entries = is2026
    ? mapEntries2026(READING_LIST_2026)
    : mapEntries2025(READING_LIST_2025);

  return (
    <div className="w-full">
      <header className="mb-10 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-end gap-x-6 sm:gap-x-12 lg:gap-x-20">
        <p className="font-serif text-base italic tracking-[-0.02em] text-ink sm:text-lg">
          Reading
        </p>
        <div className="hidden w-px sm:block" aria-hidden="true" />
        <p className="text-right font-serif text-base italic tracking-[-0.02em] text-ink sm:text-lg">
          {is2026 ? "Started" : "Genre"}
        </p>
      </header>

      <div className="flex flex-col">
        {entries.map((entry, index) => (
          <MiddleRow
            key={entry.name}
            entry={entry}
            index={index}
            author={rawEntries[index]?.author ?? ""}
          />
        ))}
      </div>
    </div>
  );
}
