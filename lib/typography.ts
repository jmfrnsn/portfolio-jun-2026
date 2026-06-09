export function readSerifFamily(): string {
  if (typeof document === "undefined") {
    return '"TeXGyreSchola-Regular", "Times New Roman", serif';
  }

  const variable = getComputedStyle(document.documentElement)
    .getPropertyValue("--font-serif")
    .trim();
  if (variable) return variable;

  const probe = document.createElement("span");
  probe.className = "font-serif";
  probe.style.visibility = "hidden";
  probe.style.position = "absolute";
  probe.textContent = "M";
  document.body.appendChild(probe);
  const family = getComputedStyle(probe).fontFamily;
  probe.remove();
  return family;
}

export function getSerifFontSpec(fontSize: number, family = readSerifFamily()): string {
  return `${fontSize}px ${family}`;
}

export const BODY_FONT_SIZE_PX = 16;
/** Matches Tailwind `text-2xl` at the default 16px root. */
export const ABOUT_FONT_SIZE_PX = 24;

export async function waitForSerifFonts(
  sizes: number[] = [BODY_FONT_SIZE_PX],
): Promise<string> {
  const family = readSerifFamily();
  await Promise.all(sizes.map((size) => document.fonts.load(getSerifFontSpec(size, family))));
  await document.fonts.ready;
  return family;
}

export const BODY_LETTER_SPACING_REM = -0.04375;

export function getBodyLetterSpacingPx(): number {
  if (typeof document === "undefined") {
    return BODY_LETTER_SPACING_REM * 16;
  }

  const rootSize = Number.parseFloat(
    getComputedStyle(document.documentElement).fontSize,
  );
  return BODY_LETTER_SPACING_REM * (Number.isFinite(rootSize) ? rootSize : 16);
}

export function getBodyTypography() {
  const fontSize = BODY_FONT_SIZE_PX;
  const lineHeight = Math.round(fontSize * 1.5);
  const letterSpacing = getBodyLetterSpacingPx();
  return { fontSize, lineHeight, letterSpacing };
}

export function getAboutTypography(fontSize = ABOUT_FONT_SIZE_PX) {
  const lineHeight = Math.round(fontSize * 1.5);
  const letterSpacing = getBodyLetterSpacingPx();
  return { fontSize, lineHeight, letterSpacing };
}
