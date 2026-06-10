export const HOME_ABOUT_LAYOUTS = [
  { id: "stacked", label: "Stacked" },
  { id: "columns", label: "Columns" },
  { id: "split", label: "Split" },
  { id: "flow", label: "Flow" },
  { id: "centered", label: "Centered" },
  { id: "ornament", label: "Ornament" },
] as const;

export type HomeAboutLayoutId = (typeof HOME_ABOUT_LAYOUTS)[number]["id"];

export const DEFAULT_HOME_ABOUT_LAYOUT: HomeAboutLayoutId = "stacked";

export const HOME_ABOUT_LAYOUT_STORAGE_KEY = "portfolio-home-about-layout";

export function isHomeAboutLayoutId(value: string): value is HomeAboutLayoutId {
  return HOME_ABOUT_LAYOUTS.some((layout) => layout.id === value);
}
