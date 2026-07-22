import type { Metadata } from "next";

import { OrnamentLayout } from "@/components/ornaments/OrnamentLayout";
import { SourceList } from "@/components/ornaments/SourceList";
import { listExportedSources } from "@/lib/ornaments/sources-export";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ornaments",
  description: "A catalog of historical ornament sources.",
};

export default function OrnamentsPage() {
  const sources = listExportedSources({ view: "active" });

  return (
    <OrnamentLayout>
      <SourceList sources={sources} />
    </OrnamentLayout>
  );
}
