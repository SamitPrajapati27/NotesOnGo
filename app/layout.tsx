import type { Metadata } from "next";
import { IBM_Plex_Serif, Gamja_Flower } from "next/font/google";
import "./globals.css";
import AppErrors from "@/src/Components/Errors/AppErrors";
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

/**
 * Provide the shared HTML layout, global styles, and editor font variables.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ibmPlexSerif.variable} ${gamjaFlower.variable} h-full antialiased`}>
      <body className="h-full flex flex-col"><AppErrors>{children}</AppErrors></body>
    </html>
  );
}
