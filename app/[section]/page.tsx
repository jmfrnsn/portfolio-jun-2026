import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SectionIndex } from "@/components/section/SectionIndex";
import { contents } from "@/components/home/contents-data";
import { getSection, isSectionSlug } from "@/lib/site-sections";

type SectionPageProps = {
  params: Promise<{ section: string }>;
};

export function generateStaticParams() {
  return contents.map((entry) => ({ section: entry.slug }));
}

export async function generateMetadata({
  params,
}: SectionPageProps): Promise<Metadata> {
  const { section: sectionParam } = await params;
  if (!isSectionSlug(sectionParam)) {
    return { title: "Not found" };
  }

  const section = getSection(sectionParam);
  if (!section) {
    return { title: "Not found" };
  }

  return {
    title: `${section.label} — Jade Franson`,
    description: section.description,
  };
}

export default async function SectionPage({ params }: SectionPageProps) {
  const { section: sectionParam } = await params;
  if (!isSectionSlug(sectionParam) || !getSection(sectionParam)) {
    notFound();
  }

  return <SectionIndex sectionSlug={sectionParam} />;
}
