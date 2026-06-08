export type ContentEntry = {
  number: string;
  title: string;
  pages: string;
  highlighted?: boolean;
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
    highlighted: true,
  },
  {
    number: "05",
    title: "CONSUMING FICTION, PHILOSOPHY, SCI-FI",
    pages: "25 - 30",
  },
];

export const aboutText =
  "Jade is a designer based in San Francisco. She aims to create artifacts that expand reality. Reality is often larger than we perceive. I want to create things that help people notice, observe, and interact with the world in new ways. I am endlessly inspired by books, movies, objects, and other artifacts.";
