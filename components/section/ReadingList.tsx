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

function entryKey(entry: ReadingDisplayEntry) {
  return `${entry.year}-${entry.name}`;
}

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
  const ratingCopy =
    typeof entry.rating === "number" ? ` Rated ${entry.rating}/10.` : "";

  return `${entry.name} is a ${entry.length.toLowerCase()} by ${entry.author}.${
    primaryContext ? ` Filed under ${primaryContext}.` : ""
  } Current shelf status: ${entry.status.toLowerCase()}.${ratingCopy}`;
}

function normalize2026(
  entry: ReadingEntry2026,
  index: number,
): ReadingDisplayEntry {
  return { ...entry, year: "2026", index };
}

function normalize2025(
  entry: ReadingEntry2025,
  index: number,
): ReadingDisplayEntry {
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
        Hover a read ↗
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
    <div className="relative aspect-[4/5] min-h-56 overflow-hidden border border-ink/15 bg-highlight text-ink shadow-[inset_0_0_0_0.45rem_rgba(39,48,28,0.04)]">
      <div className="absolute inset-x-3 top-3 flex items-center justify-between border-b border-ink/20 pb-2 font-mono text-[0.45rem] uppercase tracking-[0.12em] text-ink/45">
        <span>{entry.length}</span>
        <span>{entry.year}</span>
      </div>
      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 text-center font-serif text-5xl leading-none tracking-[-0.24rem] text-ink/70">
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

function ReadingPreview({ entry }: { entry: ReadingDisplayEntry }) {
  return (
    <aside className="top-8 md:sticky" aria-live="polite">
      <div className="grid gap-5 border border-ink/10 bg-paper/80 p-3 shadow-[0_1.25rem_4rem_rgba(39,48,28,0.06)] backdrop-blur md:grid-cols-[minmax(12rem,0.55fr)_minmax(0,1fr)] md:p-4 xl:p-5">
        <ReadingCover entry={entry} />
        <div className="flex flex-col justify-end">
          <p className="font-mono text-[0.625rem] font-extralight uppercase tracking-[0.08em] text-ink/45">
            {entryCode(entry)} · {String(entry.index + 1).padStart(2, "0")}
          </p>
          <h2 className="mt-3 font-mono text-lg font-extralight uppercase leading-tight tracking-[-0.04375rem] text-ink md:text-xl">
            {entry.name}
          </h2>
          <p className="mt-2 font-serif text-base leading-snug tracking-[-0.04375rem] text-ink/70">
            {entryNote(entry)}
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-x-5 gap-y-4">
            <MetaItem label="Author" value={entry.author} />
            <MetaItem label="Form" value={entry.length} />
            <MetaItem label="Status" value={entry.status} />
            <MetaItem label="Started" value={entry.started} />
            <MetaItem label="Genre" value={entry.genre} />
            <MetaItem
              label="Rating"
              value={entry.rating ? `${entry.rating}/10` : undefined}
            />
          </dl>
        </div>
      </div>
    </aside>
  );
}

function ReadingRow({
  entry,
  isActive,
  onActivate,
}: {
  entry: ReadingDisplayEntry;
  isActive: boolean;
  onActivate: () => void;
}) {
  return (
    <article
      tabIndex={0}
      onFocus={onActivate}
      onMouseEnter={onActivate}
      className={`group border-b border-ink/10 outline-none transition-colors last:border-b-0 hover:bg-highlight/70 focus-visible:bg-highlight/70 focus-visible:ring-1 focus-visible:ring-ink/30 ${
        isActive ? "bg-highlight/70" : ""
      }`}
    >
      <div className="grid grid-cols-[2.5rem_minmax(4.5rem,0.35fr)_minmax(0,1fr)_1.25rem] items-center gap-3 py-2 font-mono text-xs font-extralight uppercase tracking-[-0.04375rem] text-ink/75 md:grid-cols-[3rem_minmax(7rem,0.25fr)_minmax(0,1fr)_8rem_1.25rem] xl:grid-cols-[4rem_minmax(8rem,0.22fr)_minmax(0,1fr)_10rem_1.25rem]">
        <span className="text-ink/45">
          {String(entry.index + 1).padStart(2, "0")}
        </span>
        <span className="text-ink/65">{entryCode(entry)}</span>
        <h2 className="truncate text-ink">{entry.name}</h2>
        <span className={`hidden md:block ${statusClassName(entry.status)}`}>
          {entry.status}
        </span>
        <span
          className={`text-right transition-transform ${
            isActive ? "rotate-45 text-ink/70" : "text-ink/45 group-hover:rotate-45"
          }`}
        >
          +
        </span>
      </div>
    </article>
  );
}

export function ReadingList() {
  const [year, setYear] = useState<ReadingYear>("2026");
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const entries =
    year === "2026"
      ? READING_LIST_2026.map(normalize2026)
      : READING_LIST_2025.map(normalize2025);
  const activeEntry =
    entries.find((entry) => entryKey(entry) === activeKey) ?? entries[0];

  return (
    <div className="relative left-1/2 w-[calc(100vw-1.5rem)] -translate-x-1/2 md:w-[calc(100vw-4rem)]">
      <div className="p-0 md:p-2 xl:p-4">
        <div className="border-y border-ink/10 py-4 md:py-6 xl:py-8">
          <YearTabs year={year} onChange={setYear} />
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.56fr)_minmax(26rem,0.44fr)] xl:gap-10">
            <div className="border-y border-ink/10">
              {entries.map((entry) => {
                const key = entryKey(entry);
                return (
                  <ReadingRow
                    key={key}
                    entry={entry}
                    isActive={entryKey(activeEntry) === key}
                    onActivate={() => setActiveKey(key)}
                  />
                );
              })}
            </div>
            <ReadingPreview entry={activeEntry} />
          </div>
        </div>
      </div>
    </div>
  );
}
