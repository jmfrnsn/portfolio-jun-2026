import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { OrnamentLayout } from "@/components/ornaments/OrnamentLayout";
import {
  getExportedSource,
  loadOrnamentSourcesExport,
} from "@/lib/ornaments/sources-export";

type SourceDetailPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return loadOrnamentSourcesExport().sources.map((source) => ({
    id: source.id,
  }));
}

export async function generateMetadata({
  params,
}: SourceDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const source = getExportedSource(id);
  if (!source) {
    return { title: "Not found" };
  }

  return {
    title: `${source.title} — Ornaments — Jade Franson`,
    description: `${source.creator}, ${source.year}. ${source.era}${
      source.region ? `, ${source.region}` : ""
    }.`,
  };
}

export default async function OrnamentSourceDetailPage({
  params,
}: SourceDetailPageProps) {
  const { id } = await params;
  const source = getExportedSource(id);
  if (!source) {
    notFound();
  }

  const meta = [
    { label: "Creator", value: source.creator },
    { label: "Date", value: source.year },
    { label: "Era", value: source.era },
    { label: "Region", value: source.region },
    { label: "Collection", value: source.type },
    {
      label: "Status",
      value: source.notionStatus === "Archived" ? "Archived" : source.status,
    },
  ].filter((entry) => Boolean(entry.value));

  return (
    <OrnamentLayout
      title={source.title}
      description={[source.creator, source.year, source.era]
        .filter(Boolean)
        .join(" · ")}
      activeHref="/ornaments/sources"
    >
      <div className="mb-8">
        <Link
          href="/ornaments/sources"
          className="font-mono text-sm font-extralight uppercase tracking-[0.08em] text-ink/60 transition-colors hover:text-ink"
        >
          ← Sources
        </Link>
      </div>

      <article className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-highlight">
          {source.imageUrl ? (
            <Image
              src={source.imageUrl}
              alt={source.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-mono text-xs uppercase tracking-[0.08em] text-ink/40">
              No image
            </div>
          )}
        </div>

        <div className="flex flex-col gap-8">
          <dl className="flex flex-col gap-4">
            {meta.map((entry) => (
              <div key={entry.label} className="flex flex-col gap-1">
                <dt className="font-mono text-xs font-extralight uppercase tracking-[0.08em] text-ink/40">
                  {entry.label}
                </dt>
                <dd className="font-serif text-base text-ink">{entry.value}</dd>
              </div>
            ))}
          </dl>

          {source.notes ? (
            <div className="flex flex-col gap-2 border-t border-ink/10 pt-6">
              <h2 className="font-mono text-xs font-extralight uppercase tracking-[0.08em] text-ink/40">
                Notes
              </h2>
              <p className="font-serif text-base leading-relaxed text-ink/80">
                {source.notes}
              </p>
            </div>
          ) : null}

          {source.url ? (
            <a
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-sm font-extralight uppercase tracking-[0.08em] text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-ink"
            >
              View object →
            </a>
          ) : null}

          <p className="border-t border-ink/10 pt-6 font-serif text-base leading-relaxed text-ink/60">
            Linked motifs will appear here after this source is digested.
          </p>
        </div>
      </article>
    </OrnamentLayout>
  );
}
