"use client";

import { ContentsList } from "./ContentsList";
import { useHomeLayoutDials } from "./HomeLayoutDialProvider";
import { PretextAboutText } from "./PretextAboutText";
import { useMinWidthMd } from "@/lib/use-min-width-md";

export function AboutSection() {
  const dials = useHomeLayoutDials();
  const isMd = useMinWidthMd();

  const paddingX = isMd
    ? dials.section.paddingXDesktop
    : dials.section.paddingXMobile;
  const paddingTop = isMd
    ? dials.section.paddingTopDesktop
    : dials.section.paddingTop;
  const paddingBottom = isMd
    ? dials.section.paddingBottomDesktop
    : dials.section.paddingBottom;
  const viewportInset = paddingTop + paddingBottom;

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
        <PretextAboutText
          aboutText={dials.copy.aboutText}
          aboutFontSize={dials.typography.aboutFontSize}
          monogramScale={dials.dropCap.scale}
          monogramOffsetY={dials.dropCap.offsetY}
          monogramTextGap={dials.dropCap.textGap}
          monogramLinesBesideMobile={dials.dropCap.linesBesideMobile}
          monogramLinesBesideDesktop={dials.dropCap.linesBesideDesktop}
          inkBleedIntensity={dials.inkBleed.intensity}
        />
        <ContentsList />
      </div>
    </section>
  );
}
