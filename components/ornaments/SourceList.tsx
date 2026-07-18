"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { ArchiveSourceButton } from "@/components/ornaments/ArchiveSourceButton";
import { OrnamentImage } from "@/components/ornaments/OrnamentImage";
import { toOrnamentFigures } from "@/lib/ornaments/figure-catalog";
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
    return new Set(parsed.filter((value): value is string => typeof value === "string"));
  } catch {
    return new Set<string>();
  }
}

function writePendingArchiveIds(ids: Set<string>) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(
    PENDING_ARCHIVE_KEY,
    JSON.stringify([...ids]),
  );
}

export function SourceList({ sources }: SourceListProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const pending = readPendingArchiveIds();
    // Drop ids the server export already treats as archived.
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

  if (figures.length === 0) {
    return (
      <p className="text-center font-serif text-base text-ink/60">
        No ornaments yet.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-10 lg:gap-y-14">
      {figures.map((figure) => (
        <li key={figure.source.id} className="group relative">
          <Link
            href={`/ornaments/sources/${figure.source.id}`}
            className="flex flex-col gap-3"
          >
            <p className="text-center font-serif text-[0.7rem] tracking-[-0.02em] text-ink/70 sm:text-xs">
              {figure.figLabel}
            </p>
            <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-transparent">
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

          {isAdmin ? (
            <div className="absolute right-0 top-0 z-10">
              <ArchiveSourceButton
                sourceId={figure.source.id}
                archived={figure.source.notionStatus === "Archived"}
                onCompleted={(nextArchived) => {
                  const viewingArchived =
                    figure.source.notionStatus === "Archived";
                  const shouldHide = nextArchived !== viewingArchived;
                  setHiddenIds((current) => {
                    const next = new Set(current);
                    if (shouldHide) {
                      next.add(figure.source.id);
                    } else {
                      next.delete(figure.source.id);
                    }
                    writePendingArchiveIds(next);
                    return next;
                  });
                }}
              />
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
