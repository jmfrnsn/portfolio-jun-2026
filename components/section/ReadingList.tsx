"use client";

import { useState } from "react";

import {
  READING_LIST_2025,
  READING_LIST_2026,
  READING_YEARS,
  type ReadingEntry2025,
  type ReadingEntry2026,
  type ReadingStatus,
  type ReadingYear,
} from "@/lib/reading-list";

function statusClassName(status: ReadingStatus): string {
  if (status === "Done") return "text-ink/60";
  if (status === "In progress") return "text-ink/80";
  return "text-ink/45";
}

type ReadingDisplayEntry = {
  name: string;
  author: string;
  length: string;
  status: ReadingStatus;
  year: ReadingYear;
  index: number;
  started?: string;
  genre?: string;
  rating?: number;
};

function entryCode(entry: ReadingDisplayEntry) {
  return `#${entry.year.slice(2)}${String(entry.index + 1).padStart(2, "0")}`;
}

function entryInitials(name: string) {
  return name
    .replace(/#\d+/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function entryNote(entry: ReadingDisplayEntry) {
  const primaryContext = entry.genre ?? entry.started;
  const ratingCopy = typeof entry.rating === "number" ? ` Rated ${entry.rating}/10.` : "";

  return `${entry.name} is a ${entry.length.toLowerCase()} by ${entry.author}.${
    primaryContext ? ` Filed under ${primaryContext}.` : ""
  } Current shelf status: ${entry.status.toLowerCase()}.${ratingCopy}`;
}

function normalize2026(entry: ReadingEntry2026, index: number): ReadingDisplayEntry {
  return { ...entry, year: "2026", index };
}

function normalize2025(entry: ReadingEntry2025, index: number): ReadingDisplayEntry {
  return { ...entry, year: "2025", index };
}

function YearTabs({
  year,
  onChange,
}: {
  year: ReadingYear;
  onChange: (year: ReadingYear) => void;
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4 border-b border-ink/10 pb-3">
      <div className="flex rounded-full border border-ink/30 p-1">
        {READING_YEARS.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={`rounded-full px-3 py-1 font-mono text-[0.625rem] font-extralight uppercase leading-none tracking-[-0.04375rem] transition-colors ${
              year === value
                ? "bg-ink text-paper"
                : "text-ink/55 hover:text-ink"
            }`}
          >
            {value}
          </button>
        ))}
      </div>
      <p className="font-mono text-[0.625rem] font-extralight uppercase tracking-[0.08em] text-ink/45">
        Filters ↗
      </p>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value?: string | number }) {
  return (
    <div>
      <dt className="font-mono text-[0.58rem] font-extralight uppercase tracking-[0.08em] text-ink/45">
        {label}
      </dt>
      <dd className="mt-1 font-mono text-xs font-extralight tracking-[-0.04375rem] text-ink/70">
        {value ?? "—"}
      </dd>
    </div>
  );
}

function ReadingCover({ entry }: { entry: ReadingDisplayEntry }) {
  return (
    <div className="relative aspect-[4/5] min-h-36 overflow-hidden border border-ink/15 bg-highlight text-ink shadow-[inset_0_0_0_0.45rem_rgba(39,48,28,0.04)]">
      <div className="absolute inset-x-3 top-3 flex items-center justify-between border-b border-ink/20 pb-2 font-mono text-[0.45rem] uppercase tracking-[0.12em] text-ink/45">
        <span>{entry.length}</span>
        <span>{entry.year}</span>
      </div>
      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 text-center font-serif text-4xl leading-none tracking-[-0.2rem] text-ink/70">
        {entryInitials(entry.name)}
      </div>
      <div className="absolute inset-x-3 bottom-3">
        <p className="font-mono text-[0.55rem] uppercase leading-tight tracking-[-0.04375rem] text-ink/55">
          {entry.name}
        </p>
        <p className="mt-1 font-serif text-[0.65rem] leading-tight tracking-[-0.04375rem] text-ink/45">
          {entry.author}
        </p>
      </div>
    </div>
  );
}

