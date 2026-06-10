import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SectionDetail } from "@/components/section/SectionDetail";
import {
  getAllSectionItemParams,
  getSectionItem,
  isSectionSlug,
} from "@/lib/site-sections";

type SectionItemPageProps = {
  params: Promise<{ section: string; slug: string }>;
};

export function generateStaticParams() {
  return getAllSectionItemParams();
}

export async function generateMetadata({
  params,
}: SectionItemPageProps): Promise<Metadata> {
  const { section: sectionParam, slug } = await params;
  if (!isSectionSlug(sectionParam)) {
    return { title: "Not found" };
  }

  const result = getSectionItem(sectionParam, slug);
  if (!result) {
    return { title: "Not found" };
  }

  return {
    title: `${result.item.title} — ${result.section.label} — Jade Franson`,
    description: result.item.description,
  };
}

export default async function SectionItemPage({ params }: SectionItemPageProps) {
  const { section: sectionParam, slug } = await params;
  if (!isSectionSlug(sectionParam) || !getSectionItem(sectionParam, slug)) {
    notFound();
  }

  return <SectionDetail sectionSlug={sectionParam} itemSlug={slug} />;
}
