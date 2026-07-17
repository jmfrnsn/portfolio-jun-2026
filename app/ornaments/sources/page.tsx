import type { Metadata } from "next";

import { OrnamentLayout } from "@/components/ornaments/OrnamentLayout";
import { SourceList } from "@/components/ornaments/SourceList";
import { SourcesFilters } from "@/components/ornaments/SourcesFilters";
import {
  getExportedSourceFilterOptions,
  listExportedSources,
  type SourceArchiveView,
} from "@/lib/ornaments/sources-export";

export const metadata: Metadata = {
  title: "Sources — Ornaments — Jade Franson",
  description: "Filterable archive of historical ornament research sources.",
};

type SourcesPageProps = {
  searchParams: Promise<{
    view?: string;
    era?: string;
    type?: string;
  }>;
};

function parseView(value: string | undefined): SourceArchiveView {
  if (value === "archived" || value === "all" || value === "active") {
    return value;
  }
  return "active";
}

export default async function OrnamentSourcesPage({
  searchParams,
}: SourcesPageProps) {
  const params = await searchParams;
  const view = parseView(params.view);
  const era = params.era?.trim() || undefined;
  const type = params.type?.trim() || undefined;
  const options = getExportedSourceFilterOptions();
  const sources = listExportedSources({ view, era, type });

  return (
    <OrnamentLayout
      title="Sources"
      description="Museum plates, pattern books, and design drawings collected for ornament research."
      activeHref="/ornaments/sources"
    >
      <SourcesFilters
        view={view}
        era={era}
        type={type}
        eras={options.eras}
        types={options.types}
      />
      <SourceList sources={sources} />
    </OrnamentLayout>
  );
}
