"use client";

import { motion } from "framer-motion";
import { GeneratedData } from "@/types";
import { Download } from "lucide-react";
import { useState } from "react";

interface Props {
  data: GeneratedData;
}

export default function ExportSection({ data }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      // Dynamically import the pdf builder to avoid SSR and Turbopack chunk issues on mount
      const { pdf } = await import("@react-pdf/renderer");
      // @ts-expect-error (we know ExportDocument exists, using dynamic import)
      const { ExportDocument } = await import("./PDFExport");
      
      const blob = await pdf(<ExportDocument data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${data.notes.chapterTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_mastery.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to bind document into PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section id="export" className="py-24 px-6 min-h-screen flex items-center justify-center relative z-10">
      <div className="w-full max-w-4xl flex flex-col items-center">
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl font-serif text-brand-primary mb-6 text-shadow-gold">Journey Complete</h2>
          <p className="text-brand-muted tracking-wide text-lg max-w-lg mx-auto font-light">
            Your knowledge has been crystallized. Take it with you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full aspect-[16/9] max-w-2xl bg-brand-surface/30 backdrop-blur-md border border-brand-border/50 rounded-2xl flex flex-col items-center justify-center p-12 overflow-hidden group"
        >
          {/* subtle paper texture */}
          <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'1.5\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />

          {/* Book Closing Animation (Simplified CSS representation) */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-brand-bg to-transparent opacity-50 pointer-events-none" />

          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="z-10 group/btn relative flex flex-col items-center cursor-pointer disabled:opacity-50"
          >
            <div className="w-24 h-24 rounded-full border border-brand-gold/30 flex items-center justify-center mb-6 transition-all duration-700 group-hover/btn:border-brand-gold group-hover/btn:bg-brand-gold/10">
              <Download className={`w-8 h-8 text-brand-gold transition-all duration-700 ${isGenerating ? "animate-pulse" : "group-hover/btn:-translate-y-1"}`} />
            </div>
            <span className="text-brand-primary tracking-widest uppercase text-sm font-light">
              {isGenerating ? "Binding Document..." : "Export PDF"}
            </span>
          </button>

          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,169,90,0.05)_0%,transparent_70%)] pointer-events-none transition-opacity duration-700"
          />
        </motion.div>
      </div>
    </section>
  );
}
