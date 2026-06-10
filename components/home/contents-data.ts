export const contents = [
  {
    number: "01",
    title: "EXPERIMENTING WITH NEW IDEAS + TOOLS",
    pages: "LAB",
    slug: "lab",
  },
  {
    number: "02",
    title: "CULTIVATING A GARDEN OF THOUGHT",
    pages: "WRITING",
    slug: "writing",
  },
  {
    number: "03",
    title: "CONSUMING FICTION, PHILOSOPHY, SCI-FI",
    pages: "READING",
    slug: "reading",
  },
  {
    number: "04",
    title: "NOTICING THE WORLD ANEW",
    pages: "ARCHIVES",
    slug: "archives",
  },
  {
    number: "05",
    title: "TAKING A WALK",
    pages: "ABOUT",
    slug: "about",
  },
] as const;

export type ContentEntry = {
  number: string;
  title: string;
  pages: string;
  slug: (typeof contents)[number]["slug"];
};

export const DEFAULT_ABOUT_TEXT =
  "Jade is a product designer based in San Francisco, building at Perplexity. She has worked at Duolingo and Salesforce, and studied cognitive science, which shaped her interest in attention and perception. She aims to create artifacts that expand reality—things that help people notice and interact with the world anew. She is inspired by books, films, objects, and the collections people keep without quite knowing why.";

/** @deprecated Use DEFAULT_ABOUT_TEXT */
export const aboutText = DEFAULT_ABOUT_TEXT;
