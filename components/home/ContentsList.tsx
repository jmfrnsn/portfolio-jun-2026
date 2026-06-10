"use client";

import {
  SlidingHighlightList,
  SlidingHighlightRow,
} from "@/components/shared/SlidingHighlightRows";
import { getContentsFromCopyDials } from "@/lib/home-copy-dials";
import { isSectionSlug, sectionHref } from "@/lib/site-sections";
import { useMinWidthMd } from "@/lib/use-min-width-md";

import { useHomeLayoutDials } from "./HomeLayoutDialProvider";

type ContentsListProps = {
  className?: string;
};

export function ContentsList({ className = "" }: ContentsListProps) {
  const dials = useHomeLayoutDials();
  const isMd = useMinWidthMd();
  const rowPaddingX = isMd
    ? dials.contents.rowPaddingXDesktop
    : dials.contents.rowPaddingX;

  const contentsFontSize = dials.typography.contentsFontSize;
  const contents = getContentsFromCopyDials(dials.copy);

  return (
    <SlidingHighlightList
      className={`flex w-full flex-col ${className}`.trim()}
      style={{ gap: dials.contents.rowGap, fontSize: contentsFontSize }}
    >
      {contents.map((entry) => (
        <SlidingHighlightRow
          key={entry.number}
          href={isSectionSlug(entry.slug) ? sectionHref(entry.slug) : "/"}
          style={{
            paddingLeft: rowPaddingX,
            paddingRight: rowPaddingX,
            paddingTop: dials.contents.rowPaddingY,
            paddingBottom: dials.contents.rowPaddingY,
          }}
        >
          <span className="flex min-w-0 shrink-0 items-baseline gap-2 sm:gap-3">
            <span className="font-sans tracking-[-0.04375rem] text-ink">
              {entry.number}
            </span>
            <span className="font-mono font-extralight uppercase tracking-[-0.04375rem] text-ink">
              {entry.title}
            </span>
          </span>
          <span
            className="hidden min-w-8 flex-1 border-b border-dotted border-ink/35 sm:block"
            aria-hidden="true"
          />
          <span className="font-mono font-extralight tracking-[-0.04375rem] text-ink sm:ml-auto">
            {entry.pages}
          </span>
        </SlidingHighlightRow>
      ))}
    </SlidingHighlightList>
  );
}
