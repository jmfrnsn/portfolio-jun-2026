export type ContentEntry = {
  number: string;
  title: string;
  pages: string;
};

export const contents: ContentEntry[] = [
  {
    number: "01",
    title: "EXPERIMENTING WITH TOOLS + IDEAS",
    pages: "1 - 10",
  },
  {
    number: "02",
    title: "CULTIVATING A GARDEN OF THOUGHT",
    pages: "11 - 15",
  },
  {
    number: "03",
    title: "CONSUMING FICTION, PHILOSOPHY, SCI-FI",
    pages: "16 - 20",
  },
  {
    number: "04",
    title: "COLLECTING ARTIFACTS",
    pages: "21 - 24",
  },
  {
    number: "05",
    title: "CONSUMING FICTION, PHILOSOPHY, SCI-FI",
    pages: "25 - 30",
  },
];

export const DEFAULT_ABOUT_TEXT =
  "Jade is a product designer based in San Francisco, building at Perplexity. She has worked at Duolingo and Salesforce, and studied cognitive science, which shaped her interest in attention and perception. She aims to create artifacts that expand reality—things that help people notice and interact with the world anew. She is inspired by books, films, objects, and the collections people keep without quite knowing why.";

/** @deprecated Use DEFAULT_ABOUT_TEXT */
export const aboutText = DEFAULT_ABOUT_TEXT;
