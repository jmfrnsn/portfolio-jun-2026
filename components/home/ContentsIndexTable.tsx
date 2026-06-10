"use client";

import Link from "next/link";

import { contents } from "@/components/home/contents-data";
import { HOME_LAYOUT } from "@/lib/home-layout";
import { getSection, sectionHref } from "@/lib/site-sections";

function toTitleCase(value: string): string {
  return value
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function ContentsIndexTable() {
  const { typography } = HOME_LAYOUT;

  return (
    <div style={{ fontSize: typography.contentsFontSize }}>
      <div className="grid grid-cols-[2.25rem_minmax(0,1fr)_4.5rem] items-end gap-x-4 border-b border-ink/12 pb-2 font-mono text-[0.625rem] font-extralight uppercase tracking-[0.12em] text-ink/45 sm:grid-cols-[2.5rem_minmax(0,1fr)_5rem] sm:text-[0.6875rem]">
        <span>No.</span>
        <span>Title</span>
        <span className="text-right">Section</span>
      </div>

      <ul className="divide-y divide-ink/8">
        {contents.map((entry) => {
          const section = getSection(entry.slug);
          const category = section?.description ?? entry.pages;

          return (
            <li key={entry.number}>
              <Link
                href={sectionHref(entry.slug)}
                className="group grid grid-cols-[2.25rem_minmax(0,1fr)_4.5rem] items-baseline gap-x-4 py-2.5 transition-colors hover:bg-highlight sm:grid-cols-[2.5rem_minmax(0,1fr)_5rem] sm:py-3"
              >
                <span className="font-sans text-sm tracking-[-0.04375rem] text-ink/55">
                  {entry.number}
                </span>
                <span className="min-w-0 font-serif tracking-[-0.04375rem] text-ink group-hover:text-ink">
                  {toTitleCase(entry.title)}
                </span>
                <span className="text-right font-mono text-[0.8125rem] font-extralight tracking-[-0.04375rem] text-ink/55">
                  {entry.pages}
                </span>
                <span className="col-span-3 -mt-1 font-mono text-[0.6875rem] font-extralight tracking-[-0.02em] text-ink/40 sm:hidden">
                  {category}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
