import { contents, type ContentEntry } from "@/components/home/contents-data";
import type { DialConfig } from "dialkit";
import { pagesLabelToSlug } from "@/lib/site-sections";

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
  entry1Title: "DESIGNING PRODUCTS, WEBSITES, AND OBJECTS",
  entry1Pages: "LAB",
  entry2Title: "CULTIVATING A GARDEN OF THOUGHT",
  entry2Pages: "WRITING",
  entry3Title: "CONSUMING FICTION, PHILOSOPHY, SCI-FI",
  entry3Pages: "READING",
  entry4Title: "COLLECTING KNOWLEDGE",
  entry4Pages: "ARCHIVES",
  entry5Title: "CONSUMING FICTION, PHILOSOPHY, SCI-FI",
  entry5Pages: "STUDIO",
};

export const HOME_COPY_DIAL_CONFIG = {
  aboutText: {
    type: "text",
    default: "Jade is a product designer based in San Francisco, building at Perplexity. She has worked at Duolingo and Salesforce, and studied cognitive science, which shaped her interest in attention and perception. She aims to create artifacts that expand reality—things that help people notice and interact with the world anew. She is inspired by books, films, objects, and the collections people keep without quite knowing why.",
    placeholder: "Starts with Jade — J is the drop cap",
  },
  contentsCopy: {
    entry1Title: "DESIGNING PRODUCTS, WEBSITES, AND OBJECTS",
    entry1Pages: "LAB",
    entry2Title: "CULTIVATING A GARDEN OF THOUGHT",
    entry2Pages: "WRITING",
    entry3Title: "CONSUMING FICTION, PHILOSOPHY, SCI-FI",
    entry3Pages: "READING",
    entry4Title: "COLLECTING KNOWLEDGE",
    entry4Pages: "ARCHIVES",
    entry5Title: "CONSUMING FICTION, PHILOSOPHY, SCI-FI",
    entry5Pages: "STUDIO",
  },
} satisfies DialConfig;

export function getContentsFromCopyDials(
  copy: HomeCopyDials,
): ContentEntry[] {
  const rows = [
    { number: "01", title: copy.entry1Title, pages: copy.entry1Pages },
    { number: "02", title: copy.entry2Title, pages: copy.entry2Pages },
    { number: "03", title: copy.entry3Title, pages: copy.entry3Pages },
    { number: "04", title: copy.entry4Title, pages: copy.entry4Pages },
    { number: "05", title: copy.entry5Title, pages: copy.entry5Pages },
  ];

  return rows.map((row, index) => ({
    ...row,
    slug: pagesLabelToSlug(row.pages) ?? contents[index]!.slug,
  }));
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
