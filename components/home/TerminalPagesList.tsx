"use client";

import {
  SlidingHighlightList,
  SlidingHighlightRow,
} from "@/components/shared/SlidingHighlightRows";
import {
  formatListingName,
  formatPageYear,
  getSitePages,
} from "@/lib/site-pages";
import { useMinWidthMd } from "@/lib/use-min-width-md";

type TerminalPagesListProps = {
  className?: string;
};

export function TerminalPagesList({ className = "" }: TerminalPagesListProps) {
  const isMd = useMinWidthMd();
  const pages = getSitePages();
  const padX = isMd ? 10 : 12;

  return (
    <div className={`w-full font-mono ${className}`.trim()}>
      <div className="border border-ink/12 bg-paper">
        <div className="border-b border-ink/10 px-3 py-2.5 text-[11px] font-extralight uppercase tracking-[0.1em] text-ink/45 sm:px-3.5">
          <span className="text-ink/70">jade@home</span>
          <span className="text-ink/35">:</span>
          <span className="text-ink/55">~</span>
          <span className="text-ink/35">$ </span>
          <span className="normal-case tracking-[0.04em] text-ink/55">
            ls -1
          </span>
        </div>

        <SlidingHighlightList
          className="flex w-full flex-col"
          style={{
            gap: 0,
            fontSize: isMd ? 13 : 12,
          }}
        >
          {pages.map((page) => {
            const name = formatListingName(page);
            const year = formatPageYear(page.publishedAt);

            return (
              <SlidingHighlightRow
                key={page.id}
                href={page.href}
                className="group/term gap-0 !items-stretch"
                style={{
                  paddingLeft: padX,
                  paddingRight: padX,
                  paddingTop: 7,
                  paddingBottom: 7,
                }}
              >
                <span className="flex w-full min-w-0 items-baseline justify-between gap-4 font-extralight uppercase tracking-[0.06em] text-ink">
                  <span className="flex min-w-0 items-baseline gap-2">
                    <span
                      aria-hidden
                      className="inline-block w-3 shrink-0 text-ink opacity-0 transition-opacity duration-150 group-hover/term:opacity-100 group-focus-within/term:opacity-100"
                    >
                      &gt;
                    </span>
                    <span className="truncate normal-case tracking-[0.02em]">
                      {name}
                    </span>
                    <span
                      aria-hidden
                      className="inline-block h-[1em] w-[0.55ch] translate-y-[0.05em] bg-ink/80 opacity-0 group-hover/term:animate-terminal-caret group-hover/term:opacity-100 group-focus-within/term:animate-terminal-caret group-focus-within/term:opacity-100"
                    />
                  </span>
                  <span className="shrink-0 tabular-nums text-ink/50">
                    {year}
                  </span>
                </span>
              </SlidingHighlightRow>
            );
          })}
        </SlidingHighlightList>

        <div className="border-t border-ink/10 px-3 py-2 text-[10px] font-extralight uppercase tracking-[0.1em] text-ink/40 sm:px-3.5">
          {pages.length} {pages.length === 1 ? "entry" : "entries"}
        </div>
      </div>
    </div>
  );
}
