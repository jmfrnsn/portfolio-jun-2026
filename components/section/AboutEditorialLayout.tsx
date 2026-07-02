"use client";

import Image from "next/image";
import { type PreparedTextWithSegments } from "@chenglou/pretext";
import { useLayoutEffect, useRef, useState } from "react";

import {
  clearPreparedTextCache,
  getPreparedText,
  layoutTextAroundMonogram,
} from "@/lib/pretext-monogram-layout";
import { projectPositionedLines } from "@/lib/pretext-line-projection";
import { getWrapHull, type Rect } from "@/lib/pretext-wrap-geometry";
import {
  getBodyLetterSpacingPx,
  getSerifFontSpec,
  waitForSerifFonts,
} from "@/lib/typography";

const ABOUT_INTRO_ART_SRC = "/about/figma/about-intro-art.svg";
const ABOUT_PORTRAIT_SRC = "/about/figma/about-portrait.png";
const ABOUT_BLUEPRINTS_SRC = "/about/figma/about-blueprints.png";
const ABOUT_LOWER_ART_SRC = "/about/figma/about-lower-art.png";
const ABOUT_FOOTER_ART_SRC = "/about/figma/about-footer-art.png";

const ABOUT_TEXT =
  "Jade is a product designer based in San Francisco, building at Perplexity. She has worked at Duolingo and Salesforce, and studied cognitive science, which shaped her interest in attention and perception. She aims to create artifacts that expand reality, things that help people notice and interact with the world anew. She is inspired by books, films, objects, and the collections people keep without quite knowing why.";

const INTRO_TEXT =
  "ade is a designer based in San Francisco. She aims to create artifacts that expand reality. Reality is often larger than we perceive. I want to create things that help people notice, observe, and interact with the world in new ways. I am endlessly inspired by books, movies, objects, and other artifacts. This page gathers the texture around that practice: attention, perception, research, stories, images, and the small collections that change how a thing can be seen.";

const LONG_FORM_TEXT = [
  ABOUT_TEXT,
  "I am interested in tools, stories, images, and other artifacts that give ordinary reality a little more surface area. A good interface can behave like a lens. A book can make one object feel newly strange. A map can turn knowledge into a place you want to walk through.",
  "My work sits between product design, visual systems, research, and art direction. I like making things that are useful, but I also like when a useful thing leaves behind a residue of feeling.",
].join(" ");

const DEFAULT_ABOUT_FLOW_TEXT = [
  INTRO_TEXT,
  LONG_FORM_TEXT,
  ABOUT_TEXT,
  "Jade is a designer based in San Francisco. Jade is a designer based in San Francisco. I aim to create artifacts that expand reality. Jade is a designer based in San Francisco.",
  Array(5).fill(ABOUT_TEXT).join(" "),
  Array(3).fill(LONG_FORM_TEXT).join(" "),
].join(" ");

const preparedTextCache = new Map<string, PreparedTextWithSegments>();

type ShapeAlign = "left" | "center";
type TextBlockId = "intro" | "body" | "bodyExtra" | "statement" | "lower" | "footer";

type EditableTextBlock = {
  label: string;
  content: string;
  fontSize: number;
  color: string;
  justify: boolean;
};

type EditableTextBlocks = Record<TextBlockId, EditableTextBlock>;

const DEFAULT_TEXT_BLOCKS: EditableTextBlocks = {
  intro: {
    label: "Intro Wrap",
    content: INTRO_TEXT,
    fontSize: 20,
    color: "#27301c",
    justify: true,
  },
  body: {
    label: "Portrait Body",
    content: LONG_FORM_TEXT,
    fontSize: 20,
    color: "#27301c",
    justify: true,
  },
  bodyExtra: {
    label: "Portrait Body 2",
    content: ABOUT_TEXT,
    fontSize: 20,
    color: "#27301c",
    justify: true,
  },
  statement: {
    label: "Statement",
    content:
      "Jade is a designer based in San Francisco. Jade is a designer based in San Francisco. I aim to create artifacts that expand reality. Jade is a designer based in San Francisco.",
    fontSize: 32,
    color: "#000000",
    justify: true,
  },
  lower: {
    label: "Lower Wrap",
    content: Array(5).fill(ABOUT_TEXT).join(" "),
    fontSize: 20,
    color: "#27301c",
    justify: true,
  },
  footer: {
    label: "Footer Ghost",
    content: Array(3).fill(LONG_FORM_TEXT).join(" "),
    fontSize: 20,
    color: "rgba(39, 48, 28, 0.25)",
    justify: true,
  },
};

