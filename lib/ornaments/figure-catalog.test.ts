import assert from "node:assert/strict";
import test from "node:test";

import { simplifyCaptionTitle, toOrnamentFigures } from "./figure-catalog";
import type { ExportedOrnamentSource } from "./sources-export";

function stubSource(
  overrides: Partial<ExportedOrnamentSource>,
): ExportedOrnamentSource {
  return {
    id: "id",
    notionPageId: null,
    title: "Title",
    creator: "Maker",
    year: "1900",
    type: "The Met",
    era: "Baroque (17th c.)",
    region: "French",
    url: null,
    imageUrl: null,
    status: "to_read",
    notionStatus: "Active",
    archivedAt: null,
    notes: "",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

test("toOrnamentFigures assigns fig labels and era codes", () => {
  const figures = toOrnamentFigures([
    stubSource({ id: "1", era: "Baroque (17th c.)", year: "1652–1725" }),
    stubSource({ id: "2", era: "Baroque (17th c.)", year: "17th century" }),
    stubSource({
      id: "3",
      era: "19th-Century Revival & Historicism",
      year: "19th century",
    }),
  ]);

  assert.equal(figures[0]?.figLabel, "(Fig.01)");
  assert.equal(figures[1]?.figLabel, "(Fig.02)");
  assert.equal(figures[2]?.figLabel, "(Fig.03)");
  assert.equal(figures[0]?.catalogCode, "B.1");
  assert.equal(figures[1]?.catalogCode, "B.2");
  assert.equal(figures[2]?.catalogCode, "A.1");
  assert.equal(figures[0]?.dateLabel, "*(1652–1725)");
  assert.equal(figures[1]?.dateLabel, "*(17th century)");
});

test("simplifyCaptionTitle shortens museum titles for the index", () => {
  assert.equal(
    simplifyCaptionTitle(
      "Design for an Alcove with a Coat of Arms Flanked by Putti",
    ),
    "Alcove",
  );
  assert.equal(
    simplifyCaptionTitle("Design for a Frieze with Putto and Acanthus Scroll"),
    "Frieze",
  );
  assert.equal(
    simplifyCaptionTitle(
      "Design for a Chandelier with Acanthus, Grape, and Palmette Motifs",
    ),
    "Chandelier",
  );
  assert.equal(
    simplifyCaptionTitle("Ornament Design (German, 17th century)"),
    "Ornament Design",
  );
  assert.equal(
    simplifyCaptionTitle(
      "Ornament Design with Vases (Designs for Various Ornaments, pl. 38)",
    ),
    "Ornament Design with Vases",
  );
});
