"use client";

import { ContentsTableRow } from "@/components/shared/ContentsTableRow";
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
          <ContentsTableRow
            title={item.title}
            suffix={item.year ?? "—"}
            suffixClassName="font-mono text-sm font-extralight tracking-[-0.04375rem] text-ink/70"
          />
        </SlidingHighlightRow>
      ))}
    </SlidingHighlightList>
  );
}
