"use client";

import { splitAboutTextIntoColumns } from "@/lib/split-about-text";
import { getAboutTypography } from "@/lib/typography";

import { PretextAboutText } from "./PretextAboutText";
import { useAboutSectionMetrics } from "./useAboutSectionMetrics";

type AboutTextColumnsProps = {
  className?: string;
};

function ColumnParagraphs({
  paragraphs,
  fontSize,
  lineHeight,
  letterSpacing,
}: {
  paragraphs: string[];
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
}) {
  return (
    <div
      className="flex flex-col gap-6 font-serif text-ink"
      style={{
        fontSize,
        lineHeight: `${lineHeight}px`,
        letterSpacing: `${letterSpacing}px`,
      }}
    >
      {paragraphs.map((paragraph, index) => (
        <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
      ))}
    </div>
  );
}

export function AboutTextColumns({ className = "" }: AboutTextColumnsProps) {
  const { dials } = useAboutSectionMetrics();
  const { left, right } = splitAboutTextIntoColumns(dials.copy.aboutText);
  const { lineHeight, letterSpacing } = getAboutTypography(
    dials.typography.aboutFontSize,
  );

  return (
    <div
      className={`grid w-full grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-x-12 lg:gap-x-16 ${className}`.trim()}
    >
      <PretextAboutText
        aboutText={left.join(" ")}
        aboutFontSize={dials.typography.aboutFontSize}
        monogramScale={dials.dropCap.scale}
        monogramOffsetY={dials.dropCap.offsetY}
        monogramTextGap={dials.dropCap.textGap}
        monogramLinesBesideMobile={dials.dropCap.linesBesideMobile}
        monogramLinesBesideDesktop={dials.dropCap.linesBesideDesktop}
        inkBleedIntensity={dials.inkBleed.intensity}
      />
      <ColumnParagraphs
        paragraphs={right}
        fontSize={dials.typography.aboutFontSize}
        lineHeight={lineHeight}
        letterSpacing={letterSpacing}
      />
    </div>
  );
}
