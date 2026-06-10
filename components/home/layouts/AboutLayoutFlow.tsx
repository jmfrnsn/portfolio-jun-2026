"use client";

import { AboutTextBlock } from "../AboutTextBlock";
import { ContentsList } from "../ContentsList";
import { useAboutSectionMetrics } from "../useAboutSectionMetrics";

export function AboutLayoutFlow() {
  const { paddingX, paddingTop, paddingBottom } = useAboutSectionMetrics();

  return (
    <section
      style={{
        paddingLeft: paddingX,
        paddingRight: paddingX,
        paddingTop,
        paddingBottom,
      }}
    >
      <div className="mx-auto flex w-full max-w-[52rem] flex-col gap-16 md:gap-24">
        <AboutTextBlock />
        <ContentsList />
      </div>
    </section>
  );
}
