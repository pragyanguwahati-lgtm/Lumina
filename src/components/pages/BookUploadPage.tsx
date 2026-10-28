"use client";

import React, { useState } from "react";
import { useBook } from "@/context/BookContext";
import { Upload, FileText, CheckCircle2, AlertCircle, BookOpen } from "lucide-react";
import { GeneratedData } from "@/types";

/* ================= LEFT SPREAD (Your Lecture, Distilled) ================= */
export function BookUploadLeftPage() {
  return (
    <div className="w-full h-full flex flex-col justify-between select-none">
      <div className="space-y-6">
        {/* Section Tag */}
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d6ad5f]" />
          <span className="text-[11px] font-sans uppercase tracking-[0.22em] text-[#8d877a]">
            Archival Synthesis
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-serif font-medium text-[#ece6d8] leading-tight">
          Your lecture, distilled
        </h2>

        <p className="text-sm font-sans text-[#8d877a] leading-relaxed max-w-sm">
          Deposit lecture slides, documents, or raw notes. Lumina's academic intelligence synthesizes the core essentials into permanent knowledge.
        </p>

        {/* Feature List from lumina-landing-v4.html */}
        <ul className="space-y-4 pt-2">
          <li className="flex items-start gap-3.5 p-3 rounded-xl border border-[#2a251b] bg-[#12100c]/60">
            <div className="w-8 h-8 rounded-lg border border-[#8a6d3b]/40 bg-[#0b0a09] flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 stroke-[#d6ad5f] fill-none stroke-[1.4]" viewBox="0 0 24 24">
                <path d="M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6" />
              </svg>
            </div>
            <div>
              <b className="block font-serif text-base text-[#ece6d8] font-medium leading-snug">
                Notes
              </b>
              <span className="text-xs text-[#8d877a] leading-relaxed">
                A clear, structured executive summary with concepts & formulas.
              </span>
            </div>
          </li>

          <li className="flex items-start gap-3.5 p-3 rounded-xl border border-[#2a251b] bg-[#12100c]/60">
            <div className="w-8 h-8 rounded-lg border border-[#8a6d3b]/40 bg-[#0b0a09] flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 stroke-[#d6ad5f] fill-none stroke-[1.4]" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path d="M9.5 9.5a2.5 2.5 0 114 2c-.9.6-1.5 1.1-1.5 2M12 17h.01" />
              </svg>
            </div>
            <div>
              <b className="block font-serif text-base text-[#ece6d8] font-medium leading-snug">
                Quiz
              </b>
              <span className="text-xs text-[#8d877a] leading-relaxed">
                Adaptive practice questions that rigorously test what stuck.
              </span>
            </div>
          </li>

          <li className="flex items-start gap-3.5 p-3 rounded-xl border border-[#2a251b] bg-[#12100c]/60">
            <div className="w-8 h-8 rounded-lg border border-[#8a6d3b]/40 bg-[#0b0a09] flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 stroke-[#d6ad5f] fill-none stroke-[1.4]" viewBox="0 0 24 24">
                <path d="M12 4v11m0 0l-4-4m4 4l4-4M5 19h14" />
              </svg>
            </div>
            <div>
              <b className="block font-serif text-base text-[#ece6d8] font-medium leading-snug">
                Export
              </b>
              <span className="text-xs text-[#8d877a] leading-relaxed">
                Both formatted together as an archival study package.
              </span>
            </div>
          </li>
        </ul>
      </div>

      {/* Folio Bottom */}
      <div className="pt-4 border-t border-[#2a251b] flex items-center justify-between text-[11px] text-[#8d877a] font-serif">
        <span>Vol. I — Orientation</span>
        <span>p. 01</span>
      </div>
    </div>
  );
}

