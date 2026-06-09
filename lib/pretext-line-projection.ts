import type { PositionedLine } from "./pretext-monogram-layout";

export type LineProjection = {
  lines: PositionedLine[];
  font: string;
  lineHeight: number;
  letterSpacing: number;
  justify: boolean;
};

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
    element.style.letterSpacing = `${projection.letterSpacing}px`;
    element.style.textAlign = projection.justify ? "justify" : "left";
  }
}
