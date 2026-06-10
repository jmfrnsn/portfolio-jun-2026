import { DEFAULT_ABOUT_TEXT } from "@/components/home/contents-data";

/** Centered column width — padding scales down so this width is preserved. */
export const HOME_CONTENT_MAX_WIDTH_REM = 44;

export type HomeLayout = {
  section: {
    paddingXMobile: number;
    paddingTop: number;
    paddingBottom: number;
    paddingXDesktop: number;
    paddingTopDesktop: number;
    paddingBottomDesktop: number;
  };
  contents: {
    rowGap: number;
    rowPaddingX: number;
    rowPaddingY: number;
    rowPaddingXDesktop: number;
    leaderDotSize: number;
    leaderDotSpacing: number;
  };
  dropCap: {
    scale: number;
    offsetY: number;
    textGap: number;
    linesBesideMobile: number;
    linesBesideDesktop: number;
  };
  typography: {
    aboutFontSize: number;
    contentsFontSize: number;
  };
  inkBleed: {
    intensity: number;
  };
  copy: {
    aboutText: string;
  };
};

export const HOME_LAYOUT: HomeLayout = {
  section: {
    paddingXMobile: 32,
    paddingTop: 32,
    paddingBottom: 32,
    paddingXDesktop: 400,
    paddingTopDesktop: 96,
    paddingBottomDesktop: 96,
  },
  contents: {
    rowGap: 8,
    rowPaddingX: 12,
    rowPaddingY: 4,
    rowPaddingXDesktop: 8,
    leaderDotSize: 1.5,
    leaderDotSpacing: 6,
  },
  dropCap: {
    scale: 1.18,
    offsetY: 6,
    textGap: 10,
    linesBesideMobile: 3,
    linesBesideDesktop: 6,
  },
  typography: {
    aboutFontSize: 20,
    contentsFontSize: 16,
  },
  inkBleed: {
    intensity: 0,
  },
  copy: {
    aboutText: DEFAULT_ABOUT_TEXT,
  },
};
