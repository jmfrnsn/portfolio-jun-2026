"use client";

import { useHomeAboutLayout } from "./HomeAboutLayoutContext";
import { AboutLayoutCentered } from "./layouts/AboutLayoutCentered";
import { AboutLayoutColumns } from "./layouts/AboutLayoutColumns";
import { AboutLayoutFlow } from "./layouts/AboutLayoutFlow";
import { AboutLayoutOrnament } from "./layouts/AboutLayoutOrnament";
import { AboutLayoutSplit } from "./layouts/AboutLayoutSplit";
import { AboutLayoutStacked } from "./layouts/AboutLayoutStacked";

export function AboutSection() {
  const { layout } = useHomeAboutLayout();

  switch (layout) {
    case "columns":
      return <AboutLayoutColumns />;
    case "split":
      return <AboutLayoutSplit />;
    case "flow":
      return <AboutLayoutFlow />;
    case "centered":
      return <AboutLayoutCentered />;
    case "ornament":
      return <AboutLayoutOrnament />;
    case "stacked":
    default:
      return <AboutLayoutStacked />;
  }
}
