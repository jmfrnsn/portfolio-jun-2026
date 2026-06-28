import { contents, type ContentEntry } from "@/components/home/contents-data";

export const SECTION_SLUGS = contents.map((entry) => entry.slug);

export type SectionSlug = (typeof contents)[number]["slug"];

export type SectionItem = {
  slug: string;
  title: string;
  description: string;
  year?: string;
  medium?: string;
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
      slug: "coworking-club",
      title: "Coworking Club",
      description: "A landing page study for a lightweight coworking concept.",
      year: "2025",
      medium: "Website",
    },
    {
      slug: "brand-archive",
      title: "Brand Archive",
      description: "A visual archive for collecting and comparing brand systems.",
      year: "2025",
      medium: "Website",
    },
    {
      slug: "photo-gallery",
      title: "Photo Gallery",
      description: "A compact gallery interaction for browsing visual references.",
      year: "2025",
      medium: "Website",
    },
    {
      slug: "system-1-os-chess",
      title: "System 1 OS Chess",
      description: "A chess interface sketch in a retro operating-system language.",
      year: "2025",
      medium: "Website",
    },
    {
      slug: "plant-care",
      title: "Plant Care",
      description: "A small mobile concept for identifying and tending to plants.",
      year: "2025",
      medium: "iOS App",
    },
    {
      slug: "monet-waterlilies",
      title: "Monet Waterlilies",
      description: "A hand-made study combining embroidery and bookbinding.",
      year: "2025",
      medium: "Embroidery + Bookbinding",
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
  about: [],
};

const SECTION_DESCRIPTIONS: Record<SectionSlug, string> = {
  lab: "Products, websites, and objects.",
  writing: "Essays, notes, and cultivated thought.",
  reading: "Fiction, philosophy, sci-fi, and more.",
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
