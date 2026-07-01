"use client";

import Image from "next/image";
import { motion, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { getBookCoverUrl } from "@/lib/book-cover";
import {
  getLibraryCardAsset,
  type LibraryCardAsset,
} from "@/lib/reading-library-card";
import {
  READING_LIST_2025,
  READING_LIST_2026,
  type ReadingEntry2025,
  type ReadingEntry2026,
  type ReadingStatus,
} from "@/lib/reading-list";

const LIBRARY_RED = "#d7361f";

type HeroCardConfig = {
  startLeft: number;
  startTop: number;
  startRotate: number;
  endLeft: number;
  endTop: number;
  endRotate: number;
};

type DraftHeroPosition = {
  left: number;
  top: number;
};

const HERO_CARD_CONFIGS: HeroCardConfig[] = [
  { startLeft: 44, startTop: 22, startRotate: 0, endLeft: 8, endTop: 4, endRotate: -7 },
  { startLeft: 44, startTop: 22, startRotate: 0, endLeft: 28, endTop: 34, endRotate: -11 },
  { startLeft: 44, startTop: 22, startRotate: 0, endLeft: 51, endTop: 6, endRotate: 13 },
  { startLeft: 44, startTop: 22, startRotate: 0, endLeft: 67, endTop: -4, endRotate: -15 },
  { startLeft: 44, startTop: 22, startRotate: 0, endLeft: 81, endTop: 24, endRotate: 4 },
  { startLeft: 44, startTop: 22, startRotate: 0, endLeft: -4, endTop: 38, endRotate: -22 },
] as const;

const HERO_CARD_WIDTH = "12.5rem";

const COVER_OVERLAY_POSITIONS = [
  { left: "50%", top: "42%", width: "34%", rotate: "-1.1deg" },
  { left: "45%", top: "46%", width: "31%", rotate: "0.7deg" },
  { left: "56%", top: "39%", width: "36%", rotate: "1.2deg" },
  { left: "48%", top: "52%", width: "29%", rotate: "-0.5deg" },
  { left: "54%", top: "48%", width: "33%", rotate: "0.4deg" },
] as const;

type LibraryEntry = {
  name: string;
  author: string;
  year: string;
  genre: string;
  length: string;
  status: ReadingStatus;
  rating?: number;
  started?: string;
};

function mapEntry2026(entry: ReadingEntry2026): LibraryEntry {
  return {
    name: entry.name,
    author: entry.author,
    year: entry.started.replace(/^.*,\s*/, ""),
    genre: entry.length,
    length: entry.length,
    status: entry.status,
    started: entry.started,
  };
}

function mapEntry2025(entry: ReadingEntry2025): LibraryEntry {
  return {
    name: entry.name,
    author: entry.author,
    year: "2025",
    genre: entry.genre,
    length: entry.length,
    status: entry.status,
    rating: entry.rating,
  };
}

function getLibraryEntries(): LibraryEntry[] {
  return [
    ...READING_LIST_2026.map(mapEntry2026),
    ...READING_LIST_2025.map(mapEntry2025),
  ];
}

function BookCoverOverlay({
  title,
  index,
}: {
  title: string;
  index: number;
}) {
  const [failed, setFailed] = useState(false);
  const position =
    COVER_OVERLAY_POSITIONS[index % COVER_OVERLAY_POSITIONS.length]!;

  if (failed) return null;

  return (
    <div
      className="absolute aspect-[3/4] -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-ink/10 bg-paper"
      style={{
        left: position.left,
        top: position.top,
        width: position.width,
        rotate: position.rotate,
      }}
    >
      <Image
        src={getBookCoverUrl(title)}
        alt=""
        fill
        draggable={false}
        sizes="96px"
        className="pointer-events-none object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function LibraryCardImage({
  asset,
  title,
  index,
}: {
  asset: LibraryCardAsset;
  title: string;
  index: number;
}) {
  return (
    <div
      className="relative w-full"
      style={{ aspectRatio: `${asset.width} / ${asset.height}` }}
    >
      <Image
        src={asset.src}
        alt=""
        fill
        draggable={false}
        sizes="220px"
        className="pointer-events-none object-contain"
        priority={index < 4}
      />
      <BookCoverOverlay title={title} index={index} />
    </div>
  );
}

function DraggableLibraryCard({
  entry,
  index,
  config,
  previewStart,
  replayKey,
  onSelect,
  onDragPosition,
}: {
  entry: LibraryEntry;
  index: number;
  config: HeroCardConfig;
  previewStart: boolean;
  replayKey: number;
  onSelect: (index: number) => void;
  onDragPosition: (index: number, x: number, y: number) => void;
}) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const asset = getLibraryCardAsset(entry.name, index);
  const activeRotation = previewStart ? config.startRotate : config.endRotate;
  const baseRotation = activeRotation;
  const dragRotation = `${baseRotation + (index % 2 === 0 ? 4 : -4)}deg`;

  useEffect(() => {
    x.set(0);
    y.set(0);
  }, [previewStart, replayKey, x, y]);

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.12}
      dragSnapToOrigin={false}
      className="absolute cursor-grab touch-none active:cursor-grabbing"
      title="Drag library card"
      onPointerDown={() => onSelect(index)}
      onDrag={() => onDragPosition(index, x.get(), y.get())}
      onDragEnd={() => onDragPosition(index, x.get(), y.get())}
      style={{
        x,
        y,
        width: HERO_CARD_WIDTH,
      }}
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0.82,
              left: `${config.startLeft}%`,
              top: `${config.startTop}%`,
              rotate: `${config.startRotate}deg`,
              scale: 0.96,
            }
      }
      animate={{
        opacity: 0.78,
        left: `${previewStart ? config.startLeft : config.endLeft}%`,
        top: `${previewStart ? config.startTop : config.endTop}%`,
        rotate: `${activeRotation}deg`,
        scale: 1,
      }}
      whileHover={{
        opacity: 1,
        scale: 1.035,
        zIndex: 10,
        transition: {
          type: "spring",
          stiffness: 700,
          damping: 28,
          mass: 0.35,
        },
      }}
      whileTap={{ rotate: dragRotation, scale: 1.045 }}
      whileDrag={{
        opacity: 1,
        rotate: dragRotation,
        scale: 1.045,
        zIndex: 20,
        transition: {
          type: "spring",
          stiffness: 520,
          damping: 24,
          mass: 0.45,
        },
      }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              type: "spring",
              stiffness: 95,
              damping: 18,
              mass: 0.75,
              delay: 0.35,
            }
      }
      aria-label={`${entry.name} by ${entry.author}`}
    >
      <LibraryCardImage asset={asset} title={entry.name} index={index} />
    </motion.div>
  );
}

