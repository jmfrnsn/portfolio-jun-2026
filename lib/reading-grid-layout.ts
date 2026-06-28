export type GridItemPlacement = {
  colSpanLg: 2 | 3 | 4;
  numberToCoverGap: string;
  coverWidthPercent: number;
  coverMaxWidth: string;
  coverAlign: "start" | "center" | "end";
  flyIn: { x: number; y: number };
};

const LG_SPAN_PATTERN: GridItemPlacement["colSpanLg"][] = [
  2, 2, 3, 2, 4, 2, 3, 2, 4, 2, 2, 3, 2,
];

const GAP_PATTERN = [
  "4.5rem",
  "7.25rem",
  "3.5rem",
  "6rem",
  "5.5rem",
  "8.5rem",
  "4rem",
  "6.75rem",
] as const;

const ALIGN_PATTERN: GridItemPlacement["coverAlign"][] = [
  "start",
  "start",
  "center",
  "end",
  "start",
  "center",
  "start",
  "end",
];

const FLY_IN_PATTERN: GridItemPlacement["flyIn"][] = [
  { x: -24, y: 56 },
  { x: 16, y: 72 },
  { x: -8, y: 48 },
  { x: 24, y: 64 },
];

function getCoverMaxWidth(colSpanLg: GridItemPlacement["colSpanLg"]): string {
  if (colSpanLg >= 4) return "30rem";
  if (colSpanLg >= 3) return "22rem";
  return "15rem";
}

export function getGridItemPlacement(index: number): GridItemPlacement {
  const colSpanLg = LG_SPAN_PATTERN[index % LG_SPAN_PATTERN.length] ?? 2;
  const gap = GAP_PATTERN[index % GAP_PATTERN.length] ?? "5rem";
  const row = Math.floor(index / 8);
  const rowOffset = row % 2 === 1 ? "1.25rem" : "0rem";

  return {
    colSpanLg,
    numberToCoverGap: `calc(${gap} + ${rowOffset})`,
    coverWidthPercent: 100,
    coverMaxWidth: getCoverMaxWidth(colSpanLg),
    coverAlign: ALIGN_PATTERN[index % ALIGN_PATTERN.length] ?? "start",
    flyIn: FLY_IN_PATTERN[index % FLY_IN_PATTERN.length] ?? { x: 0, y: 64 },
  };
}

export function getColSpanClassName(colSpanLg: GridItemPlacement["colSpanLg"]): string {
  const smSpan = colSpanLg >= 3 ? 2 : 1;
  const smClass = smSpan === 2 ? "sm:col-span-2" : "sm:col-span-1";
  const lgClass =
    colSpanLg === 4
      ? "lg:col-span-4"
      : colSpanLg === 3
        ? "lg:col-span-3"
        : "lg:col-span-2";

  return `col-span-1 ${smClass} ${lgClass}`;
}

export function getCoverWrapperClassName(
  align: GridItemPlacement["coverAlign"],
): string {
  if (align === "end") return "ml-auto";
  if (align === "center") return "mx-auto";
  return "";
}
