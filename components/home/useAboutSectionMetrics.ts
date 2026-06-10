"use client";

import {
  HOME_CONTENT_MAX_WIDTH_REM,
  HOME_LAYOUT,
  type HomeLayout,
} from "@/lib/home-layout";
import { useMinWidthMd } from "@/lib/use-min-width-md";

function getPaddingX(
  isMd: boolean,
  section: HomeLayout["section"],
): number | string {
  if (!isMd) return section.paddingXMobile;

  return `max(${section.paddingXMobile}px, min(${section.paddingXDesktop}px, (100vw - ${HOME_CONTENT_MAX_WIDTH_REM}rem) / 2))`;
}

export function useAboutSectionMetrics() {
  const isMd = useMinWidthMd();
  const { section } = HOME_LAYOUT;

  const paddingX = getPaddingX(isMd, section);
  const paddingTop = isMd ? section.paddingTopDesktop : section.paddingTop;
  const paddingBottom = isMd ? section.paddingBottomDesktop : section.paddingBottom;
  const viewportInset = paddingTop + paddingBottom;

  return {
    dials: HOME_LAYOUT,
    isMd,
    paddingX,
    paddingTop,
    paddingBottom,
    viewportInset,
    contentMaxWidth: `${HOME_CONTENT_MAX_WIDTH_REM}rem`,
  };
}
