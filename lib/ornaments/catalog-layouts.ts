export const CATALOG_LAYOUT_IDS = [
  "plates",
  "textbook",
  "folio",
  "quire",
  "platebook",
  "gallery",
  "editorial",
  "draft",
  "dot",
] as const;

export type CatalogLayoutId = (typeof CATALOG_LAYOUT_IDS)[number];

export type CatalogLayoutOption = {
  id: CatalogLayoutId;
  label: string;
  blurb: string;
  family: "grid" | "page" | "folio" | "gallery" | "editorial" | "draft" | "dot";
};

export const CATALOG_LAYOUTS: CatalogLayoutOption[] = [
  {
    id: "plates",
    label: "Plates",
    family: "grid",
    blurb: "Open catalog grid with fig marks above each plate.",
  },
  {
    id: "textbook",
    label: "Textbook",
    family: "page",
    blurb: "Botany-manual pages in a horizontal scroll — Fig. N. captions below.",
  },
  {
    id: "folio",
    label: "Folio",
    family: "folio",
    blurb: "Facing leaves, two figures each — the open illustrated manual.",
  },
  {
    id: "quire",
    label: "Quire",
    family: "folio",
    blurb: "Denser gatherings: three small specimens stacked per leaf.",
  },
  {
    id: "platebook",
    label: "Platebook",
    family: "folio",
    blurb: "One large plate per leaf — museum plate-volume pacing.",
  },
  {
    id: "gallery",
    label: "Gallery",
    family: "gallery",
    blurb: "Dark museum strip — title, intro columns, arrows, and page dots.",
  },
  {
    id: "editorial",
    label: "Editorial",
    family: "editorial",
    blurb: "Shortest-column pack — notes with their plates, lanes kept level.",
  },
  {
    id: "draft",
    label: "Draft",
    family: "draft",
    blurb: "Engineering sheet — fine units, major crosses, plates on the module.",
  },
  {
    id: "dot",
    label: "Dot",
    family: "dot",
    blurb: "Sparse + field — lookbook placement with open ground between plates.",
  },
];

export const DEFAULT_CATALOG_LAYOUT: CatalogLayoutId = "textbook";
export const CATALOG_LAYOUT_STORAGE_KEY = "ornament-catalog-layout";

export function isCatalogLayoutId(value: unknown): value is CatalogLayoutId {
  return (
    typeof value === "string" &&
    (CATALOG_LAYOUT_IDS as readonly string[]).includes(value)
  );
}

export function formatTextbookFigLabel(index: number) {
  return `Fig. ${index + 1}.`;
}

export type FolioFamilyId = Extract<
  CatalogLayoutId,
  "folio" | "quire" | "platebook"
>;

export function isFolioFamilyId(value: CatalogLayoutId): value is FolioFamilyId {
  return value === "folio" || value === "quire" || value === "platebook";
}
