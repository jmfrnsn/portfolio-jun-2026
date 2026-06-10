"use client";

import {
  HOME_CONTENT_MAX_WIDTH_REM,
  type HomeLayoutDials,
} from "@/lib/home-layout-dials";
import { useMinWidthMd } from "@/lib/use-min-width-md";

import { useHomeLayoutDials } from "./HomeLayoutDialProvider";

function getPaddingX(
  isMd: boolean,
  section: HomeLayoutDials["section"],
): number | string {
  if (!isMd) return section.paddingXMobile;

  return `max(${section.paddingXMobile}px, min(${section.paddingXDesktop}px, (100vw - ${HOME_CONTENT_MAX_WIDTH_REM}rem) / 2))`;
}

export function useAboutSectionMetrics() {
  const dials = useHomeLayoutDials();
  const isMd = useMinWidthMd();

  const paddingX = getPaddingX(isMd, dials.section);
  const paddingTop = isMd
    ? dials.section.paddingTopDesktop
    : dials.section.paddingTop;
  const paddingBottom = isMd
    ? dials.section.paddingBottomDesktop
    : dials.section.paddingBottom;
  const viewportInset = paddingTop + paddingBottom;

  return {
    dials,
    isMd,
    paddingX,
    paddingTop,
    paddingBottom,
    viewportInset,
    contentMaxWidth: `${HOME_CONTENT_MAX_WIDTH_REM}rem`,
  };
}
