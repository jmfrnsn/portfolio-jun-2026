"use client";

import { useMinWidthMd } from "@/lib/use-min-width-md";

import { useHomeLayoutDials } from "./HomeLayoutDialProvider";

export function useAboutSectionMetrics() {
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

  return {
    dials,
    isMd,
    paddingX,
    paddingTop,
    paddingBottom,
    viewportInset,
  };
}
