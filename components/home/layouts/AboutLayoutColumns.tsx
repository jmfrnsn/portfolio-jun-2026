"use client";

import { AboutTextColumns } from "../AboutTextColumns";
import { ContentsList } from "../ContentsList";
import { useAboutSectionMetrics } from "../useAboutSectionMetrics";

export function AboutLayoutColumns() {
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
        <AboutTextColumns />
        <ContentsList />
      </div>
    </section>
  );
}
