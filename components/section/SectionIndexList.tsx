"use client";

import {
  SlidingHighlightList,
  SlidingHighlightRow,
} from "@/components/shared/SlidingHighlightRows";
import { sectionItemHref, type SiteSection } from "@/lib/site-sections";

type SectionIndexListProps = {
  section: SiteSection;
};

export function SectionIndexList({ section }: SectionIndexListProps) {
  return (
    <SlidingHighlightList className="flex flex-col gap-2">
      {section.items.map((item) => (
        <SlidingHighlightRow
          key={item.slug}
          href={sectionItemHref(section.slug, item.slug)}
          className="p-2"
        >
          <span className="min-w-0 flex-1 font-mono text-sm font-extralight uppercase tracking-[-0.04375rem] text-ink">
            {item.title}
          </span>
          <span
            className="hidden min-w-8 flex-1 border-b border-dotted border-ink/35 sm:block"
            aria-hidden="true"
          />
          <span className="font-mono text-sm font-extralight tracking-[-0.04375rem] text-ink/70 sm:ml-auto">
            {item.year ?? "—"}
          </span>
        </SlidingHighlightRow>
      ))}
    </SlidingHighlightList>
  );
}
