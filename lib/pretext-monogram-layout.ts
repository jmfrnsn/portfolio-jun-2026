import {
  layoutNextLine,
  prepareWithSegments,
  type LayoutCursor,
  type PreparedTextWithSegments,
} from "@chenglou/pretext";

import {
  carveTextLineSlots,
  getPolygonIntervalForBand,
  transformWrapPoints,
  type Interval,
  type Point,
  type Rect,
} from "./pretext-wrap-geometry";

export type PositionedLine = {
  x: number;
  y: number;
  width: number;
  slotWidth: number;
  text: string;
};

type MonogramObstacle = {
  hull: Point[];
  horizontalPadding: number;
  verticalPadding: number;
};

const MIN_SLOT_WIDTH = 24;

/** Gap between the drop cap and wrapped text on the right and below. */
export const MONOGRAM_TEXT_GAP = 10;

export function positionedLinesEqual(
  left: PositionedLine[],
  right: PositionedLine[],
): boolean {
  if (left.length !== right.length) return false;
  for (let index = 0; index < left.length; index++) {
    const a = left[index]!;
    const b = right[index]!;
    if (
      a.x !== b.x ||
      a.y !== b.y ||
      a.width !== b.width ||
      a.slotWidth !== b.slotWidth ||
      a.text !== b.text
    ) {
      return false;
    }
  }
  return true;
}

export function layoutTextAroundMonogram(
  prepared: PreparedTextWithSegments,
  region: Rect,
  lineHeight: number,
  monogramRect: Rect,
  monogramHull: Point[],
  textGap = MONOGRAM_TEXT_GAP,
): { lines: PositionedLine[]; height: number } {
  const obstacle: MonogramObstacle = {
    hull: transformWrapPoints(monogramHull, monogramRect),
    horizontalPadding: textGap,
    verticalPadding: 0,
  };

  let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
  let lineTop = region.y;
  const lines: PositionedLine[] = [];
  let textExhausted = false;

  while (
    lineTop + lineHeight <= region.y + region.height &&
    !textExhausted
  ) {
    const bandTop = lineTop;
    const bandBottom = lineTop + lineHeight;
    const blocked: Interval[] = [];

    const interval = getPolygonIntervalForBand(
      obstacle.hull,
      bandTop,
      bandBottom,
      obstacle.horizontalPadding,
      obstacle.verticalPadding,
    );
    if (interval !== null) blocked.push(interval);

    const slots = carveTextLineSlots(
      { left: region.x, right: region.x + region.width },
      blocked,
      MIN_SLOT_WIDTH,
    );

    if (slots.length === 0) {
      lineTop += lineHeight;
      continue;
    }

    const orderedSlots = [...slots].sort((left, right) => left.left - right.left);

    for (const slot of orderedSlots) {
      const slotWidth = slot.right - slot.left;
      const line = layoutNextLine(prepared, cursor, slotWidth);
      if (line === null) {
        textExhausted = true;
        break;
      }

      lines.push({
        x: Math.round(slot.left),
        y: Math.round(lineTop),
        width: line.width,
        slotWidth,
        text: line.text,
      });

      cursor = line.end;
    }

    lineTop += lineHeight;
  }

  const height =
    lines.length === 0
      ? 0
      : lines[lines.length - 1]!.y + lineHeight - region.y;

  return { lines, height };
}

export function clearPreparedTextCache(
  cache: Map<string, PreparedTextWithSegments>,
): void {
  cache.clear();
}

export function getPreparedText(
  text: string,
  font: string,
  cache: Map<string, PreparedTextWithSegments>,
  letterSpacing = 0,
): PreparedTextWithSegments {
  const key = `${font}::${letterSpacing}::${text}`;
  const cached = cache.get(key);
  if (cached !== undefined) return cached;
  const prepared = prepareWithSegments(text, font, { letterSpacing });
  cache.set(key, prepared);
  return prepared;
}
