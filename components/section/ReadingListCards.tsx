"use client";

import { LibraryBookCard } from "@/components/section/LibraryBookCard";
import {
  READING_LIST_2025,
  READING_LIST_2026,
  type ReadingYear,
} from "@/lib/reading-list";

type ReadingListCardsProps = {
  year: ReadingYear;
};

export function ReadingListCards({ year }: ReadingListCardsProps) {
  const entries = year === "2026" ? READING_LIST_2026 : READING_LIST_2025;

  return (
    <div className="grid grid-cols-2 items-start gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12 xl:grid-cols-5">
      {entries.map((entry, index) => (
        <LibraryBookCard
          key={entry.name}
          index={index}
          title={entry.name}
          author={entry.author}
        />
      ))}
    </div>
  );
}
