"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { FileText } from "lucide-react";

interface Props {
  onComplete: () => void;
  fileName: string;
  isDataReady: boolean;
}

export default function TransformationSequence({ onComplete, fileName, isDataReady }: Props) {
  const [phase, setPhase] = useState<"landing" | "scanning" | "separating" | "floating" | "reorganizing">("landing");

  useEffect(() => {
    const runSequence = async () => {
      setPhase("landing");
      await new Promise(r => setTimeout(r, 1000));
      
      setPhase("scanning");
      await new Promise(r => setTimeout(r, 1500));
      
      setPhase("separating");
      await new Promise(r => setTimeout(r, 1200));
      
      setPhase("floating");
      await new Promise(r => setTimeout(r, 2000));
      
      setPhase("reorganizing");
      await new Promise(r => setTimeout(r, 1500));
      // Animation is done, now we wait for isDataReady (handled by the second useEffect)
    };
    
    runSequence();
  }, []); // Run once on mount

  useEffect(() => {
    if (phase === "reorganizing" && isDataReady) {
      onComplete();
    }
  }, [phase, isDataReady, onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-brand-bg overflow-hidden"
    >
      {/* Dynamic Background during transformation */}
      <motion.div 
        animate={{
          background: phase === "reorganizing" 
            ? "radial-gradient(circle at center, rgba(212,169,90,0.1) 0%, #090909 70%)" 
            : "radial-gradient(circle at center, rgba(255,255,255,0.02) 0%, #090909 70%)"
        }}
        transition={{ duration: 2 }}
        className="absolute inset-0"
      />

      <div className="relative w-64 h-80 flex items-center justify-center">
        {/* The Document */}
        <motion.div
          animate={{
            scale: phase === "landing" ? [1.2, 1] : phase === "separating" ? 0.9 : phase === "floating" ? 0 : 0,
            y: phase === "landing" ? [-50, 0] : 0,
            opacity: phase === "floating" ? 0 : 1,
            rotateX: phase === "separating" ? 20 : 0,
          }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-brand-surface border border-brand-border rounded-lg shadow-2xl flex flex-col items-center justify-center p-6 origin-bottom"
        >
          <FileText size={48} className="text-brand-muted mb-4 opacity-50" />
          <p className="text-sm text-brand-primary text-center truncate w-full font-serif">{fileName}</p>
          
          {/* Scanning Line */}
          {phase === "scanning" && (
            <motion.div 
              initial={{ top: "0%" }}
              animate={{ top: "100%" }}
              transition={{ duration: 1.5, ease: "linear" }}
              className="absolute left-0 right-0 h-1 bg-brand-gold shadow-[0_0_15px_rgba(212,169,90,0.8)] z-10"
            />
          )}
        </motion.div>

        {/* Separating Pages Effect */}
        {phase === "separating" && (
          <>
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 0, x: 0, rotateZ: 0 }}
                animate={{ 
                  opacity: [0, 0.5, 0], 
                  y: -50 * i, 
                  x: (i % 2 === 0 ? 30 : -30) * i,
                  rotateZ: (i % 2 === 0 ? 5 : -5) * i 
                }}
                transition={{ duration: 1.2, delay: i * 0.1, ease: "easeOut" }}
                className="absolute inset-0 bg-brand-surface/50 border border-brand-border/50 rounded-lg -z-10"
              />
            ))}
          </>
        )}

        {/* Floating Words & Orbiting Keywords */}
        {(phase === "floating" || phase === "reorganizing") && (
          <div className="absolute inset-0 flex items-center justify-center">
            {["Synthesis", "Analysis", "Concept", "Theory", "Formula", "Definition", "Mastery"].map((word, i) => (
              <motion.div
                key={word}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={
                  phase === "floating" 
                  ? {
                      opacity: [0, 1, 0.8],
                      scale: [0.5, 1],
                      x: Math.cos((i / 7) * Math.PI * 2) * 120,
                      y: Math.sin((i / 7) * Math.PI * 2) * 120,
                    }
                  : {
                      opacity: [0.8, 1, 0],
                      scale: [1, 1.2, 0],
                      x: 0,
                      y: 0,
                    }
                }
                transition={{ 
                  duration: phase === "floating" ? 2 : 1.5, 
                  ease: "easeInOut",
                  delay: phase === "floating" ? i * 0.1 : 0 
                }}
                className={`absolute font-serif ${i % 2 === 0 ? 'text-brand-gold text-shadow-gold text-xl' : 'text-brand-muted text-sm'}`}
              >
                {word}
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      {/* Subtitles */}
      <div className="absolute bottom-24 left-0 right-0 text-center">
        <motion.p
          key={phase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-brand-muted tracking-[0.2em] uppercase text-xs font-light"
        >
          {phase === "landing" && "Receiving document..."}
          {phase === "scanning" && "Analyzing structure..."}
          {phase === "separating" && "Extracting key concepts..."}
          {phase === "floating" && "Synthesizing knowledge..."}
          {phase === "reorganizing" && "Formatting revision notes..."}
        </motion.p>
      </div>
    </motion.div>
  );
}
