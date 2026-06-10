import type { PositionedLine } from "./pretext-monogram-layout";

export type LineProjection = {
  lines: PositionedLine[];
  font: string;
  lineHeight: number;
  letterSpacing: number;
  justify: boolean;
};

let measureContext: CanvasRenderingContext2D | null = null;

function getMeasureContext(): CanvasRenderingContext2D {
  if (!measureContext) {
    const canvas = document.createElement("canvas");
    measureContext = canvas.getContext("2d")!;
  }
  return measureContext;
}

function measureTextWidth(
  text: string,
  font: string,
  letterSpacing: number,
): number {
  if (!text) return 0;

  const context = getMeasureContext();
  context.font = font;

  let width = 0;
  for (let index = 0; index < text.length; index++) {
    width += context.measureText(text[index]!).width;
    if (index < text.length - 1) {
      width += letterSpacing;
    }
  }

  return width;
}

const FULL_WIDTH_SLOT_RATIO = 0.9;
const MAX_WORD_SPACING_MULTIPLIER = 1.5;
const MAX_EXTRA_LETTER_SPACING = 0.4;

function isFullWidthLine(line: PositionedLine, maxSlotWidth: number): boolean {
  return line.slotWidth >= maxSlotWidth * FULL_WIDTH_SLOT_RATIO;
}

function applyLineAlignment(
  element: HTMLSpanElement,
  line: PositionedLine,
  projection: LineProjection,
  maxSlotWidth: number,
): void {
  element.style.wordSpacing = "0px";
  element.style.letterSpacing = `${projection.letterSpacing}px`;
  element.style.textAlign = "left";

  if (!projection.justify || !isFullWidthLine(line, maxSlotWidth)) return;

  const words = line.text.trim().split(/\s+/).filter(Boolean);
  if (words.length < 2) return;

  const spaceWidth = measureTextWidth(" ", projection.font, 0);
  const wordsWidth = words.reduce(
    (total, word) =>
      total + measureTextWidth(word, projection.font, projection.letterSpacing),
    0,
  );
  const naturalWidth = wordsWidth + spaceWidth * (words.length - 1);
  const extraSpace = line.slotWidth - naturalWidth;

  if (extraSpace <= 0) return;

  const gaps = words.length - 1;
  const maxAdditionalWordSpacing =
    spaceWidth * Math.max(MAX_WORD_SPACING_MULTIPLIER - 1, 0);
  const additionalWordSpacing = Math.min(
    extraSpace / gaps,
    maxAdditionalWordSpacing,
  );
  element.style.wordSpacing = `${additionalWordSpacing}px`;

  const filledByWords = additionalWordSpacing * gaps;
  let remaining = extraSpace - filledByWords;
  if (remaining <= 0) return;

  const charGaps = Math.max(line.text.length - 1, 1);
  const letterSpacingExtra = Math.min(
    remaining / charGaps,
    MAX_EXTRA_LETTER_SPACING,
  );

  if (letterSpacingExtra > 0) {
    element.style.letterSpacing = `${projection.letterSpacing + letterSpacingExtra}px`;
  }
}

function syncPool(
  pool: HTMLSpanElement[],
  length: number,
  parent: HTMLElement,
  create: () => HTMLSpanElement,
): void {
  while (pool.length < length) {
    const element = create();
    pool.push(element);
    parent.appendChild(element);
  }
  while (pool.length > length) {
    const element = pool.pop();
    element?.remove();
  }
}

export function projectPositionedLines(
  parent: HTMLElement,
  pool: HTMLSpanElement[],
  projection: LineProjection,
): void {
  syncPool(pool, projection.lines.length, parent, () => {
    const element = document.createElement("span");
    element.className = "about-ink-line absolute text-ink";
    return element;
  });

  const maxSlotWidth = projection.lines.reduce(
    (max, line) => Math.max(max, line.slotWidth),
    0,
  );

  for (let index = 0; index < projection.lines.length; index++) {
    const element = pool[index]!;
    const line = projection.lines[index]!;
    element.textContent = line.text;
    element.style.left = `${line.x}px`;
    element.style.top = `${line.y}px`;
    element.style.width = `${line.slotWidth}px`;
    element.style.display = "block";
    element.style.height = `${projection.lineHeight}px`;
    element.style.overflow = "hidden";
    element.style.whiteSpace = "nowrap";
    element.style.font = projection.font;
    element.style.lineHeight = `${projection.lineHeight}px`;
    applyLineAlignment(element, line, projection, maxSlotWidth);
  }
}
