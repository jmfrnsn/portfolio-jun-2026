"use client";

import { AboutTextBlock } from "../AboutTextBlock";
import { ContentsList } from "../ContentsList";
import { useAboutSectionMetrics } from "../useAboutSectionMetrics";

export function AboutLayoutCentered() {
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
        className="mx-auto flex w-full max-w-[40rem] flex-col"
        style={{ minHeight: `calc(100svh - ${viewportInset}px)` }}
      >
        <div className="flex w-full flex-1 flex-col justify-center">
          <AboutTextBlock
            className="w-full"
            textAlign="justify"
            monogramLinesBesideMobile={3}
            monogramLinesBesideDesktop={3}
            monogramScale={1.4}
          />
        </div>

        <div className="mt-12 flex w-full flex-col items-center text-center md:mt-16">
          <h2 className="mb-6 font-serif text-2xl text-ink md:mb-8">CONTENTS</h2>
          <ContentsList className="text-left" />
        </div>
      </div>
    </section>
  );
}
