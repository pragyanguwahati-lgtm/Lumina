"use client";

import { motion } from "framer-motion";
import { useBook, BookPage } from "@/context/BookContext";

const NAV_ITEMS: { id: BookPage; label: string }[] = [
  { id: "upload", label: "Upload" },
  { id: "notes", label: "Notes" },
  { id: "quiz", label: "Quiz" },
  { id: "export", label: "Export" },
];

export default function Navigation() {
  const { currentPage, turnToPage, generatedData } = useBook();

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-brand-bg/60 backdrop-blur-md border-b border-brand-border/30"
    >
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        <button
          onClick={() => turnToPage("cover")}
          className="font-serif text-2xl tracking-widest text-brand-primary cursor-pointer hover:text-brand-gold transition-colors"
        >
          LUMINA
        </button>

        <div className="flex space-x-6 sm:space-x-8">
          {NAV_ITEMS.map((item) => {
            const isActive = currentPage === item.id;
            const isDisabled = item.id !== "upload" && !generatedData;

            return (
              <button
                key={item.id}
                disabled={isDisabled}
                aria-label={`Navigate to ${item.label}`}
                onClick={() => turnToPage(item.id)}
                className={`
                  relative text-xs sm:text-sm tracking-widest uppercase transition-colors duration-300 rounded-md px-2 py-1
                  ${isActive ? "text-brand-gold font-medium" : "text-brand-muted hover:text-brand-primary"}
                  ${isDisabled ? "opacity-30 cursor-not-allowed hover:text-brand-muted" : "cursor-pointer"}
                `}
              >
                <span>{item.label}</span>

                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-gold shadow-[0_0_8px_#D4A95A]"
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}

