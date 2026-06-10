"use client";

import { AboutEditorialLayout } from "@/components/section/AboutEditorialLayout";
import { FooterSection } from "@/components/home/FooterSection";

export function SectionAbout() {
  return (
    <div className="bg-paper text-ink">
      <AboutEditorialLayout />
      <FooterSection />
    </div>
  );
}
