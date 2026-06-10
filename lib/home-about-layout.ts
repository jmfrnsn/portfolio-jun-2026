export const HOME_ABOUT_LAYOUTS = [
  { id: "columns", label: "Columns" },
  { id: "centered", label: "Centered" },
  { id: "editorial", label: "Editorial" },
  { id: "index", label: "Index" },
  { id: "contents", label: "Contents" },
] as const;

export type HomeAboutLayoutId = (typeof HOME_ABOUT_LAYOUTS)[number]["id"];

export const DEFAULT_HOME_ABOUT_LAYOUT: HomeAboutLayoutId = "editorial";

export const HOME_ABOUT_LAYOUT_STORAGE_KEY = "portfolio-home-about-layout";

export function isHomeAboutLayoutId(value: string): value is HomeAboutLayoutId {
  return HOME_ABOUT_LAYOUTS.some((layout) => layout.id === value);
}