const TEXT_BLOCK_IDS: TextBlockId[] = [
  "intro",
  "body",
  "bodyExtra",
  "statement",
  "lower",
  "footer",
];

const TEXT_FLOW_RATIOS: Record<TextBlockId, number> = {
  intro: 0.12,
  body: 0.18,
  bodyExtra: 0.1,
  statement: 0.08,
  lower: 0.37,
  footer: 0.15,
};

type AboutPretextWrapProps = {
  text: string;
  shapeSrc: string;
  shapeAlt: string;
  shapeAspectRatio: number;
  shapeWidth: number;
  mobileShapeWidth: number;
  shapeAlign?: ShapeAlign;
  shapeTop?: number;
  textGap?: number;
  fontSize?: number;
  lineHeightRatio?: number;
  color?: string;
  justify?: boolean;
  className?: string;
  imageClassName?: string;
};

function getShapeRect({
  containerWidth,
  shapeWidth,
  mobileShapeWidth,
  shapeAspectRatio,
  shapeAlign,
  shapeTop,
}: {
  containerWidth: number;
  shapeWidth: number;
  mobileShapeWidth: number;
  shapeAspectRatio: number;
  shapeAlign: ShapeAlign;
  shapeTop: number;
}): Rect {
  const width = containerWidth < 640 ? mobileShapeWidth : shapeWidth;
  return {
    x: shapeAlign === "center" ? Math.max(0, (containerWidth - width) / 2) : 0,
    y: shapeTop,
    width,
    height: width * shapeAspectRatio,
  };
}

function setShapeLayout(element: HTMLImageElement | null, rect: Rect): void {
  if (!element) return;
  element.style.left = `${rect.x}px`;
  element.style.top = `${rect.y}px`;
  element.style.width = `${rect.width}px`;
  element.style.height = `${rect.height}px`;
}

function AboutPretextWrap({
  text,
  shapeSrc,
  shapeAlt,
  shapeAspectRatio,
  shapeWidth,
  mobileShapeWidth,
  shapeAlign = "left",
  shapeTop = 0,
  textGap = 14,
  fontSize = 20,
  lineHeightRatio = 1.25,
  color = "#27301c",
  justify = true,
  className,
  imageClassName,
}: AboutPretextWrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const linesLayerRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<HTMLImageElement>(null);
  const linePoolRef = useRef<HTMLSpanElement[]>([]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const linesLayer = linesLayerRef.current;
    if (!container || !linesLayer) return;

    let cancelled = false;

    async function relayout() {
      const serifFamily = await waitForSerifFonts([fontSize]);
      const hull = await getWrapHull(shapeSrc, {
        smoothRadius: 4,
        mode: "envelope",
      });
      if (cancelled || !container || !linesLayer) return;

      const containerWidth = container.clientWidth;
      if (containerWidth <= 0) return;

      const lineHeight = Math.round(fontSize * lineHeightRatio);
      const letterSpacing = getBodyLetterSpacingPx();
      const font = getSerifFontSpec(fontSize, serifFamily);
      const shapeRect = getShapeRect({
        containerWidth,
        shapeWidth,
        mobileShapeWidth,
        shapeAspectRatio,
        shapeAlign,
        shapeTop,
      });
      const prepared = getPreparedText(text, font, preparedTextCache, letterSpacing);
      const projection = layoutTextAroundMonogram(
        prepared,
        { x: 0, y: 0, width: containerWidth, height: 100_000 },
        lineHeight,
        shapeRect,
        hull,
        textGap,
      );

      setShapeLayout(shapeRef.current, shapeRect);
      container.style.minHeight = `${Math.ceil(
        Math.max(projection.height, shapeRect.y + shapeRect.height),
      )}px`;
      projectPositionedLines(linesLayer, linePoolRef.current, {
        lines: projection.lines,
        font,
        lineHeight,
        letterSpacing,
        justify,
      });
      for (const element of linePoolRef.current) {
        element.style.color = color;
      }
    }

    relayout();

    const observer = new ResizeObserver(() => {
      relayout();
    });
    observer.observe(container);

    return () => {
      cancelled = true;
      observer.disconnect();
      for (const element of linePoolRef.current) {
        element.remove();
      }
      linePoolRef.current = [];
      clearPreparedTextCache(preparedTextCache);
    };
  }, [
    fontSize,
    color,
    justify,
    lineHeightRatio,
    mobileShapeWidth,
    shapeAlign,
    shapeAspectRatio,
    shapeSrc,
    shapeTop,
    shapeWidth,
    text,
    textGap,
  ]);

  return (
    <div
      ref={containerRef}
      aria-label={text}
      className={`relative w-full font-serif text-ink ${className ?? ""}`}
      style={{ color }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={shapeRef}
        src={shapeSrc}
        alt={shapeAlt}
        draggable={false}
        className={`pointer-events-none absolute z-[2] object-contain ${imageClassName ?? ""}`}
      />
      <div ref={linesLayerRef} className="about-ink-bleed relative z-[1]" />
    </div>
  );
}

