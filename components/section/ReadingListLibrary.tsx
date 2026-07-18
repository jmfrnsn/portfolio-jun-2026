"use client";

import Image from "next/image";
import { motion, useMotionValue } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { useEditorSurface } from "@/components/editor/EditorContext";
import { getBookCoverUrl } from "@/lib/book-cover";
import { readEditorStorage, writeEditorStorage } from "@/lib/editor-storage";
import {
  DEFAULT_LIBRARY_HERO_CARD_PLACEMENTS,
  type LibraryHeroCardPlacement,
} from "@/lib/library-hero-config";
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
const HERO_CARD_WIDTH = "12.5rem";
const LIBRARY_EDITOR_STORAGE_KEY = "portfolio-editor:v1:library";

function cloneDefaultLibraryHeroCardPlacements(): LibraryHeroCardPlacement[] {
  return DEFAULT_LIBRARY_HERO_CARD_PLACEMENTS.map((placement) => ({ ...placement }));
}

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
  placement,
  onSelect,
  onDragPlacement,
}: {
  entry: LibraryEntry;
  index: number;
  placement: LibraryHeroCardPlacement;
  onSelect: (index: number) => void;
  onDragPlacement: (index: number, offsetX: number, offsetY: number) => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const asset = getLibraryCardAsset(entry.name, index);
  const dragRotation = `${placement.rotate + (index % 2 === 0 ? 4 : -4)}deg`;

  useEffect(() => {
    x.set(0);
    y.set(0);
  }, [placement.left, placement.top, x, y]);

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.12}
      dragSnapToOrigin={false}
      className="absolute cursor-grab touch-none active:cursor-grabbing"
      title="Drag library card"
      onPointerDown={() => onSelect(index)}
      onDragEnd={() => onDragPlacement(index, x.get(), y.get())}
      style={{
        x,
        y,
        width: HERO_CARD_WIDTH,
        left: `${placement.left}%`,
        top: `${placement.top}%`,
        rotate: `${placement.rotate}deg`,
        opacity: 0.78,
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
      aria-label={`${entry.name} by ${entry.author}`}
    >
      <LibraryCardImage asset={asset} title={entry.name} index={index} />
    </motion.div>
  );
}

function PlacementEditorControl({
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

function LibraryHeroPlacementPanel({
  entries,
  placements,
  selectedIndex,
  onSelect,
  onPlacementChange,
  onReset,
}: {
  entries: LibraryEntry[];
  placements: LibraryHeroCardPlacement[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onPlacementChange: (index: number, placement: LibraryHeroCardPlacement) => void;
  onReset: () => void;
}) {
  const [bakeStatus, setBakeStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const placement = placements[selectedIndex]!;
  const entry = entries[selectedIndex]!;

  const update = (key: keyof LibraryHeroCardPlacement, value: number) => {
    onPlacementChange(selectedIndex, { ...placement, [key]: value });
  };

  const bakePlacements = async () => {
    setBakeStatus("saving");

    try {
      const response = await window.fetch("/api/library-hero-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placements }),
      });

      if (!response.ok) throw new Error("Failed to bake placements");

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
          Card Layout
        </p>
        <p className="mt-1 truncate font-serif text-sm tracking-[-0.04375rem] text-ink">
          {entry.name}
        </p>
      </div>

      <select
        value={selectedIndex}
        onChange={(event) => onSelect(Number(event.target.value))}
        className="w-full rounded-sm border border-ink/10 bg-paper px-2 py-1.5 font-mono text-[10px] font-extralight uppercase tracking-[0.08em] text-ink"
      >
        {entries.map((item, index) => (
          <option key={item.name} value={index}>
            {String(index + 1).padStart(2, "0")} {item.name}
          </option>
        ))}
      </select>

      <p className="rounded-sm border border-ink/10 bg-highlight/40 p-2 font-mono text-[10px] font-extralight uppercase tracking-[0.08em] text-ink/45">
        Drag cards on the page, or tune the selected card below.
      </p>

      <div className="grid gap-2 border-t border-ink/10 pt-3">
        <PlacementEditorControl
          label="Left %"
          value={placement.left}
          min={-30}
          max={110}
          step={0.25}
          onChange={(value) => update("left", value)}
        />
        <PlacementEditorControl
          label="Top %"
          value={placement.top}
          min={-30}
          max={90}
          step={0.25}
          onChange={(value) => update("top", value)}
        />
        <PlacementEditorControl
          label="Rotate"
          value={placement.rotate}
          min={-45}
          max={45}
          onChange={(value) => update("rotate", value)}
        />
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
          onClick={bakePlacements}
          disabled={bakeStatus === "saving"}
          className="cursor-pointer rounded-sm border border-ink/10 px-2 py-1.5 font-mono text-[10px] font-extralight uppercase tracking-[0.1em] text-ink/55 transition-colors hover:bg-highlight hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          {bakeStatus === "saving"
            ? "Baking"
            : bakeStatus === "saved"
              ? "Baked"
              : bakeStatus === "error"
                ? "Error"
                : "Bake Layout"}
        </button>
      </div>
    </div>
  );
}

function LibraryHero({ entries }: { entries: LibraryEntry[] }) {
  const heroRef = useRef<HTMLElement>(null);
  const heroEntries = entries.slice(0, DEFAULT_LIBRARY_HERO_CARD_PLACEMENTS.length);
  const [placements, setPlacements] = useState<LibraryHeroCardPlacement[]>(() =>
    readEditorStorage(
      LIBRARY_EDITOR_STORAGE_KEY,
      cloneDefaultLibraryHeroCardPlacements(),
    ),
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const updatePlacement = (
    index: number,
    placement: LibraryHeroCardPlacement,
  ) => {
    setPlacements((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? placement : item)),
    );
  };

  const updateDraggedPlacement = (
    index: number,
    offsetX: number,
    offsetY: number,
  ) => {
    const rect = heroRef.current?.getBoundingClientRect();
    const placement = placements[index];
    if (!rect || !placement) return;

    updatePlacement(index, {
      ...placement,
      left: Number((placement.left + (offsetX / rect.width) * 100).toFixed(2)),
      top: Number((placement.top + (offsetY / rect.height) * 100).toFixed(2)),
    });
    setSelectedIndex(index);
  };

  const resetPlacements = () => {
    setPlacements(cloneDefaultLibraryHeroCardPlacements());
    setSelectedIndex(0);
  };

  useEffect(() => {
    writeEditorStorage(LIBRARY_EDITOR_STORAGE_KEY, placements);
  }, [placements]);

  const editorSurface = useMemo(
    () => ({
      id: "library-card-layout",
      title: "Library Cards",
      group: "Page",
      renderPanel: () => (
        <LibraryHeroPlacementPanel
          entries={heroEntries}
          placements={placements}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          onPlacementChange={updatePlacement}
          onReset={resetPlacements}
        />
      ),
    }),
    [heroEntries, placements, selectedIndex],
  );

  useEditorSurface(editorSurface);

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
            key={entry.name}
            entry={entry}
            index={index}
            placement={placements[index]!}
            onSelect={setSelectedIndex}
            onDragPlacement={updateDraggedPlacement}
          />
        ))}
      </div>
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
  const entries = useMemo(() => getLibraryEntries(), []);

  return (
    <div>
      <LibraryHero entries={entries} />
      <LibraryList entries={entries} />
    </div>
  );
}
