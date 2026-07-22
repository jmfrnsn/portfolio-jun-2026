"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { ArchiveSourceButton } from "@/components/ornaments/ArchiveSourceButton";
import { CatalogVersionDial } from "@/components/ornaments/CatalogVersionDial";
import { DotGridView } from "@/components/ornaments/DotGridView";
import { DraftGridView } from "@/components/ornaments/DraftGridView";
import { EditorialView } from "@/components/ornaments/EditorialView";
import { GalleryView } from "@/components/ornaments/GalleryView";
import { OrnamentImage } from "@/components/ornaments/OrnamentImage";
import {
  CATALOG_LAYOUT_STORAGE_KEY,
  DEFAULT_CATALOG_LAYOUT,
  formatTextbookFigLabel,
  isCatalogLayoutId,
  isFolioFamilyId,
  type CatalogLayoutId,
  type FolioFamilyId,
} from "@/lib/ornaments/catalog-layouts";
import {
  toOrnamentFigures,
  type OrnamentFigure,
} from "@/lib/ornaments/figure-catalog";
import type { ExportedOrnamentSource } from "@/lib/ornaments/sources-export";

const PENDING_ARCHIVE_KEY = "ornament-pending-archive-ids";

type SourceListProps = {
  sources: ExportedOrnamentSource[];
};

function readPendingArchiveIds() {
  if (typeof window === "undefined") return new Set<string>();
  try {
    const raw = window.sessionStorage.getItem(PENDING_ARCHIVE_KEY);
    if (!raw) return new Set<string>();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set<string>();
    return new Set(
      parsed.filter((value): value is string => typeof value === "string"),
    );
  } catch {
    return new Set<string>();
  }
}

function writePendingArchiveIds(ids: Set<string>) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(PENDING_ARCHIVE_KEY, JSON.stringify([...ids]));
}

function chunkFigures<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
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

function PlatesView({
  figures,
  isAdmin,
  onArchiveChange,
}: {
  figures: OrnamentFigure[];
  isAdmin: boolean;
  onArchiveChange: (sourceId: string, nextArchived: boolean) => void;
}) {
  return (
    <ul className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-10 lg:gap-y-14">
      {figures.map((figure) => (
        <li key={figure.source.id} className="group relative">
          <Link
            href={`/ornaments/sources/${figure.source.id}`}
            className="flex flex-col gap-3"
          >
            <p className="text-center font-serif text-[0.7rem] tracking-[-0.02em] text-fig sm:text-xs">
              {figure.figLabel}
            </p>
            <div className="relative flex aspect-square items-center justify-center overflow-hidden">
              {figure.source.imageUrl ? (
                <OrnamentImage
                  src={figure.source.imageUrl}
                  alt={figure.source.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 18vw"
                  className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.015]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-serif text-xs text-ink/35">
                  No image
                </div>
              )}
            </div>
          </Link>
          <ArchiveCorner
            figure={figure}
            isAdmin={isAdmin}
            onArchiveChange={onArchiveChange}
          />
        </li>
      ))}
    </ul>
  );
}

function TextbookView({
  figures,
  isAdmin,
  onArchiveChange,
}: {
  figures: OrnamentFigure[];
  isAdmin: boolean;
  onArchiveChange: (sourceId: string, nextArchived: boolean) => void;
}) {
  // One plate per leaf keeps horizontal paging readable.
  const pages = chunkFigures(figures, 1);

  return (
    <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2">
      <div
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 pt-1 sm:gap-5 sm:px-8 md:px-10"
        style={{ scrollbarGutter: "stable" }}
      >
        {pages.map((pageFigures, pageIndex) => {
          const pageNumber = pageIndex + 1;
          const figure = pageFigures[0];
          if (!figure) return null;

          const running =
            figure.source.era
              ?.replace(/\s*\([^)]*\)\s*/g, "")
              .replace(/\.$/, "")
              .toUpperCase() || "ORNAMENT";

          return (
            <article
              key={`textbook-page-${figure.source.id}`}
              className="relative flex w-[min(22rem,calc(100vw-2.5rem))] shrink-0 snap-center flex-col border border-ink/10 bg-transparent px-5 py-7 sm:w-[24rem] sm:px-8 sm:py-9"
            >
              <header className="mb-6 grid grid-cols-[2rem_1fr_2rem] items-baseline border-b border-ink/15 pb-2.5">
                <span className="font-serif text-sm text-ink/55">
                  {pageNumber}
                </span>
                <h2 className="truncate text-center font-serif text-[0.65rem] uppercase tracking-[0.16em] text-ink/70 sm:text-[0.7rem]">
                  {running}.
                </h2>
                <span className="text-right font-serif text-sm text-ink/55">
                  {pageNumber + 100}
                </span>
              </header>

              <figure className="group relative mx-auto flex min-h-0 w-full flex-1 flex-col">
                <Link
                  href={`/ornaments/sources/${figure.source.id}`}
                  className="flex min-h-0 flex-1 flex-col"
                >
                  <div className="relative mx-auto aspect-[4/5] w-full max-w-[18rem] flex-1 overflow-hidden bg-transparent">
                    {figure.source.imageUrl ? (
                      <OrnamentImage
                        src={figure.source.imageUrl}
                        alt={figure.source.title}
                        fill
                        sizes="18rem"
                        className="object-contain"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center font-serif text-xs text-ink/35">
                        No image
                      </div>
                    )}
                  </div>
                  <figcaption className="mt-4 text-center font-serif text-[0.9rem] leading-snug tracking-[-0.03em] text-ink">
                    <span className="text-fig">
                      {formatTextbookFigLabel(figure.index)}
                    </span>{" "}
                    <span className="italic">{figure.titleLabel}</span>
                    {figure.source.creator ? (
                      <span className="text-ink/70">
                        {" "}
                        ({figure.source.creator}
                        {figure.source.year ? `, ${figure.source.year}` : ""}
                        ).
                      </span>
                    ) : (
                      "."
                    )}
                  </figcaption>
                </Link>
                <ArchiveCorner
                  figure={figure}
                  isAdmin={isAdmin}
                  onArchiveChange={onArchiveChange}
                />
              </figure>

              <p className="mt-6 font-serif text-[0.8rem] leading-[1.5] tracking-[-0.02em] text-ink/70">
                <span className="font-semibold text-ink">
                  {pageNumber + 600}.
                </span>{" "}
                A plate for study from the grammar of ornament.
              </p>
            </article>
          );
        })}
        {/* Trailing pad so the last page can snap/center comfortably. */}
        <div className="w-2 shrink-0 sm:w-4" aria-hidden />
      </div>
    </div>
  );
}

