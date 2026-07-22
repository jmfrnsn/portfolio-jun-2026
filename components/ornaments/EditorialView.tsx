"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { ArchiveSourceButton } from "@/components/ornaments/ArchiveSourceButton";
import { OrnamentImage } from "@/components/ornaments/OrnamentImage";
import { formatTextbookFigLabel } from "@/lib/ornaments/catalog-layouts";
import type { OrnamentFigure } from "@/lib/ornaments/figure-catalog";

type EditorialViewProps = {
  figures: OrnamentFigure[];
  isAdmin: boolean;
  onArchiveChange: (sourceId: string, nextArchived: boolean) => void;
};

type StudyNote = { id: string; text: string };

type ProseBlock = {
  kind: "prose";
  id: string;
  notes: StudyNote[];
  /** Estimated height used by the shortest-column packer. */
  height: number;
};

type PlateBlock = {
  kind: "plate";
  id: string;
  figure: OrnamentFigure;
  size: "sm" | "md" | "lg";
  height: number;
};

type LayoutBlock = ProseBlock | PlateBlock;

type PackedColumn = {
  height: number;
  blocks: LayoutBlock[];
};

const COLUMN_GAP = 28;
const PROSE_LINE = 22;
const PROSE_CHARS_PER_LINE = 42;

function shortEra(era: string) {
  return (
    era
      .replace(/\s*\([^)]*\)\s*/g, "")
      .replace(/\.$/, "")
      .trim() || "Ornament"
  );
}

function figureRef(figure: OrnamentFigure) {
  return formatTextbookFigLabel(figure.index).replace(/\.$/, "");
}

function estimateProseHeight(text: string) {
  const lines = Math.max(2, Math.ceil(text.length / PROSE_CHARS_PER_LINE));
  return lines * PROSE_LINE + 14;
}

function plateHeight(size: PlateBlock["size"]) {
  if (size === "lg") return 420;
  if (size === "sm") return 200;
  return 300;
}

function notesForFigure(figure: OrnamentFigure): StudyNote[] {
  const title = figure.titleLabel;
  const creator = figure.source.creator || "an anonymous draughtsman";
  const region = figure.source.region || "an unstated region";
  const year = figure.source.year || "n.d.";
  const era = shortEra(figure.source.era);
  const fromNotes = figure.source.notes?.trim();
  const notes: StudyNote[] = [];

  if (fromNotes) {
    notes.push({ id: `${figure.source.id}-notes`, text: fromNotes });
  }

  notes.push({
    id: `${figure.source.id}-attr`,
    text: `${figureRef(figure)} (${title}) is attributed to ${creator}, ${region}, ${year}. Read it as a ${era} specimen: attend to contour, the unit of repeat, and how ground is reserved around the motif.`,
  });

  notes.push({
    id: `${figure.source.id}-grammar`,
    text: `In ${figureRef(figure)}, the plate preserves a transferable grammar—edges that could migrate to wood, metal, plaster, or textile. Mark where the line thickens at joins and where it thins into foliage or scroll.`,
  });

  return notes;
}

const CLOSING_NOTES: StudyNote[] = [
  {
    id: "close-compare",
    text: "Taken together these plates ask for comparison rather than chronology alone: which forms lock into a border, which stand as freestanding trophies, and which dissolve into open grotesque fields.",
  },
  {
    id: "close-method",
    text: "A working method: name the smallest repeating cell, then the larger assembly it builds. Ornament becomes legible when the page holds several such assemblies in one view.",
  },
  {
    id: "close-ground",
    text: "Where a drawing feels sparse, the empty ground is part of the design. Where it feels dense, look for the hidden grid that keeps putti, acanthus, and strapwork from collapsing into noise.",
  },
  {
    id: "close-manual",
    text: "This catalog is a manual for looking, not a tutorial in drafting. The figures are specimens; the paragraphs are how we keep them from floating as isolated pictures.",
  },
];

function makeProseBlock(id: string, notes: StudyNote[]): ProseBlock {
  const height = notes.reduce(
    (sum, note) => sum + estimateProseHeight(note.text),
    8,
  );
  return { kind: "prose", id, notes, height };
}

function makePlateBlock(
  figure: OrnamentFigure,
  size: PlateBlock["size"],
): PlateBlock {
  return {
    kind: "plate",
    id: `plate-${figure.source.id}`,
    figure,
    size,
    height: plateHeight(size) + 56,
  };
}

/**
 * Build a reading-order stream: for each figure, its notes then its plate.
 * Keeping note→plate adjacent means packing can't separate caption from image
 * across the whole page the way the old hand grid did.
 */
function buildBlocks(figures: OrnamentFigure[]): LayoutBlock[] {
  const blocks: LayoutBlock[] = [];

  figures.forEach((figure, index) => {
    const size: PlateBlock["size"] =
      index % 5 === 2 ? "lg" : index % 3 === 0 ? "md" : "sm";
    blocks.push(makeProseBlock(`prose-${figure.source.id}`, notesForFigure(figure)));
    blocks.push(makePlateBlock(figure, size));
  });

  // Closing essays as separate prose units so they can fill short columns.
  for (const note of CLOSING_NOTES) {
    blocks.push(makeProseBlock(note.id, [note]));
  }

  return blocks;
}

/**
 * Greedy shortest-column packer (identical-machines / masonry greedy).
 * Places each block into the currently shortest column — the standard
 * online algorithm for balanced masonry when item heights are known.
 */
