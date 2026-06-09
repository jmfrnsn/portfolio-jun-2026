import type { DialConfig } from "dialkit";

import {
  DEFAULT_HOME_COPY_DIALS,
  type HomeCopyDials,
} from "./home-copy-dials";

export type { HomeCopyDials };
export {
  DEFAULT_HOME_COPY_DIALS,
  getContentsFromCopyDials,
  HOME_COPY_DIAL_CONFIG,
} from "./home-copy-dials";

export const HOME_LAYOUT_DIAL_CONFIG = {
  section: {
    paddingXMobile: [32, 0, 256, 4],
    paddingTop: [32, 0, 256, 4],
    paddingBottom: [32, 0, 256, 4],
    paddingXDesktop: [400, 0, 400, 4],
    paddingTopDesktop: [96, 0, 400, 4],
    paddingBottomDesktop: [96, 0, 400, 4],
  },
  contents: {
    rowGap: [8, 0, 128, 4],
    rowPaddingX: [8, 0, 160, 4],
    rowPaddingY: [4, 0, 96, 4],
    rowPaddingXDesktop: [8, 0, 160, 4],
  },
  dropCap: {
    _collapsed: true,
    scale: [0.7, 0.3, 1.2, 0.01],
    offsetY: [6, 0, 32],
    textGap: [10, 0, 32],
    linesBesideMobile: [3, 1, 8],
    linesBesideDesktop: [6, 1, 10],
  },
  typography: {
    aboutFontSize: [20, 12, 48],
    contentsFontSize: [16, 10, 32],
  },
  inkBleed: {
    intensity: [0.47, 0, 1, 0.01],
  },
} satisfies DialConfig;

export type HomeLayoutDials = {
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
  copy: HomeCopyDials;
};

export const DEFAULT_HOME_LAYOUT_DIALS: HomeLayoutDials = {
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
    rowPaddingX: 8,
    rowPaddingY: 4,
    rowPaddingXDesktop: 8,
  },
  dropCap: {
    scale: 0.7,
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
    intensity: 0.47,
  },
  copy: DEFAULT_HOME_COPY_DIALS,
};
