"use client";

import { type PreparedTextWithSegments } from "@chenglou/pretext";
import { useLayoutEffect, useRef, useState } from "react";

import { projectPositionedLines } from "@/lib/pretext-line-projection";
import {
  clearPreparedTextCache,
  getPreparedText,
  layoutTextAroundMonogram,
  positionedLinesEqual,
  type PositionedLine,
} from "@/lib/pretext-monogram-layout";
import { getWrapHull, type Point, type Rect } from "@/lib/pretext-wrap-geometry";
import {
  getAboutTypography,
  getSerifFontSpec,
  waitForSerifFonts,
} from "@/lib/typography";

const DROP_CAP_SRC = "/images/drop-cap-j.svg";

type MonogramLayoutConfig = {
  scale: number;
  offsetY: number;
  textGap: number;
  linesBesideMobile: number;
  linesBesideDesktop: number;
};

type PretextAboutTextProps = {
  aboutText: string;
  aboutFontSize: number;
  monogramScale: number;
  monogramOffsetY: number;
  monogramTextGap: number;
  monogramLinesBesideMobile: number;
  monogramLinesBesideDesktop: number;
};

type TextProjection = {
  lines: PositionedLine[];
  font: string;
  lineHeight: number;
  letterSpacing: number;
  firstParagraphHeight: number;
  monogramRect: Rect;
};

const preparedCache = new Map<string, PreparedTextWithSegments>();
let monogramHullPromise: Promise<Point[]> | null = null;

function getMonogramHull(): Promise<Point[]> {
  monogramHullPromise ??= getWrapHull(DROP_CAP_SRC, {
    smoothRadius: 4,
    mode: "envelope",
  });
  return monogramHullPromise;
}

/**
 * Snap cap size to whole line bands so text below starts on a clean line,
 * not mid-band (fractional scale values otherwise land between lines).
 */
function snapMonogramSideToLineGrid(
  scaledSide: number,
  lineHeight: number,
  offsetY: number,
  textGap: number,
): number {
  const lineCount = Math.max(
    1,
    Math.round((scaledSide + textGap) / lineHeight),
  );
  let side = lineCount * lineHeight - textGap;
  const alignedBottom = Math.round((offsetY + side) / lineHeight) * lineHeight;
  side = alignedBottom - offsetY;
  return Math.max(lineHeight - textGap, side);
}

function getMonogramSize(
  containerWidth: number,
  lineHeight: number,
  layout: MonogramLayoutConfig,
): Pick<Rect, "width" | "height"> {
  const linesBeside =
    containerWidth >= 768
      ? layout.linesBesideDesktop
      : layout.linesBesideMobile;
  const scaledSide =
    (linesBeside * lineHeight - layout.textGap) * layout.scale;
  const side = snapMonogramSideToLineGrid(
    scaledSide,
    lineHeight,
    layout.offsetY,
    layout.textGap,
  );
  return { width: side, height: side };
}

function computeProjection(
  containerWidth: number,
  hull: Point[],
  serifFamily: string,
  layout: MonogramLayoutConfig,
  aboutFontSize: number,
  bodyText: string,
): TextProjection {
  const { fontSize, lineHeight, letterSpacing } = getAboutTypography(aboutFontSize);
  const font = getSerifFontSpec(fontSize, serifFamily);
  const { width, height } = getMonogramSize(containerWidth, lineHeight, layout);
  const monogramRect: Rect = {
    x: 0,
    y: layout.offsetY,
    width,
    height,
  };
  const prepared = getPreparedText(bodyText, font, preparedCache, letterSpacing);
  const first = layoutTextAroundMonogram(
    prepared,
    { x: 0, y: 0, width: containerWidth, height: 100_000 },
    lineHeight,
    monogramRect,
    hull,
    layout.textGap,
  );

  return {
    monogramRect,
    lines: first.lines,
    firstParagraphHeight: Math.max(
      first.height,
      monogramRect.y + monogramRect.height,
    ),
    font,
    lineHeight,
    letterSpacing,
  };
}

function setMonogramLayout(
  element: HTMLDivElement | null,
  rect: Rect,
): void {
  if (!element) return;
  element.style.left = `${rect.x}px`;
  element.style.top = `${rect.y}px`;
  element.style.width = `${rect.width}px`;
  element.style.height = `${rect.height}px`;
}

function getBodyText(aboutText: string): string {
  return aboutText.startsWith("J") ? aboutText.slice(1) : aboutText;
}

