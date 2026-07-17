import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { OrnamentLayout } from "@/components/ornaments/OrnamentLayout";
import {
  listExportedSources,
  loadOrnamentSourcesExport,
} from "@/lib/ornaments/sources-export";

export const metadata: Metadata = {
  title: "Ornaments — Jade Franson",
  description:
    "A research catalog of historical ornament sources, motifs, and project threads.",
};

export default function OrnamentsPage() {
  const { counts } = loadOrnamentSourcesExport();
  const recentSources = listExportedSources({ view: "active" }).slice(0, 3);

  return (
    <OrnamentLayout
      title="Catalog"
      description="A working archive of historical ornament sources drawn from museum collections, kept for close looking and future motif work."
      activeHref="/ornaments"
    >
      <section className="mb-14 grid grid-cols-3 gap-6 border-b border-ink/10 pb-10 md:gap-10">
        <Stat label="Sources" value={counts.total} href="/ornaments/sources" />
        <Stat label="Active" value={counts.active} href="/ornaments/sources" />
        <Stat
          label="Archived"
          value={counts.archived}
          href="/ornaments/sources?view=archived"
        />
      </section>

      <section className="flex flex-col gap-8">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-mono text-sm font-extralight uppercase tracking-[0.08em] text-ink">
            Recent sources
          </h2>
          <Link
            href="/ornaments/sources"
            className="font-mono text-xs font-extralight uppercase tracking-[0.08em] text-ink/45 transition-colors hover:text-ink"
          >
            View all
          </Link>
        </div>

        {recentSources.length === 0 ? (
          <p className="font-serif text-base text-ink/60">
            No active sources yet.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-3">
            {recentSources.map((source) => (
              <li key={source.id}>
                <Link
                  href={`/ornaments/sources/${source.id}`}
                  className="group flex flex-col gap-3"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-highlight">
                    {source.imageUrl ? (
                      <Image
                        src={source.imageUrl}
                        alt={source.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-serif text-base leading-snug text-ink">
                      {source.title}
                    </h3>
                    <p className="font-mono text-xs font-extralight uppercase tracking-[0.08em] text-ink/50">
                      {source.era}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-14 border-t border-ink/10 pt-10">
        <p className="max-w-prose font-serif text-base leading-relaxed text-ink/70">
          Motif extraction and project threads will appear here once sources are
          digested. Browse the source archive to begin.
        </p>
      </section>
    </OrnamentLayout>
  );
}

function Stat({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link href={href} className="group flex flex-col gap-1">
      <span className="font-serif text-3xl tracking-[-0.04375rem] text-ink transition-colors group-hover:text-ink/70 md:text-4xl">
        {value}
      </span>
      <span className="font-mono text-xs font-extralight uppercase tracking-[0.08em] text-ink/45">
        {label}
      </span>
    </Link>
  );
}
