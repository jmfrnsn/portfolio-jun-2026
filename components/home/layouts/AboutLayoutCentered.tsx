"use client";

import { AboutTextBlock } from "../AboutTextBlock";
import { ContentsList } from "../ContentsList";
import { useAboutSectionMetrics } from "../useAboutSectionMetrics";

export function AboutLayoutCentered() {
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
        className="mx-auto flex w-full flex-col"
        style={{
          maxWidth: contentMaxWidth,
          minHeight: `calc(100svh - ${viewportInset}px)`,
        }}
      >
        <div className="flex w-full flex-1 flex-col justify-start">
          <AboutTextBlock
            className="w-full"
            textAlign="justify"
            monogramLinesBesideMobile={3}
            monogramLinesBesideDesktop={3}
            monogramScale={1.4}
          />
        </div>

        <div className="mt-12 flex w-full flex-col items-center md:mt-16">
          <ContentsList className="text-left" />
        </div>
      </div>
    </section>
  );
}
