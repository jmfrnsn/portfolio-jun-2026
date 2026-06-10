import { SectionIndexList } from "@/components/section/SectionIndexList";
import { SectionLayout } from "@/components/section/SectionLayout";
import { getSection, type SectionSlug } from "@/lib/site-sections";

type SectionIndexProps = {
  sectionSlug: SectionSlug;
};

export function SectionIndex({ sectionSlug }: SectionIndexProps) {
  const section = getSection(sectionSlug);
  if (!section) return null;

  return (
    <SectionLayout section={section}>
      <SectionIndexList section={section} />
    </SectionLayout>
  );
}
