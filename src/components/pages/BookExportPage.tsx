"use client";

import React, { useState } from "react";
import { useBook } from "@/context/BookContext";
import { Download, CheckCircle2, RotateCcw, Sparkles } from "lucide-react";

export default function BookExportPage() {
  const { generatedData, resetBook, turnToPage } = useBook();
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);

  if (!generatedData) {
    return (
      <div className="w-full h-full flex items-center justify-center notebook-paper p-12 text-center text-[#6E6B66]">
        <div>
          <p className="font-serif text-lg">No document has been generated yet.</p>
          <button
            onClick={() => turnToPage("upload")}
            className="mt-4 px-4 py-2 bg-[#D4A95A] text-black text-xs font-serif uppercase tracking-widest rounded-md"
          >
            Upload Lecture
          </button>
        </div>
      </div>
    );
  }

  const handleDownload = async () => {
    setIsGenerating(true);
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
    <div className="w-full h-full flex flex-col md:flex-row bg-[#F8F6F0]">
      {/* ================= LEFT SPREAD (Completion Certificate / Summary) ================= */}
      <div className="w-full md:w-1/2 h-full notebook-paper notebook-spine-shadow-left border-r border-[#E0DCD3] p-8 md:p-10 flex flex-col justify-between relative overflow-y-auto">
        <div className="notebook-margin-rule" />

        <div className="relative pl-8 space-y-6">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C7A58] font-semibold">
              Mastery Achieved
            </span>
            <h2 className="text-2xl font-serif text-[#1C1A17] font-semibold mt-1">
              Lecture Crystallized
            </h2>
            <div className="w-12 h-1 bg-[#D4A95A] mt-2 rounded-full" />
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-[#4E4B45] font-serif leading-relaxed">
            <p>
              You have transformed this lecture into permanent knowledge. The synthesized study notes and assessment have been compiled into an archival package.
            </p>

            <div className="bg-[#EFECE3]/70 p-4 rounded-xl border border-[#DCD7CB] space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#7A756D]">Chapter:</span>
                <span className="font-semibold text-[#1C1A17]">{generatedData.notes.chapterTitle}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#7A756D]">Core Concepts:</span>
                <span className="font-semibold text-[#1C1A17]">{generatedData.notes.keyConcepts.length} Topics</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#7A756D]">Practice Assessment:</span>
                <span className="font-semibold text-[#1C1A17]">{generatedData.quiz.questions.length} Questions</span>
              </div>
            </div>

            {/* Embossed stamp seal */}
            <div className="pt-2 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-[#D4A95A] flex items-center justify-center bg-[#D4A95A]/10">
                <Sparkles className="w-5 h-5 text-[#D4A95A]" />
              </div>
              <div className="text-[11px] font-sans">
                <span className="font-bold text-[#1C1A17] uppercase tracking-wider block">Verified Archival Seal</span>
                <span className="text-[#8C877E]">Lumina Knowledge Synthesis Engine</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative pl-8 pt-4 flex justify-between items-center text-xs text-[#8A857D] font-serif">
          <span>Export Manifest</span>
          <span>p. 07</span>
        </div>
      </div>

      {/* ================= RIGHT SPREAD (Download Card matching video 00:18) ================= */}
      <div className="w-full md:w-1/2 h-full notebook-paper notebook-spine-shadow-right p-8 md:p-10 flex flex-col justify-between items-center relative">
        <div className="w-full flex justify-end text-xs text-[#8A857D] font-serif">
          <span>p. 08</span>
        </div>

        {/* Center PDF Export Area */}
        <div className="my-auto flex flex-col items-center text-center max-w-xs">
          {/* PDF Document Icon matching video */}
          <div className="relative mb-6">
            <div className="w-24 h-32 bg-white rounded-lg shadow-xl border border-[#D5CFBF] flex flex-col items-center justify-center relative p-3">
              {/* PDF badge */}
              <div className="bg-[#D9383A] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-wider uppercase mb-2">
                PDF
              </div>
              <span className="font-serif font-bold text-xs text-[#2A2825] tracking-tight">
                LUMINA
              </span>
              <span className="text-[9px] text-[#8C877E] uppercase tracking-widest mt-1">
                SUMMARY & QUIZ
              </span>

              {/* Sparkle burst decoration */}
              <div className="absolute -top-3 -right-3 text-[#D4A95A] animate-pulse">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Download Button (as seen in video at 00:19) */}
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="group relative px-6 py-3 bg-[#1C1A17] hover:bg-[#2C2925] text-white rounded-full font-serif text-sm tracking-wider flex items-center gap-2 shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 cursor-pointer"
          >
            <Download className={`w-4 h-4 text-[#D4A95A] ${isGenerating ? "animate-bounce" : ""}`} />
            <span>{isGenerating ? "Binding PDF..." : "Download Summary & Quiz"}</span>

            {/* Subtle glow rim */}
            <div className="absolute inset-0 rounded-full border border-[#D4A95A]/40 pointer-events-none" />
          </button>

          {downloadDone && (
            <div className="flex items-center gap-1.5 text-xs text-[#4A7C59] mt-3 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>PDF downloaded successfully</span>
            </div>
          )}

          <p className="text-[11px] text-[#8C877E] mt-4 font-light">
            Formatted for print & digital review
          </p>
        </div>

        {/* Bottom Reset action */}
        <div className="pt-4 flex justify-between items-center w-full text-xs text-[#8A857D] font-serif border-t border-[#E5E0D5]">
          <button
            onClick={resetBook}
            className="flex items-center gap-1 text-xs text-[#6B655B] hover:text-[#1C1A17] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Upload Another Lecture</span>
          </button>
          <span>End of Volume</span>
        </div>

      </div>
    </div>
  );
}

