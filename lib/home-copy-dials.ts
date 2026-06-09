import type { ContentEntry } from "@/components/home/contents-data";
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
  aboutText: "Jade is a product designer based in San Francisco, building at Perplexity. She has worked at Duolingo and Salesforce, and studied cognitive science, which shaped her interest in attention and perception. She aims to create artifacts that expand reality—things that help people notice and interact with the world anew. She is inspired by books, films, objects, and the collections people keep without quite knowing why.",
  entry1Title: "EXPERIMENTING WITH TOOLS + IDEAS",
  entry1Pages: "1 - 10",
  entry2Title: "CULTIVATING A GARDEN OF THOUGHT",
  entry2Pages: "11 - 15",
  entry3Title: "CONSUMING FICTION, PHILOSOPHY, SCI-FI",
  entry3Pages: "16 - 20",
  entry4Title: "COLLECTING ARTIFACTS",
  entry4Pages: "21 - 24",
  entry5Title: "CONSUMING FICTION, PHILOSOPHY, SCI-FI",
  entry5Pages: "25 - 30",
};

export const HOME_COPY_DIAL_CONFIG = {
  aboutText: {
    type: "text",
    default: "Jade is a product designer based in San Francisco, building at Perplexity. She has worked at Duolingo and Salesforce, and studied cognitive science, which shaped her interest in attention and perception. She aims to create artifacts that expand reality—things that help people notice and interact with the world anew. She is inspired by books, films, objects, and the collections people keep without quite knowing why.",
    placeholder: "Starts with Jade — J is the drop cap",
  },
  contentsCopy: {
    entry1Title: "EXPERIMENTING WITH TOOLS + IDEAS",
    entry1Pages: "1 - 10",
    entry2Title: "CULTIVATING A GARDEN OF THOUGHT",
    entry2Pages: "11 - 15",
    entry3Title: "CONSUMING FICTION, PHILOSOPHY, SCI-FI",
    entry3Pages: "16 - 20",
    entry4Title: "COLLECTING ARTIFACTS",
    entry4Pages: "21 - 24",
    entry5Title: "CONSUMING FICTION, PHILOSOPHY, SCI-FI",
    entry5Pages: "25 - 30",
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
