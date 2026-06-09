import type { ContentEntry } from "@/components/home/contents-data";
import { contents, DEFAULT_ABOUT_TEXT } from "@/components/home/contents-data";
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
  aboutText: DEFAULT_ABOUT_TEXT,
  entry1Title: contents[0]!.title,
  entry1Pages: contents[0]!.pages,
  entry2Title: contents[1]!.title,
  entry2Pages: contents[1]!.pages,
  entry3Title: contents[2]!.title,
  entry3Pages: contents[2]!.pages,
  entry4Title: contents[3]!.title,
  entry4Pages: contents[3]!.pages,
  entry5Title: contents[4]!.title,
  entry5Pages: contents[4]!.pages,
};

export const HOME_COPY_DIAL_CONFIG = {
  aboutText: {
    type: "text",
    default: DEFAULT_ABOUT_TEXT,
    placeholder: "Starts with Jade — J is the drop cap",
  },
  contentsCopy: {
    entry1Title: contents[0]!.title,
    entry1Pages: contents[0]!.pages,
    entry2Title: contents[1]!.title,
    entry2Pages: contents[1]!.pages,
    entry3Title: contents[2]!.title,
    entry3Pages: contents[2]!.pages,
    entry4Title: contents[3]!.title,
    entry4Pages: contents[3]!.pages,
    entry5Title: contents[4]!.title,
    entry5Pages: contents[4]!.pages,
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
