"use client";

import Image from "next/image";
import Link from "next/link";

import { ArchiveSourceButton } from "@/components/ornaments/ArchiveSourceButton";
import type { ExportedOrnamentSource } from "@/lib/ornaments/sources-export";

type SourceListProps = {
  sources: ExportedOrnamentSource[];
};

export function SourceList({ sources }: SourceListProps) {
  if (sources.length === 0) {
    return (
      <p className="font-serif text-base text-ink/60">
        No sources match these filters.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {sources.map((source) => (
        <li key={source.id} className="group relative">
          <Link
            href={`/ornaments/sources/${source.id}`}
            className="flex flex-col gap-4"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-highlight">
              {source.imageUrl ? (
                <Image
                  src={source.imageUrl}
                  alt={source.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                />
              ) : (
                <div className="flex h-full items-center justify-center font-mono text-xs uppercase tracking-[0.08em] text-ink/40">
                  No image
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <h2 className="font-serif text-lg leading-snug tracking-[-0.04375rem] text-ink transition-colors group-hover:text-ink/70">
                {source.title}
              </h2>
              <p className="font-mono text-xs font-extralight uppercase tracking-[0.08em] text-ink/55">
                {[source.creator, source.year].filter(Boolean).join(" · ")}
              </p>
              <p className="font-serif text-sm text-ink/60">
                {[source.era, source.region, source.type]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          </Link>

          <div className="pointer-events-none absolute right-3 top-3 z-10 opacity-100 transition-opacity duration-200 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:opacity-100">
            <div className="pointer-events-auto">
              <ArchiveSourceButton
                sourceId={source.id}
                archived={source.notionStatus === "Archived"}
              />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
