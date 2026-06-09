export type ContentEntry = {
  number: string;
  title: string;
  pages: string;
};

export const contents: ContentEntry[] = [
  {
    number: "01",
    title: "DESIGNING PRODUCTS, WEBSITES, AND OBJECTS",
    pages: "LAB",
  },
  {
    number: "02",
    title: "CULTIVATING A GARDEN OF THOUGHT",
    pages: "WRITING",
  },
  {
    number: "03",
    title: "CONSUMING FICTION, PHILOSOPHY, SCI-FI",
    pages: "READING",
  },
  {
    number: "04",
    title: "COLLECTING KNOWLEDGE",
    pages: "ARCHIVES",
  },
  {
    number: "05",
    title: "CONSUMING FICTION, PHILOSOPHY, SCI-FI",
    pages: "STUDIO",
  },
];

export const DEFAULT_ABOUT_TEXT =
  "Jade is a product designer based in San Francisco, building at Perplexity. She has worked at Duolingo and Salesforce, and studied cognitive science, which shaped her interest in attention and perception. She aims to create artifacts that expand reality—things that help people notice and interact with the world anew. She is inspired by books, films, objects, and the collections people keep without quite knowing why.";

/** @deprecated Use DEFAULT_ABOUT_TEXT */
export const aboutText = DEFAULT_ABOUT_TEXT;
