"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { ArchiveSourceButton } from "@/components/ornaments/ArchiveSourceButton";
import { toOrnamentFigures } from "@/lib/ornaments/figure-catalog";
import type { ExportedOrnamentSource } from "@/lib/ornaments/sources-export";

type SourceListProps = {
  sources: ExportedOrnamentSource[];
};

export function SourceList({ sources }: SourceListProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());

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
        No sources match these filters.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-20 md:gap-28">
      <ul className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-10 lg:gap-y-14">
        {figures.map((figure) => (
          <li key={figure.source.id} className="group relative">
            <Link
              href={`/ornaments/sources/${figure.source.id}`}
              className="flex flex-col gap-3"
            >
              <div className="flex items-baseline justify-between gap-2 font-serif text-[0.7rem] tracking-[-0.02em] text-ink/70 sm:text-xs">
                <span>{figure.figLabel}</span>
                <span>{figure.catalogCode}</span>
              </div>
              <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-transparent">
                {figure.source.imageUrl ? (
                  <Image
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
              <div className="pointer-events-none absolute right-0 top-7 z-10 opacity-100 transition-opacity duration-200 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:opacity-100">
                <div className="pointer-events-auto">
                  <ArchiveSourceButton
                    sourceId={figure.source.id}
                    archived={figure.source.notionStatus === "Archived"}
                    onCompleted={(nextArchived) => {
                      const viewingArchived =
                        figure.source.notionStatus === "Archived";
                      if (nextArchived !== viewingArchived) {
                        setHiddenIds((current) => {
                          const next = new Set(current);
                          next.add(figure.source.id);
                          return next;
                        });
                      }
                    }}
                  />
                </div>
              </div>
            ) : null}
          </li>
        ))}
      </ul>

      <ul className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-10 lg:gap-y-14">
        {figures.map((figure) => (
          <li key={`caption-${figure.source.id}`}>
            <Link
              href={`/ornaments/sources/${figure.source.id}`}
              className="flex flex-col items-center gap-1.5 text-center transition-opacity hover:opacity-70"
            >
              <p className="flex w-full items-baseline justify-between gap-2 font-serif text-[0.7rem] tracking-[-0.02em] text-ink/65 sm:text-xs">
                <span>{figure.figLabel}</span>
                <span>{figure.catalogCode}</span>
              </p>
              <h2 className="max-w-[16rem] font-serif text-sm leading-snug tracking-[-0.03em] text-ink sm:text-[0.95rem]">
                {figure.source.title}
              </h2>
              <p className="font-serif text-xs italic tracking-[-0.02em] text-ink/55 sm:text-sm">
                {figure.dateLabel}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
