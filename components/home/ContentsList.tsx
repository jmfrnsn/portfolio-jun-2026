"use client";

import { ContentsTableRow } from "@/components/shared/ContentsTableRow";
import {
  SlidingHighlightList,
  SlidingHighlightRow,
} from "@/components/shared/SlidingHighlightRows";
import { HOME_LAYOUT } from "@/lib/home-layout";
import { formatPageYear, getSitePages } from "@/lib/site-pages";
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
  const pages = getSitePages();

  return (
    <SlidingHighlightList
      className={`flex w-full flex-col ${className}`.trim()}
      style={{
        gap: contentsLayout.rowGap,
        fontSize: typography.contentsFontSize,
      }}
    >
      {pages.map((page) => (
        <SlidingHighlightRow
          key={page.id}
          href={page.href}
          style={{
            paddingLeft: rowPaddingX,
            paddingRight: rowPaddingX,
            paddingTop: contentsLayout.rowPaddingY,
            paddingBottom: contentsLayout.rowPaddingY,
          }}
        >
          <ContentsTableRow
            title={page.title}
            suffix={formatPageYear(page.publishedAt)}
            titleVariant={page.titleVariant}
          />
        </SlidingHighlightRow>
      ))}
    </SlidingHighlightList>
  );
}
