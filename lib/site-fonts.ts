import localFont from "next/font/local";

export const display = {
  variable: "font-display-fallback",
};

export const serif = localFont({
  src: "../public/fonts/TeXGyreSchola-Regular.woff",
  variable: "--font-serif",
  display: "swap",
  fallback: ["Times New Roman", "serif"],
});

export const mono = localFont({
  src: "../public/fonts/pp-supply-mono.woff2",
  variable: "--font-mono",
  display: "swap",
  weight: "200",
  fallback: ["ui-monospace", "monospace"],
});
