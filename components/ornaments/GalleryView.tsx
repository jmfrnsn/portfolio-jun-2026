"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { ArchiveSourceButton } from "@/components/ornaments/ArchiveSourceButton";
import { OrnamentImage } from "@/components/ornaments/OrnamentImage";
import type { OrnamentFigure } from "@/lib/ornaments/figure-catalog";

type GalleryViewProps = {
  figures: OrnamentFigure[];
  isAdmin: boolean;
  onArchiveChange: (sourceId: string, nextArchived: boolean) => void;
};

function formatMeta(figure: OrnamentFigure) {
  const parts = [
    figure.source.region?.trim() || null,
    figure.source.year?.trim() || null,
    figure.source.creator?.trim() || null,
  ].filter(Boolean);
  return parts.join("   ·   ");
}

export function GalleryView({
  figures,
  isAdmin,
  onArchiveChange,
}: GalleryViewProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    function updateActive() {
      const node = scrollerRef.current;
      if (!node) return;
      const children = [...node.querySelectorAll<HTMLElement>("[data-gallery-slide]")];
      if (children.length === 0) return;

      const mid = node.scrollLeft + node.clientWidth / 2;
      let best = 0;
      let bestDist = Number.POSITIVE_INFINITY;
      children.forEach((child, index) => {
        const center = child.offsetLeft + child.offsetWidth / 2;
        const dist = Math.abs(center - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = index;
        }
      });
      setActiveIndex(best);
    }

    updateActive();
    scroller.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      scroller.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [figures.length]);

  function scrollBySlides(direction: -1 | 1) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const slide = scroller.querySelector<HTMLElement>("[data-gallery-slide]");
    const amount = slide ? slide.offsetWidth + 48 : scroller.clientWidth * 0.7;
    scroller.scrollBy({ left: direction * amount, behavior: "smooth" });
  }

  function scrollToIndex(index: number) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const slide = scroller.querySelectorAll<HTMLElement>("[data-gallery-slide]")[
      index
    ];
    if (!slide) return;
    scroller.scrollTo({
      left: slide.offsetLeft - (scroller.clientWidth - slide.offsetWidth) / 2,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 -mt-36 mb-[-8rem] bg-[#0a0a0a] text-white md:-mt-44">
      <div className="mx-auto flex min-h-svh max-w-[78rem] flex-col px-5 pb-36 pt-36 sm:px-8 md:px-10 md:pt-44">
        <header className="grid gap-8 border-b border-white/10 pb-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-end md:gap-12">
          <div>
            <div className="flex flex-wrap items-start gap-x-3 gap-y-1">
              <h1 className="font-sans text-4xl font-medium tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">
                Ornaments
              </h1>
              <span className="mt-2 font-mono text-[10px] font-extralight uppercase tracking-[0.14em] text-white/45">
                ® Historical design drawings
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-8">
            <p className="font-mono text-[11px] font-extralight leading-relaxed tracking-[0.02em] text-white/55">
              A working catalog of public-domain ornament plates—friezes,
              grotesques, putti, and botanical scrolls drawn for the decorative
              arts.
            </p>
            <p className="font-mono text-[11px] font-extralight leading-relaxed tracking-[0.02em] text-white/55">
              Scroll the gallery to compare studies side by side. Each plate
              links out to the full museum record when one exists.
            </p>
          </div>
        </header>

        <div className="relative mt-10 flex flex-1 flex-col justify-center md:mt-14">
          <button
            type="button"
            aria-label="Previous plate"
            onClick={() => scrollBySlides(-1)}
            className="absolute left-0 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 font-sans text-lg text-white/80 backdrop-blur-sm transition-colors hover:border-white/40 hover:text-white md:flex"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next plate"
            onClick={() => scrollBySlides(1)}
            className="absolute right-0 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 font-sans text-lg text-white/80 backdrop-blur-sm transition-colors hover:border-white/40 hover:text-white md:flex"
          >
            ›
          </button>

          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory gap-10 overflow-x-auto px-[12vw] pb-2 pt-2 scrollbar-none sm:gap-14 md:px-[18%]"
          >
            {figures.map((figure) => (
              <article
                key={figure.source.id}
                data-gallery-slide
                className="relative w-[min(18rem,70vw)] shrink-0 snap-center sm:w-[20rem] md:w-[22rem]"
              >
                <Link
                  href={`/ornaments/sources/${figure.source.id}`}
                  className="group block"
                >
                  <div className="relative mx-auto aspect-[4/5] w-full overflow-hidden">
                    {figure.source.imageUrl ? (
                      <OrnamentImage
                        src={figure.source.imageUrl}
                        alt={figure.source.title}
                        fill
                        sizes="22rem"
                        blend="normal"
                        className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center font-mono text-xs text-white/30">
                        No image
                      </div>
                    )}
                  </div>
                  <p className="mt-5 font-mono text-[10px] font-extralight leading-relaxed tracking-[0.04em] text-white/55">
                    <span className="mr-2 inline-block h-1 w-1 rounded-full bg-white/70 align-middle" />
                    <span className="text-fig">
                      Fig.&nbsp;{String(figure.index + 1).padStart(2, "0")}
                    </span>
                    <span className="mx-2 text-white/25">·</span>
                    {formatMeta(figure) || figure.titleLabel}
                  </p>
                </Link>

                {isAdmin ? (
                  <div className="absolute right-0 top-0 z-10">
                    <ArchiveSourceButton
                      sourceId={figure.source.id}
                      archived={figure.source.notionStatus === "Archived"}
                      onCompleted={(nextArchived) =>
                        onArchiveChange(figure.source.id, nextArchived)
                      }
                    />
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {figures.map((figure, index) => {
            const active = index === activeIndex;
            return (
              <button
                key={figure.source.id}
                type="button"
                aria-label={`Go to figure ${index + 1}`}
                aria-current={active ? "true" : undefined}
                onClick={() => scrollToIndex(index)}
                className={`h-1.5 rounded-full transition-all ${
                  active
                    ? "w-5 bg-white"
                    : "w-1.5 bg-white/25 hover:bg-white/45"
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
