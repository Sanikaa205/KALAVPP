import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Kalavpp - Premium ArtCommerce Platform",
    template: "%s | Kalavpp",
  },
  description:
    "Discover, buy, and commission original artworks, handcrafted items, digital art, and creative services from talented Indian artists and creators.",
  keywords: [
    "art marketplace",
    "Indian art",
    "handcrafted",
    "digital art",
    "commission art",
    "artisan",
    "creative services",
  ],
  openGraph: {
    siteName: "Kalavpp",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
