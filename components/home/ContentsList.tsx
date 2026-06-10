"use client";

import { ContentsTableRow } from "@/components/shared/ContentsTableRow";
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
          <ContentsTableRow
            number={entry.number}
            title={entry.title}
            suffix={entry.pages}
          />
        </SlidingHighlightRow>
      ))}
    </SlidingHighlightList>
  );
}
