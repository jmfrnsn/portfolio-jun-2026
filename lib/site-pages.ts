/**
 * Homepage running list — destinations sorted by publishedAt (newest first).
 * Add a row here when you ship a new page.
 */
export type SitePage = {
  id: string;
  href: string;
  /** Uppercase mono title shown in the default home list. */
  title: string;
  /** ISO date (YYYY-MM-DD); drives sort order. */
  publishedAt: string;
  /** Optional hover scramble line (default list). */
  titleVariant?: string;
  /** Terminal listing: directories get a trailing slash. */
  kind?: "file" | "dir";
};

export const SITE_PAGES: readonly SitePage[] = [
  {
    id: "ornaments",
    href: "/ornaments",
    title: "ORNAMENT RESEARCH CATALOG",
    publishedAt: "2026-07-22",
    titleVariant: "A FIELD INDEX OF DECORATIVE SPECIMENS",
    kind: "dir",
  },
  {
    id: "etymology",
    href: "/etymology",
    title: "ETYMOLOGY",
    publishedAt: "2026-07-17",
    titleVariant: "WORD ORIGINS KEPT FOR LOOKING",
    kind: "file",
  },
  {
    id: "lab",
    href: "/lab",
    title: "LAB",
    publishedAt: "2025-11-01",
    titleVariant: "TRYING IDEAS BEFORE THEY'RE READY",
    kind: "dir",
  },
  {
    id: "writing",
    href: "/writing",
    title: "WRITING",
    publishedAt: "2025-10-01",
    titleVariant: "NOTES THAT NEED ROOM TO GROW",
    kind: "dir",
  },
  {
    id: "reading",
    href: "/reading",
    title: "LIBRARY",
    publishedAt: "2025-09-01",
    titleVariant: "BOOKS THAT REWIRE HOW I SEE",
    kind: "dir",
  },
] as const;

export function getSitePages(): SitePage[] {
  return [...SITE_PAGES].sort((a, b) => {
    const byDate = b.publishedAt.localeCompare(a.publishedAt);
    if (byDate !== 0) return byDate;
    return a.title.localeCompare(b.title);
  });
}

export function formatPageYear(publishedAt: string): string {
  return publishedAt.slice(0, 4);
}

/** Terminal `ls`-style basename (`ornaments/`, `etymology`). */
export function formatListingName(page: SitePage): string {
  const base = page.id;
  return page.kind === "dir" ? `${base}/` : base;
}
