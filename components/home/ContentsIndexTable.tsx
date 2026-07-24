"use client";

import Link from "next/link";

import { HOME_LAYOUT } from "@/lib/home-layout";
import { formatPageYear, getSitePages } from "@/lib/site-pages";

function toTitleCase(value: string): string {
  return value
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function ContentsIndexTable() {
  const { typography } = HOME_LAYOUT;
  const pages = getSitePages();

  return (
    <div style={{ fontSize: typography.contentsFontSize }}>
      <div className="grid grid-cols-[minmax(0,1fr)_4.5rem] items-end gap-x-4 border-b border-ink/12 pb-2 font-mono text-[0.625rem] font-extralight uppercase tracking-[0.12em] text-ink/45 sm:grid-cols-[minmax(0,1fr)_5rem] sm:text-[0.6875rem]">
        <span>Title</span>
        <span className="text-right">Year</span>
      </div>

      <ul className="divide-y divide-ink/8">
        {pages.map((page) => (
          <li key={page.id}>
            <Link
              href={page.href}
              className="group grid grid-cols-[minmax(0,1fr)_4.5rem] items-baseline gap-x-4 py-2.5 transition-colors hover:bg-highlight sm:grid-cols-[minmax(0,1fr)_5rem] sm:py-3"
            >
              <span className="min-w-0 font-serif tracking-[-0.04375rem] text-ink group-hover:text-ink">
                {toTitleCase(page.title)}
              </span>
              <span className="text-right font-mono text-[0.8125rem] font-extralight tracking-[-0.04375rem] text-ink/55">
                {formatPageYear(page.publishedAt)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
