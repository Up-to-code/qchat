import type { Metadata } from "next";
import "./globals.css";
import "./codex-theme.css";
import "@fontsource/noto-sans-arabic/arabic-400.css";
import "@fontsource/noto-sans-arabic/arabic-500.css";

export const metadata: Metadata = {
  title: "QChat — Generative UI compiler",
  description: "A secure, adapter-first React runtime for validated generative interfaces.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