function ReadingRow({ entry }: { entry: ReadingDisplayEntry }) {
  return (
    <article
      tabIndex={0}
      className="group border-b border-ink/10 outline-none transition-colors last:border-b-0 hover:bg-highlight/70 focus-visible:bg-highlight/70 focus-visible:ring-1 focus-visible:ring-ink/30"
    >
      <div className="grid grid-cols-[2.5rem_minmax(4.5rem,0.35fr)_minmax(0,1fr)_1.25rem] items-center gap-3 py-2 font-mono text-xs font-extralight uppercase tracking-[-0.04375rem] text-ink/75 md:grid-cols-[3rem_minmax(8rem,0.25fr)_minmax(0,1fr)_10rem_1.25rem] xl:grid-cols-[4rem_minmax(10rem,0.22fr)_minmax(0,1fr)_12rem_1.25rem]">
        <span className="text-ink/45">{String(entry.index + 1).padStart(2, "0")}</span>
        <span className="text-ink/65">{entryCode(entry)}</span>
        <h2 className="truncate text-ink">{entry.name}</h2>
        <span className={`hidden md:block ${statusClassName(entry.status)}`}>
          {entry.status}
        </span>
        <span className="text-right text-ink/45 transition-transform group-hover:rotate-45 group-focus-visible:rotate-45">
          +
        </span>
      </div>

      <div className="grid max-h-0 grid-cols-1 gap-4 overflow-hidden opacity-0 transition-[max-height,opacity,padding] duration-300 ease-out group-hover:max-h-[34rem] group-hover:pb-6 group-hover:pt-3 group-hover:opacity-100 group-focus-within:max-h-[34rem] group-focus-within:pb-6 group-focus-within:pt-3 group-focus-within:opacity-100 md:grid-cols-[minmax(8rem,0.75fr)_minmax(0,1fr)_minmax(8rem,0.8fr)] md:gap-6">
        <ReadingCover entry={entry} />

        <div className="flex flex-col justify-end">
          <p className="max-w-sm font-serif text-sm leading-snug tracking-[-0.04375rem] text-ink/70">
            {entryNote(entry)}
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-3">
            <MetaItem label="Author" value={entry.author} />
            <MetaItem label="Form" value={entry.length} />
            <MetaItem label="Status" value={entry.status} />
            <MetaItem label="Started" value={entry.started} />
            <MetaItem label="Genre" value={entry.genre} />
            <MetaItem label="Rating" value={entry.rating ? `${entry.rating}/10` : undefined} />
          </dl>
        </div>

        <div className="hidden items-end justify-end md:flex">
          <div className="aspect-[3/4] w-full max-w-36 border border-ink/15 p-3 text-ink/45">
            <div className="h-full border border-ink/10 p-3">
              <p className="font-mono text-[0.55rem] uppercase leading-tight tracking-[0.08em]">
                Reading note
              </p>
              <p className="mt-12 font-serif text-lg leading-none tracking-[-0.08rem] text-ink/60">
                {entry.author.split(" ").at(-1)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ReadingList() {
  const [year, setYear] = useState<ReadingYear>("2026");

  return (
    <div className="relative left-1/2 w-[calc(100vw-1.5rem)] -translate-x-1/2 md:w-[calc(100vw-4rem)]">
      <div className="p-0 md:p-2 xl:p-4">
        <div className="border-y border-ink/10 py-4 md:py-6 xl:py-8">
          <YearTabs year={year} onChange={setYear} />
          <div className="border-y border-ink/10">
            {(year === "2026"
              ? READING_LIST_2026.map(normalize2026)
              : READING_LIST_2025.map(normalize2025)
            ).map((entry) => (
              <ReadingRow key={`${entry.year}-${entry.name}`} entry={entry} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
