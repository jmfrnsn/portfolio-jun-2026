"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { getBookCoverUrl } from "@/lib/book-cover";
import {
  getLibraryCardAsset,
  type LibraryCardAsset,
} from "@/lib/reading-library-card";

const COVER_OVERLAY_POSITIONS = [
  { left: "50%", top: "42%", width: "34%", rotate: "-1.1deg" },
  { left: "45%", top: "46%", width: "31%", rotate: "0.7deg" },
  { left: "56%", top: "39%", width: "36%", rotate: "1.2deg" },
  { left: "48%", top: "52%", width: "29%", rotate: "-0.5deg" },
  { left: "54%", top: "48%", width: "33%", rotate: "0.4deg" },
] as const;

type LibraryBookCardProps = {
  index: number;
  title: string;
  author: string;
};

export function LibraryBookCard({ index, title, author }: LibraryBookCardProps) {
  const reduceMotion = useReducedMotion();
  const asset = getLibraryCardAsset(title, index);
  const delay = index * 0.035;
  const alt = `${title} by ${author}`;

  return (
    <motion.figure
      className="group w-full outline-none"
      tabIndex={0}
      aria-label={alt}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              type: "spring",
              stiffness: 120,
              damping: 22,
              delay,
            }
      }
    >
      <CardImage
        asset={asset}
        alt={alt}
        index={index}
        title={title}
        author={author}
      />
    </motion.figure>
  );
}

function CardImage({
  asset,
  alt,
  index,
  title,
  author,
}: {
  asset: LibraryCardAsset;
  alt: string;
  index: number;
  title: string;
  author: string;
}) {
  const rotation = (index % 5) - 2;
  const overlayPosition =
    COVER_OVERLAY_POSITIONS[index % COVER_OVERLAY_POSITIONS.length]!;
  const [coverFailed, setCoverFailed] = useState(false);

  return (
    <div
      className="relative w-full transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:rotate-[0.4deg] group-focus-within:-translate-y-0.5 group-focus-within:rotate-[0.4deg]"
      style={{
        aspectRatio: `${asset.width} / ${asset.height}`,
        rotate: `${rotation * 0.15}deg`,
      }}
    >
      <Image
        src={asset.src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 44vw, (max-width: 1024px) 28vw, 220px"
        className="object-contain object-center"
        priority={index < 4}
      />
      {!coverFailed ? (
        <div
          className="absolute aspect-[3/4] -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-ink/10 bg-paper"
          style={{
            left: overlayPosition.left,
            top: overlayPosition.top,
            width: overlayPosition.width,
            rotate: overlayPosition.rotate,
          }}
        >
          <Image
            src={getBookCoverUrl(title)}
            alt=""
            fill
            sizes="96px"
            className="object-cover"
            onError={() => setCoverFailed(true)}
          />
        </div>
      ) : null}
      <div
        className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-paper/95 via-paper/50 to-transparent px-2 pb-2 pt-8 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
        aria-hidden="true"
      >
        <p className="font-serif text-sm leading-snug tracking-[-0.02em] text-ink">
          {title}
        </p>
        <p className="mt-0.5 font-mono text-[0.625rem] font-extralight tracking-[-0.02em] text-ink/55">
          {author}
        </p>
      </div>
    </div>
  );
}
