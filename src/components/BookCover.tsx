"use client";

import { motion } from "framer-motion";
import { Sparkles, BookOpen } from "lucide-react";

interface BookCoverProps {
  onOpen: () => void;
}

export default function BookCover({ onOpen }: BookCoverProps) {
  return (
    <div className="relative w-full max-w-[500px] aspect-[4/5] mx-auto perspective-2000 flex items-center justify-center p-4">
      {/* Soft desk cast shadow */}
      <div className="absolute -bottom-6 w-[88%] h-12 bg-black/70 blur-2xl rounded-full pointer-events-none" />

      {/* Book Cover Container */}
      <motion.div
        onClick={onOpen}
        whileHover={{ scale: 1.02, rotateY: -4 }}
        whileTap={{ scale: 0.98 }}
        className="relative w-full h-full rounded-2xl cursor-pointer overflow-hidden border border-brand-border/40 book-outer-shadow group transition-transform duration-500 bg-[#101010]"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Real marble texture background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-85"
          style={{
            backgroundImage: `url('/marble_cover.jpg')`,
          }}
        />

        {/* Ambient Dark Gradient & Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 pointer-events-none" />

        {/* Left Book Spine Binding Effect */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/70 via-black/40 to-transparent border-r border-white/5 pointer-events-none" />
        <div className="absolute left-3 top-0 bottom-0 w-[1px] bg-brand-gold/20 pointer-events-none" />

        {/* Outer Gold Border Trim */}
        <div className="absolute inset-6 rounded-xl border border-brand-gold/40 pointer-events-none transition-colors duration-500 group-hover:border-brand-gold/70" />
        <div className="absolute inset-[26px] rounded-lg border border-brand-gold/15 pointer-events-none" />

        {/* Center Typography & Emboss */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="w-12 h-12 rounded-full border border-brand-gold/30 flex items-center justify-center mb-6 bg-black/40 backdrop-blur-sm group-hover:border-brand-gold/60 transition-colors">
              <Sparkles className="w-5 h-5 text-brand-gold animate-pulse" />
            </div>

            <h1 className="text-6xl md:text-7xl font-serif text-emboss-gold tracking-tight font-medium mb-4">
              Lumina
            </h1>

            <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-brand-gold to-transparent mb-6 opacity-80" />

            <p className="text-xs md:text-sm uppercase tracking-[0.35em] text-[#C4BBAF] font-light max-w-xs leading-relaxed">
              Turn lectures into mastery
            </p>
          </motion.div>

          {/* Bottom Open prompt */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-brand-gold"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Click to Open Notebook</span>
          </motion.div>
        </div>

        {/* Dynamic Light Sheen on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      </motion.div>
    </div>
  );
}

