"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SITE_SECTIONS } from "@/lib/site-sections";

const NAV_ORNAMENT_SRC = "/images/nav-ornament.png";

type MonogramMarkProps = {
  className?: string;
};

function formatPathSegment(value: string): string {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getNavTitle(pathname: string): string[] {
  if (pathname === "/") return ["Jade Franson", "Designer + Artist"];

  const [, sectionSlug, itemSlug] = pathname.split("/");
  const section = SITE_SECTIONS.find((entry) => entry.slug === sectionSlug);

  if (section && itemSlug) {
    const item = section.items.find((entry) => entry.slug === itemSlug);
    return [item?.title ?? formatPathSegment(itemSlug)];
  }

  if (section) return [section.label];

  return [formatPathSegment(sectionSlug ?? "Home")];
}

export function MonogramMark({ className = "" }: MonogramMarkProps) {
  const pathname = usePathname();
  const titleLines = getNavTitle(pathname);

  return (
    <Link
      href="/"
      aria-label="Home"
      className={`pointer-events-auto fixed left-1/2 top-5 z-40 flex -translate-x-1/2 flex-col items-center text-center transition-opacity hover:opacity-75 md:top-7 ${className}`.trim()}
    >
      <span className="relative block h-[32px] w-[74px] opacity-75">
        <Image
          src={NAV_ORNAMENT_SRC}
          alt=""
          fill
          priority
          sizes="74px"
          className="object-contain object-center"
        />
      </span>
      <span className="mt-3 flex flex-col font-mono text-base font-extralight uppercase leading-[1.28] tracking-[-0.04375rem] text-ink">
        {titleLines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </span>
    </Link>
  );
}