const FOLIO_LEAF_SIZE: Record<FolioFamilyId, number> = {
  folio: 2,
  quire: 3,
  platebook: 1,
};

const FOLIO_RUNNING: Record<FolioFamilyId, { verso: string; recto: string }> = {
  folio: { verso: "Morphology.", recto: "Morphology." },
  quire: { verso: "Ornament.", recto: "Specimens." },
  platebook: { verso: "Plates.", recto: "Plates." },
};

function FolioFigure({
  figure,
  variant,
  isAdmin,
  onArchiveChange,
}: {
  figure: OrnamentFigure;
  variant: FolioFamilyId;
  isAdmin: boolean;
  onArchiveChange: (sourceId: string, nextArchived: boolean) => void;
}) {
  const imageClass =
    variant === "platebook"
      ? "relative mx-auto aspect-[4/5] w-[min(100%,17rem)] overflow-hidden sm:w-[min(100%,19rem)]"
      : variant === "quire"
        ? "relative mx-auto aspect-square w-[min(100%,10.5rem)] overflow-hidden"
        : "relative mx-auto aspect-square w-[min(100%,14rem)] overflow-hidden";

  return (
    <figure className="group relative">
      <Link href={`/ornaments/sources/${figure.source.id}`} className="block">
        <div className={imageClass}>
          {figure.source.imageUrl ? (
            <OrnamentImage
              src={figure.source.imageUrl}
              alt={figure.source.title}
              fill
              sizes={variant === "platebook" ? "19rem" : "14rem"}
              className="object-contain"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-serif text-xs text-ink/35">
              No image
            </div>
          )}
        </div>
        {variant === "platebook" ? (
          <figcaption className="mt-5 text-center font-serif text-[0.95rem] leading-snug tracking-[-0.03em] text-ink">
            <span className="text-fig">
              {formatTextbookFigLabel(figure.index)}
            </span>{" "}
            <em>{figure.titleLabel}</em>.
            <span className="mt-1 block text-[0.8rem] text-ink/55">
              {figure.source.creator}
              {figure.source.year ? `, ${figure.source.year}` : ""}
            </span>
          </figcaption>
        ) : (
          <figcaption className="mt-3 text-center font-serif text-[0.85rem] leading-snug tracking-[-0.03em] text-ink">
            <span className="text-fig">
              {formatTextbookFigLabel(figure.index)}
            </span>{" "}
            <em>{figure.titleLabel}</em>.
          </figcaption>
        )}
      </Link>
      <ArchiveCorner
        figure={figure}
        isAdmin={isAdmin}
        onArchiveChange={onArchiveChange}
      />
    </figure>
  );
}

