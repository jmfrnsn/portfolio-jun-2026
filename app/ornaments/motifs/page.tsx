import type { Metadata } from "next";
import Link from "next/link";

import { OrnamentLayout } from "@/components/ornaments/OrnamentLayout";

export const metadata: Metadata = {
  title: "Motifs — Ornaments — Jade Franson",
  description: "Extracted ornament motifs from researched sources.",
};

export default function OrnamentMotifsPage() {
  return (
    <OrnamentLayout
      title="Motifs"
      description="Distinct ornamental forms pulled from source plates — types, styles, tags, and resonance."
      activeHref="/ornaments/motifs"
    >
      <div className="flex max-w-prose flex-col gap-4">
        <p className="font-serif text-base leading-relaxed text-ink/70">
          No motifs have been exported yet. Digest a source to begin extracting
          motif records into the catalog.
        </p>
        <Link
          href="/ornaments/sources"
          className="font-mono text-sm font-extralight uppercase tracking-[0.08em] text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-ink"
        >
          Browse sources →
        </Link>
      </div>
    </OrnamentLayout>
  );
}
