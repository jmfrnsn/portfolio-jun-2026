import type { ContentEntry } from "@/components/home/contents-data";

/** One hover variant per row — parallel in tone to the default title. */
export const CONTENTS_TITLE_VARIANTS: Record<ContentEntry["slug"], string> = {
  lab: "TRYING IDEAS BEFORE THEY'RE READY",
  writing: "NOTES THAT NEED ROOM TO GROW",
  reading: "BOOKS THAT REWIRE HOW I SEE",
  about: "WHO I AM AND WHAT I CARE ABOUT",
};
