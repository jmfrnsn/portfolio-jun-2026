"use client";

import Image from "next/image";

import { ContentsIndexTable } from "../ContentsIndexTable";
import { useAboutSectionMetrics } from "../useAboutSectionMetrics";

const HERO_IMAGE = "/images/footer-illustration.png";

const TAGLINE =
  "Product design, websites, and objects — building artifacts that expand reality.";

export function AboutLayoutIndex() {
  const { paddingX, paddingTop, paddingBottom, viewportInset, contentMaxWidth } =
    useAboutSectionMetrics();

  return (
    <section
      style={{
        paddingLeft: paddingX,
        paddingRight: paddingX,
        paddingTop,
        paddingBottom,
      }}
    >
      <div
        className="relative mx-auto flex w-full flex-col"
        style={{
          maxWidth: contentMaxWidth,
          minHeight: `calc(100svh - ${viewportInset}px)`,
        }}
      >
        <p className="max-w-[14rem] font-mono text-[0.6875rem] font-extralight leading-relaxed tracking-[-0.02em] text-ink/70 sm:max-w-xs sm:text-xs">
          {TAGLINE}
        </p>

        <div className="flex flex-1 flex-col items-center justify-center py-10 md:py-16">
          <div className="flex w-full max-w-[11rem] flex-col items-center sm:max-w-[13rem]">
            <div className="relative aspect-[950/632] w-full">
              <Image
                src={HERO_IMAGE}
                alt=""
                fill
                priority
                sizes="(max-width: 768px) 40vw, 13rem"
                className="object-contain"
              />
            </div>
            <h1 className="mt-6 text-center font-serif text-[clamp(2.5rem,9vw,4.5rem)] uppercase leading-none tracking-[-0.06rem] text-ink">
              Jade Franson
            </h1>
            <p className="mt-2 font-serif text-lg italic tracking-[-0.04rem] text-ink/70">
              sf.
            </p>
          </div>
        </div>

        <div className="mt-auto pt-8 md:pt-12">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-3 sm:min-w-0">
              <div
                className="inline-flex w-fit overflow-hidden rounded-sm border border-ink/12"
                role="tablist"
                aria-label="Contents view"
              >
                <span
                  role="tab"
                  aria-selected
                  className="bg-ink/[0.06] px-2.5 py-1 font-mono text-[0.625rem] font-extralight uppercase tracking-[0.1em] text-ink"
                >
                  List
                </span>
                <span
                  role="tab"
                  aria-selected={false}
                  className="px-2.5 py-1 font-mono text-[0.625rem] font-extralight uppercase tracking-[0.1em] text-ink/35"
                >
                  Grid
                </span>
                <span
                  role="tab"
                  aria-selected={false}
                  className="px-2.5 py-1 font-mono text-[0.625rem] font-extralight uppercase tracking-[0.1em] text-ink/35"
                >
                  Info
                </span>
              </div>
              <div className="font-mono text-[0.625rem] font-extralight leading-relaxed tracking-[-0.02em] text-ink/45">
                <p>View: Contents</p>
                <p>Layout: List</p>
              </div>
            </div>

            <button
              type="button"
              className="font-mono text-[0.625rem] font-extralight uppercase tracking-[0.1em] text-ink/45"
              aria-disabled
            >
              Filter ↓
            </button>
          </div>

          <ContentsIndexTable />
        </div>
      </div>
    </section>
  );
}
