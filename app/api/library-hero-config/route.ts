import { writeFile } from "node:fs/promises";
import path from "node:path";

import type { LibraryHeroCardPlacement } from "@/lib/library-hero-config";

export const runtime = "nodejs";

function isLibraryHeroCardPlacement(
  value: unknown,
): value is LibraryHeroCardPlacement {
  if (!value || typeof value !== "object") return false;

  const placement = value as Record<keyof LibraryHeroCardPlacement, unknown>;
  return (
    typeof placement.left === "number" &&
    Number.isFinite(placement.left) &&
    typeof placement.top === "number" &&
    Number.isFinite(placement.top) &&
    typeof placement.rotate === "number" &&
    Number.isFinite(placement.rotate)
  );
}

function formatPlacements(placements: LibraryHeroCardPlacement[]): string {
  const body = placements
    .map(
      (placement) => `  {
    left: ${placement.left},
    top: ${placement.top},
    rotate: ${placement.rotate},
  },`,
    )
    .join("\n");

  return `export type LibraryHeroCardPlacement = {
  left: number;
  top: number;
  rotate: number;
};

export const DEFAULT_LIBRARY_HERO_CARD_PLACEMENTS: LibraryHeroCardPlacement[] = [
${body}
];
`;
}

export async function POST(request: Request) {
  const payload = (await request.json()) as unknown;
  const placements =
    payload && typeof payload === "object"
      ? (payload as { placements?: unknown }).placements
      : undefined;

  if (
    !Array.isArray(placements) ||
    !placements.every(isLibraryHeroCardPlacement)
  ) {
    return Response.json(
      { error: "Invalid library hero placement payload." },
      { status: 400 },
    );
  }

  const filePath = path.join(process.cwd(), "lib", "library-hero-config.ts");
  await writeFile(filePath, formatPlacements(placements), "utf8");

  return Response.json({ ok: true });
}
