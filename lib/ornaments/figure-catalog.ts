import type { ExportedOrnamentSource } from "./sources-export";

export type OrnamentFigure = {
  source: ExportedOrnamentSource;
  index: number;
  figLabel: string;
  catalogCode: string;
  titleLabel: string;
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

/** Short plate captions, closer to catalog index labels than full museum titles. */
export function simplifyCaptionTitle(title: string) {
  let simplified = title.trim().replace(/\s+/g, " ");

  // Drop trailing parentheticals: "(German, 17th century)", "(… pl. 38)"
  simplified = simplified.replace(/(?:\s*\([^)]*\))+\s*$/g, "").trim();

  // "Design for an Alcove…" → "Alcove…"
  simplified = simplified
    .replace(/^Designs?\s+for\s+(?:an?\s+|the\s+)?/i, "")
    .trim();

  // Keep the object noun, drop long descriptive tails.
  // "Alcove with a Coat of Arms…" → "Alcove"
  // "Ornament Design with Vases" → "Ornament Design"
  const withMatch = simplified.match(
    /^(.+?)\s+with\s+(?:a|an|the)\s+/i,
  );
  if (withMatch?.[1]) {
    simplified = withMatch[1].trim();
  } else {
    const genericWith = simplified.match(/^(.+?)\s+with\s+/i);
    if (genericWith?.[1] && simplified.length > 28) {
      simplified = genericWith[1].trim();
    }
  }

  // "Chandelier … Motifs" leftovers
  simplified = simplified.replace(/\s+Motifs?$/i, "").trim();

  return simplified || title.trim();
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
      titleLabel: simplifyCaptionTitle(source.title),
      dateLabel: formatDateLabel(source.year),
    };
  });
}