/* ================= RIGHT SPREAD (Interactive Deposit Portal) ================= */
export function BookUploadRightPage() {
  const {
    uploadedFile,
    setUploadedFile,
    uploadedText,
    setUploadedText,
    isTransforming,
    setIsTransforming,
    uploadProgress,
    setUploadProgress,
    setGeneratedData,
    turnToPage,
    playTactileSound,
    loadSampleLecture,
  } = useBook();

  const [mode, setMode] = useState<"file" | "text">("file");
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) {
      setErrorMsg("Please choose a valid PDF document.");
      setUploadedFile(null);
      return;
    }
    setErrorMsg(null);
    setUploadedFile(file);
    playTactileSound("select");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleGenerate = async () => {
    if (isTransforming) return;
    if (mode === "file" && !uploadedFile) {
      setErrorMsg("Please upload a PDF lecture to continue.");
      return;
    }
    if (mode === "text" && (!uploadedText || uploadedText.trim().length < 50)) {
      setErrorMsg("Please paste at least 50 characters of lecture content.");
      return;
    }

    setErrorMsg(null);
    setIsTransforming(true);
    setUploadProgress(15);
    playTactileSound("select");

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 88) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.floor(Math.random() * 10) + 4;
      });
    }, 300);

    try {
      const formData = new FormData();
      if (mode === "file" && uploadedFile) {
        formData.append("file", uploadedFile);
      } else {
        formData.append("text", uploadedText.trim());
      }

      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to analyze lecture material.");
      }

      const text = await res.text();
      const cleanJson = text.replace(/```json\n?|\n?```/g, "").trim();
      const data = JSON.parse(cleanJson) as GeneratedData;

      setUploadProgress(100);
      setGeneratedData(data);

      setTimeout(() => {
        setIsTransforming(false);
        turnToPage("notes");
      }, 700);
    } catch (err: unknown) {
      clearInterval(progressInterval);
      setIsTransforming(false);
      setUploadProgress(0);
      setErrorMsg(err instanceof Error ? err.message : "Error analyzing document.");
    }
  };

  const isButtonDisabled = 
    isTransforming ||
    (mode === "file" && !uploadedFile) ||
    (mode === "text" && uploadedText.trim().length < 50);

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div>
        {/* Right Page Header */}
        <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#d6ad5f] leading-tight">
          Add your lecture
        </h2>
        <p className="text-xs sm:text-sm text-[#8d877a] leading-relaxed mt-1.5">
          Upload a PDF or paste text. Lumina writes your notes and quiz.
        </p>

        {/* Tab Switcher (Upload PDF / Paste Text) */}
        <div className="flex gap-6 mt-5 mb-4 border-b border-[#2a251b]" role="tablist">
          <button
            role="tab"
            aria-selected={mode === "file"}
            onClick={() => { setMode("file"); playTactileSound("select"); }}
            className={`
              pb-2.5 text-xs font-sans uppercase tracking-[0.16em] transition-colors border-b-2
              ${mode === "file" 
                ? "border-[#d6ad5f] text-[#d6ad5f] font-semibold" 
                : "border-transparent text-[#8d877a] hover:text-[#ece6d8]"}
            `}
          >
            Upload PDF
          </button>
          <button
            role="tab"
            aria-selected={mode === "text"}
            onClick={() => { setMode("text"); playTactileSound("select"); }}
            className={`
              pb-2.5 text-xs font-sans uppercase tracking-[0.16em] transition-colors border-b-2
              ${mode === "text" 
                ? "border-[#d6ad5f] text-[#d6ad5f] font-semibold" 
                : "border-transparent text-[#8d877a] hover:text-[#ece6d8]"}
            `}
          >
            Paste Text
          </button>
        </div>

        {/* Mode 1: File Drop Zone */}
        {mode === "file" && (
          <div className="space-y-3">
            <div
              className={`
                ring relative rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300
                border border-dashed
                ${isDragOver 
                  ? "border-[#d6ad5f] bg-[#d6ad5f]/10" 
                  : uploadedFile 
                    ? "border-[#d6ad5f]/60 bg-[#16140f]" 
                    : "border-[#8a6d3b]/50 hover:border-[#d6ad5f] bg-[#0e0c09]"}
              `}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("lumina-file-input")?.click()}
              tabIndex={0}
              role="button"
              aria-label="Upload PDF lecture file"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  document.getElementById("lumina-file-input")?.click();
                }
              }}
            >
              <input
                type="file"
                id="lumina-file-input"
                accept="application/pdf,.pdf"
                className="hidden"
                suppressHydrationWarning
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              />

              {!uploadedFile ? (
                <>
                  <div className="w-12 h-12 rounded-full border border-[#8a6d3b] flex items-center justify-center mb-3 text-[#d6ad5f] transition-transform duration-300 group-hover:-translate-y-1">
                    <Upload className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <strong className="font-serif text-base text-[#ece6d8] font-medium block">
                    Drop a PDF here
                  </strong>
                  <span className="text-xs text-[#8d877a] mt-1 block">
                    or click to choose a file
                  </span>
                </>
              ) : (
                <div className="w-full flex flex-col items-center py-2">
                  <div className="w-10 h-10 rounded-full border border-[#7fb77e]/50 bg-[#7fb77e]/10 flex items-center justify-center mb-2 text-[#7fb77e]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <strong className="font-serif text-sm text-[#f6d78c] truncate max-w-[240px] block">
                    {uploadedFile.name}
                  </strong>
                  <span className="text-xs text-[#8d877a] mt-0.5">
                    {(uploadedFile.size / 1048576).toFixed(1)} MB • Click to replace
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mode 2: Paste Text Area */}
        {mode === "text" && (
          <div className="space-y-2">
            <textarea
              value={uploadedText}
              onChange={(e) => setUploadedText(e.target.value)}
              placeholder="Paste your lecture notes, transcript, or syllabus here…"
              aria-label="Lecture text content"
              rows={6}
              className="w-full resize-none bg-[#0e0c09] border border-[#8a6d3b]/60 rounded-xl p-4 text-xs sm:text-sm font-sans text-[#ece6d8] placeholder-[#645f54] focus:outline-none focus:border-[#d6ad5f] focus:ring-2 focus:ring-[#d6ad5f]/20 transition-all leading-relaxed"
            />
            <div className="flex justify-between items-center text-[11px] text-[#8d877a]">
              <span>Min. 50 characters</span>
              <span className={uploadedText.length >= 50 ? "text-[#7fb77e]" : ""}>
                {uploadedText.length} characters
              </span>
            </div>
          </div>
        )}

        {/* Scanning & Progress Indicator */}
        {isTransforming && (
          <div className="mt-4 p-3.5 rounded-xl border border-[#d6ad5f]/30 bg-[#16140f] space-y-2">
            <div className="flex justify-between items-center text-xs font-mono text-[#d6ad5f]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d6ad5f] animate-ping" />
                <span>Crystallizing Lecture...</span>
              </span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#2a251b] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#8a6d3b] via-[#d6ad5f] to-[#f6d78c] transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Callout */}
        {errorMsg && (
          <div className="mt-3 flex items-center gap-2 text-xs text-[#e58a7e] bg-[#e58a7e]/10 border border-[#e58a7e]/20 p-2.5 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Bottom CTA Button */}
      <div className="pt-4 border-t border-[#2a251b]">
        <button
          onClick={handleGenerate}
          disabled={isButtonDisabled}
          className={`
            btn-shimmer w-full py-3.5 px-6 rounded-xl font-sans text-xs uppercase tracking-[0.18em] font-semibold transition-all duration-300
            ${isButtonDisabled 
              ? "bg-[#2a251b] text-[#5d584d] cursor-not-allowed opacity-40" 
              : "bg-[#d6ad5f] hover:bg-[#f6d78c] text-[#14100a] shadow-lg cursor-pointer hover:shadow-[0_0_20px_rgba(214,173,95,0.4)]"}
          `}
        >
          {isTransforming ? "Crystallizing..." : "Generate Notes & Quiz"}
        </button>

        <div className="mt-2.5 text-center">
          <button
            type="button"
            onClick={loadSampleLecture}
            className="text-[11px] font-sans text-[#8d877a] hover:text-[#d6ad5f] transition-colors underline underline-offset-4 cursor-pointer focus:outline-none focus:text-[#f6d78c]"
          >
            Or explore with sample lecture (Quantum Mechanics)
          </button>
        </div>
      </div>
    </div>
  );
}
