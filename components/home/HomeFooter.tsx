"use client";

import { FooterSection } from "./FooterSection";
import { useHomeAboutLayout } from "./HomeAboutLayoutContext";

export function HomeFooter() {
  const { layout } = useHomeAboutLayout();

  if (layout === "index") return null;

  return <FooterSection />;
}