export function PretextAboutText({
  aboutText,
  aboutFontSize,
  monogramScale,
  monogramOffsetY,
  monogramTextGap,
  monogramLinesBesideMobile,
  monogramLinesBesideDesktop,
}: PretextAboutTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const monogramRef = useRef<HTMLDivElement>(null);
  const linePoolRef = useRef<HTMLSpanElement[]>([]);
  const hullRef = useRef<Point[] | null>(null);
  const serifFamilyRef = useRef<string | null>(null);
  const projectionRef = useRef<TextProjection | null>(null);
  const lastAboutTextRef = useRef(aboutText);
  const layoutRef = useRef<MonogramLayoutConfig>({
    scale: monogramScale,
    offsetY: monogramOffsetY,
    textGap: monogramTextGap,
    linesBesideMobile: monogramLinesBesideMobile,
    linesBesideDesktop: monogramLinesBesideDesktop,
  });
  const [isReady, setIsReady] = useState(false);

  layoutRef.current = {
    scale: monogramScale,
    offsetY: monogramOffsetY,
    textGap: monogramTextGap,
    linesBesideMobile: monogramLinesBesideMobile,
    linesBesideDesktop: monogramLinesBesideDesktop,
  };

  const projectLayout = (projection: TextProjection) => {
    const textLayer = textLayerRef.current;
    if (!textLayer) return;

    textLayer.style.minHeight = `${projection.firstParagraphHeight}px`;
    projectPositionedLines(textLayer, linePoolRef.current, {
      lines: projection.lines,
      font: projection.font,
      lineHeight: projection.lineHeight,
      letterSpacing: projection.letterSpacing,
      justify: true,
    });
  };

  const commitLayout = (containerWidth: number) => {
    const hull = hullRef.current;
    const textLayer = textLayerRef.current;
    if (!hull || !textLayer) return;

    const serifFamily = serifFamilyRef.current;
    if (!serifFamily) return;

    const nextProjection = computeProjection(
      containerWidth,
      hull,
      serifFamily,
      layoutRef.current,
      aboutFontSize,
      getBodyText(aboutText),
    );
    const previous = projectionRef.current;

    const linesChanged =
      previous === null ||
      !positionedLinesEqual(previous.lines, nextProjection.lines);
    const typographyChanged =
      previous === null ||
      previous.font !== nextProjection.font ||
      previous.lineHeight !== nextProjection.lineHeight ||
      previous.letterSpacing !== nextProjection.letterSpacing;
    const heightChanged =
      previous === null ||
      previous.firstParagraphHeight !== nextProjection.firstParagraphHeight;

    if (linesChanged || typographyChanged || heightChanged) {
      projectLayout(nextProjection);
    }

    setMonogramLayout(monogramRef.current, nextProjection.monogramRect);
    projectionRef.current = nextProjection;

    if (!isReady) setIsReady(true);
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    async function relayout() {
      const serifFamily = await waitForSerifFonts([aboutFontSize]);
      if (cancelled || !container) return;

      if (serifFamilyRef.current !== serifFamily) {
        clearPreparedTextCache(preparedCache);
        serifFamilyRef.current = serifFamily;
        projectionRef.current = null;
      }

      if (lastAboutTextRef.current !== aboutText) {
        clearPreparedTextCache(preparedCache);
        projectionRef.current = null;
        lastAboutTextRef.current = aboutText;
      }

      const hull = await getMonogramHull();
      if (cancelled || !container) return;

      hullRef.current = hull;

      const containerWidth = container.clientWidth;
      if (containerWidth <= 0) return;

      commitLayout(containerWidth);
    }

    relayout();

    const observer = new ResizeObserver(() => {
      const containerWidth = container.clientWidth;
      if (containerWidth <= 0 || !hullRef.current) return;
      commitLayout(containerWidth);
    });
    observer.observe(container);

    return () => {
      cancelled = true;
      observer.disconnect();
      for (const element of linePoolRef.current) {
        element.remove();
      }
      linePoolRef.current = [];
    };
  }, [
    aboutText,
    aboutFontSize,
    monogramScale,
    monogramOffsetY,
    monogramTextGap,
    monogramLinesBesideMobile,
    monogramLinesBesideDesktop,
  ]);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[11rem] md:min-h-[14rem]"
      style={{ fontSize: aboutFontSize }}
    >
      <div
        ref={textLayerRef}
        className={`relative ${isReady ? "opacity-100" : "opacity-0"}`}
        aria-hidden={!isReady}
      >
        <div
          ref={monogramRef}
          className="pointer-events-none absolute left-0 top-0 z-[2]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={DROP_CAP_SRC}
            alt=""
            draggable={false}
            className="h-full w-full object-contain object-top"
          />
        </div>
      </div>
    </div>
  );
}
