export const READING_LAYOUTS = [
  { id: "library", label: "Library" },
  { id: "table", label: "Table" },
  { id: "covers", label: "Covers" },
  { id: "grid", label: "Grid" },
  { id: "middle", label: "Middle" },
  { id: "cards", label: "Cards" },
] as const;

export type ReadingLayoutId = (typeof READING_LAYOUTS)[number]["id"];

export const DEFAULT_READING_LAYOUT: ReadingLayoutId = "library";

export const READING_LAYOUT_STORAGE_KEY = "portfolio-reading-layout-v2";

export function isReadingLayoutId(value: string): value is ReadingLayoutId {
  return READING_LAYOUTS.some((layout) => layout.id === value);
}
