"use client";

import { useAboutSectionMetrics } from "@/components/home/useAboutSectionMetrics";

type SectionContentShellProps = {
  children: React.ReactNode;
};

export function SectionContentShell({ children }: SectionContentShellProps) {
  const { paddingX, contentMaxWidth } = useAboutSectionMetrics();

  return (
    <div
      style={{
        paddingLeft: paddingX,
        paddingRight: paddingX,
      }}
    >
      <div
        className="mx-auto w-full pb-24 pt-12 md:pb-32 md:pt-16"
        style={{ maxWidth: contentMaxWidth }}
      >
        {children}
      </div>
    </div>
  );
}
