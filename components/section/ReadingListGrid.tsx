"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { getBookCoverUrl } from "@/lib/book-cover";
import {
  getColSpanClassName,
  getCoverWrapperClassName,
  getGridItemPlacement,
} from "@/lib/reading-grid-layout";
import {
  READING_LIST_2025,
  READING_LIST_2026,
  type ReadingYear,
} from "@/lib/reading-list";

type GridEntry = {
  name: string;
  author: string;
};

function formatGridIndex(index: number): string {
  return `(${String(index + 1).padStart(2, "0")})`;
}

function GridBookCover({ title, author }: { title: string; author: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative aspect-[3/4] w-full">
      {failed ? (
        <div
          className="h-full w-full bg-ink/[0.06]"
          role="img"
          aria-label={`${title} by ${author}`}
        />
      ) : (
        <Image
          src={getBookCoverUrl(title)}
          alt={`${title} by ${author}`}
          fill
          sizes="(max-width: 640px) 44vw, 480px"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

function ReadingGrid({ entries }: { entries: GridEntry[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="grid w-full grid-cols-2 items-start gap-x-4 gap-y-20 sm:grid-cols-4 sm:gap-x-5 sm:gap-y-28 lg:grid-cols-8 lg:gap-x-6 lg:gap-y-32">
      {entries.map((entry, index) => {
        const placement = getGridItemPlacement(index);
        const delay = index * 0.05;

        return (
          <article
            key={entry.name}
            className={`w-full min-w-0 ${getColSpanClassName(placement.colSpanLg)}`}
          >
            <motion.p
              className="font-sans text-[0.625rem] leading-none tracking-[0.04em] text-ink/70"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: reduceMotion ? 0 : 0.4,
                delay: reduceMotion ? 0 : delay * 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {formatGridIndex(index)}
            </motion.p>
            <div style={{ marginTop: placement.numberToCoverGap }}>
              <motion.div
                className={getCoverWrapperClassName(placement.coverAlign)}
                style={{
                  width: `${placement.coverWidthPercent}%`,
                  maxWidth: placement.coverMaxWidth,
                }}
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        x: placement.flyIn.x,
                        y: placement.flyIn.y,
                      }
                }
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : {
                        type: "spring",
                        stiffness: 100,
                        damping: 18,
                        mass: 0.95,
                        delay,
                      }
                }
              >
                <GridBookCover title={entry.name} author={entry.author} />
              </motion.div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

type ReadingListGridProps = {
  year: ReadingYear;
};

export function ReadingListGrid({ year }: ReadingListGridProps) {
  const entries: GridEntry[] =
    year === "2026"
      ? READING_LIST_2026.map(({ name, author }) => ({ name, author }))
      : READING_LIST_2025.map(({ name, author }) => ({ name, author }));

  return (
    <div className="w-full" key={year}>
      <ReadingGrid entries={entries} />
    </div>
  );
}
