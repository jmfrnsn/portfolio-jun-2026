"use client";

import Image from "next/image";
import { useState } from "react";

import { getBookCoverUrl } from "@/lib/book-cover";

type BookCoverPreviewProps = {
  title: string;
  author: string;
  y: number;
};

export function BookCoverPreview({ title, author, y }: BookCoverPreviewProps) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <div
      className="pointer-events-none fixed right-6 z-30 hidden w-[7.5rem] md:block lg:right-[max(1.5rem,calc((100vw-44rem)/2-10rem))] lg:w-[9rem]"
      style={{ top: y, transform: "translateY(-50%)" }}
      aria-hidden="true"
    >
      <div className="overflow-hidden bg-ink/5 shadow-[0_8px_32px_-8px_rgb(39_48_28/0.18)]">
        <div className="relative aspect-[2/3] w-full">
          <Image
            src={getBookCoverUrl(title)}
            alt=""
            fill
            sizes="144px"
            className="object-cover"
            onError={() => setFailed(true)}
          />
        </div>
      </div>
      <p className="mt-2 font-mono text-[0.625rem] font-extralight uppercase tracking-[0.08em] text-ink/45">
        {author}
      </p>
    </div>
  );
}
