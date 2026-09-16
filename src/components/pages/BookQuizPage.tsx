"use client";

import React, { useState } from "react";
import { useBook } from "@/context/BookContext";
import { ArrowRight, Check, X } from "lucide-react";

export default function BookQuizPage() {
  const { generatedData, turnToPage } = useBook();
  const questions = generatedData?.quiz?.questions || [];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [shortAnswers, setShortAnswers] = useState<Record<number, string>>({});

  if (questions.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center notebook-paper p-12 text-center text-[#6E6B66]">
        <div>
          <p className="font-serif text-lg">No quiz questions available yet.</p>
          <button
            onClick={() => turnToPage("upload")}
            className="mt-4 px-4 py-2 bg-[#D4A95A] text-black text-xs font-serif uppercase tracking-widest rounded-md"
          >
            Upload Lecture First
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const isLast = currentIdx === questions.length - 1;
  const isCurrentRevealed = revealed[currentIdx];
  const currentSelected = selectedAnswers[currentIdx];

  const handleSelect = (option: string) => {
    if (isCurrentRevealed) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentIdx]: option }));
  };

  const handleConfirm = () => {
    setRevealed((prev) => ({ ...prev, [currentIdx]: true }));
  };

  const handleNext = () => {
    if (!isLast) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      turnToPage("export");
    }
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-[#F8F6F0]">
      {/* ================= LEFT SPREAD (Exam Paper Sheet / All Questions Index) ================= */}
      <div className="w-full md:w-1/2 h-full notebook-paper notebook-spine-shadow-left border-r border-[#E0DCD3] p-8 md:p-10 flex flex-col justify-between relative overflow-y-auto">
        <div className="notebook-margin-rule" />

        <div className="relative pl-8 space-y-6">
          {/* Header styled like 00:15 in reference video */}
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C7A58] font-semibold">
              Assessment
            </span>
            <h2 className="text-2xl font-serif text-[#1C1A17] font-semibold mt-1">
              Examination Questions
            </h2>
            <div className="w-12 h-1 bg-[#D4A95A] mt-2 rounded-full" />
          </div>

          {/* List of questions overview */}
          <div className="space-y-4">
            {questions.map((q, idx) => {
              const isSelected = idx === currentIdx;

              return (
                <div
                  key={idx}
                  onClick={() => setCurrentIdx(idx)}
                  className={`
                    p-3 rounded-xl cursor-pointer transition-all duration-200 border text-xs
                    ${isSelected ? "bg-[#EAE4D7] border-[#B8AA91] shadow-xs" : "bg-[#F3EFE7]/50 border-transparent hover:bg-[#EFEAE0]"}
                  `}
                >
                  <div className="flex items-center justify-between font-serif mb-1">
                    <span className="font-semibold text-[#2C2925]">Question {idx + 1}</span>
                    <span className="text-[10px] uppercase tracking-wider text-[#7E7970] font-sans">
                      {q.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[#55514A] line-clamp-2 leading-relaxed">
                    {q.question}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative pl-8 pt-4 flex justify-between items-center text-xs text-[#8A857D] font-serif">
          <span>Examination Index</span>
          <span>p. 05</span>
        </div>
      </div>

      {/* ================= RIGHT SPREAD (Active Question Card & Answering) ================= */}
      <div className="w-full md:w-1/2 h-full notebook-paper notebook-spine-shadow-right p-8 md:p-10 flex flex-col justify-between relative overflow-y-auto">
        
        <div className="space-y-6">
          {/* Question Banner */}
          <div className="flex justify-between items-center border-b border-[#E0DCD3] pb-3">
            <span className="text-xs uppercase tracking-widest text-[#8C7A58] font-semibold">
              Question 0{currentIdx + 1} of 0{questions.length}
            </span>
            <span className="text-xs font-serif italic text-[#6E6B66]">
              Select choice below
            </span>
          </div>

          {/* Question Title */}
          <h3 className="text-lg md:text-xl font-serif text-[#1C1A17] leading-relaxed">
            {currentQ.question}
          </h3>

          {/* Question Options / Input */}
          <div className="space-y-3 pt-2">
            {(currentQ.type === "mcq" || currentQ.type === "tf") && currentQ.options?.map((opt, i) => {
              const isSelected = currentSelected === opt;
              const isCorrect = opt === currentQ.correctAnswer;
              const showResult = isCurrentRevealed && (isSelected || isCorrect);

              return (
                <button
                  key={i}
                  disabled={isCurrentRevealed}
                  onClick={() => handleSelect(opt)}
                  className={`
                    w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-sans flex items-center justify-between transition-all duration-200
                    ${isSelected ? "border-[#D4A95A] bg-[#D4A95A]/15 font-medium text-[#1A1918]" : "border-[#D8D2C5] bg-[#F2EFE9] hover:bg-[#ECE7DC] text-[#3A3834]"}
                    ${showResult ? (isCorrect ? "border-[#4A7C59] bg-[#4A7C59]/15 text-[#24452E]" : "border-red-500/60 bg-red-100/40 text-red-900") : ""}
                  `}
                >
                  <div className="flex items-center gap-3">
                    {/* Circle radio like reference video */}
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? "border-[#D4A95A] bg-[#D4A95A]" : "border-[#8F8A80]"}`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span>{opt}</span>
                  </div>

                  {showResult && (
                    isCorrect ? <Check className="w-4 h-4 text-[#4A7C59]" /> : <X className="w-4 h-4 text-red-600" />
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
                  className="w-full bg-[#F2EFE9] border border-[#D8D2C5] rounded-xl p-3.5 text-xs text-[#242220] min-h-[90px] focus:outline-none focus:border-[#D4A95A] resize-none"
                />
                {isCurrentRevealed && (
                  <div className="p-3 border border-[#4A7C59]/40 bg-[#4A7C59]/10 rounded-xl text-xs">
                    <span className="font-bold text-[#2E583A] block mb-1">Expected Answer:</span>
                    <p className="text-[#1C1A17]">{currentQ.correctAnswer}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Explanation if Revealed */}
          {isCurrentRevealed && (
            <div className="p-3 bg-[#EFECE3] rounded-xl border border-[#DCD7CB] text-xs text-[#4A4742] space-y-1">
              <span className="font-bold uppercase tracking-wider text-[#8A795A] text-[10px]">
                Explanation
              </span>
              <p className="leading-relaxed font-serif">{currentQ.explanation}</p>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 flex justify-between items-center text-xs text-[#8A857D] font-serif border-t border-[#E5E0D5]">
          <span>p. 06</span>

          <div className="flex items-center gap-3">
            {!isCurrentRevealed ? (
              <button
                onClick={handleConfirm}
                disabled={!currentSelected && !shortAnswers[currentIdx]}
                className="px-4 py-1.5 bg-[#D4A95A] text-black text-xs font-serif uppercase tracking-widest rounded-full font-medium hover:bg-[#C49848] transition-colors disabled:opacity-40"
              >
                Confirm
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-4 py-1.5 bg-[#2C2925] text-white text-xs font-serif uppercase tracking-widest rounded-full font-medium hover:bg-[#1A1816] transition-colors"
              >
                <span>{isLast ? "Review Export" : "Next"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

