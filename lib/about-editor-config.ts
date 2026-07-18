import type { AboutEditorConfig } from "./about-editor-types";

const ABOUT_TEXT =
  "Jade is a product designer based in San Francisco, building at Perplexity. She has worked at Duolingo and Salesforce, and studied cognitive science, which shaped her interest in attention and perception. She aims to create artifacts that expand reality, things that help people notice and interact with the world anew. She is inspired by books, films, objects, and the collections people keep without quite knowing why.";

const INTRO_TEXT =
  "ade is a designer based in San Francisco. She aims to create artifacts that expand reality. Reality is often larger than we perceive. I want to create things that help people notice, observe, and interact with the world in new ways. I am endlessly inspired by books, movies, objects, and other artifacts. This page gathers the texture around that practice: attention, perception, research, stories, images, and the small collections that change how a thing can be seen.";

const LONG_FORM_TEXT = [
  ABOUT_TEXT,
  "I am interested in tools, stories, images, and other artifacts that give ordinary reality a little more surface area. A good interface can behave like a lens. A book can make one object feel newly strange. A map can turn knowledge into a place you want to walk through.",
  "My work sits between product design, visual systems, research, and art direction. I like making things that are useful, but I also like when a useful thing leaves behind a residue of feeling.",
].join(" ");

export const DEFAULT_ABOUT_EDITOR_CONFIG: AboutEditorConfig = {
  sourceText: [
    INTRO_TEXT,
    LONG_FORM_TEXT,
    ABOUT_TEXT,
    "Jade is a designer based in San Francisco. Jade is a designer based in San Francisco. I aim to create artifacts that expand reality. Jade is a designer based in San Francisco.",
    Array(5).fill(ABOUT_TEXT).join(" "),
    Array(3).fill(LONG_FORM_TEXT).join(" "),
  ].join(" "),
  textBlocks: {
    intro: {
      label: "Intro Wrap",
      fontSize: 20,
      color: "#27301c",
      justify: true,
    },
    body: {
      label: "Portrait Body",
      fontSize: 20,
      color: "#27301c",
      justify: true,
    },
    bodyExtra: {
      label: "Portrait Body 2",
      fontSize: 20,
      color: "#27301c",
      justify: true,
    },
    statement: {
      label: "Statement",
      fontSize: 32,
      color: "#000000",
      justify: true,
    },
    lower: {
      label: "Lower Wrap",
      fontSize: 20,
      color: "#27301c",
      justify: true,
    },
    footer: {
      label: "Footer Ghost",
      fontSize: 20,
      color: "rgba(39, 48, 28, 0.25)",
      justify: true,
    },
  },
};
