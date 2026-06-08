"use client";

import { type PreparedTextWithSegments } from "@chenglou/pretext";
import { useLayoutEffect, useRef, useState } from "react";

import { projectPositionedLines } from "@/lib/pretext-line-projection";
import {
  getPreparedText,
  layoutTextAroundMonogram,
  positionedLinesEqual,
  type PositionedLine,
} from "@/lib/pretext-monogram-layout";
import { getWrapHull, type Point, type Rect } from "@/lib/pretext-wrap-geometry";

import { aboutText } from "./contents-data";

const DROP_CAP_SRC = "/images/drop-cap-j.svg";
const BODY_TEXT = aboutText.slice(1);
const MONOGRAM_OFFSET: Point = { x: 0, y: 0 };

let cachedSerifFontFamily: string | null = null;

function getSerifFontFamily(): string {
  if (cachedSerifFontFamily !== null) return cachedSerifFontFamily;
  if (typeof document === "undefined") {
    return '"Cormorant Garamond", "Times New Roman", serif';
  }

  const probe = document.createElement("span");
  probe.className = "font-serif";
  probe.style.visibility = "hidden";
  probe.style.position = "absolute";
  probe.textContent = "M";
  document.body.appendChild(probe);
  cachedSerifFontFamily = getComputedStyle(probe).fontFamily;
  probe.remove();
  return cachedSerifFontFamily;
}

function getTypography(containerWidth: number) {
  const fontSize = containerWidth >= 768 ? 24 : 18;
  const lineHeight = Math.round(fontSize * 1.5);
  const font = `${fontSize}px ${getSerifFontFamily()}`;
  return { fontSize, lineHeight, font };
}

type TextProjection = {
  lines: PositionedLine[];
  font: string;
  lineHeight: number;
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

function getMonogramSize(containerWidth: number): Pick<Rect, "width" | "height"> {
  const width = containerWidth >= 768 ? 186 : 88;
  const height = containerWidth >= 768 ? 188 : 88;
  return { width, height };
}

function computeProjection(
  containerWidth: number,
  hull: Point[],
): TextProjection {
  const { lineHeight, font } = getTypography(containerWidth);
  const { width, height } = getMonogramSize(containerWidth);
  const monogramRect: Rect = {
    x: MONOGRAM_OFFSET.x,
    y: MONOGRAM_OFFSET.y,
    width,
    height,
  };
  const prepared = getPreparedText(BODY_TEXT, font, preparedCache);
  const first = layoutTextAroundMonogram(
    prepared,
    { x: 0, y: 0, width: containerWidth, height: 100_000 },
    lineHeight,
    monogramRect,
    hull,
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

export function PretextAboutText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const monogramRef = useRef<HTMLDivElement>(null);
  const linePoolRef = useRef<HTMLSpanElement[]>([]);
  const hullRef = useRef<Point[] | null>(null);
  const projectionRef = useRef<TextProjection | null>(null);
  const [isReady, setIsReady] = useState(false);

  const projectLayout = (projection: TextProjection, containerWidth: number) => {
    const textLayer = textLayerRef.current;
    if (!textLayer) return;

    textLayer.style.minHeight = `${projection.firstParagraphHeight}px`;
    projectPositionedLines(textLayer, linePoolRef.current, {
      lines: projection.lines,
      font: projection.font,
      lineHeight: projection.lineHeight,
      justify: containerWidth >= 640,
    });
  };

  const commitLayout = (containerWidth: number) => {
    const hull = hullRef.current;
    const textLayer = textLayerRef.current;
    if (!hull || !textLayer) return;

    const nextProjection = computeProjection(containerWidth, hull);
    const previous = projectionRef.current;

    const linesChanged =
      previous === null ||
      !positionedLinesEqual(previous.lines, nextProjection.lines);
    const typographyChanged =
      previous === null ||
      previous.font !== nextProjection.font ||
      previous.lineHeight !== nextProjection.lineHeight;
    const heightChanged =
      previous === null ||
      previous.firstParagraphHeight !== nextProjection.firstParagraphHeight;

    if (linesChanged || typographyChanged || heightChanged) {
      projectLayout(nextProjection, containerWidth);
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
      await document.fonts.ready;
      const hull = await getMonogramHull();
      if (cancelled || !container) return;

      hullRef.current = hull;

      const containerWidth = container.clientWidth;
      if (containerWidth <= 0) return;

      commitLayout(containerWidth);
    }

    relayout();

    let resizeTimer: number;
    const observer = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const containerWidth = container.clientWidth;
        if (containerWidth <= 0 || !hullRef.current) return;
        commitLayout(containerWidth);
      }, 100);
    });
    observer.observe(container);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.clearTimeout(resizeTimer);
      for (const element of linePoolRef.current) {
        element.remove();
      }
      linePoolRef.current = [];
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[11rem] md:min-h-[14rem]"
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
