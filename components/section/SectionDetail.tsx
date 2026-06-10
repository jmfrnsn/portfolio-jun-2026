import Link from "next/link";

import { SectionLayout } from "@/components/section/SectionLayout";
import {
  getSectionItem,
  sectionHref,
  type SectionSlug,
} from "@/lib/site-sections";

type SectionDetailProps = {
  sectionSlug: SectionSlug;
  itemSlug: string;
};

export function SectionDetail({ sectionSlug, itemSlug }: SectionDetailProps) {
  const result = getSectionItem(sectionSlug, itemSlug);
  if (!result) return null;

  const { section, item } = result;

  return (
    <SectionLayout section={section}>
      <article className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Link
            href={sectionHref(section.slug)}
            className="font-mono text-sm font-extralight uppercase tracking-[0.08em] text-ink/60 transition-colors hover:text-ink"
          >
            ← {section.label}
          </Link>
          <h2 className="font-serif text-3xl tracking-[-0.04375rem] text-ink md:text-4xl">
            {item.title}
          </h2>
          {item.year ? (
            <p className="font-mono text-sm font-extralight tracking-[-0.04375rem] text-ink/60">
              {item.year}
            </p>
          ) : null}
        </div>

        <div className="max-w-prose font-serif text-base leading-relaxed tracking-[-0.04375rem] text-ink/90">
          <p>{item.description}</p>
          <p className="mt-4 text-ink/60">
            This page is a scaffold. Replace this body with project copy, media,
            and metadata when the piece is ready to publish.
          </p>
        </div>
      </article>
    </SectionLayout>
  );
}
