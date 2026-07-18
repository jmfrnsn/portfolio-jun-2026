import type { ExportedOrnamentSource } from "./sources-export";

export type OrnamentFigure = {
  source: ExportedOrnamentSource;
  index: number;
  figLabel: string;
  catalogCode: string;
  dateLabel: string;
};

function formatFigLabel(index: number) {
  return `(Fig.${String(index + 1).padStart(2, "0")})`;
}

function formatDateLabel(year: string) {
  const trimmed = year.trim();
  if (!trimmed || trimmed.toLowerCase() === "n.d.") {
    return "n.d.";
  }

  if (/[–—-]|\bcentury\b|\d{4}\s*[-–]\s*\d{4}/i.test(trimmed)) {
    return `*(${trimmed})`;
  }

  return trimmed;
}

/** Assign stable A.1 / B.2 style codes by era grouping. */
export function toOrnamentFigures(
  sources: ExportedOrnamentSource[],
): OrnamentFigure[] {
  const eras = [...new Set(sources.map((source) => source.era))].sort((a, b) =>
    a.localeCompare(b),
  );
  const eraLetters = new Map(
    eras.map((era, index) => [
      era,
      String.fromCharCode(65 + (index % 26)),
    ]),
  );
  const eraCounts = new Map<string, number>();

  return sources.map((source, index) => {
    const letter = eraLetters.get(source.era) ?? "Z";
    const next = (eraCounts.get(letter) ?? 0) + 1;
    eraCounts.set(letter, next);

    return {
      source,
      index,
      figLabel: formatFigLabel(index),
      catalogCode: `${letter}.${next}`,
      dateLabel: formatDateLabel(source.year),
    };
  });
}
