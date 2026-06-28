export type LibraryCardPlaceholder = {
  id: string;
  label: string;
  src: string;
  width: number;
  height: number;
};

/** Placeholder art until each book has a bespoke card asset. */
export const LIBRARY_CARD_PLACEHOLDERS: LibraryCardPlaceholder[] = [
  {
    id: "library-placeholder",
    label: "Library checkout card",
    src: "/reading/cards/library-placeholder.png",
    width: 537,
    height: 862,
  },
];

export type LibraryCardBespokeAsset = {
  src: string;
  width?: number;
  height?: number;
};

/**
 * Per-book bespoke card art. Keys match `ReadingEntry.name`.
 *
 * @example
 * "Good Old Neon": "/reading/cards/good-old-neon.png"
 * "The Goldfinch": { src: "/reading/cards/goldfinch.png", width: 500, height: 800 }
 */
export const LIBRARY_CARD_ASSETS: Partial<
  Record<string, string | LibraryCardBespokeAsset>
> = {};

export type LibraryCardAsset = {
  src: string;
  width: number;
  height: number;
  isPlaceholder: boolean;
  placeholderId?: string;
};

export function getLibraryCardAsset(title: string, index: number): LibraryCardAsset {
  const bespoke = LIBRARY_CARD_ASSETS[title];
  if (bespoke) {
    const src = typeof bespoke === "string" ? bespoke : bespoke.src;
    const width =
      typeof bespoke === "string" ? 436 : (bespoke.width ?? 436);
    const height =
      typeof bespoke === "string" ? 776 : (bespoke.height ?? 776);

    return {
      src,
      width,
      height,
      isPlaceholder: false,
    };
  }

  const placeholder =
    LIBRARY_CARD_PLACEHOLDERS[index % LIBRARY_CARD_PLACEHOLDERS.length]!;

  return {
    src: placeholder.src,
    width: placeholder.width,
    height: placeholder.height,
    isPlaceholder: true,
    placeholderId: placeholder.id,
  };
}

export function formatCardDate(started: string): string {
  const parsed = new Date(started);
  if (Number.isNaN(parsed.getTime())) return started;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
