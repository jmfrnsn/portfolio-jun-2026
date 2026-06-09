import type { HomeCopyDials } from "./home-copy-dials";
import type { HomeLayoutDials } from "./home-layout-dials";

export type BakeHomeLayoutPayload = Omit<HomeLayoutDials, "copy"> & {
  copy: HomeCopyDials;
};

function escapeTsString(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function slider(defaultValue: number, min: number, max: number, step?: number): string {
  return step === undefined
    ? `[${defaultValue}, ${min}, ${max}]`
    : `[${defaultValue}, ${min}, ${max}, ${step}]`;
}

export function buildHomeLayoutDialsSource(payload: BakeHomeLayoutPayload): string {
  const { section, contents, dropCap, typography, inkBleed } = payload;

  return `import type { DialConfig } from "dialkit";

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
    paddingXMobile: ${slider(section.paddingXMobile, 0, 256, 4)},
    paddingTop: ${slider(section.paddingTop, 0, 256, 4)},
    paddingBottom: ${slider(section.paddingBottom, 0, 256, 4)},
    paddingXDesktop: ${slider(section.paddingXDesktop, 0, 400, 4)},
    paddingTopDesktop: ${slider(section.paddingTopDesktop, 0, 400, 4)},
    paddingBottomDesktop: ${slider(section.paddingBottomDesktop, 0, 400, 4)},
  },
  contents: {
    rowGap: ${slider(contents.rowGap, 0, 128, 4)},
    rowPaddingX: ${slider(contents.rowPaddingX, 0, 160, 4)},
    rowPaddingY: ${slider(contents.rowPaddingY, 0, 96, 4)},
    rowPaddingXDesktop: ${slider(contents.rowPaddingXDesktop, 0, 160, 4)},
  },
  dropCap: {
    _collapsed: true,
    scale: ${slider(dropCap.scale, 0.3, 1.2, 0.01)},
    offsetY: ${slider(dropCap.offsetY, 0, 32)},
    textGap: ${slider(dropCap.textGap, 0, 32)},
    linesBesideMobile: ${slider(dropCap.linesBesideMobile, 1, 8)},
    linesBesideDesktop: ${slider(dropCap.linesBesideDesktop, 1, 10)},
  },
  typography: {
    aboutFontSize: ${slider(typography.aboutFontSize, 12, 48)},
    contentsFontSize: ${slider(typography.contentsFontSize, 10, 32)},
  },
  inkBleed: {
    intensity: ${slider(inkBleed.intensity, 0, 1, 0.01)},
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
    paddingXMobile: ${section.paddingXMobile},
    paddingTop: ${section.paddingTop},
    paddingBottom: ${section.paddingBottom},
    paddingXDesktop: ${section.paddingXDesktop},
    paddingTopDesktop: ${section.paddingTopDesktop},
    paddingBottomDesktop: ${section.paddingBottomDesktop},
  },
  contents: {
    rowGap: ${contents.rowGap},
    rowPaddingX: ${contents.rowPaddingX},
    rowPaddingY: ${contents.rowPaddingY},
    rowPaddingXDesktop: ${contents.rowPaddingXDesktop},
  },
  dropCap: {
    scale: ${dropCap.scale},
    offsetY: ${dropCap.offsetY},
    textGap: ${dropCap.textGap},
    linesBesideMobile: ${dropCap.linesBesideMobile},
    linesBesideDesktop: ${dropCap.linesBesideDesktop},
  },
  typography: {
    aboutFontSize: ${typography.aboutFontSize},
    contentsFontSize: ${typography.contentsFontSize},
  },
  inkBleed: {
    intensity: ${inkBleed.intensity},
  },
  copy: DEFAULT_HOME_COPY_DIALS,
};
`;
}

export function buildHomeCopyDialsSource(copy: HomeCopyDials): string {
  return `import type { ContentEntry } from "@/components/home/contents-data";
import type { DialConfig } from "dialkit";

export type HomeCopyDials = {
  aboutText: string;
  entry1Title: string;
  entry1Pages: string;
  entry2Title: string;
  entry2Pages: string;
  entry3Title: string;
  entry3Pages: string;
  entry4Title: string;
  entry4Pages: string;
  entry5Title: string;
  entry5Pages: string;
};

export const DEFAULT_HOME_COPY_DIALS: HomeCopyDials = {
  aboutText: "${escapeTsString(copy.aboutText)}",
  entry1Title: "${escapeTsString(copy.entry1Title)}",
  entry1Pages: "${escapeTsString(copy.entry1Pages)}",
  entry2Title: "${escapeTsString(copy.entry2Title)}",
  entry2Pages: "${escapeTsString(copy.entry2Pages)}",
  entry3Title: "${escapeTsString(copy.entry3Title)}",
  entry3Pages: "${escapeTsString(copy.entry3Pages)}",
  entry4Title: "${escapeTsString(copy.entry4Title)}",
  entry4Pages: "${escapeTsString(copy.entry4Pages)}",
  entry5Title: "${escapeTsString(copy.entry5Title)}",
  entry5Pages: "${escapeTsString(copy.entry5Pages)}",
};

export const HOME_COPY_DIAL_CONFIG = {
  aboutText: {
    type: "text",
    default: "${escapeTsString(copy.aboutText)}",
    placeholder: "Starts with Jade — J is the drop cap",
  },
  contentsCopy: {
    entry1Title: "${escapeTsString(copy.entry1Title)}",
    entry1Pages: "${escapeTsString(copy.entry1Pages)}",
    entry2Title: "${escapeTsString(copy.entry2Title)}",
    entry2Pages: "${escapeTsString(copy.entry2Pages)}",
    entry3Title: "${escapeTsString(copy.entry3Title)}",
    entry3Pages: "${escapeTsString(copy.entry3Pages)}",
    entry4Title: "${escapeTsString(copy.entry4Title)}",
    entry4Pages: "${escapeTsString(copy.entry4Pages)}",
    entry5Title: "${escapeTsString(copy.entry5Title)}",
    entry5Pages: "${escapeTsString(copy.entry5Pages)}",
  },
} satisfies DialConfig;

export function getContentsFromCopyDials(
  copy: HomeCopyDials,
): ContentEntry[] {
  return [
    { number: "01", title: copy.entry1Title, pages: copy.entry1Pages },
    { number: "02", title: copy.entry2Title, pages: copy.entry2Pages },
    { number: "03", title: copy.entry3Title, pages: copy.entry3Pages },
    { number: "04", title: copy.entry4Title, pages: copy.entry4Pages },
    { number: "05", title: copy.entry5Title, pages: copy.entry5Pages },
  ];
}

export function flattenCopyDialsFromPanel(panel: {
  aboutText: string;
  contentsCopy: {
    entry1Title: string;
    entry1Pages: string;
    entry2Title: string;
    entry2Pages: string;
    entry3Title: string;
    entry3Pages: string;
    entry4Title: string;
    entry4Pages: string;
    entry5Title: string;
    entry5Pages: string;
  };
}): HomeCopyDials {
  return {
    aboutText: panel.aboutText,
    ...panel.contentsCopy,
  };
}
`;
}

export function buildContentsDataSource(copy: HomeCopyDials): string {
  return `export type ContentEntry = {
  number: string;
  title: string;
  pages: string;
};

export const contents: ContentEntry[] = [
  {
    number: "01",
    title: "${escapeTsString(copy.entry1Title)}",
    pages: "${escapeTsString(copy.entry1Pages)}",
  },
  {
    number: "02",
    title: "${escapeTsString(copy.entry2Title)}",
    pages: "${escapeTsString(copy.entry2Pages)}",
  },
  {
    number: "03",
    title: "${escapeTsString(copy.entry3Title)}",
    pages: "${escapeTsString(copy.entry3Pages)}",
  },
  {
    number: "04",
    title: "${escapeTsString(copy.entry4Title)}",
    pages: "${escapeTsString(copy.entry4Pages)}",
  },
  {
    number: "05",
    title: "${escapeTsString(copy.entry5Title)}",
    pages: "${escapeTsString(copy.entry5Pages)}",
  },
];

export const DEFAULT_ABOUT_TEXT =
  "${escapeTsString(copy.aboutText)}";

/** @deprecated Use DEFAULT_ABOUT_TEXT */
export const aboutText = DEFAULT_ABOUT_TEXT;
`;
}
