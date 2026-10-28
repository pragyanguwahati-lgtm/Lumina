"use client";

import React from "react";
import { motion } from "framer-motion";
import { useBook, BookPage } from "@/context/BookContext";
import { Volume2, VolumeX, Sparkles, Book } from "lucide-react";

const NAV_ITEMS: { id: BookPage; label: string }[] = [
  { id: "upload", label: "Upload" },
  { id: "notes", label: "Notes" },
  { id: "quiz", label: "Quiz" },
  { id: "export", label: "Export" },
];

export default function Navigation() {
  const {
    isBookOpen,
    currentPage,
    turnToPage,
    closeBook,
    generatedData,
    soundEnabled,
    toggleSound,
    isTransforming
  } = useBook();

  return (
    <header className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-6 sm:px-12 md:px-20 border-b border-[#d6ad5f]/10 z-50 bg-[#0b0a09]/75 backdrop-blur-md transition-all duration-300">
      {/* Brand Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={closeBook}
          className="group flex items-center gap-2.5 text-left focus:outline-none"
          title="Return to closed tome cover"
        >
          <span className="font-serif font-medium text-2xl tracking-[0.12em] text-[#ffffff] group-hover:text-[#f6d78c] transition-colors">
            LUMINA
          </span>
          {isBookOpen && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] tracking-widest uppercase py-0.5 px-2 rounded-full border border-[#d6ad5f]/25 text-[#d6ad5f] bg-[#16140f]/60 hover:bg-[#d6ad5f]/15 transition-all">
              <Book className="w-3 h-3" />
              <span>Close Cover</span>
            </span>
          )}
        </button>
      </div>

      {/* Center Navigation Links (shown on md+) */}
      <nav aria-label="Sections" className="hidden md:flex items-center gap-8 lg:gap-11">
        {NAV_ITEMS.map((item) => {
          const isActive = isBookOpen && currentPage === item.id;
          const isAllowed = item.id === "upload" || Boolean(generatedData);

          return (
            <button
              key={item.id}
              disabled={!isAllowed}
              onClick={() => turnToPage(item.id)}
              aria-label={`Navigate to ${item.label}`}
              aria-current={isActive ? "page" : undefined}
              className={`
                relative py-1.5 text-xs font-sans uppercase tracking-[0.16em] transition-all duration-300
                ${isActive 
                  ? "text-[#ece6d8] font-semibold" 
                  : isAllowed 
                    ? "text-[#8d877a] hover:text-[#ece6d8]" 
                    : "text-[#4a463e] cursor-not-allowed opacity-40"}
              `}
            >
              <span>{item.label}</span>

              {isActive && (
                <motion.div
                  layoutId="active-nav-line"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#d6ad5f] shadow-[0_0_8px_#d6ad5f]"
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Right Utility Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Status chip */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#2a251b] bg-[#16140f] text-[11px] text-[#8d877a]">
          <span className={`w-1.5 h-1.5 rounded-full ${isTransforming ? "bg-[#d6ad5f] animate-ping" : "bg-[#7fb77e]"}`} />
          <span className="font-mono text-[10px] tracking-wider uppercase">
            {isTransforming ? "Crystallizing" : "Synthesizer Ready"}
          </span>
        </div>

        {/* Audio FX Toggle */}
        <button
          onClick={toggleSound}
          aria-label={soundEnabled ? "Mute tactile sound effects" : "Enable tactile sound effects"}
          title={soundEnabled ? "Mute tactile sound effects" : "Enable tactile sound effects"}
          className={`
            w-10 h-10 rounded-lg border transition-all duration-200 flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-[#d6ad5f]
            ${soundEnabled 
              ? "border-[#d6ad5f]/40 bg-[#d6ad5f]/15 text-[#f6d78c]" 
              : "border-[#2a251b] bg-[#16140f] text-[#8d877a] hover:text-[#ece6d8] hover:border-[#8a6d3b]"}
          `}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
}
