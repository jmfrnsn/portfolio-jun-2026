"use client";

import { AboutTextBlock } from "../AboutTextBlock";
import { ContentsList } from "../ContentsList";
import { useAboutSectionMetrics } from "../useAboutSectionMetrics";

export function AboutLayoutSplit() {
  const { paddingX, paddingTop, paddingBottom, viewportInset, isMd } =
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
        className="flex flex-col gap-12 md:grid md:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] md:items-start md:gap-16 lg:gap-20"
        style={
          isMd
            ? { minHeight: `calc(100svh - ${viewportInset}px)` }
            : undefined
        }
      >
        <AboutTextBlock className="md:sticky md:top-24" />
        <div className="flex w-full flex-col md:pt-6">
          <ContentsList />
        </div>
      </div>
    </section>
  );
}
