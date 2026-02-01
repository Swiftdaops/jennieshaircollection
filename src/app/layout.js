import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import PublicShell from "@/components/PublicShell";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://yourdomain.com"), // change to your real domain

  title: {
    default: "Jennie’s Hairs Collection | Luxury Wigs & Hair Extensions",
    template: "%s | Jennie’s Hairs Collection",
  },

  description:
    "Jennie’s Hairs Collection offers premium luxury wigs and hair extensions in Nigeria. Elegant, high-quality hair for queens and princesses who lead.",

  keywords: [
    "luxury wigs Nigeria",
    "human hair wigs",
    "hair extensions Nigeria",
    "blonde wigs",
    "lace frontal wigs",
    "luxury hair Lagos",
    "Jennie’s Hairs Collection",
  ],

  authors: [{ name: "Jennie’s Hairs Collection" }],
  creator: "Jennie’s Hairs Collection",
  publisher: "Jennie’s Hairs Collection",

  openGraph: {
    title: "Jennie’s Hairs Collection | Luxury Wigs for Elegant Queens",
    description:
      "Premium luxury wigs and hair extensions designed for elegance, confidence, and royalty.",
    url: "https://yourdomain.com",
    siteName: "Jennie’s Hairs Collection",
    images: [
      {
        url: "https://res.cloudinary.com/ds2cq1vue/image/upload/v1769979572/7388794-removebg-preview_wirqwz.png",
        width: 1200,
        height: 630,
        alt: "Jennie’s Hairs Collection Logo",
      },
    ],
    locale: "en_NG",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Jennie’s Hairs Collection | Luxury Wigs",
    description:
      "Luxury wigs and hair extensions crafted for queens. Confidence, elegance, and beauty.",
    images: [
      "https://res.cloudinary.com/ds2cq1vue/image/upload/v1769979572/7388794-removebg-preview_wirqwz.png",
    ],
  },

  icons: {
    icon: "/favicon.ico",
    apple:
      "https://res.cloudinary.com/ds2cq1vue/image/upload/v1769979572/7388794-removebg-preview_wirqwz.png",
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <PublicShell>{children}</PublicShell>
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
