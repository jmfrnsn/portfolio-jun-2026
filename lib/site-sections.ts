import { contents, type ContentEntry } from "@/components/home/contents-data";

export const SECTION_SLUGS = contents.map((entry) => entry.slug);

export type SectionSlug = (typeof contents)[number]["slug"];

export type SectionItem = {
  slug: string;
  title: string;
  description: string;
  year?: string;
};

export type SiteSection = {
  slug: SectionSlug;
  number: string;
  title: string;
  label: string;
  description: string;
  items: SectionItem[];
};

export function pagesLabelToSlug(label: string): SectionSlug | null {
  const slug = label.trim().toLowerCase();
  return isSectionSlug(slug) ? slug : null;
}

export function isSectionSlug(value: string): value is SectionSlug {
  return SECTION_SLUGS.includes(value as SectionSlug);
}

const SECTION_ITEMS: Record<SectionSlug, SectionItem[]> = {
  lab: [
    {
      slug: "perplexity-comet",
      title: "Perplexity Comet",
      description: "Product design for the Comet browser experience.",
      year: "2025",
    },
    {
      slug: "duolingo-music",
      title: "Duolingo Music",
      description: "Interaction and visual design for music learning.",
      year: "2023",
    },
    {
      slug: "object-study-01",
      title: "Object Study 01",
      description: "A small physical-digital object experiment.",
      year: "2024",
    },
  ],
  writing: [
    {
      slug: "garden-of-thought",
      title: "A Garden of Thought",
      description: "Notes on cultivating attention through writing.",
      year: "2025",
    },
    {
      slug: "expanded-reality",
      title: "Expanded Reality",
      description: "On artifacts that help people notice the world anew.",
      year: "2024",
    },
  ],
  reading: [],
  archives: [
    {
      slug: "knowledge-index",
      title: "Knowledge Index",
      description: "Collected references, links, and fragments.",
      year: "2025",
    },
    {
      slug: "collections",
      title: "Collections",
      description: "Objects and sets kept without quite knowing why.",
      year: "2024",
    },
  ],
  about: [],
};

const SECTION_DESCRIPTIONS: Record<SectionSlug, string> = {
  lab: "Products, websites, and objects.",
  writing: "Essays, notes, and cultivated thought.",
  reading: "Fiction, philosophy, sci-fi, and more.",
  archives: "Collected knowledge and references.",
  about: "Biography and background.",
};

export function buildSiteSections(
  entries: readonly ContentEntry[] = contents,
): SiteSection[] {
  return entries.flatMap((entry) => {
    if (!isSectionSlug(entry.slug)) return [];

    const slug = entry.slug;
    return [
      {
        slug,
        number: entry.number,
        title: entry.title,
        label: entry.pages,
        description: SECTION_DESCRIPTIONS[slug],
        items: SECTION_ITEMS[slug],
      },
    ];
  });
}

export const SITE_SECTIONS = buildSiteSections();

export function getSection(slug: SectionSlug): SiteSection | undefined {
  return SITE_SECTIONS.find((section) => section.slug === slug);
}

export function getSectionItem(
  sectionSlug: SectionSlug,
  itemSlug: string,
): { section: SiteSection; item: SectionItem } | undefined {
  const section = getSection(sectionSlug);
  if (!section) return undefined;

  const item = section.items.find((entry) => entry.slug === itemSlug);
  if (!item) return undefined;

  return { section, item };
}

export function sectionHref(slug: SectionSlug): string {
  return `/${slug}`;
}

export function sectionItemHref(sectionSlug: SectionSlug, itemSlug: string): string {
  return `/${sectionSlug}/${itemSlug}`;
}

export function getAllSectionItemParams(): Array<{
  section: SectionSlug;
  slug: string;
}> {
  return SITE_SECTIONS.flatMap((section) =>
    section.items.map((item) => ({
      section: section.slug,
      slug: item.slug,
    })),
  );
}
