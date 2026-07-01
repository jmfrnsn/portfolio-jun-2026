import { writeFile } from "node:fs/promises";
import path from "node:path";

import type { HeroCardConfig } from "@/lib/library-hero-config";

export const runtime = "nodejs";

function isHeroCardConfig(value: unknown): value is HeroCardConfig {
  if (!value || typeof value !== "object") return false;

  const config = value as Record<keyof HeroCardConfig, unknown>;
  return (
    typeof config.startLeft === "number" &&
    typeof config.startTop === "number" &&
    typeof config.startRotate === "number" &&
    typeof config.endLeft === "number" &&
    typeof config.endTop === "number" &&
    typeof config.endRotate === "number"
  );
}

function formatConfig(configs: HeroCardConfig[]): string {
  const body = configs
    .map(
      (config) => `  {
    startLeft: ${config.startLeft},
    startTop: ${config.startTop},
    startRotate: ${config.startRotate},
    endLeft: ${config.endLeft},
    endTop: ${config.endTop},
    endRotate: ${config.endRotate},
  },`,
    )
    .join("\n");

  return `export type HeroCardConfig = {
  startLeft: number;
  startTop: number;
  startRotate: number;
  endLeft: number;
  endTop: number;
  endRotate: number;
};

export const DEFAULT_LIBRARY_HERO_CARD_CONFIGS: HeroCardConfig[] = [
${body}
];
`;
}

export async function POST(request: Request) {
  const payload = (await request.json()) as unknown;
  const configs =
    payload && typeof payload === "object"
      ? (payload as { configs?: unknown }).configs
      : undefined;

  if (!Array.isArray(configs) || !configs.every(isHeroCardConfig)) {
    return Response.json({ error: "Invalid hero config payload." }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "lib", "library-hero-config.ts");
  await writeFile(filePath, formatConfig(configs), "utf8");

  return Response.json({ ok: true });
}