function packShortestColumn(
  blocks: LayoutBlock[],
  columnCount: number,
): PackedColumn[] {
  const columns: PackedColumn[] = Array.from({ length: columnCount }, () => ({
    height: 0,
    blocks: [],
  }));

  for (const block of blocks) {
    let shortest = 0;
    for (let i = 1; i < columns.length; i += 1) {
      if (columns[i]!.height < columns[shortest]!.height) {
        shortest = i;
      }
    }
    const column = columns[shortest]!;
    column.blocks.push(block);
    column.height += block.height + COLUMN_GAP;
  }

  return columns;
}

function useColumnCount() {
  const [count, setCount] = useState(2);

  useEffect(() => {
    const mqXl = window.matchMedia("(min-width: 1280px)");
    const mqMd = window.matchMedia("(min-width: 768px)");

    function update() {
      if (mqXl.matches) setCount(3);
      else if (mqMd.matches) setCount(2);
      else setCount(1);
    }

    update();
    mqXl.addEventListener("change", update);
    mqMd.addEventListener("change", update);
    return () => {
      mqXl.removeEventListener("change", update);
      mqMd.removeEventListener("change", update);
    };
  }, []);

  return count;
}

function ArchiveCorner({
  figure,
  isAdmin,
  onArchiveChange,
}: {
  figure: OrnamentFigure;
  isAdmin: boolean;
  onArchiveChange: (sourceId: string, nextArchived: boolean) => void;
}) {
  if (!isAdmin) return null;
  return (
    <div className="absolute right-0 top-0 z-10">
      <ArchiveSourceButton
        sourceId={figure.source.id}
        archived={figure.source.notionStatus === "Archived"}
        onCompleted={(nextArchived) =>
          onArchiveChange(figure.source.id, nextArchived)
        }
      />
    </div>
  );
}

function ProseBlockView({ block }: { block: ProseBlock }) {
  return (
    <div className="font-serif text-[0.9rem] leading-[1.55] tracking-[-0.02em] text-ink/80">
      {block.notes.map((note) => (
        <p key={note.id} className="mb-3.5 text-pretty last:mb-0">
          {note.text}
        </p>
      ))}
    </div>
  );
}

function PlateBlockView({
  block,
  isAdmin,
  onArchiveChange,
}: {
  block: PlateBlock;
  isAdmin: boolean;
  onArchiveChange: (sourceId: string, nextArchived: boolean) => void;
}) {
  const maxH =
    block.size === "lg"
      ? "h-[18rem] md:h-[22rem]"
      : block.size === "sm"
        ? "h-[10rem] md:h-[12rem]"
        : "h-[14rem] md:h-[16rem]";

  return (
    <figure className="group relative min-w-0">
      <Link
        href={`/ornaments/sources/${block.figure.source.id}`}
        className="block"
      >
        <div className={`relative w-full overflow-hidden ${maxH}`}>
          {block.figure.source.imageUrl ? (
            <OrnamentImage
              src={block.figure.source.imageUrl}
              alt={block.figure.source.title}
              width={1200}
              height={1500}
              sizes={
                block.size === "lg"
                  ? "36vw"
                  : block.size === "sm"
                    ? "18vw"
                    : "28vw"
              }
              className="mx-auto h-full w-auto max-w-full object-contain object-top"
            />
          ) : (
            <div className="flex h-28 items-center justify-center font-serif text-xs text-ink/35">
              No image
            </div>
          )}
        </div>
        <figcaption className="mt-2 font-serif text-[0.82rem] leading-snug tracking-[-0.03em] text-ink">
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.08em] text-fig">
            {formatTextbookFigLabel(block.figure.index)}
          </span>{" "}
          <span className="italic">{block.figure.titleLabel}</span>
          {block.figure.source.creator ? (
            <span className="text-ink/60">
              {" "}
              ({block.figure.source.creator}
              {block.figure.source.year
                ? `, ${block.figure.source.year}`
                : ""}
              )
            </span>
          ) : null}
        </figcaption>
      </Link>
      <ArchiveCorner
        figure={block.figure}
        isAdmin={isAdmin}
        onArchiveChange={onArchiveChange}
      />
    </figure>
  );
}

export function EditorialView({
  figures,
  isAdmin,
  onArchiveChange,
}: EditorialViewProps) {
  const columnCount = useColumnCount();
  const blocks = useMemo(() => buildBlocks(figures), [figures]);
  const columns = useMemo(
    () => packShortestColumn(blocks, columnCount),
    [blocks, columnCount],
  );

  const leadEra = shortEra(figures[0]?.source.era || "Ornament");

  return (
    <div className="relative mx-auto w-full max-w-[92rem]">
      <header className="mb-10 max-w-2xl">
        <p className="font-mono text-[10px] font-extralight uppercase tracking-[0.14em] text-ink/40">
          Catalog · Ornament Research
        </p>
        <h1 className="mt-1 font-serif text-3xl tracking-[-0.05em] text-ink md:text-5xl">
          Pattern &amp; Assembly
        </h1>
        <p className="mt-3 font-serif text-[0.95rem] leading-relaxed tracking-[-0.02em] text-ink/60">
          {leadEra} plates packed by shortest-column: each note sits with its
          figure, then blocks fill the lowest lane so columns stay level.
        </p>
      </header>

      <div
        className="grid items-start gap-x-8 gap-y-10 lg:gap-x-12"
        style={{
          gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
        }}
      >
        {columns.map((column, columnIndex) => (
          <div
            key={`col-${columnIndex}`}
            className="flex min-w-0 flex-col gap-7"
          >
            {column.blocks.map((block) =>
              block.kind === "prose" ? (
                <ProseBlockView key={block.id} block={block} />
              ) : (
                <PlateBlockView
                  key={block.id}
                  block={block}
                  isAdmin={isAdmin}
                  onArchiveChange={onArchiveChange}
                />
              ),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
