"use client";

import Image from "next/image";

import { splitAboutTextIntoColumns } from "@/lib/split-about-text";
import { getAboutTypography } from "@/lib/typography";

import { ContentsList } from "../ContentsList";
import { useAboutSectionMetrics } from "../useAboutSectionMetrics";

const HERO_IMAGE = "/images/hero-garden.png";

function GhostTextLayer({ text }: { text: string }) {
  const filler = Array(8).fill(text).join(" ");

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 h-[min(140vh,72rem)] overflow-hidden opacity-[0.11]"
      aria-hidden="true"
    >
      <p className="columns-2 gap-10 font-serif text-[0.8125rem] leading-[1.65] tracking-[-0.04375rem] text-ink text-justify md:columns-3 md:gap-14 md:text-sm">
        {filler}
      </p>
    </div>
  );
}

function SideColumn({
  paragraphs,
  fontSize,
  lineHeight,
  letterSpacing,
  className = "",
}: {
  paragraphs: string[];
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col gap-5 font-serif text-ink ${className}`.trim()}
      style={{
        fontSize,
        lineHeight: `${lineHeight}px`,
        letterSpacing: `${letterSpacing}px`,
      }}
    >
      {paragraphs.map((paragraph, index) => (
        <p key={`${index}-${paragraph.slice(0, 24)}`} className="text-justify">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export function AboutLayoutEditorial() {
  const { paddingX, paddingTop, paddingBottom, contentMaxWidth, dials } =
    useAboutSectionMetrics();
  const aboutText = dials.copy.aboutText;
  const { left, right } = splitAboutTextIntoColumns(aboutText);
  const { fontSize, lineHeight, letterSpacing } = getAboutTypography(
    dials.typography.aboutFontSize,
  );

  return (
    <section
      className="relative"
      style={{
        paddingLeft: paddingX,
        paddingRight: paddingX,
        paddingTop,
        paddingBottom,
      }}
    >
      <div
        className="relative mx-auto w-full"
        style={{ maxWidth: contentMaxWidth }}
      >
        <GhostTextLayer text={aboutText} />

        <p
          className="pointer-events-none absolute left-0 top-24 hidden font-display text-[clamp(3rem,8vw,5rem)] text-ink/8 md:block"
          aria-hidden="true"
        >
          JF
        </p>
        <p
          className="pointer-events-none absolute right-0 top-[28rem] hidden font-display text-[clamp(3rem,8vw,5rem)] text-ink/8 md:block"
          aria-hidden="true"
        >
          JF
        </p>

        <div className="relative z-10 grid grid-cols-1 items-start gap-10 md:grid-cols-[minmax(0,1fr)_minmax(12rem,18rem)_minmax(0,1fr)] md:gap-8 lg:gap-12">
          <SideColumn
            paragraphs={left}
            fontSize={fontSize}
            lineHeight={lineHeight}
            letterSpacing={letterSpacing}
            className="hidden md:flex md:pt-2"
          />

          <div className="mx-auto w-full max-w-[17rem] md:max-w-none md:px-2">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-ink/5">
              <Image
                src={HERO_IMAGE}
                alt="Garden scene"
                fill
                priority
                sizes="(max-width: 768px) 68vw, 18rem"
                className="object-cover object-center"
              />
            </div>
          </div>

          <SideColumn
            paragraphs={right}
            fontSize={fontSize}
            lineHeight={lineHeight}
            letterSpacing={letterSpacing}
            className="hidden md:flex md:pt-24"
          />

          <SideColumn
            paragraphs={[...left, ...right]}
            fontSize={fontSize}
            lineHeight={lineHeight}
            letterSpacing={letterSpacing}
            className="md:hidden"
          />
        </div>

        <div className="relative z-10 mt-16 md:mt-24">
          <p className="mb-8 text-center font-mono text-[0.6875rem] font-extralight uppercase tracking-[0.28em] text-ink/55 md:text-xs">
            Contents
          </p>
          <ContentsList className="text-left" />
        </div>
      </div>
    </section>
  );
}
