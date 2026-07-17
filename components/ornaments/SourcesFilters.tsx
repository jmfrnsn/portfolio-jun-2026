import Link from "next/link";

import type { SourceArchiveView } from "@/lib/ornaments/sources-export";

type SourcesFiltersProps = {
  view: SourceArchiveView;
  era?: string;
  type?: string;
  eras: string[];
  types: string[];
};

function buildHref(params: {
  view: SourceArchiveView;
  era?: string;
  type?: string;
}) {
  const search = new URLSearchParams();
  if (params.view !== "active") search.set("view", params.view);
  if (params.era) search.set("era", params.era);
  if (params.type) search.set("type", params.type);
  const query = search.toString();
  return query ? `/ornaments/sources?${query}` : "/ornaments/sources";
}

function FilterLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`font-mono text-xs font-extralight uppercase tracking-[0.08em] transition-colors ${
        active ? "text-ink" : "text-ink/40 hover:text-ink/70"
      }`}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  );
}

export function SourcesFilters({
  view,
  era,
  type,
  eras,
  types,
}: SourcesFiltersProps) {
  const views: { value: SourceArchiveView; label: string }[] = [
    { value: "active", label: "Active" },
    { value: "archived", label: "Archived" },
    { value: "all", label: "All" },
  ];

  return (
    <div className="mb-10 flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <span className="font-mono text-xs font-extralight uppercase tracking-[0.08em] text-ink/35">
          View
        </span>
        {views.map((entry) => (
          <FilterLink
            key={entry.value}
            href={buildHref({ view: entry.value, era, type })}
            label={entry.label}
            active={view === entry.value}
          />
        ))}
      </div>

      {eras.length > 0 ? (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="font-mono text-xs font-extralight uppercase tracking-[0.08em] text-ink/35">
            Era
          </span>
          <FilterLink
            href={buildHref({ view, type })}
            label="All"
            active={!era}
          />
          {eras.map((value) => (
            <FilterLink
              key={value}
              href={buildHref({ view, era: value, type })}
              label={value}
              active={era === value}
            />
          ))}
        </div>
      ) : null}

      {types.length > 0 ? (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="font-mono text-xs font-extralight uppercase tracking-[0.08em] text-ink/35">
            Source
          </span>
          <FilterLink
            href={buildHref({ view, era })}
            label="All"
            active={!type}
          />
          {types.map((value) => (
            <FilterLink
              key={value}
              href={buildHref({ view, era, type: value })}
              label={value}
              active={type === value}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
