"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Atmosphere() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* 1. Analog film grain for the archival feel */}
      <div className="texture-overlay" />
      
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-brand-bg">
        
        {/* 2. Cozy, faint notebook / graph paper grid */}
        <div 
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(212, 169, 90, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212, 169, 90, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            backgroundPosition: 'center center'
          }}
        />

        {/* 3. The "Desk Lamp": A warm, golden glow at the top left, mimicking a cozy study lamp */}
        <motion.div
          animate={{
            x: ["-5%", "5%", "0%", "-5%"],
            y: ["-2%", "2%", "-2%", "-2%"],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-[30%] -left-[10%] w-[80vw] h-[80vw] bg-[radial-gradient(circle_at_center,rgba(212,169,90,0.07)_0%,transparent_60%)] blur-[100px] rounded-full z-0"
        />

        {/* 4. The "Night Window": A very subtle, cool, midnight-blue glow from the bottom right to contrast the warm lamp */}
        <motion.div
          animate={{
            x: ["5%", "-5%", "0%", "5%"],
            y: ["2%", "-2%", "2%", "2%"],
            scale: [0.95, 1.05, 1, 0.95],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-[30%] -right-[10%] w-[70vw] h-[70vw] bg-[radial-gradient(circle_at_center,rgba(134,142,150,0.04)_0%,transparent_60%)] blur-[120px] rounded-full z-0"
        />

        {/* 5. A slow, breathing vignette to keep focus centered */}
        <motion.div 
          animate={{ opacity: [0.75, 0.9, 0.75] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#090909_100%)] z-10" 
        />
      </div>
    </>
  );
}
