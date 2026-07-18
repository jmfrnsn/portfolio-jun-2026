export type AboutTextBlockId =
  | "intro"
  | "body"
  | "bodyExtra"
  | "statement"
  | "lower"
  | "footer";

export type AboutTextStyle = {
  label: string;
  fontSize: number;
  color: string;
  justify: boolean;
};

export type AboutEditorConfig = {
  sourceText: string;
  textBlocks: Record<AboutTextBlockId, AboutTextStyle>;
};

export const ABOUT_TEXT_BLOCK_IDS: AboutTextBlockId[] = [
  "intro",
  "body",
  "bodyExtra",
  "statement",
  "lower",
  "footer",
];

const TEXT_FLOW_RATIOS: Record<AboutTextBlockId, number> = {
  intro: 0.12,
  body: 0.18,
  bodyExtra: 0.1,
  statement: 0.08,
  lower: 0.37,
  footer: 0.15,
};

export function cloneAboutEditorConfig(
  config: AboutEditorConfig,
): AboutEditorConfig {
  return {
    sourceText: config.sourceText,
    textBlocks: Object.fromEntries(
      Object.entries(config.textBlocks).map(([id, block]) => [
        id,
        { ...block },
      ]),
    ) as AboutEditorConfig["textBlocks"],
  };
}

export function splitAboutFlowText(text: string): Record<AboutTextBlockId, string> {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const chunks = {} as Record<AboutTextBlockId, string>;
  let cursor = 0;

  for (const id of ABOUT_TEXT_BLOCK_IDS) {
    const remainingWords = words.length - cursor;
    const remainingBlocks =
      ABOUT_TEXT_BLOCK_IDS.length - ABOUT_TEXT_BLOCK_IDS.indexOf(id);
    const isLast = id === ABOUT_TEXT_BLOCK_IDS[ABOUT_TEXT_BLOCK_IDS.length - 1];
    const count = isLast
      ? remainingWords
      : Math.min(
          remainingWords,
          Math.max(
            Math.round(words.length * TEXT_FLOW_RATIOS[id]),
            remainingBlocks > 1 ? 1 : 0,
          ),
        );

    chunks[id] = words.slice(cursor, cursor + count).join(" ");
    cursor += count;
  }

  return chunks;
}
