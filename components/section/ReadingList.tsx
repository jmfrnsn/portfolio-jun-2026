"use client";

import { useState } from "react";

import {
  READING_LIST_2025,
  READING_LIST_2026,
  READING_YEARS,
  type ReadingStatus,
  type ReadingYear,
} from "@/lib/reading-list";

function statusClassName(status: ReadingStatus): string {
  if (status === "Done") return "text-ink/60";
  if (status === "In progress") return "text-ink/80";
  return "text-ink/45";
}

function YearTabs({
  year,
  onChange,
}: {
  year: ReadingYear;
  onChange: (year: ReadingYear) => void;
}) {
  return (
    <div className="mb-6 flex gap-4 border-b border-ink/10">
      {READING_YEARS.map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={`-mb-px border-b pb-2 font-mono text-sm font-extralight uppercase tracking-[-0.04375rem] transition-colors ${
            year === value
              ? "border-ink text-ink"
              : "border-transparent text-ink/45 hover:text-ink/70"
          }`}
        >
          {value}
        </button>
      ))}
    </div>
  );
}

function Table2026() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[40rem] border-collapse text-left">
        <thead>
          <tr className="border-b border-ink/10">
            {["Name", "Started", "Author", "Length", "Status"].map((label) => (
              <th
                key={label}
                className="pb-3 pr-4 font-mono text-xs font-extralight uppercase tracking-[0.06em] text-ink/50 last:pr-0"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {READING_LIST_2026.map((entry) => (
            <tr
              key={entry.name}
              className="border-b border-ink/5 last:border-b-0"
            >
              <td className="py-3 pr-4 font-serif text-base tracking-[-0.04375rem] text-ink">
                {entry.name}
              </td>
              <td className="py-3 pr-4 font-mono text-sm font-extralight tracking-[-0.04375rem] text-ink/70">
                {entry.started}
              </td>
              <td className="py-3 pr-4 font-serif text-sm tracking-[-0.04375rem] text-ink/80">
                {entry.author}
              </td>
              <td className="py-3 pr-4 font-mono text-sm font-extralight tracking-[-0.04375rem] text-ink/70">
                {entry.length}
              </td>
              <td
                className={`py-3 font-mono text-sm font-extralight tracking-[-0.04375rem] ${statusClassName(entry.status)}`}
              >
                {entry.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Table2025() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[48rem] border-collapse text-left">
        <thead>
          <tr className="border-b border-ink/10">
            {[
              "Name",
              "Author",
              "Genre",
              "Length",
              "Status",
              "Rating",
            ].map((label) => (
              <th
                key={label}
                className="pb-3 pr-4 font-mono text-xs font-extralight uppercase tracking-[0.06em] text-ink/50 last:pr-0"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {READING_LIST_2025.map((entry) => (
            <tr
              key={entry.name}
              className="border-b border-ink/5 last:border-b-0"
            >
              <td className="py-3 pr-4 font-serif text-base tracking-[-0.04375rem] text-ink">
                {entry.name}
              </td>
              <td className="py-3 pr-4 font-serif text-sm tracking-[-0.04375rem] text-ink/80">
                {entry.author}
              </td>
              <td className="py-3 pr-4 font-mono text-sm font-extralight tracking-[-0.04375rem] text-ink/70">
                {entry.genre}
              </td>
              <td className="py-3 pr-4 font-mono text-sm font-extralight tracking-[-0.04375rem] text-ink/70">
                {entry.length}
              </td>
              <td
                className={`py-3 pr-4 font-mono text-sm font-extralight tracking-[-0.04375rem] ${statusClassName(entry.status)}`}
              >
                {entry.status}
              </td>
              <td className="py-3 font-mono text-sm font-extralight tracking-[-0.04375rem] text-ink/60">
                {entry.rating ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ReadingList() {
  const [year, setYear] = useState<ReadingYear>("2026");

  return (
    <div>
      <YearTabs year={year} onChange={setYear} />
      {year === "2026" ? <Table2026 /> : <Table2025 />}
    </div>
  );
}
