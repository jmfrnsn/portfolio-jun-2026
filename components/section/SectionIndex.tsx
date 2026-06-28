import { LabIndex } from "@/components/section/LabIndex";
import { ReadingPage } from "@/components/section/ReadingPage";
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

  if (sectionSlug === "reading") {
    return <ReadingPage />;
  }

  const section = getSection(sectionSlug);
  if (!section) return null;

  if (sectionSlug === "lab") {
    return <LabIndex section={section} />;
  }

  return (
    <SectionLayout section={section}>
      <SectionIndexList section={section} />
    </SectionLayout>
  );
}
