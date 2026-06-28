"use client";

import { ReadingLayoutProvider } from "@/components/section/ReadingLayoutContext";
import { ReadingLayoutSelector } from "@/components/section/ReadingLayoutSelector";
import { ReadingList } from "@/components/section/ReadingList";

export function ReadingPage() {
  return (
    <div className="min-h-svh bg-paper text-ink">
      <ReadingLayoutProvider>
        <div className="w-full px-6 pb-24 pt-44 sm:px-10 md:pb-32 md:pt-52 lg:px-14">
          <ReadingList />
        </div>
        <ReadingLayoutSelector />
      </ReadingLayoutProvider>
    </div>
  );
}
