import {
  Cormorant_Garamond,
  IBM_Plex_Mono,
  Pinyon_Script,
} from "next/font/google";

export const display = Pinyon_Script({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

export const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["200", "300"],
});
