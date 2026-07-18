import { writeFile } from "node:fs/promises";
import path from "node:path";

import {
  ABOUT_TEXT_BLOCK_IDS,
  type AboutEditorConfig,
  type AboutTextStyle,
} from "@/lib/about-editor-types";

export const runtime = "nodejs";

function isTextStyle(value: unknown): value is AboutTextStyle {
  if (!value || typeof value !== "object") return false;

  const style = value as Record<keyof AboutTextStyle, unknown>;
  return (
    typeof style.label === "string" &&
    typeof style.fontSize === "number" &&
    Number.isFinite(style.fontSize) &&
    typeof style.color === "string" &&
    typeof style.justify === "boolean"
  );
}

function isAboutEditorConfig(value: unknown): value is AboutEditorConfig {
  if (!value || typeof value !== "object") return false;

  const config = value as Partial<AboutEditorConfig>;
  return (
    typeof config.sourceText === "string" &&
    !!config.textBlocks &&
    ABOUT_TEXT_BLOCK_IDS.every((id) => isTextStyle(config.textBlocks?.[id]))
  );
}

function formatConfig(config: AboutEditorConfig): string {
  return `import type { AboutEditorConfig } from "./about-editor-types";

export const DEFAULT_ABOUT_EDITOR_CONFIG: AboutEditorConfig = ${JSON.stringify(
    config,
    null,
    2,
  )};
`;
}

export async function POST(request: Request) {
  const payload = (await request.json()) as unknown;
  const config =
    payload && typeof payload === "object"
      ? (payload as { config?: unknown }).config
      : undefined;

  if (!isAboutEditorConfig(config)) {
    return Response.json(
      { error: "Invalid about editor config payload." },
      { status: 400 },
    );
  }

  const filePath = path.join(process.cwd(), "lib", "about-editor-config.ts");
  await writeFile(filePath, formatConfig(config), "utf8");

  return Response.json({ ok: true });
}
