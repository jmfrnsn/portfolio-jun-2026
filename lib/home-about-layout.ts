export const HOME_ABOUT_LAYOUTS = [
  {
    id: "editorial",
    label: "Editorial",
    blurb: "About columns with the running page list beside the hero.",
  },
  {
    id: "contents",
    label: "Contents",
    blurb: "Page list alone — dotted leaders, year suffixes, scramble hover.",
  },
  {
    id: "terminal",
    label: "Terminal",
    blurb: "Directory listing on paper — prompt, ls rows, caret on focus.",
  },
  {
    id: "columns",
    label: "Columns",
    blurb: "Split about text with the page list in the center lane.",
  },
  {
    id: "centered",
    label: "Centered",
    blurb: "Centered about block with the page list below.",
  },
  {
    id: "index",
    label: "Index",
    blurb: "Index table of pages with a small illustration.",
  },
] as const;

export type HomeAboutLayoutId = (typeof HOME_ABOUT_LAYOUTS)[number]["id"];

export const DEFAULT_HOME_ABOUT_LAYOUT: HomeAboutLayoutId = "editorial";

export const HOME_ABOUT_LAYOUT_STORAGE_KEY = "portfolio-home-about-layout";

export function isHomeAboutLayoutId(value: string): value is HomeAboutLayoutId {
  return HOME_ABOUT_LAYOUTS.some((layout) => layout.id === value);
}