function FolioFamilyView({
  figures,
  variant,
  isAdmin,
  onArchiveChange,
}: {
  figures: OrnamentFigure[];
  variant: FolioFamilyId;
  isAdmin: boolean;
  onArchiveChange: (sourceId: string, nextArchived: boolean) => void;
}) {
  const perLeaf = FOLIO_LEAF_SIZE[variant];
  const spreads = chunkFigures(figures, perLeaf * 2);
  const running = FOLIO_RUNNING[variant];

  return (
    <div className="flex flex-col gap-12 md:gap-16">
      {spreads.map((spreadFigures, spreadIndex) => (
        <div
          key={`${variant}-spread-${spreadIndex}`}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-3"
        >
          {chunkFigures(spreadFigures, perLeaf).map((leafFigures, leafIndex) => {
            const pageNumber = spreadIndex * 2 + leafIndex + 1;
            const isVerso = leafIndex % 2 === 0;
            const head = isVerso ? running.verso : running.recto;

            return (
              <article
                key={`${variant}-leaf-${pageNumber}`}
                className="border border-ink/10 bg-transparent px-5 py-7 sm:px-7"
              >
                <header
                  className={`mb-6 flex items-baseline border-b border-ink/15 pb-2 ${
                    isVerso ? "justify-between" : "flex-row-reverse justify-between"
                  }`}
                >
                  <h2 className="font-serif text-[0.65rem] uppercase tracking-[0.16em] text-ink/65">
                    {head}
                  </h2>
                  <span className="font-serif text-sm text-ink/50">
                    {pageNumber}
                  </span>
                </header>

                <div
                  className={
                    variant === "quire"
                      ? "flex flex-col gap-6"
                      : variant === "platebook"
                        ? "flex flex-col"
                        : "flex flex-col gap-8"
                  }
                >
                  {leafFigures.map((figure) => (
                    <FolioFigure
                      key={figure.source.id}
                      figure={figure}
                      variant={variant}
                      isAdmin={isAdmin}
                      onArchiveChange={onArchiveChange}
                    />
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function SourceList({ sources }: SourceListProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(() => new Set());
  const [layout, setLayout] = useState<CatalogLayoutId>(DEFAULT_CATALOG_LAYOUT);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CATALOG_LAYOUT_STORAGE_KEY);
      if (isCatalogLayoutId(stored)) {
        setLayout(stored);
      } else if (stored) {
        // Drop removed layouts (pretext / chapbook / herbarium, etc.).
        window.localStorage.setItem(
          CATALOG_LAYOUT_STORAGE_KEY,
          DEFAULT_CATALOG_LAYOUT,
        );
        setLayout(DEFAULT_CATALOG_LAYOUT);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(CATALOG_LAYOUT_STORAGE_KEY, layout);
    } catch {
      // ignore
    }
  }, [layout]);

  useEffect(() => {
    const pending = readPendingArchiveIds();
    const serverIds = new Set(sources.map((source) => source.id));
    for (const id of [...pending]) {
      if (!serverIds.has(id)) {
        pending.delete(id);
      }
    }
    writePendingArchiveIds(pending);
    setHiddenIds(pending);
  }, [sources]);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const response = await fetch("/api/ornaments/admin/session", {
          credentials: "same-origin",
          cache: "no-store",
        });
        if (!response.ok) return;
        const body = (await response.json()) as { authenticated?: boolean };
        if (!cancelled) {
          setIsAdmin(Boolean(body.authenticated));
        }
      } catch {
        if (!cancelled) {
          setIsAdmin(false);
        }
      }
    }

    void loadSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const visibleSources = useMemo(
    () => sources.filter((source) => !hiddenIds.has(source.id)),
    [hiddenIds, sources],
  );
  const figures = useMemo(
    () => toOrnamentFigures(visibleSources),
    [visibleSources],
  );

  function handleArchiveChange(sourceId: string, nextArchived: boolean) {
    const source = sources.find((entry) => entry.id === sourceId);
    if (!source) return;
    const viewingArchived = source.notionStatus === "Archived";
    const shouldHide = nextArchived !== viewingArchived;

    setHiddenIds((current) => {
      const next = new Set(current);
      if (shouldHide) {
        next.add(sourceId);
      } else {
        next.delete(sourceId);
      }
      writePendingArchiveIds(next);
      return next;
    });
  }

  if (figures.length === 0) {
    return (
      <p className="text-center font-serif text-base text-ink/60">
        No ornaments yet.
      </p>
    );
  }

  return (
    <>
      <div className="pb-28">
        {layout === "plates" ? (
          <PlatesView
            figures={figures}
            isAdmin={isAdmin}
            onArchiveChange={handleArchiveChange}
          />
        ) : null}
        {layout === "textbook" ? (
          <TextbookView
            figures={figures}
            isAdmin={isAdmin}
            onArchiveChange={handleArchiveChange}
          />
        ) : null}
        {isFolioFamilyId(layout) ? (
          <FolioFamilyView
            figures={figures}
            variant={layout}
            isAdmin={isAdmin}
            onArchiveChange={handleArchiveChange}
          />
        ) : null}
        {layout === "gallery" ? (
          <GalleryView
            figures={figures}
            isAdmin={isAdmin}
            onArchiveChange={handleArchiveChange}
          />
        ) : null}
        {layout === "editorial" ? (
          <EditorialView
            figures={figures}
            isAdmin={isAdmin}
            onArchiveChange={handleArchiveChange}
          />
        ) : null}
        {layout === "draft" ? (
          <DraftGridView
            figures={figures}
            isAdmin={isAdmin}
            onArchiveChange={handleArchiveChange}
          />
        ) : null}
        {layout === "dot" ? (
          <DotGridView
            figures={figures}
            isAdmin={isAdmin}
            onArchiveChange={handleArchiveChange}
          />
        ) : null}
      </div>
      <CatalogVersionDial value={layout} onChange={setLayout} />
    </>
  );
}
