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
    paddingXMobile: [32, 0, 96],
    paddingTop: [32, 0, 96],
    paddingBottom: [32, 0, 96],
    paddingXDesktop: [48, 0, 128],
    paddingTopDesktop: [48, 0, 128],
    paddingBottomDesktop: [48, 0, 128],
  },
  contents: {
    rowGap: [4, 0, 48],
    rowPaddingX: [12, 0, 48],
    rowPaddingY: [10, 0, 32],
    rowPaddingXDesktop: [16, 0, 48],
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
    aboutFontSize: [24, 12, 48],
    contentsFontSize: [16, 10, 32],
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
  copy: HomeCopyDials;
};

export const DEFAULT_HOME_LAYOUT_DIALS: HomeLayoutDials = {
  section: {
    paddingXMobile: 32,
    paddingTop: 32,
    paddingBottom: 32,
    paddingXDesktop: 48,
    paddingTopDesktop: 48,
    paddingBottomDesktop: 48,
  },
  contents: {
    rowGap: 4,
    rowPaddingX: 12,
    rowPaddingY: 10,
    rowPaddingXDesktop: 16,
  },
  dropCap: {
    scale: 0.7,
    offsetY: 6,
    textGap: 10,
    linesBesideMobile: 3,
    linesBesideDesktop: 6,
  },
  typography: {
    aboutFontSize: 24,
    contentsFontSize: 16,
  },
  copy: DEFAULT_HOME_COPY_DIALS,
};