function HeroEditorControl({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-1">
      <span className="flex items-center justify-between font-mono text-[10px] font-extralight uppercase tracking-[0.08em] text-ink/45">
        {label}
        <span className="text-ink/70">{value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="accent-ink"
      />
    </label>
  );
}

function LibraryHeroEditor({
  entries,
  configs,
  selectedIndex,
  previewStart,
  draftPosition,
  onSelect,
  onPreviewStartChange,
  onPlaceStart,
  onPlaceEnd,
  onReplay,
  onReset,
  onConfigChange,
}: {
  entries: LibraryEntry[];
  configs: HeroCardConfig[];
  selectedIndex: number;
  previewStart: boolean;
  draftPosition?: DraftHeroPosition;
  onSelect: (index: number) => void;
  onPreviewStartChange: (value: boolean) => void;
  onPlaceStart: () => void;
  onPlaceEnd: () => void;
  onReplay: () => void;
  onReset: () => void;
  onConfigChange: (index: number, config: HeroCardConfig) => void;
}) {
  const [open, setOpen] = useState(false);
  const config = configs[selectedIndex]!;
  const entry = entries[selectedIndex]!;

  const update = (key: keyof HeroCardConfig, value: number) => {
    onConfigChange(selectedIndex, { ...config, [key]: value });
  };

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      <div className="pointer-events-auto flex flex-col items-end gap-1.5">
        {open ? (
          <div className="w-[min(calc(100vw-2rem),22rem)] rounded-md border border-ink/10 bg-paper/95 p-3 shadow-sm backdrop-blur-sm">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] font-extralight uppercase tracking-[0.1em] text-ink/60">
                  Hero Edit
                </p>
                <p className="mt-1 truncate font-serif text-sm tracking-[-0.04375rem] text-ink">
                  {entry.name}
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
              value={selectedIndex}
              onChange={(event) => onSelect(Number(event.target.value))}
              className="mb-3 w-full rounded-sm border border-ink/10 bg-paper px-2 py-1.5 font-mono text-[10px] font-extralight uppercase tracking-[0.08em] text-ink"
            >
              {entries.slice(0, configs.length).map((item, index) => (
                <option key={item.name} value={index}>
                  {String(index + 1).padStart(2, "0")} {item.name}
                </option>
              ))}
            </select>

            <div className="mb-3 grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => onPreviewStartChange(true)}
                className={`cursor-pointer rounded-sm border px-2 py-1.5 font-mono text-[10px] font-extralight uppercase tracking-[0.08em] transition-colors ${
                  previewStart
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/10 text-ink/55 hover:bg-highlight"
                }`}
              >
                Start
              </button>
              <button
                type="button"
                onClick={() => onPreviewStartChange(false)}
                className={`cursor-pointer rounded-sm border px-2 py-1.5 font-mono text-[10px] font-extralight uppercase tracking-[0.08em] transition-colors ${
                  !previewStart
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/10 text-ink/55 hover:bg-highlight"
                }`}
              >
                End
              </button>
            </div>

            <div className="mb-3 rounded-sm border border-ink/10 bg-highlight/40 p-2">
              <p className="mb-2 font-mono text-[10px] font-extralight uppercase tracking-[0.08em] text-ink/45">
                Drag selected card, then place keyframe
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={onPlaceStart}
                  disabled={!draftPosition}
                  className="cursor-pointer rounded-sm border border-ink/10 px-2 py-1.5 font-mono text-[10px] font-extralight uppercase tracking-[0.08em] text-ink/55 transition-colors hover:bg-paper disabled:cursor-not-allowed disabled:opacity-35"
                >
                  Set Start Here
                </button>
                <button
                  type="button"
                  onClick={onPlaceEnd}
                  disabled={!draftPosition}
                  className="cursor-pointer rounded-sm border border-ink/10 px-2 py-1.5 font-mono text-[10px] font-extralight uppercase tracking-[0.08em] text-ink/55 transition-colors hover:bg-paper disabled:cursor-not-allowed disabled:opacity-35"
                >
                  Set End Here
                </button>
              </div>
              {draftPosition ? (
                <p className="mt-2 font-mono text-[10px] font-extralight uppercase tracking-[0.08em] text-ink/35">
                  Current: {draftPosition.left.toFixed(1)} /{" "}
                  {draftPosition.top.toFixed(1)}
                </p>
              ) : null}
            </div>

            <div className="grid gap-3">
              <div className="grid gap-2 border-t border-ink/10 pt-3">
                <p className="font-mono text-[10px] font-extralight uppercase tracking-[0.1em] text-ink/35">
                  Start
                </p>
                <HeroEditorControl label="Left %" value={config.startLeft} min={-20} max={100} onChange={(value) => update("startLeft", value)} />
                <HeroEditorControl label="Top %" value={config.startTop} min={-20} max={80} onChange={(value) => update("startTop", value)} />
                <HeroEditorControl label="Rotate" value={config.startRotate} min={-45} max={45} onChange={(value) => update("startRotate", value)} />
              </div>

              <div className="grid gap-2 border-t border-ink/10 pt-3">
                <p className="font-mono text-[10px] font-extralight uppercase tracking-[0.1em] text-ink/35">
                  End
                </p>
                <HeroEditorControl label="Left %" value={config.endLeft} min={-20} max={100} onChange={(value) => update("endLeft", value)} />
                <HeroEditorControl label="Top %" value={config.endTop} min={-20} max={80} onChange={(value) => update("endTop", value)} />
                <HeroEditorControl label="Rotate" value={config.endRotate} min={-45} max={45} onChange={(value) => update("endRotate", value)} />
              </div>
            </div>

            <div className="mt-4 flex justify-between gap-2">
              <button
                type="button"
                onClick={onReset}
                className="cursor-pointer font-mono text-[10px] font-extralight uppercase tracking-[0.1em] text-ink/40 transition-colors hover:text-ink"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={onReplay}
                className="cursor-pointer rounded-sm border border-ink/10 px-2 py-1.5 font-mono text-[10px] font-extralight uppercase tracking-[0.1em] text-ink/55 transition-colors hover:bg-highlight hover:text-ink"
              >
                Replay
              </button>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="cursor-pointer rounded-md border border-ink/10 bg-paper/80 px-2.5 py-1.5 font-mono text-[10px] font-extralight uppercase tracking-[0.1em] text-ink/45 backdrop-blur-sm transition-colors hover:border-ink/20 hover:bg-paper hover:text-ink/70"
        >
          Hero Edit
        </button>
      </div>
    </div>
  );
}

function LibraryHero({ entries }: { entries: LibraryEntry[] }) {
  const heroRef = useRef<HTMLElement>(null);
  const heroEntries = entries.slice(0, HERO_CARD_CONFIGS.length);
  const [configs, setConfigs] = useState<HeroCardConfig[]>(() =>
    HERO_CARD_CONFIGS.map((config) => ({ ...config })),
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [previewStart, setPreviewStart] = useState(false);
  const [draftPositions, setDraftPositions] = useState<
    Partial<Record<number, DraftHeroPosition>>
  >({});
  const [replayKey, setReplayKey] = useState(0);

  const updateConfig = (index: number, config: HeroCardConfig) => {
    setConfigs((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? config : item)),
    );
  };

  const resetConfigs = () => {
    setConfigs(HERO_CARD_CONFIGS.map((config) => ({ ...config })));
    setDraftPositions({});
    setPreviewStart(false);
    setReplayKey((value) => value + 1);
  };

  const replay = () => {
    setDraftPositions({});
    setPreviewStart(false);
    setReplayKey((value) => value + 1);
  };

  const updateDraggedPosition = (index: number, offsetX: number, offsetY: number) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;

    const config = configs[index];
    if (!config) return;

    const baseLeft = previewStart ? config.startLeft : config.endLeft;
    const baseTop = previewStart ? config.startTop : config.endTop;
    const left = baseLeft + (offsetX / rect.width) * 100;
    const top = baseTop + (offsetY / rect.height) * 100;

    setSelectedIndex(index);
    setDraftPositions((current) => ({
      ...current,
      [index]: {
        left: Number(left.toFixed(2)),
        top: Number(top.toFixed(2)),
      },
    }));
  };

  const placeKeyframe = (target: "start" | "end") => {
    const draft = draftPositions[selectedIndex];
    if (!draft) return;

    setConfigs((current) =>
      current.map((config, index) => {
        if (index !== selectedIndex) return config;
        return target === "start"
          ? { ...config, startLeft: draft.left, startTop: draft.top }
          : { ...config, endLeft: draft.left, endTop: draft.top };
      }),
    );
    setDraftPositions((current) => {
      const next = { ...current };
      delete next[selectedIndex];
      return next;
    });
    setPreviewStart(target === "start");
    setReplayKey((value) => value + 1);
  };

  return (
    <section
      ref={heroRef}
      className="relative h-[42rem] overflow-visible md:h-[48rem]"
    >
      <p
        className="font-playground-thin pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[55%] text-[clamp(10rem,30vw,27rem)] leading-none text-ink/[0.035]"
        aria-hidden="true"
      >
        Library
      </p>
      <div className="absolute inset-x-0 top-0 h-full">
        {heroEntries.map((entry, index) => (
          <DraggableLibraryCard
            key={`${entry.name}-${replayKey}`}
            entry={entry}
            index={index}
            config={configs[index]!}
            previewStart={previewStart}
            replayKey={replayKey}
            onSelect={setSelectedIndex}
            onDragPosition={updateDraggedPosition}
          />
        ))}
      </div>
      <LibraryHeroEditor
        entries={heroEntries}
        configs={configs}
        selectedIndex={selectedIndex}
        previewStart={previewStart}
        draftPosition={draftPositions[selectedIndex]}
        onSelect={setSelectedIndex}
        onPreviewStartChange={setPreviewStart}
        onPlaceStart={() => placeKeyframe("start")}
        onPlaceEnd={() => placeKeyframe("end")}
        onReplay={replay}
        onReset={resetConfigs}
        onConfigChange={updateConfig}
      />
    </section>
  );
}

