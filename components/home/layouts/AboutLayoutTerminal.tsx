"use client";

import { TerminalPagesList } from "../TerminalPagesList";
import { useAboutSectionMetrics } from "../useAboutSectionMetrics";

export function AboutLayoutTerminal() {
  const { paddingX, paddingTop, paddingBottom, viewportInset } =
    useAboutSectionMetrics();

  return (
    <section
      style={{
        paddingLeft: paddingX,
        paddingRight: paddingX,
        paddingTop,
        paddingBottom,
      }}
    >
      <div
        className="mx-auto flex w-full max-w-[28rem] flex-col justify-center"
        style={{
          minHeight: `calc(100svh - ${viewportInset}px)`,
        }}
      >
        <TerminalPagesList />
      </div>
    </section>
  );
}
