"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  
  return (
    <section 
      ref={containerRef}
      id="upload" 
      className="relative h-[120vh] flex flex-col items-center justify-center overflow-hidden"
    >
      <motion.div 
        style={{ y, opacity, scale }}
        className="text-center z-10 w-full px-6 flex flex-col items-center"
      >
        <motion.h1 
          initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="text-[110px] leading-[0.9] tracking-tight font-serif text-brand-primary text-shadow-gold"
        >
          LUMINA
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 1 }}
          className="mt-8 text-xl font-light tracking-widest uppercase text-brand-muted max-w-xl text-center"
        >
          Turn lectures into mastery.
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        style={{ opacity }}
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-brand-gold to-transparent relative overflow-hidden">
          <motion.div 
            className="absolute top-0 w-full h-1/2 bg-white"
            animate={{ top: ["-50%", "150%"] }}
            transition={{ duration: 2, ease: "linear", repeat: Infinity }}
          />
        </div>
        <span className="text-[10px] tracking-[0.3em] uppercase text-brand-gold">
          Begin Journey
        </span>
      </motion.div>
    </section>
  );
}
