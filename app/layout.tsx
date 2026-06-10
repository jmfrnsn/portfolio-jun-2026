import type { Metadata } from "next";

import "./globals.css";
import { MonogramMark } from "@/components/shared/MonogramMark";
import { display, mono, serif } from "@/lib/site-fonts";

export const metadata: Metadata = {
  title: "Jade Franson",
  description:
    "Portfolio of Jade Franson, a designer based in San Francisco.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${serif.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-paper font-serif text-base text-ink">
        <MonogramMark />
        {children}
      </body>
    </html>
  );
}
