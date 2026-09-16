import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import LenisProvider from "../components/LenisProvider";
import Atmosphere from "../components/Atmosphere";
import Navigation from "../components/Navigation";
import { BookProvider } from "../context/BookContext";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LUMINA | Turn Lectures Into Mastery",
  description: "Tactile AI-powered study journal that turns lecture materials into mastery revision notes and practice exams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="antialiased min-h-screen flex flex-col relative selection:bg-brand-gold/30 selection:text-brand-primary">
        <BookProvider>
          <LenisProvider>
            <Atmosphere />
            <Navigation />
            <main className="flex-grow relative z-10 pt-16">
              {children}
            </main>
          </LenisProvider>
        </BookProvider>
      </body>
    </html>
  );
}

