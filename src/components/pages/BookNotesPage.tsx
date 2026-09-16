"use client";

import React from "react";
import { useBook } from "@/context/BookContext";
import { ArrowRight, BookOpen } from "lucide-react";

export default function BookNotesPage() {
  const { generatedData, turnToPage } = useBook();
  const notes = generatedData?.notes;

  if (!notes) {
    return (
      <div className="w-full h-full flex items-center justify-center notebook-paper p-12 text-center text-[#6E6B66]">
        <div>
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-serif text-lg">No archival notes available yet.</p>
          <button
            onClick={() => turnToPage("upload")}
            className="mt-4 px-4 py-2 bg-[#D4A95A] text-black text-xs font-serif uppercase tracking-widest rounded-md"
          >
            Go to Upload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-[#F8F6F0]">
      {/* ================= LEFT SPREAD (Chapter Summary & Keyed Keywords) ================= */}
      <div className="w-full md:w-1/2 h-full notebook-paper notebook-spine-shadow-left border-r border-[#E0DCD3] p-8 md:p-10 flex flex-col justify-between relative overflow-y-auto">
        <div className="notebook-margin-rule" />

        <div className="relative pl-8 space-y-6">
          {/* Header */}
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C7A58] font-semibold">
              Chapter Summary
            </span>
            <h2 className="text-2xl md:text-3xl font-serif text-[#1C1A17] font-semibold mt-1">
              {notes.chapterTitle}
            </h2>
            <div className="w-12 h-1 bg-[#D4A95A] mt-2 rounded-full" />
          </div>

          {/* Executive Summary Card */}
          <div className="bg-[#EFECE3]/70 p-4 rounded-xl border border-[#DCD7CB] shadow-xs">
            <p className="text-sm font-serif italic text-[#383530] leading-relaxed">
              "{notes.executiveSummary}"
            </p>
          </div>

          {/* Keyed Keywords / Concepts (as seen in video at 00:13) */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#7A7367] font-bold">
              Keyed Keywords & Concepts
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#2E2C28] leading-relaxed">
              {notes.keyConcepts.map((concept, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4A95A] mt-1.5 shrink-0" />
                  <span>{concept}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Pagination */}
        <div className="relative pl-8 pt-4 flex justify-between items-center text-xs text-[#8A857D] font-serif">
          <span>Notes — Part I</span>
          <span>p. 03</span>
        </div>
      </div>

      {/* ================= RIGHT SPREAD (Definitions, Formulas & Exam Focus) ================= */}
      <div className="w-full md:w-1/2 h-full notebook-paper notebook-spine-shadow-right p-8 md:p-10 flex flex-col justify-between relative overflow-y-auto">
        
        <div className="space-y-6">
          {/* Important Definitions */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#7A7367] font-bold">
              Important Definitions
            </h3>
            <div className="space-y-2.5">
              {notes.importantDefinitions.map((def, idx) => (
                <div key={idx} className="border-b border-[#E2DDD3] pb-2 text-xs">
                  <span className="font-serif font-bold text-[#1C1A17] text-sm mr-2">
                    {def.term}:
                  </span>
                  <span className="text-[#4E4B45] leading-relaxed">{def.definition}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Formulas (if present) */}
          {notes.formulas && notes.formulas.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs uppercase tracking-[0.2em] text-[#7A7367] font-bold">
                Formulas
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {notes.formulas.map((form, idx) => (
                  <div key={idx} className="bg-[#EFECE3]/80 p-2.5 rounded-lg border border-[#D8D2C4] flex items-center justify-between text-xs">
                    <span className="text-[#6B655B] font-medium">{form.name}</span>
                    <span className="font-serif italic font-semibold text-[#1C1A17]">{form.formula}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exam Focus & Memory Tricks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="bg-[#EFECE3]/50 p-3 rounded-xl border border-[#DCD7CB]">
              <span className="text-[10px] uppercase tracking-wider text-[#B87A28] font-bold block mb-1">
                Exam Focus
              </span>
              <ul className="text-[11px] text-[#423F3A] space-y-1">
                {notes.examFocusedPoints.slice(0, 3).map((pt, idx) => (
                  <li key={idx} className="leading-snug">• {pt}</li>
                ))}
              </ul>
            </div>

            <div className="bg-[#EFECE3]/50 p-3 rounded-xl border border-[#DCD7CB]">
              <span className="text-[10px] uppercase tracking-wider text-[#4A7C59] font-bold block mb-1">
                Memory Shortcut
              </span>
              <ul className="text-[11px] text-[#423F3A] space-y-1">
                {notes.memoryShortcuts.slice(0, 3).map((trick, idx) => (
                  <li key={idx} className="leading-snug">• {trick}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Pagination & Turn to Quiz Action */}
        <div className="pt-4 flex justify-between items-center text-xs text-[#8A857D] font-serif border-t border-[#E5E0D5]">
          <span>p. 04</span>
          
          <button
            onClick={() => turnToPage("quiz")}
            className="flex items-center gap-1.5 text-xs uppercase tracking-widest font-sans font-medium text-[#1C1A17] hover:text-[#D4A95A] transition-colors bg-[#EAE5DA] hover:bg-[#DDD7CA] px-3 py-1.5 rounded-full"
          >
            <span>Proceed to Quiz</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}

