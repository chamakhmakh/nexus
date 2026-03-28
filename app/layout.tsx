import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";

export const metadata: Metadata = {
  title: "NEXUS — The Future of Human Evolution",
  description:
    "A cinematic experience at the intersection of science, technology, and the next chapter of mankind.",
  keywords: ["NEXUS", "futuristic", "sci-fi", "human evolution", "technology"],
  openGraph: {
    title: "NEXUS",
    description: "The next chapter of mankind begins here.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
