import Link from "next/link";

import { FooterSection } from "@/components/home/FooterSection";
import { SectionContentShell } from "@/components/section/SectionContentShell";
import type { SiteSection } from "@/lib/site-sections";

type SectionLayoutProps = {
  section: SiteSection;
  children: React.ReactNode;
};

export function SectionLayout({ section, children }: SectionLayoutProps) {
  return (
    <div className="bg-paper text-ink">
      <SectionContentShell>
        <header className="mb-12 md:mb-16">
          <Link
            href="/"
            className="font-mono text-sm font-extralight uppercase tracking-[0.08em] text-ink/60 transition-colors hover:text-ink"
          >
            ← Contents
          </Link>

          <div className="mt-8 flex flex-col gap-3">
            <p className="font-sans text-sm tracking-[-0.04375rem] text-ink/60">
              {section.number}
            </p>
            <h1 className="font-mono text-sm font-extralight uppercase tracking-[-0.04375rem] text-ink md:text-base">
              {section.title}
            </h1>
            <p className="font-serif text-xl tracking-[-0.04375rem] text-ink md:text-2xl">
              {section.label}
            </p>
            <p className="max-w-prose font-serif text-base leading-relaxed tracking-[-0.04375rem] text-ink/80">
              {section.description}
            </p>
          </div>
        </header>

        <main>{children}</main>
      </SectionContentShell>
      <FooterSection />
    </div>
  );
}
