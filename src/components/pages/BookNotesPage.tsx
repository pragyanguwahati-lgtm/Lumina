"use client";

import React, { useState } from "react";
import { useBook } from "@/context/BookContext";
import { 
  ArrowRight, 
  BookOpen, 
  Lightbulb, 
  Compass, 
  Code2, 
  Calculator, 
  GitGraph, 
  Copy, 
  Check, 
  Layers 
} from "lucide-react";

/* ================= LEFT SPREAD (Chapter Overview & Key Concepts) ================= */
export function BookNotesLeftPage() {
  const { generatedData, turnToPage } = useBook();
  const notes = generatedData?.notes;

  if (!notes) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 text-[#8d877a]">
        <BookOpen className="w-10 h-10 mb-3 opacity-40 text-[#d6ad5f]" />
        <p className="font-serif text-lg text-[#ece6d8]">No notes distilled yet.</p>
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
      <div className="space-y-3.5">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d6ad5f]" />
            <span className="text-[10px] font-sans uppercase tracking-[0.22em] text-[#8d877a]">
              Synthesized Notes
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-medium text-[#ece6d8] leading-tight">
            {notes.chapterTitle}
          </h2>
          <div className="w-14 h-[1px] bg-gradient-to-r from-[#d6ad5f] to-transparent mt-2" />
        </div>

        {/* Executive Summary Card */}
        <div className="relative p-3 rounded-xl border border-[#2a251b] bg-[#12100c]/80 shadow-md">
          <span className="text-[9px] uppercase tracking-widest text-[#d6ad5f] font-mono block mb-1">
            Executive Summary
          </span>
          <p className="text-xs sm:text-sm font-serif italic text-[#c5bfb0] leading-relaxed">
            "{notes.executiveSummary}"
          </p>
        </div>

        {/* Key Concepts */}
        <div className="space-y-2">
          <h3 className="text-[11px] uppercase tracking-[0.18em] text-[#8d877a] font-sans font-semibold">
            Keyed Principles & Concepts
          </h3>
          <ul className="space-y-1.5 text-xs sm:text-[13px] text-[#ece6d8] leading-relaxed">
            {notes.keyConcepts.map((concept, idx) => (
              <li key={idx} className="flex items-start gap-2 p-1.5 rounded-lg bg-[#0e0c09]/50 border border-[#2a251b]/60">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d6ad5f] mt-1.5 shrink-0 shadow-[0_0_6px_#d6ad5f]" />
                <span className="text-[#ece6d8]">{concept}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Folio Bottom */}
      <div className="pt-2.5 border-t border-[#2a251b] flex items-center justify-between text-[11px] text-[#8d877a] font-serif">
        <span>Chapter Summary</span>
        <span>p. 03</span>
      </div>
    </div>
  );
}

/* ================= RIGHT SPREAD (Specialized Insights: Concepts / Code / Numericals / Diagram) ================= */
export function BookNotesRightPage() {
  const { generatedData, turnToPage, playTactileSound } = useBook();
  const notes = generatedData?.notes;

  type SubTab = "concepts" | "code" | "numericals" | "diagram";
  const [activeTab, setActiveTab] = useState<SubTab>("concepts");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const tabParam = new URLSearchParams(window.location.search).get("tab") as SubTab;
    if (tabParam && ["concepts", "code", "numericals", "diagram"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  if (!notes) return null;

  const hasCode = Boolean(notes.codeSnippets && notes.codeSnippets.length > 0);
  const hasNumericals = Boolean(notes.numericals && notes.numericals.length > 0);
  const hasDiagram = Boolean(notes.diagram && notes.diagram.mermaidCode);

  const handleCopyCode = (code: string, idx: number) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedIndex(idx);
      playTactileSound("select");
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="space-y-3">
        {/* Specialized Sub-Tabs Bar (if code, numericals or diagram available) */}
        {(hasCode || hasNumericals || hasDiagram) && (
          <div className="flex items-center gap-1.5 p-1 rounded-xl border border-[#2a251b] bg-[#0b0a09]/80 overflow-x-auto text-[10px] font-sans uppercase tracking-[0.14em]">
            <button
              onClick={() => { setActiveTab("concepts"); playTactileSound("select"); }}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "concepts" 
                  ? "bg-[#d6ad5f] text-[#0b0a09] font-bold shadow-xs" 
                  : "text-[#8d877a] hover:text-[#ece6d8]"
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>Concepts</span>
            </button>

            {hasCode && (
              <button
                onClick={() => { setActiveTab("code"); playTactileSound("select"); }}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === "code" 
                    ? "bg-[#d6ad5f] text-[#0b0a09] font-bold shadow-xs" 
                    : "text-[#8d877a] hover:text-[#ece6d8]"
                }`}
              >
                <Code2 className="w-3 h-3" />
                <span>Code ({notes.codeSnippets?.length})</span>
              </button>
            )}

            {hasNumericals && (
              <button
                onClick={() => { setActiveTab("numericals"); playTactileSound("select"); }}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === "numericals" 
                    ? "bg-[#d6ad5f] text-[#0b0a09] font-bold shadow-xs" 
                    : "text-[#8d877a] hover:text-[#ece6d8]"
                }`}
              >
                <Calculator className="w-3 h-3" />
                <span>Numericals ({notes.numericals?.length})</span>
              </button>
            )}

            {hasDiagram && (
              <button
                onClick={() => { setActiveTab("diagram"); playTactileSound("select"); }}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === "diagram" 
                    ? "bg-[#d6ad5f] text-[#0b0a09] font-bold shadow-xs" 
                    : "text-[#8d877a] hover:text-[#ece6d8]"
                }`}
              >
                <GitGraph className="w-3 h-3" />
                <span>Diagram</span>
              </button>
            )}
          </div>
        )}

        {/* ================= VIEW 1: CONCEPTS & FORMULAS (Default) ================= */}
        {activeTab === "concepts" && (
          <div className="space-y-3">
            {/* Core Definitions */}
            <div>
              <h3 className="text-[11px] uppercase tracking-[0.18em] text-[#8d877a] font-sans font-semibold mb-1.5">
                Core Definitions
              </h3>
              <div className="space-y-1.5">
                {notes.importantDefinitions.map((def, idx) => (
                  <div key={idx} className="p-2 rounded-xl border border-[#2a251b] bg-[#12100c]/60 text-xs">
                    <span className="font-serif font-medium text-[#d6ad5f] text-xs block mb-0.5">
                      {def.term}
                    </span>
                    <span className="text-[#8d877a] leading-relaxed block text-[11px]">
                      {def.definition}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Formulas */}
            {notes.formulas && notes.formulas.length > 0 && (
              <div>
                <h3 className="text-[11px] uppercase tracking-[0.18em] text-[#8d877a] font-sans font-semibold mb-1">
                  Key Formulations
                </h3>
                <div className="grid grid-cols-1 gap-1.5">
                  {notes.formulas.map((form, idx) => (
                    <div key={idx} className="p-2 rounded-xl border border-[#2a251b] bg-[#0e0c09] flex items-center justify-between text-[11px]">
                      <span className="text-[#8d877a] font-mono">{form.name}</span>
                      <span className="font-serif italic font-medium text-[#f6d78c]">{form.formula}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bento Cards: Exam Focus & Memory Shortcuts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
              <div className="p-2.5 rounded-xl border border-[#d6ad5f]/25 bg-[#d6ad5f]/5 space-y-1">
                <div className="flex items-center gap-1.5 text-[#d6ad5f]">
                  <Compass className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase tracking-wider font-semibold">
                    Exam Focus
                  </span>
                </div>
                <ul className="text-[10px] text-[#c5bfb0] space-y-0.5">
                  {notes.examFocusedPoints.slice(0, 3).map((pt, idx) => (
                    <li key={idx} className="leading-snug">• {pt}</li>
                  ))}
                </ul>
              </div>

              <div className="p-2.5 rounded-xl border border-[#7fb77e]/25 bg-[#7fb77e]/5 space-y-1">
                <div className="flex items-center gap-1.5 text-[#7fb77e]">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase tracking-wider font-semibold">
                    Memory Cue
                  </span>
                </div>
                <ul className="text-[10px] text-[#c5bfb0] space-y-0.5">
                  {notes.memoryShortcuts.slice(0, 3).map((cue, idx) => (
                    <li key={idx} className="leading-snug">• {cue}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 2: CODE & ALGORITHMS ================= */}
        {activeTab === "code" && notes.codeSnippets && (
          <div className="space-y-2.5">
            {notes.codeSnippets.map((snippet, idx) => (
              <div key={idx} className="rounded-xl border border-[#2a251b] bg-[#080706] overflow-hidden text-xs">
                {/* Code Terminal Header */}
                <div className="flex items-center justify-between px-3 py-1.5 bg-[#12100c] border-b border-[#2a251b]">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase tracking-widest font-mono text-[#d6ad5f] px-1.5 py-0.5 rounded-sm bg-[#0b0a09] border border-[#2a251b]">
                      {snippet.language}
                    </span>
                    <span className="font-serif font-medium text-xs text-[#ece6d8]">
                      {snippet.title}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopyCode(snippet.code, idx)}
                    className="flex items-center gap-1 text-[10px] text-[#8d877a] hover:text-[#d6ad5f] transition-colors p-1"
                    title="Copy code"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3 h-3 text-[#7fb77e]" />
                        <span className="text-[#7fb77e]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Code Body */}
                <pre className="p-3 font-mono text-[11px] text-[#f6d78c] leading-relaxed overflow-x-auto selection:bg-[#d6ad5f]/30">
                  <code>{snippet.code}</code>
                </pre>

                {/* Explanation & Complexity */}
                <div className="p-2.5 bg-[#0e0c09] border-t border-[#2a251b] space-y-1 text-[11px]">
                  {snippet.complexity && (
                    <span className="text-[9px] font-mono text-[#7fb77e] block font-semibold">
                      Complexity: {snippet.complexity}
                    </span>
                  )}
                  <p className="text-[#8d877a] leading-relaxed">
                    {snippet.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= VIEW 3: WORKED NUMERICALS ================= */}
        {activeTab === "numericals" && notes.numericals && (
          <div className="space-y-2.5">
            {notes.numericals.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-[#2a251b] bg-[#12100c]/70 space-y-2 text-xs">
                {/* Problem Title & Statement */}
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#d6ad5f] block mb-0.5">
                    Worked Problem 0{idx + 1}
                  </span>
                  <h4 className="font-serif font-medium text-sm text-[#ece6d8]">
                    {item.title}
                  </h4>
                  <p className="text-[#8d877a] text-[11px] mt-1 leading-relaxed bg-[#0b0a09]/60 p-2 rounded-lg border border-[#2a251b]/40">
                    {item.problemStatement}
                  </p>
                </div>

                {/* Formula */}
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-[#0e0c09] border border-[#2a251b] text-[11px]">
                  <span className="text-[10px] text-[#8d877a] font-mono">Formula:</span>
                  <span className="font-serif italic font-medium text-[#f6d78c]">{item.formulaUsed}</span>
                </div>

                {/* Derivation Steps */}
                <div className="space-y-1">
                  <span className="text-[10px] text-[#8d877a] uppercase tracking-wider font-semibold block">
                    Derivation Steps:
                  </span>
                  <ul className="space-y-0.5 text-[11px] text-[#c5bfb0] font-sans">
                    {item.stepByStepSolution.map((step, sIdx) => (
                      <li key={sIdx} className="leading-snug pl-1 border-l-2 border-[#d6ad5f]/40 ml-1">
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Final Boxed Answer */}
                <div className="p-2 rounded-lg border border-[#7fb77e]/40 bg-[#7fb77e]/10 flex items-center justify-between text-xs">
                  <span className="font-bold text-[#7fb77e]">Result:</span>
                  <span className="font-mono font-bold text-[#ece6d8]">{item.finalAnswer}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= VIEW 4: ARCHITECTURE DIAGRAM ================= */}
        {activeTab === "diagram" && notes.diagram && (
          <div className="p-3.5 rounded-xl border border-[#2a251b] bg-[#0e0c09] space-y-2.5 text-xs">
            <div className="flex items-center justify-between border-b border-[#2a251b] pb-1.5">
              <span className="font-serif font-medium text-sm text-[#ece6d8]">
                {notes.diagram.title}
              </span>
              <span className="text-[9px] uppercase tracking-wider font-mono text-[#d6ad5f] px-1.5 py-0.5 rounded-sm bg-[#16140f] border border-[#2a251b]">
                {notes.diagram.type}
              </span>
            </div>

            {/* Visual Flow Representation */}
            <div className="p-3 rounded-xl bg-[#12100c] border border-[#8a6d3b]/40 font-mono text-[11px] text-[#f6d78c] leading-relaxed whitespace-pre-wrap selection:bg-[#d6ad5f]/30">
              {notes.diagram.mermaidCode}
            </div>

            <p className="text-[11px] text-[#8d877a] italic font-serif">
              "{notes.diagram.caption}"
            </p>
          </div>
        )}
      </div>

      {/* Bottom CTA to turn to Quiz */}
      <div className="pt-2.5 border-t border-[#2a251b] flex items-center justify-between">
        <span className="text-[11px] text-[#8d877a] font-serif">p. 04</span>

        <button
          onClick={() => {
            playTactileSound("page");
            turnToPage("quiz");
          }}
          className="btn-shimmer flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d6ad5f]/40 bg-[#d6ad5f]/15 text-[#f6d78c] hover:bg-[#d6ad5f] hover:text-[#0b0a09] transition-all text-[11px] font-sans uppercase tracking-widest font-semibold"
        >
          <span>Take Quiz</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
