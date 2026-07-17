import sourcesExport from "@/data/ornaments/sources.json";

import type { Source } from "./schema";

export type ExportedOrnamentSource = {
  id: string;
  notionPageId: string | null;
  title: string;
  creator: string;
  year: string;
  type: string;
  era: string;
  region: string | null;
  url: string | null;
  imageUrl: string | null;
  status: Source["status"];
  notionStatus: "Active" | "Archived";
  archivedAt: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type OrnamentSourcesExport = {
  schemaVersion: 1;
  counts: {
    total: number;
    active: number;
    archived: number;
  };
  sources: ExportedOrnamentSource[];
};

export type SourceArchiveView = "active" | "archived" | "all";

export type SourceListFilters = {
  view?: SourceArchiveView;
  era?: string;
  type?: string;
  region?: string;
};

export function loadOrnamentSourcesExport(): OrnamentSourcesExport {
  return sourcesExport as OrnamentSourcesExport;
}

export function listExportedSources(
  filters: SourceListFilters = {},
): ExportedOrnamentSource[] {
  const { sources } = loadOrnamentSourcesExport();
  const view = filters.view ?? "active";

  return sources.filter((source) => {
    if (view === "active" && source.notionStatus !== "Active") return false;
    if (view === "archived" && source.notionStatus !== "Archived") return false;
    if (filters.era && source.era !== filters.era) return false;
    if (filters.type && source.type !== filters.type) return false;
    if (filters.region && source.region !== filters.region) return false;
    return true;
  });
}

export function getExportedSource(
  id: string,
): ExportedOrnamentSource | undefined {
  return loadOrnamentSourcesExport().sources.find((source) => source.id === id);
}

export function getExportedSourceFilterOptions() {
  const { sources } = loadOrnamentSourcesExport();
  const active = sources.filter((source) => source.notionStatus === "Active");

  return {
    eras: uniqueSorted(active.map((source) => source.era)),
    types: uniqueSorted(active.map((source) => source.type)),
    regions: uniqueSorted(
      active
        .map((source) => source.region)
        .filter((region): region is string => Boolean(region)),
    ),
  };
}

function uniqueSorted(values: string[]) {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}
