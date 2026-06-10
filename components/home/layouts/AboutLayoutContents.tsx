"use client";

import { ContentsList } from "../ContentsList";
import { useAboutSectionMetrics } from "../useAboutSectionMetrics";

export function AboutLayoutContents() {
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
        className="mx-auto flex w-full flex-col justify-center"
        style={{
          maxWidth: contentMaxWidth,
          minHeight: `calc(100svh - ${viewportInset}px)`,
        }}
      >
        <ContentsList className="text-left" />
      </div>
    </section>
  );
}
