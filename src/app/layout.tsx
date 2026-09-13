import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import LenisProvider from "../components/LenisProvider";
import Atmosphere from "../components/Atmosphere";
import Navigation from "../components/Navigation";

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
  title: "LUMINA | AI-Powered Student Workspace",
  description: "Turn lectures into mastery with AI-generated revision notes and quizzes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="antialiased min-h-screen flex flex-col relative selection:bg-brand-gold/30 selection:text-brand-primary">
        <LenisProvider>
          <Atmosphere />
          <Navigation />
          <main className="flex-grow relative z-10">
            {children}
          </main>
        </LenisProvider>
      </body>
    </html>
  );
}
