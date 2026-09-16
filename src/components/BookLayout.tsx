"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBook, BookPage } from "@/context/BookContext";
import { Volume2, VolumeX, RotateCcw } from "lucide-react";

interface BookLayoutProps {
  children: React.ReactNode;
}

const TABS: { id: BookPage; label: string }[] = [
  { id: "upload", label: "UPLOAD" },
  { id: "notes", label: "NOTES" },
  { id: "quiz", label: "QUIZ" },
  { id: "export", label: "EXPORT" },
];

export default function BookLayout({ children }: BookLayoutProps) {
  const { currentPage, turnToPage, flipDirection, soundEnabled, toggleSound, resetBook, generatedData } = useBook();

  // Page Flip Animation Variants
  const flipVariants = {
    initial: (direction: "next" | "prev") => ({
      rotateY: direction === "next" ? 45 : -45,
      opacity: 0,
      scale: 0.98,
      transformOrigin: direction === "next" ? "left center" : "right center",
    }),
    animate: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut" as const,
      },
    },
    exit: (direction: "next" | "prev") => ({
      rotateY: direction === "next" ? -50 : 50,
      opacity: 0,
      scale: 0.98,
      transformOrigin: direction === "next" ? "left center" : "right center",
      transition: {
        duration: 0.5,
        ease: "easeIn" as const,
      },
    }),
  };


  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-8 flex flex-col items-center">
      {/* Top Utility Ribbon / Bar */}
      <div className="w-full flex items-center justify-between mb-4 px-2">
        <button
          onClick={resetBook}
          className="flex items-center gap-2 text-xs uppercase tracking-widest text-brand-muted hover:text-brand-gold transition-colors py-1 px-3 rounded-lg border border-brand-border/40 bg-brand-surface/30 backdrop-blur-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Cover</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? "Mute book sound effects" : "Enable tactile sound effects"}
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-brand-muted hover:text-brand-gold transition-colors py-1 px-3 rounded-lg border border-brand-border/40 bg-brand-surface/30 backdrop-blur-sm"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-brand-gold" /> : <VolumeX className="w-3.5 h-3.5 text-brand-muted" />}
            <span>{soundEnabled ? "Sound On" : "Sound Muted"}</span>
          </button>
        </div>
      </div>

      {/* Main Double-Page Book Container */}
      <div className="relative w-full aspect-[16/10] min-h-[580px] perspective-2000 flex items-stretch">
        
        {/* Desk Ambient Cast Shadow under Book */}
        <div className="absolute -bottom-8 left-[3%] right-[3%] h-14 bg-black/80 blur-3xl rounded-[40px] pointer-events-none" />

        {/* The Open Notebook Outer Leather / Binding Border */}
        <div className="relative w-full h-full bg-[#1A1918] rounded-2xl p-2.5 sm:p-4 book-outer-shadow border border-[#3A3835] flex items-stretch overflow-hidden">
          
          {/* Top Ledger Navigation Tabs */}
          <nav
            aria-label="Notebook chapters navigation"
            className="absolute top-2 right-8 z-30 flex items-center gap-2 sm:gap-4"
          >
            {TABS.map((tab) => {
              const isActive = currentPage === tab.id;
              const isDisabled = tab.id !== "upload" && !generatedData;

              return (
                <button
                  key={tab.id}
                  disabled={isDisabled}
                  onClick={() => turnToPage(tab.id)}
                  aria-label={`Navigate to ${tab.label}`}
                  className={`
                    relative px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-serif uppercase tracking-[0.2em] rounded-t-md transition-all duration-300
                    ${isActive 
                      ? "bg-[#F8F6F0] text-[#242220] font-semibold shadow-md translate-y-1" 
                      : isDisabled
                      ? "bg-[#252422] text-[#6E6B66] cursor-not-allowed opacity-50"
                      : "bg-[#2C2A28] text-[#B5AEA4] hover:text-brand-gold hover:bg-[#383532]"
                    }
                  `}
                >
                  {tab.label}
                  {isActive && (
                    <div className="absolute -bottom-1 left-0 right-0 h-1.5 bg-[#F8F6F0]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Animated Page Flip Body Container */}
          <div className="relative w-full h-full preserve-3d">
            <AnimatePresence mode="wait" custom={flipDirection}>
              <motion.div
                key={currentPage}
                custom={flipDirection}
                variants={flipVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full h-full flex rounded-xl overflow-hidden shadow-2xl relative"
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {children}

                {/* Central Spine Shadow & Crease Overlay */}
                <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-12 pointer-events-none z-20 flex">
                  {/* Left inner shadow */}
                  <div className="w-1/2 h-full bg-gradient-to-r from-transparent to-black/25" />
                  {/* Spine binding line */}
                  <div className="w-[1px] h-full bg-black/40" />
                  {/* Right inner shadow */}
                  <div className="w-1/2 h-full bg-gradient-to-l from-transparent to-black/25" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}

