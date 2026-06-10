"use client";

import { contents } from "@/components/home/contents-data";
import { ContentsTableRow } from "@/components/shared/ContentsTableRow";
import {
  SlidingHighlightList,
  SlidingHighlightRow,
} from "@/components/shared/SlidingHighlightRows";
import { HOME_LAYOUT } from "@/lib/home-layout";
import { sectionHref } from "@/lib/site-sections";
import { useMinWidthMd } from "@/lib/use-min-width-md";

type ContentsListProps = {
  className?: string;
};

export function ContentsList({ className = "" }: ContentsListProps) {
  const isMd = useMinWidthMd();
  const { contents: contentsLayout, typography } = HOME_LAYOUT;
  const rowPaddingX = isMd
    ? contentsLayout.rowPaddingXDesktop
    : contentsLayout.rowPaddingX;

  return (
    <SlidingHighlightList
      className={`flex w-full flex-col ${className}`.trim()}
      style={{
        gap: contentsLayout.rowGap,
        fontSize: typography.contentsFontSize,
      }}
    >
      {contents.map((entry) => (
        <SlidingHighlightRow
          key={entry.number}
          href={sectionHref(entry.slug)}
          style={{
            paddingLeft: rowPaddingX,
            paddingRight: rowPaddingX,
            paddingTop: contentsLayout.rowPaddingY,
            paddingBottom: contentsLayout.rowPaddingY,
          }}
        >
          <ContentsTableRow
            number={entry.number}
            title={entry.title}
            suffix={entry.pages}
            slug={entry.slug}
          />
        </SlidingHighlightRow>
      ))}
    </SlidingHighlightList>
  );
}
