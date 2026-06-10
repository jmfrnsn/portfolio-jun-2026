"use client";

import Link from "next/link";

import { useAboutSectionMetrics } from "@/components/home/useAboutSectionMetrics";

function GhostTextLayer({ text }: { text: string }) {
  const filler = Array(8).fill(text).join(" ");

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 min-h-full overflow-hidden opacity-[0.11]"
      aria-hidden="true"
    >
      <p className="columns-2 gap-10 font-serif text-[0.8125rem] leading-[1.65] tracking-[-0.04375rem] text-ink text-justify md:columns-3 md:gap-14 md:text-sm">
        {filler}
      </p>
    </div>
  );
}

export function AboutEditorialLayout() {
  const { paddingX, paddingTop, paddingBottom, contentMaxWidth, dials } =
    useAboutSectionMetrics();
  const aboutText = dials.copy.aboutText;

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
        className="relative mx-auto w-full min-h-[calc(100svh-8rem)]"
        style={{ maxWidth: contentMaxWidth }}
      >
        <GhostTextLayer text={aboutText} />

        <div className="relative z-10 flex min-h-[calc(100svh-8rem)] flex-col items-center justify-center py-16 text-center md:py-24">
          <Link
            href="/"
            className="font-display text-[clamp(2.75rem,9vw,5.25rem)] leading-[0.95] text-ink transition-opacity hover:opacity-75"
          >
            Jade Franson
          </Link>

          <p className="mt-4 font-serif text-[0.6875rem] uppercase tracking-[0.34em] text-ink md:text-xs">
            A designer in San Francisco
          </p>

          <div className="relative mt-10 w-full max-w-[28rem] md:mt-12 md:max-w-[32rem]">
            <p className="font-sans text-[clamp(1.0625rem,3vw,1.4375rem)] font-bold uppercase leading-[1.12] tracking-[-0.02em] text-ink">
              Building at Perplexity
            </p>
            <p className="font-sans text-[clamp(1.0625rem,3vw,1.4375rem)] font-bold uppercase leading-[1.12] tracking-[-0.02em] text-ink">
              Artifacts that expand reality
            </p>

            <p
              className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-[58%] -translate-y-1/2 font-display text-[clamp(1.875rem,5.5vw,3rem)] leading-none text-ink"
              aria-hidden="true"
            >
              San Francisco
            </p>
            <p
              className="pointer-events-none absolute right-[6%] top-[62%] font-display text-[clamp(1.375rem,3.8vw,2.125rem)] leading-none text-ink md:right-[10%]"
              aria-hidden="true"
            >
              2025
            </p>
          </div>

          <div className="mt-14 max-w-[26rem] font-sans text-[clamp(0.6875rem,1.9vw,0.8125rem)] font-bold uppercase leading-[1.5] tracking-[0.05em] text-ink md:mt-16 md:max-w-[30rem]">
            <p>After Duolingo and Salesforce, she studied</p>
            <p>cognitive science — shaped by attention,</p>
            <p>perception, books, films, and collections.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
