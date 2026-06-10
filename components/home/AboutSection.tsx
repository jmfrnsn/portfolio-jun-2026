"use client";

import { useHomeAboutLayout } from "./HomeAboutLayoutContext";
import { AboutLayoutCentered } from "./layouts/AboutLayoutCentered";
import { AboutLayoutColumns } from "./layouts/AboutLayoutColumns";
import { AboutLayoutContents } from "./layouts/AboutLayoutContents";
import { AboutLayoutEditorial } from "./layouts/AboutLayoutEditorial";
import { AboutLayoutIndex } from "./layouts/AboutLayoutIndex";

export function AboutSection() {
  const { layout } = useHomeAboutLayout();

  switch (layout) {
    case "columns":
      return <AboutLayoutColumns />;
    case "centered":
      return <AboutLayoutCentered />;
    case "editorial":
      return <AboutLayoutEditorial />;
    case "index":
      return <AboutLayoutIndex />;
    case "contents":
      return <AboutLayoutContents />;
    default:
      return <AboutLayoutEditorial />;
  }
}
