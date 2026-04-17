import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kido Studio — Editorial Kids Fashion",
    template: "%s | Kido Studio",
  },
  description:
    "Discover curated kids' fashion — clean, modern, and effortlessly cool. Shop boys, girls, and infants collections.",
  keywords: ["kids fashion", "children clothing", "boys clothes", "girls clothes", "infant wear"],
  openGraph: {
    title: "Kido Studio — Editorial Kids Fashion",
    description: "Curated kids' fashion — clean, modern, effortlessly cool.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#F2F1ED",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
