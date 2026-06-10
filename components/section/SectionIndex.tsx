import { ReadingList } from "@/components/section/ReadingList";
import { SectionAbout } from "@/components/section/SectionAbout";
import { SectionIndexList } from "@/components/section/SectionIndexList";
import { SectionLayout } from "@/components/section/SectionLayout";
import { getSection, type SectionSlug } from "@/lib/site-sections";

type SectionIndexProps = {
  sectionSlug: SectionSlug;
};

export function SectionIndex({ sectionSlug }: SectionIndexProps) {
  if (sectionSlug === "about") {
    return <SectionAbout />;
  }

  const section = getSection(sectionSlug);
  if (!section) return null;

  return (
    <SectionLayout section={section}>
      {sectionSlug === "reading" ? (
        <ReadingList />
      ) : (
        <SectionIndexList section={section} />
      )}
    </SectionLayout>
  );
}
