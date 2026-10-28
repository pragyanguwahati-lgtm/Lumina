"use client";

import React, { useState } from "react";
import { useBook } from "@/context/BookContext";
import { Download, CheckCircle2, RotateCcw, Sparkles, FileCheck, Layers } from "lucide-react";

/* ================= LEFT SPREAD (Archival Certificate of Completion) ================= */
export function BookExportLeftPage() {
  const { generatedData, turnToPage } = useBook();

  if (!generatedData) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 text-[#8d877a]">
        <FileCheck className="w-10 h-10 mb-3 opacity-40 text-[#d6ad5f]" />
        <p className="font-serif text-lg text-[#ece6d8]">No document compiled yet.</p>
        <button
          onClick={() => turnToPage("upload")}
          className="mt-4 px-4 py-2 bg-[#d6ad5f] text-[#0b0a09] text-xs font-sans uppercase tracking-widest rounded-lg font-semibold"
        >
          Upload Lecture First
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d6ad5f]" />
            <span className="text-[10px] font-sans uppercase tracking-[0.22em] text-[#8d877a]">
              Mastery Achieved
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#ece6d8] leading-tight">
            Lecture Crystallized
          </h2>
          <div className="w-14 h-[1px] bg-gradient-to-r from-[#d6ad5f] to-transparent mt-2.5" />
        </div>

        <p className="text-xs sm:text-sm font-serif italic text-[#c5bfb0] leading-relaxed">
          "You have transformed this lecture into permanent knowledge. The synthesized study notes and assessment have been compiled into an archival package."
        </p>

        {/* Manifest Details */}
        <div className="p-4 rounded-xl border border-[#2a251b] bg-[#12100c]/80 space-y-2.5 text-xs">
          <div className="flex justify-between items-center text-[#8d877a]">
            <span>Chapter:</span>
            <span className="font-serif font-medium text-[#ece6d8] truncate max-w-[180px]">
              {generatedData.notes.chapterTitle}
            </span>
          </div>
          <div className="flex justify-between items-center text-[#8d877a]">
            <span>Core Principles:</span>
            <span className="font-mono text-[#f6d78c]">
              {generatedData.notes.keyConcepts.length} Topics
            </span>
          </div>
          <div className="flex justify-between items-center text-[#8d877a]">
            <span>Assessment Rigor:</span>
            <span className="font-mono text-[#f6d78c]">
              {generatedData.quiz.questions.length} Questions Verified
            </span>
          </div>
        </div>

        {/* Embossed Stamp Seal */}
        <div className="flex items-center gap-3.5 p-3 rounded-xl border border-[#d6ad5f]/20 bg-[#d6ad5f]/5">
          <div className="w-11 h-11 rounded-full border border-[#d6ad5f] flex items-center justify-center bg-[#0b0a09] shadow-md">
            <Sparkles className="w-5 h-5 text-[#d6ad5f]" />
          </div>
          <div>
            <span className="text-xs font-sans font-semibold text-[#ece6d8] uppercase tracking-wider block">
              Verified Archival Seal
            </span>
            <span className="text-[10px] text-[#8d877a]">
              Lumina Knowledge Synthesis Engine
            </span>
          </div>
        </div>
      </div>

      {/* Folio Bottom */}
      <div className="pt-4 border-t border-[#2a251b] flex items-center justify-between text-[11px] text-[#8d877a] font-serif">
        <span>Export Manifest</span>
        <span>p. 07</span>
      </div>
    </div>
  );
}

/* ================= RIGHT SPREAD (Download Card matching video 00:18) ================= */
export function BookExportRightPage() {
  const { generatedData, resetBook, playTactileSound } = useBook();
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);

  if (!generatedData) return null;

  const handleDownload = async () => {
    setIsGenerating(true);
    playTactileSound("select");

    try {
      const { pdf } = await import("@react-pdf/renderer");
      const { ExportDocument } = await import("../PDFExport");

      const blob = await pdf(<ExportDocument data={generatedData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${generatedData.notes.chapterTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_mastery.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      setDownloadDone(true);
    } catch (err) {
      console.error(err);
      alert("Failed to export PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between items-center text-center">
      <div className="w-full flex justify-end pr-14 text-[11px] text-[#8d877a] font-serif">
        <span>p. 08</span>
      </div>

      {/* Center PDF Tile */}
      <div className="my-auto flex flex-col items-center max-w-xs">
        {/* Illuminated PDF Card */}
        <div className="relative mb-6 group cursor-pointer" onClick={handleDownload}>
          <div className="w-28 h-36 bg-[#0e0c09] rounded-xl border border-[#d6ad5f]/40 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col items-center justify-between transition-transform duration-300 group-hover:scale-105">
            {/* PDF Badge */}
            <div className="bg-[#b8893f] text-[#0b0a09] text-[9px] font-bold px-2 py-0.5 rounded-sm tracking-wider uppercase">
              PDF
            </div>
            
            <span className="font-serif font-medium text-sm text-[#ece6d8] tracking-tight">
              LUMINA
            </span>

            <span className="text-[9px] text-[#8d877a] uppercase tracking-widest font-mono">
              MASTER ARCHIVE
            </span>

            {/* Sparkle badge */}
            <div className="absolute -top-2.5 -right-2.5 text-[#d6ad5f] animate-pulse">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className="btn-shimmer px-6 py-3 rounded-full bg-[#d6ad5f] text-[#0b0a09] font-sans text-xs uppercase tracking-widest font-semibold flex items-center gap-2 shadow-lg hover:shadow-[0_0_25px_rgba(214,173,95,0.4)] transition-all cursor-pointer disabled:opacity-50"
        >
          <Download className={`w-4 h-4 ${isGenerating ? "animate-bounce" : ""}`} />
          <span>{isGenerating ? "Binding PDF..." : "Download Archival PDF"}</span>
        </button>

        {downloadDone && (
          <div className="flex items-center gap-1.5 text-xs text-[#7fb77e] mt-3 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>PDF downloaded successfully</span>
          </div>
        )}

        <p className="text-[11px] text-[#8d877a] mt-4 font-light">
          Formatted for print & high-density digital review
        </p>
      </div>

      {/* Bottom Upload Another Lecture */}
      <div className="w-full pt-4 border-t border-[#2a251b] flex items-center justify-between text-xs">
        <button
          onClick={() => {
            playTactileSound("page");
            resetBook();
          }}
          className="flex items-center gap-1.5 text-[#8d877a] hover:text-[#d6ad5f] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Upload Another Lecture</span>
        </button>
        <span className="text-[11px] text-[#8d877a] font-serif">End of Volume</span>
      </div>
    </div>
  );
}
