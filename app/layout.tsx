import "../styles/globals.css";
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "Telugu Vaancha – Telugu Lyrics, Songs & Artists",
  description:
    "Explore Telugu cinema music and lyrics in Telugu, Romanized Telugu, and English translation. Discover your favorite artists and movies.",
  keywords: [
    "Telugu lyrics",
    "Telugu songs",
    "Telugu cinema",
    "Telugu movie songs",
    "Telugu Vaancha",
  ],
  openGraph: {
    title: "Telugu Vaancha – Telugu Lyrics, Songs & Artists",
    description:
      "Discover Telugu cinema music and lyrics in Telugu, English Transliteration, and English translation.",
    url: "https://telugu-vaancha.vercel.app/",
    siteName: "Telugu Vaancha",
    images: [
      {
        url: "https://telugu-vaancha.vercel.app/og-image.png", // optional: add if you have one
        width: 1200,
        height: 630,
        alt: "Telugu Vaancha",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  other: {
    "google-site-verification": "ZNLK-m4dbc12qfVhshB8pFkPoeBXaWypYadhIkBR0vw",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container  max-w-full  px-4 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
