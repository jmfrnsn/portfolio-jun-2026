"use client";

import { PretextAboutText } from "./PretextAboutText";
import { useAboutSectionMetrics } from "./useAboutSectionMetrics";

type AboutTextBlockProps = {
  className?: string;
  textAlign?: "left" | "justify";
  monogramLinesBesideMobile?: number;
  monogramLinesBesideDesktop?: number;
  monogramScale?: number;
};

export function AboutTextBlock({
  className,
  textAlign,
  monogramLinesBesideMobile,
  monogramLinesBesideDesktop,
  monogramScale,
}: AboutTextBlockProps) {
  const { dials } = useAboutSectionMetrics();

  return (
    <div className={className} style={{ paddingLeft: 8, paddingRight: 8 }}>
      <PretextAboutText
        aboutText={dials.copy.aboutText}
        aboutFontSize={dials.typography.aboutFontSize}
        monogramScale={monogramScale ?? dials.dropCap.scale}
        monogramOffsetY={dials.dropCap.offsetY}
        monogramTextGap={dials.dropCap.textGap}
        monogramLinesBesideMobile={
          monogramLinesBesideMobile ?? dials.dropCap.linesBesideMobile
        }
        monogramLinesBesideDesktop={
          monogramLinesBesideDesktop ?? dials.dropCap.linesBesideDesktop
        }
        inkBleedIntensity={dials.inkBleed.intensity}
        textAlign={textAlign}
      />
    </div>
  );
}
