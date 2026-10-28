"use client";

import React, { useState } from "react";
import { useBook } from "@/context/BookContext";
import { ArrowRight, Check, X, HelpCircle, Award } from "lucide-react";

/* ================= LEFT SPREAD (Questions Overview & Navigation) ================= */
export function BookQuizLeftPage({
  currentIdx,
  setCurrentIdx,
  revealed,
}: {
  currentIdx: number;
  setCurrentIdx: (idx: number) => void;
  revealed: Record<number, boolean>;
}) {
  const { generatedData, turnToPage } = useBook();
  const questions = generatedData?.quiz?.questions || [];

  if (questions.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 text-[#8d877a]">
        <HelpCircle className="w-10 h-10 mb-3 opacity-40 text-[#d6ad5f]" />
        <p className="font-serif text-lg text-[#ece6d8]">No quiz questions available.</p>
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
      <div className="space-y-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d6ad5f]" />
            <span className="text-[10px] font-sans uppercase tracking-[0.22em] text-[#8d877a]">
              Assessment
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#ece6d8] leading-tight">
            Examination Index
          </h2>
          <div className="w-14 h-[1px] bg-gradient-to-r from-[#d6ad5f] to-transparent mt-2.5" />
        </div>

        {/* Question cards index */}
        <div className="space-y-2.5">
          {questions.map((q, idx) => {
            const isSelected = idx === currentIdx;
            const isDone = revealed[idx];

            return (
              <button
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                className={`
                  w-full text-left p-3 rounded-xl border text-xs transition-all duration-200 flex items-center justify-between
                  ${isSelected 
                    ? "border-[#d6ad5f] bg-[#d6ad5f]/15 shadow-sm" 
                    : "border-[#2a251b] bg-[#12100c]/60 hover:border-[#8a6d3b] hover:bg-[#16140f]"}
                `}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`font-serif font-medium text-sm ${isSelected ? "text-[#f6d78c]" : "text-[#ece6d8]"}`}>
                      Question 0{idx + 1}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider font-mono text-[#8d877a] px-1.5 py-0.5 rounded-sm bg-[#0b0a09] border border-[#2a251b]">
                      {q.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8d877a] line-clamp-1 mt-0.5 font-sans">
                    {q.question}
                  </p>
                </div>

                {isDone && (
                  <span className="w-5 h-5 rounded-full bg-[#7fb77e]/20 border border-[#7fb77e]/60 flex items-center justify-center text-[#7fb77e] shrink-0 ml-2">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Folio Bottom */}
      <div className="pt-4 border-t border-[#2a251b] flex items-center justify-between text-[11px] text-[#8d877a] font-serif">
        <span>Assessment Sheet</span>
        <span>p. 05</span>
      </div>
    </div>
  );
}

/* ================= RIGHT SPREAD (Active Question Card & Answering) ================= */
export function BookQuizRightPage({
  currentIdx,
  setCurrentIdx,
  revealed,
  setRevealed,
}: {
  currentIdx: number;
  setCurrentIdx: (idx: number) => void;
  revealed: Record<number, boolean>;
  setRevealed: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
}) {
  const { generatedData, turnToPage, playTactileSound } = useBook();
  const questions = generatedData?.quiz?.questions || [];

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [shortAnswers, setShortAnswers] = useState<Record<number, string>>({});

  if (questions.length === 0) return null;

  const currentQ = questions[currentIdx];
  const isLast = currentIdx === questions.length - 1;
  const isCurrentRevealed = revealed[currentIdx];
  const currentSelected = selectedAnswers[currentIdx];

  const handleSelect = (option: string) => {
    if (isCurrentRevealed) return;
    playTactileSound("select");
    setSelectedAnswers((prev) => ({ ...prev, [currentIdx]: option }));
  };

  const handleConfirm = () => {
    playTactileSound("select");
    setRevealed((prev) => ({ ...prev, [currentIdx]: true }));
  };

  const handleNext = () => {
    playTactileSound("page");
    if (!isLast) {
      setCurrentIdx(currentIdx + 1);
    } else {
      turnToPage("export");
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="space-y-5">
        {/* Question Header */}
        <div className="flex justify-between items-center border-b border-[#2a251b] pb-2.5">
          <span className="text-xs uppercase tracking-widest text-[#d6ad5f] font-mono">
            Question 0{currentIdx + 1} of 0{questions.length}
          </span>
          <span className="text-[11px] font-sans text-[#8d877a]">
            {isCurrentRevealed ? "Reviewed" : "Select your answer"}
          </span>
        </div>

        {/* Question Heading */}
        <h3 className="text-lg sm:text-xl font-serif text-[#ece6d8] leading-relaxed">
          {currentQ.question}
        </h3>

        {/* Options */}
        <div className="space-y-2.5 pt-1">
          {(currentQ.type === "mcq" || currentQ.type === "tf") && currentQ.options?.map((opt, i) => {
            const isSelected = currentSelected === opt;
            const isCorrect = opt === currentQ.correctAnswer;
            const showResult = isCurrentRevealed;

            let borderClass = "border-[#2a251b] bg-[#12100c]/60 text-[#c5bfb0] hover:border-[#8a6d3b]";
            if (isSelected) {
              borderClass = "border-[#d6ad5f] bg-[#d6ad5f]/15 text-[#ece6d8]";
            }
            if (showResult) {
              if (isCorrect) {
                borderClass = "border-[#7fb77e] bg-[#7fb77e]/15 text-[#ece6d8]";
              } else if (isSelected && !isCorrect) {
                borderClass = "border-[#e58a7e] bg-[#e58a7e]/15 text-[#e58a7e]";
              }
            }

            return (
              <button
                key={i}
                disabled={isCurrentRevealed}
                onClick={() => handleSelect(opt)}
                className={`
                  w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-sans flex items-center justify-between transition-all duration-200
                  ${borderClass}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? "border-[#d6ad5f] bg-[#d6ad5f]" : "border-[#8d877a]"}`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#0b0a09]" />}
                  </div>
                  <span>{opt}</span>
                </div>

                {showResult && isCorrect && (
                  <Check className="w-4 h-4 text-[#7fb77e] shrink-0" />
                )}
                {showResult && isSelected && !isCorrect && (
                  <X className="w-4 h-4 text-[#e58a7e] shrink-0" />
                )}
              </button>
            );
          })}

          {currentQ.type === "short" && (
            <div className="space-y-3">
              <textarea
                value={shortAnswers[currentIdx] || ""}
                onChange={(e) => setShortAnswers({ ...shortAnswers, [currentIdx]: e.target.value })}
                disabled={isCurrentRevealed}
                placeholder="Inscribe your explanation..."
                className="w-full bg-[#0e0c09] border border-[#8a6d3b]/60 rounded-xl p-3.5 text-xs text-[#ece6d8] min-h-[90px] focus:outline-none focus:border-[#d6ad5f] resize-none"
              />
              {isCurrentRevealed && (
                <div className="p-3 border border-[#7fb77e]/40 bg-[#7fb77e]/10 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-[#7fb77e] block">Expected Answer:</span>
                  <p className="text-[#ece6d8]">{currentQ.correctAnswer}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Explanation Card */}
        {isCurrentRevealed && (
          <div className="p-3.5 bg-[#12100c] rounded-xl border border-[#2a251b] text-xs text-[#8d877a] space-y-1">
            <span className="font-bold uppercase tracking-wider text-[#d6ad5f] text-[10px] block">
              Explanation
            </span>
            <p className="leading-relaxed font-serif text-[#ece6d8]">
              {currentQ.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="pt-4 border-t border-[#2a251b] flex items-center justify-between">
        <span className="text-[11px] text-[#8d877a] font-serif">p. 06</span>

        <div className="flex items-center gap-3">
          {!isCurrentRevealed ? (
            <button
              onClick={handleConfirm}
              disabled={!currentSelected && !shortAnswers[currentIdx]}
              className="btn-shimmer px-5 py-2 rounded-full bg-[#d6ad5f] text-[#0b0a09] text-xs font-sans uppercase tracking-widest font-semibold disabled:opacity-40"
            >
              Confirm Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="btn-shimmer flex items-center gap-2 px-5 py-2 rounded-full border border-[#d6ad5f]/40 bg-[#d6ad5f]/15 text-[#f6d78c] hover:bg-[#d6ad5f] hover:text-[#0b0a09] transition-all text-xs font-sans uppercase tracking-widest font-semibold"
            >
              <span>{isLast ? "Review Export" : "Next Question"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
