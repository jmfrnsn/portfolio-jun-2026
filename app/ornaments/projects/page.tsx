import type { Metadata } from "next";
import Link from "next/link";

import { OrnamentLayout } from "@/components/ornaments/OrnamentLayout";

export const metadata: Metadata = {
  title: "Projects — Ornaments — Jade Franson",
  description: "Project threads woven from related ornament motifs.",
};

export default function OrnamentProjectsPage() {
  return (
    <OrnamentLayout
      title="Projects"
      description="Thematic threads that gather related motifs and sources into possible outputs."
      activeHref="/ornaments/projects"
    >
      <div className="flex max-w-prose flex-col gap-4">
        <p className="font-serif text-base leading-relaxed text-ink/70">
          No project threads yet. Once motifs accumulate, suggestions and
          curated threads will live here.
        </p>
        <Link
          href="/ornaments/motifs"
          className="font-mono text-sm font-extralight uppercase tracking-[0.08em] text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-ink"
        >
          View motifs →
        </Link>
      </div>
    </OrnamentLayout>
  );
}