function cloneDefaultTextBlocks(): EditableTextBlocks {
  return Object.fromEntries(
    Object.entries(DEFAULT_TEXT_BLOCKS).map(([id, block]) => [
      id,
      { ...block },
    ]),
  ) as EditableTextBlocks;
}

function textAlignClass(justify: boolean): string {
  return justify ? "text-justify" : "text-left";
}

function splitFlowText(text: string): Record<TextBlockId, string> {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const chunks = {} as Record<TextBlockId, string>;
  let cursor = 0;

  for (const id of TEXT_BLOCK_IDS) {
    const remainingWords = words.length - cursor;
    const remainingBlocks = TEXT_BLOCK_IDS.length - TEXT_BLOCK_IDS.indexOf(id);
    const isLast = id === TEXT_BLOCK_IDS[TEXT_BLOCK_IDS.length - 1];
    const count = isLast
      ? remainingWords
      : Math.min(
          remainingWords,
          Math.max(
            Math.round(words.length * TEXT_FLOW_RATIOS[id]),
            remainingBlocks > 1 ? 1 : 0,
          ),
        );

    chunks[id] = words.slice(cursor, cursor + count).join(" ");
    cursor += count;
  }

  return chunks;
}

function AboutInlineEditor({
  blocks,
  selectedId,
  sourceText,
  onSelect,
  onSourceTextChange,
  onBlockChange,
  onReset,
}: {
  blocks: EditableTextBlocks;
  selectedId: TextBlockId;
  sourceText: string;
  onSelect: (id: TextBlockId) => void;
  onSourceTextChange: (text: string) => void;
  onBlockChange: (id: TextBlockId, block: EditableTextBlock) => void;
  onReset: () => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = blocks[selectedId];

  const updateSelected = (
    key: keyof Pick<
      EditableTextBlock,
      "fontSize" | "color" | "justify"
    >,
    value: number | string | boolean,
  ) => {
    onBlockChange(selectedId, { ...selected, [key]: value });
  };

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      <div className="pointer-events-auto flex flex-col items-end gap-1.5">
        {open ? (
          <div className="w-[min(calc(100vw-2rem),24rem)] rounded-md border border-ink/10 bg-paper/95 p-3 shadow-sm backdrop-blur-sm">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] font-extralight uppercase tracking-[0.1em] text-ink/60">
                  About Edit
                </p>
                <p className="mt-1 font-serif text-sm tracking-[-0.04375rem] text-ink">
                  {selected.label}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="cursor-pointer font-mono text-[10px] font-extralight uppercase tracking-[0.1em] text-ink/40 transition-colors hover:text-ink"
              >
                Close
              </button>
            </div>

            <select
              value={selectedId}
              onChange={(event) => onSelect(event.target.value as TextBlockId)}
              className="mb-3 w-full rounded-sm border border-ink/10 bg-paper px-2 py-1.5 font-mono text-[10px] font-extralight uppercase tracking-[0.08em] text-ink"
            >
              {TEXT_BLOCK_IDS.map((id) => (
                <option key={id} value={id}>
                  {blocks[id].label}
                </option>
              ))}
            </select>

            <label className="grid gap-1">
              <span className="font-mono text-[10px] font-extralight uppercase tracking-[0.08em] text-ink/45">
                Continuous Copy
              </span>
              <textarea
                value={sourceText}
                onChange={(event) => onSourceTextChange(event.target.value)}
                rows={8}
                className="min-h-32 resize-y rounded-sm border border-ink/10 bg-paper p-2 font-serif text-xs leading-relaxed tracking-[-0.04375rem] text-ink outline-none focus:border-ink/30"
              />
            </label>

            <div className="mt-3 grid gap-3 border-t border-ink/10 pt-3">
              <label className="grid gap-1">
                <span className="flex items-center justify-between font-mono text-[10px] font-extralight uppercase tracking-[0.08em] text-ink/45">
                  Text Size
                  <span className="text-ink/70">{selected.fontSize}px</span>
                </span>
                <input
                  type="range"
                  min={10}
                  max={48}
                  step={1}
                  value={selected.fontSize}
                  onChange={(event) =>
                    updateSelected("fontSize", Number(event.target.value))
                  }
                  className="accent-ink"
                />
              </label>

              <div className="grid grid-cols-[1fr_auto] items-center gap-3">
                <label className="grid gap-1">
                  <span className="font-mono text-[10px] font-extralight uppercase tracking-[0.08em] text-ink/45">
                    Color
                  </span>
                  <input
                    type="text"
                    value={selected.color}
                    onChange={(event) => updateSelected("color", event.target.value)}
                    className="rounded-sm border border-ink/10 bg-paper px-2 py-1.5 font-mono text-[10px] font-extralight tracking-[0.04em] text-ink outline-none focus:border-ink/30"
                  />
                </label>
                <input
                  aria-label="Text color"
                  type="color"
                  value={
                    selected.color.startsWith("#") && selected.color.length === 7
                      ? selected.color
                      : "#27301c"
                  }
                  onChange={(event) => updateSelected("color", event.target.value)}
                  className="mt-4 h-8 w-10 cursor-pointer rounded-sm border border-ink/10 bg-paper"
                />
              </div>

              <label className="flex items-center justify-between gap-3 rounded-sm border border-ink/10 px-2 py-1.5 font-mono text-[10px] font-extralight uppercase tracking-[0.08em] text-ink/55">
                Justify
                <input
                  type="checkbox"
                  checked={selected.justify}
                  onChange={(event) =>
                    updateSelected("justify", event.target.checked)
                  }
                  className="accent-ink"
                />
              </label>
            </div>

            <div className="mt-4 flex justify-between">
              <button
                type="button"
                onClick={onReset}
                className="cursor-pointer font-mono text-[10px] font-extralight uppercase tracking-[0.1em] text-ink/40 transition-colors hover:text-ink"
              >
                Reset
              </button>
              <p className="font-mono text-[10px] font-extralight uppercase tracking-[0.1em] text-ink/30">
                Local Only
              </p>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="cursor-pointer rounded-md border border-ink/10 bg-paper/80 px-2.5 py-1.5 font-mono text-[10px] font-extralight uppercase tracking-[0.1em] text-ink/45 backdrop-blur-sm transition-colors hover:border-ink/20 hover:bg-paper hover:text-ink/70"
        >
          About Edit
        </button>
      </div>
    </div>
  );
}

export function AboutEditorialLayout() {
  const [textBlocks, setTextBlocks] = useState<EditableTextBlocks>(() =>
    cloneDefaultTextBlocks(),
  );
  const [sourceText, setSourceText] = useState(DEFAULT_ABOUT_FLOW_TEXT);
  const [selectedTextBlockId, setSelectedTextBlockId] =
    useState<TextBlockId>("intro");
  const flowText = splitFlowText(sourceText);
  const introBlock = textBlocks.intro;
  const bodyBlock = textBlocks.body;
  const bodyExtraBlock = textBlocks.bodyExtra;
  const statementBlock = textBlocks.statement;
  const lowerBlock = textBlocks.lower;
  const footerBlock = textBlocks.footer;

  const updateTextBlock = (id: TextBlockId, block: EditableTextBlock) => {
    setTextBlocks((current) => ({ ...current, [id]: block }));
  };

  return (
    <section className="relative overflow-hidden bg-paper px-6 pb-24 pt-36 text-ink sm:px-10 md:pb-36 md:pt-44 lg:px-14">
      <div className="mx-auto w-full max-w-[58.375rem]">
        <p className="font-serif text-xl leading-none text-black md:text-2xl">
          01. INTRO
        </p>

        <div className="mt-6">
          <AboutPretextWrap
            text={flowText.intro}
            shapeSrc={ABOUT_INTRO_ART_SRC}
            shapeAlt=""
            shapeAspectRatio={188 / 186}
            shapeWidth={186}
            mobileShapeWidth={112}
            fontSize={introBlock.fontSize}
            color={introBlock.color}
            justify={introBlock.justify}
          />
        </div>

        <div className="mt-7 grid items-start gap-8 md:grid-cols-[minmax(0,1fr)_26.5rem] md:gap-[3.375rem]">
          <div className="space-y-4 font-serif leading-[1.32] tracking-[-0.04375rem]">
            <p
              className={textAlignClass(bodyBlock.justify)}
              style={{ color: bodyBlock.color, fontSize: bodyBlock.fontSize }}
            >
              {flowText.body}
            </p>
            <p
              className={textAlignClass(bodyExtraBlock.justify)}
              style={{
                color: bodyExtraBlock.color,
                fontSize: bodyExtraBlock.fontSize,
              }}
            >
              {flowText.bodyExtra}
            </p>
          </div>
          <div className="relative mx-auto aspect-[424/450] w-full max-w-[26.5rem] overflow-hidden md:mx-0">
            <Image
              src={ABOUT_PORTRAIT_SRC}
              alt="Portrait of Jade Franson"
              fill
              sizes="(max-width: 768px) 80vw, 424px"
              className="object-cover object-bottom grayscale"
              priority
            />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-20 w-[min(100%,72rem)] md:mt-28">
        <div className="relative aspect-[735/520] w-full">
          <Image
            src={ABOUT_BLUEPRINTS_SRC}
            alt="Blueprints for reveries and continuity"
            fill
            sizes="(max-width: 768px) 92vw, 1152px"
            className="object-contain"
          />
        </div>
      </div>

      <div className="mx-auto mt-18 w-full max-w-[58.375rem] md:mt-24">
        <p
          className={`font-serif leading-[1.22] tracking-[-0.04375rem] ${textAlignClass(statementBlock.justify)}`}
          style={{
            color: statementBlock.color,
            fontSize: statementBlock.fontSize,
          }}
        >
          {flowText.statement}
        </p>

        <AboutPretextWrap
          text={flowText.lower}
          shapeSrc={ABOUT_LOWER_ART_SRC}
          shapeAlt=""
          shapeAspectRatio={1024 / 598}
          shapeWidth={300}
          mobileShapeWidth={168}
          shapeAlign="center"
          shapeTop={84}
          textGap={18}
          fontSize={lowerBlock.fontSize}
          lineHeightRatio={1.2}
          color={lowerBlock.color}
          justify={lowerBlock.justify}
          className="mt-8"
        />
      </div>

      <div className="relative mx-auto mt-28 w-full max-w-[82rem] pb-10 md:mt-36">
        <p
          className={`pointer-events-none absolute inset-x-1/2 bottom-4 w-[120rem] -translate-x-1/2 font-serif leading-[1.2] tracking-[-0.04375rem] ${textAlignClass(footerBlock.justify)}`}
          style={{ color: footerBlock.color, fontSize: footerBlock.fontSize }}
          aria-hidden="true"
        >
          {flowText.footer}
        </p>
        <div className="relative z-10 mx-auto aspect-[736/490] w-full max-w-[46rem]">
          <Image
            src={ABOUT_FOOTER_ART_SRC}
            alt="Decorative archival emblem"
            fill
            sizes="(max-width: 768px) 86vw, 736px"
            className="object-contain"
          />
        </div>
      </div>
      <AboutInlineEditor
        blocks={textBlocks}
        selectedId={selectedTextBlockId}
        sourceText={sourceText}
        onSelect={setSelectedTextBlockId}
        onSourceTextChange={setSourceText}
        onBlockChange={updateTextBlock}
        onReset={() => {
          setTextBlocks(cloneDefaultTextBlocks());
          setSourceText(DEFAULT_ABOUT_FLOW_TEXT);
        }}
      />
    </section>
  );
}
