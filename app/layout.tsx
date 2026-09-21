import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "90s Music World",
  description: "A premium nostalgic 90s music streaming experience with cinematic playback.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-black">{children}</body>
    </html>
  );
}
