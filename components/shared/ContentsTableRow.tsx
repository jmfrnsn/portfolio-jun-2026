"use client";

import { VariantScrambleText } from "@/components/shared/VariantScrambleText";
import { HOME_LAYOUT } from "@/lib/home-layout";

type ContentsTableRowProps = {
  number?: string;
  title: string;
  suffix: string;
  suffixClassName?: string;
  /** Hover scramble line; when set, title swaps on row hover. */
  titleVariant?: string;
};

export function ContentsTableRow({
  number,
  title,
  suffix,
  suffixClassName = "font-mono font-extralight tracking-[-0.04375rem] text-ink",
  titleVariant,
}: ContentsTableRowProps) {
  const { leaderDotSize, leaderDotSpacing } = HOME_LAYOUT.contents;
  const dotRadius = leaderDotSize / 2;

  return (
    <>
      {number ? (
        <span className="shrink-0 font-sans tracking-[-0.04375rem] text-ink">
          {number}
        </span>
      ) : null}
      {titleVariant ? (
        <VariantScrambleText
          title={title}
          variant={titleVariant}
          className="min-w-0 shrink font-mono font-extralight uppercase tracking-[-0.04375rem] text-ink"
        />
      ) : (
        <span className="min-w-0 shrink font-mono font-extralight uppercase tracking-[-0.04375rem] text-ink">
          {title}
        </span>
      )}
      <span
        className="contents-row-leader"
        style={{
          backgroundImage: `radial-gradient(circle, rgb(39 48 28 / 0.35) ${dotRadius}px, transparent ${dotRadius}px)`,
          backgroundSize: `${leaderDotSpacing}px 3px`,
        }}
        aria-hidden="true"
      />
      <span className={`shrink-0 ${suffixClassName}`.trim()}>{suffix}</span>
    </>
  );
}
