"use client";

import Image from "next/image";
import { type PreparedTextWithSegments } from "@chenglou/pretext";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useEditorSurface } from "@/components/editor/EditorContext";
import { DEFAULT_ABOUT_EDITOR_CONFIG } from "@/lib/about-editor-config";
import {
  ABOUT_TEXT_BLOCK_IDS,
  cloneAboutEditorConfig,
  splitAboutFlowText,
  type AboutEditorConfig,
  type AboutTextBlockId,
  type AboutTextStyle,
} from "@/lib/about-editor-types";
import { readEditorStorage, writeEditorStorage } from "@/lib/editor-storage";
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

const preparedTextCache = new Map<string, PreparedTextWithSegments>();
const ABOUT_EDITOR_STORAGE_KEY = "portfolio-editor:v1:about";

type ShapeAlign = "left" | "center";

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

function textAlignClass(justify: boolean): string {
  return justify ? "text-justify" : "text-left";
}

function AboutEditorPanel({
  config,
  selectedId,
  onSelect,
  onConfigChange,
  onReset,
  onBake,
}: {
  config: AboutEditorConfig;
  selectedId: AboutTextBlockId;
  onSelect: (id: AboutTextBlockId) => void;
  onConfigChange: (config: AboutEditorConfig) => void;
  onReset: () => void;
  onBake: () => Promise<void>;
}) {
  const [bakeStatus, setBakeStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const selected = config.textBlocks[selectedId];

  const updateSelected = (
    key: keyof Pick<AboutTextStyle, "fontSize" | "color" | "justify">,
    value: number | string | boolean,
  ) => {
    onConfigChange({
      ...config,
      textBlocks: {
        ...config.textBlocks,
        [selectedId]: { ...selected, [key]: value },
      },
    });
  };

  const bake = async () => {
    setBakeStatus("saving");

    try {
      await onBake();
      setBakeStatus("saved");
      window.setTimeout(() => setBakeStatus("idle"), 1800);
    } catch {
      setBakeStatus("error");
    }
  };

  return (
    <div className="grid gap-3">
      <div>
        <p className="font-mono text-[10px] font-extralight uppercase tracking-[0.1em] text-ink/60">
          About Text Flow
        </p>
        <p className="mt-1 font-serif text-sm tracking-[-0.04375rem] text-ink">
          {selected.label}
        </p>
      </div>

      <select
        value={selectedId}
        onChange={(event) => onSelect(event.target.value as AboutTextBlockId)}
        className="w-full rounded-sm border border-ink/10 bg-paper px-2 py-1.5 font-mono text-[10px] font-extralight uppercase tracking-[0.08em] text-ink"
      >
        {ABOUT_TEXT_BLOCK_IDS.map((id) => (
          <option key={id} value={id}>
            {config.textBlocks[id].label}
          </option>
        ))}
      </select>

      <label className="grid gap-1">
        <span className="font-mono text-[10px] font-extralight uppercase tracking-[0.08em] text-ink/45">
          Continuous Copy
        </span>
        <textarea
          value={config.sourceText}
          onChange={(event) =>
            onConfigChange({ ...config, sourceText: event.target.value })
          }
          rows={10}
          className="min-h-40 resize-y rounded-sm border border-ink/10 bg-paper p-2 font-serif text-xs leading-relaxed tracking-[-0.04375rem] text-ink outline-none focus:border-ink/30"
        />
      </label>

      <div className="grid gap-3 border-t border-ink/10 pt-3">
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
            onChange={(event) => updateSelected("justify", event.target.checked)}
            className="accent-ink"
          />
        </label>
      </div>

      <div className="flex justify-between gap-2 border-t border-ink/10 pt-3">
        <button
          type="button"
          onClick={onReset}
          className="cursor-pointer font-mono text-[10px] font-extralight uppercase tracking-[0.1em] text-ink/40 transition-colors hover:text-ink"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={bake}
          disabled={bakeStatus === "saving"}
          className="cursor-pointer rounded-sm border border-ink/10 px-2 py-1.5 font-mono text-[10px] font-extralight uppercase tracking-[0.1em] text-ink/55 transition-colors hover:bg-highlight hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          {bakeStatus === "saving"
            ? "Baking"
            : bakeStatus === "saved"
              ? "Baked"
              : bakeStatus === "error"
                ? "Error"
                : "Bake About"}
        </button>
      </div>
    </div>
  );
}

export function AboutEditorialLayout() {
  const [config, setConfig] = useState<AboutEditorConfig>(() =>
    readEditorStorage(
      ABOUT_EDITOR_STORAGE_KEY,
      cloneAboutEditorConfig(DEFAULT_ABOUT_EDITOR_CONFIG),
    ),
  );
  const [selectedTextBlockId, setSelectedTextBlockId] =
    useState<AboutTextBlockId>("intro");
  const flowText = splitAboutFlowText(config.sourceText);
  const introBlock = config.textBlocks.intro;
  const bodyBlock = config.textBlocks.body;
  const bodyExtraBlock = config.textBlocks.bodyExtra;
  const statementBlock = config.textBlocks.statement;
  const lowerBlock = config.textBlocks.lower;
  const footerBlock = config.textBlocks.footer;

  const resetConfig = useCallback(() => {
    setConfig(cloneAboutEditorConfig(DEFAULT_ABOUT_EDITOR_CONFIG));
  }, []);

  const bakeConfig = useCallback(async () => {
    const response = await window.fetch("/api/about-editor-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config }),
    });

    if (!response.ok) throw new Error("Failed to bake about config");
  }, [config]);

  useEffect(() => {
    writeEditorStorage(ABOUT_EDITOR_STORAGE_KEY, config);
  }, [config]);

  const editorSurface = useMemo(
    () => ({
      id: "about-editor",
      title: "About",
      group: "Page",
      renderPanel: () => (
        <AboutEditorPanel
          config={config}
          selectedId={selectedTextBlockId}
          onSelect={setSelectedTextBlockId}
          onConfigChange={setConfig}
          onReset={resetConfig}
          onBake={bakeConfig}
        />
      ),
    }),
    [bakeConfig, config, resetConfig, selectedTextBlockId],
  );

  useEditorSurface(editorSurface);

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
    </section>
  );
}
