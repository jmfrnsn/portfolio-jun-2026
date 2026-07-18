import Link from "next/link";

import { FooterSection } from "@/components/home/FooterSection";
import { SectionContentShell } from "@/components/section/SectionContentShell";

const NAV_LINKS = [
  { href: "/ornaments", label: "Overview" },
  { href: "/ornaments/sources", label: "Sources" },
  { href: "/ornaments/motifs", label: "Motifs" },
  { href: "/ornaments/projects", label: "Projects" },
] as const;

type OrnamentLayoutProps = {
  title: string;
  description: string;
  activeHref?: (typeof NAV_LINKS)[number]["href"];
  /** Wider plate layout for the archival sources grid. */
  wide?: boolean;
  children: React.ReactNode;
};

export function OrnamentLayout({
  title,
  description,
  activeHref = "/ornaments",
  wide = false,
  children,
}: OrnamentLayoutProps) {
  const header = (
    <header className={wide ? "mb-10 md:mb-14" : "mb-12 md:mb-16"}>
      <div className="flex flex-col gap-3">
        <p className="font-sans text-sm tracking-[-0.04375rem] text-ink/60">
          Research
        </p>
        <h1 className="font-mono text-sm font-extralight uppercase tracking-[-0.04375rem] text-ink md:text-base">
          Historic Ornament
        </h1>
        <p className="font-serif text-xl tracking-[-0.04375rem] text-ink md:text-2xl">
          {title}
        </p>
        <p className="max-w-prose font-serif text-base leading-relaxed tracking-[-0.04375rem] text-ink/80">
          {description}
        </p>
      </div>

      <nav
        aria-label="Ornament catalog"
        className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-ink/10 pt-6"
      >
        {NAV_LINKS.map((link) => {
          const isActive = link.href === activeHref;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`font-mono text-sm font-extralight uppercase tracking-[0.08em] transition-colors ${
                isActive ? "text-ink" : "text-ink/45 hover:text-ink"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );

  if (wide) {
    return (
      <div className="bg-paper text-ink">
        <div className="mx-auto w-full max-w-[72rem] px-5 pb-24 pt-36 sm:px-8 md:px-10 md:pb-32 md:pt-44">
          {header}
          <main>{children}</main>
        </div>
        <FooterSection />
      </div>
    );
  }

  return (
    <div className="bg-paper text-ink">
      <SectionContentShell>
        {header}
        <main>{children}</main>
      </SectionContentShell>
      <FooterSection />
    </div>
  );
}