function statusLabel(status: ReadingStatus): string {
  if (status === "In progress") return "Reading";
  if (status === "To be read") return "Queued";
  return "Finished";
}

function LibraryListRow({
  entry,
  index,
  expanded,
  onToggle,
}: {
  entry: LibraryEntry;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-t" style={{ borderColor: LIBRARY_RED }}>
      <button
        type="button"
        onClick={onToggle}
        className="grid w-full grid-cols-[minmax(9rem,1.5fr)_4.5rem_minmax(8rem,1fr)_minmax(7rem,0.8fr)_auto] items-center gap-4 px-3 py-3 text-left font-mono text-[0.6875rem] font-extralight tracking-[-0.04375rem] transition-colors hover:bg-[#d7361f]/[0.035]"
        style={{ color: LIBRARY_RED }}
      >
        <span>{entry.name}</span>
        <span>{entry.year}</span>
        <span>{entry.author}</span>
        <span>{entry.genre}</span>
        <span>{expanded ? "−" : "+"}</span>
      </button>

      {expanded ? (
        <div
          className="grid gap-6 px-3 pb-6 md:grid-cols-[18rem_minmax(0,1fr)]"
          style={{ color: LIBRARY_RED }}
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-[#d7361f]/[0.04]">
            <Image
              src={getBookCoverUrl(entry.name, "L")}
              alt=""
              fill
              sizes="18rem"
              className="object-cover"
            />
          </div>
          <div className="grid gap-x-8 gap-y-4 md:grid-cols-[9rem_minmax(0,1fr)]">
            <p className="font-mono text-[0.6875rem] font-extralight tracking-[-0.04375rem]">
              Notes:
            </p>
            <p className="max-w-3xl font-mono text-[0.6875rem] font-extralight leading-relaxed tracking-[-0.04375rem]">
              {entry.name} by {entry.author}. A {entry.length.toLowerCase()} in
              the library archive, currently marked {statusLabel(entry.status).toLowerCase()}.
            </p>

            <p className="font-mono text-[0.6875rem] font-extralight tracking-[-0.04375rem]">
              Metadata:
            </p>
            <div className="space-y-2 font-mono text-[0.6875rem] font-extralight leading-relaxed tracking-[-0.04375rem]">
              <p>Length: {entry.length}</p>
              <p>Status: {statusLabel(entry.status)}</p>
              {entry.started ? <p>Started: {entry.started}</p> : null}
              {entry.rating != null ? <p>Rating: {entry.rating}/10</p> : null}
            </div>

            <p className="font-mono text-[0.6875rem] font-extralight tracking-[-0.04375rem]">
              Shelf:
            </p>
            <p className="font-mono text-[0.6875rem] font-extralight leading-relaxed tracking-[-0.04375rem]">
              {index < READING_LIST_2026.length ? "2026 reading" : "2025 archive"}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function LibraryList({ entries }: { entries: LibraryEntry[] }) {
  const [expandedIndex, setExpandedIndex] = useState(0);

  return (
    <section className="bg-paper pb-32">
      <div className="overflow-x-auto">
        <div className="min-w-[56rem]">
          <div
            className="grid grid-cols-[minmax(9rem,1.5fr)_4.5rem_minmax(8rem,1fr)_minmax(7rem,0.8fr)_auto] gap-4 border-t px-3 py-3 font-mono text-[0.6875rem] font-extralight tracking-[-0.04375rem]"
            style={{ borderColor: LIBRARY_RED, color: LIBRARY_RED }}
          >
            <span>↑ Title</span>
            <span>↑ Year</span>
            <span>↑ Author</span>
            <span>↑ Genre</span>
            <span />
          </div>

          {entries.map((entry, index) => (
            <LibraryListRow
              key={`${entry.name}-${entry.author}-${index}`}
              entry={entry}
              index={index}
              expanded={expandedIndex === index}
              onToggle={() =>
                setExpandedIndex((current) => (current === index ? -1 : index))
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReadingListLibrary() {
  const entries = useMemo(getLibraryEntries, []);

  return (
    <div>
      <LibraryHero entries={entries} />
      <LibraryList entries={entries} />
    </div>
  );
}
