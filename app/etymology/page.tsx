import type { Metadata } from "next";

import { EtymologyLayout } from "@/components/etymology/EtymologyLayout";
import { ETYMOLOGY_ENTRIES } from "@/lib/etymology/entries";

export const metadata: Metadata = {
  title: "Etymology",
  description: "A working list of word origins, senses, and notes.",
};

export default function EtymologyPage() {
  const entries = ETYMOLOGY_ENTRIES;

  return (
    <EtymologyLayout>
      <header className="mb-12 border-b border-ink/10 pb-8 md:mb-16">
        <p className="font-mono text-[10px] font-extralight uppercase tracking-[0.14em] text-ink/40">
          Research · Language
        </p>
        <h1 className="mt-1 font-serif text-3xl tracking-[-0.05em] text-ink md:text-5xl">
          Etymology
        </h1>
        <p className="mt-3 max-w-xl font-serif text-sm leading-relaxed tracking-[-0.02em] text-ink/55 md:text-base">
          A working list of word origins, senses, and short notes—kept as a
          catalog for looking rather than a glossary for looking up.
        </p>
      </header>

      {entries.length === 0 ? (
        <p className="font-serif text-base tracking-[-0.03em] text-ink/50">
          No entries yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-10 md:gap-12">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="grid grid-cols-1 gap-3 border-t border-ink/10 pt-6 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] sm:gap-8"
            >
              <div>
                <h2 className="font-serif text-xl tracking-[-0.04em] text-ink md:text-2xl">
                  {entry.word}
                </h2>
                {entry.phonetic ? (
                  <p className="mt-1 font-mono text-[10px] font-extralight uppercase tracking-[0.1em] text-ink/40">
                    {entry.phonetic}
                  </p>
                ) : null}
              </div>
              <div className="font-serif text-[0.95rem] leading-relaxed tracking-[-0.02em] text-ink/75">
                <p>
                  <span className="font-sans text-[0.65rem] font-medium uppercase tracking-[0.1em] text-fig">
                    Origin.
                  </span>{" "}
                  {entry.origin}
                </p>
                <p className="mt-3">
                  <span className="font-sans text-[0.65rem] font-medium uppercase tracking-[0.1em] text-fig">
                    Sense.
                  </span>{" "}
                  {entry.sense}
                </p>
                {entry.note ? (
                  <p className="mt-3 text-ink/55">
                    <span className="font-sans text-[0.65rem] font-medium uppercase tracking-[0.1em] text-fig">
                      Note.
                    </span>{" "}
                    {entry.note}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </EtymologyLayout>
  );
}
