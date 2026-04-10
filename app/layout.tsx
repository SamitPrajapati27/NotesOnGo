import type { Metadata } from "next";
import { IBM_Plex_Serif,Gamja_Flower } from "next/font/google"
import "./globals.css";

export const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-serif",
});
export const gamjaFlower = Gamja_Flower({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gamja",
});

export const metadata: Metadata = {
  title: "Notes on Go",
  description: "Note taking website to improve your noting taking notes!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${gamjaFlower.variable} ${gamjaFlower.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
