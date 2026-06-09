import {
  ABOUT_FONT_SIZE_PX,
  BODY_FONT_SIZE_PX,
  waitForSerifFonts,
} from "@/lib/typography";
import { getWrapHull } from "@/lib/pretext-wrap-geometry";

const HERO_IMAGE = "/images/hero-garden.png";
const DROP_CAP_SRC = "/images/drop-cap-j.svg";

function loadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const image = document.createElement("img");
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
  });
}

export function preloadHomeAssets(): Promise<void> {
  return Promise.all([
    waitForSerifFonts([ABOUT_FONT_SIZE_PX, BODY_FONT_SIZE_PX]),
    loadImage(HERO_IMAGE),
    loadImage(DROP_CAP_SRC),
    getWrapHull(DROP_CAP_SRC, { smoothRadius: 4, mode: "envelope" }),
  ]).then(() => undefined);
}
