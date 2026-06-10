"use client";

import { AboutOrnament } from "../AboutOrnament";
import { AboutTextBlock } from "../AboutTextBlock";
import { ContentsList } from "../ContentsList";
import { useAboutSectionMetrics } from "../useAboutSectionMetrics";

export function AboutLayoutOrnament() {
  const { paddingX, paddingTop, paddingBottom, viewportInset } =
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
        className="flex flex-col justify-between"
        style={{ minHeight: `calc(100svh - ${viewportInset}px)` }}
      >
        <AboutTextBlock />
        <div className="flex w-full flex-col">
          <AboutOrnament className="mb-10 md:mb-12" />
          <ContentsList />
        </div>
      </div>
    </section>
  );
}
