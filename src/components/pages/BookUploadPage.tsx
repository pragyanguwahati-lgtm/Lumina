"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useBook } from "@/context/BookContext";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText } from "lucide-react";
import { GeneratedData } from "@/types";

export default function BookUploadPage() {
  const {
    setUploadedFile,
    setIsTransforming,
    setGeneratedData,
    turnToPage,
    uploadProgress,
    setUploadProgress,
    isTransforming,
  } = useBook();

  const [droppedFile, setDroppedFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const processUpload = async (file: File) => {
    setDroppedFile(file);
    setUploadedFile(file);
    setIsTransforming(true);
    setErrorMsg(null);
    setUploadProgress(10);

    try {
      // Progress simulation loop
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.floor(Math.random() * 12) + 5;
        });
      }, 350);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        throw new Error("Failed to analyze and transform document.");
      }

      const text = await res.text();
      const cleanText = text.replace(/```json\n?|\n?```/g, "").trim();
      const data = JSON.parse(cleanText) as GeneratedData;

      setGeneratedData(data);
      setUploadProgress(100);

      // Give 900ms for signature flourish to finish, then flip to notes page
      setTimeout(() => {
        setIsTransforming(false);
        turnToPage("notes");
      }, 1000);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "An error occurred during scanning.");
      setIsTransforming(false);
      setUploadProgress(0);
      setDroppedFile(null);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      processUpload(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/vnd.ms-powerpoint": [".ppt"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
    },
    maxFiles: 1,
    disabled: isTransforming,
  });

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-[#F8F6F0]">
      {/* ================= LEFT SPREAD (Cover / Lumina Title Page) ================= */}
      <div className="w-full md:w-1/2 h-full notebook-paper notebook-spine-shadow-left border-r border-[#E0DCD3] p-8 md:p-12 flex flex-col justify-between relative select-none">
        {/* Vertical Red Margin Rule */}
        <div className="notebook-margin-rule" />

        {/* Top Header */}
        <div className="relative pl-8">
          <span className="text-3xl md:text-4xl font-serif text-[#1C1A17] tracking-wider font-normal">
            Lumina
          </span>
          <div className="w-16 h-[1.5px] bg-[#D4A95A] mt-2" />
        </div>

        {/* Center Journal Body Lines with Calligraphy Quotes */}
        <div className="relative pl-8 space-y-7 text-[#4A4742] font-serif">
          <p className="text-lg md:text-xl italic leading-relaxed text-[#2C2925]">
            "Knowledge begins when disorder is distilled into clarity."
          </p>

          <div className="text-sm font-sans space-y-2 text-[#5E5B55] leading-relaxed">
            <p className="font-semibold text-xs uppercase tracking-widest text-[#8A785B]">Archival Protocol</p>
            <p>1. Deposit lecture notes, slides, or study materials.</p>
            <p>2. Watch the automated analysis extract core definitions and formulas.</p>
            <p>3. Turn pages to review synthesized mastery and test your recall.</p>
          </div>
        </div>

        {/* Bottom Page Number */}
        <div className="relative pl-8 flex justify-between items-center text-xs text-[#8A857D] font-serif">
          <span>Vol. I — Orientation</span>
          <span>p. 01</span>
        </div>
      </div>

      {/* ================= RIGHT SPREAD (Interactive Deposit & Fountain Pen) ================= */}
      <div className="w-full md:w-1/2 h-full notebook-paper notebook-spine-shadow-right p-8 md:p-12 flex flex-col justify-between items-center relative">
        
        {/* Top Blank Ruled Lines */}
        <div className="w-full flex justify-end text-xs text-[#8A857D] font-serif">
          <span>p. 02</span>
        </div>

        {/* Center Deposit Area Box */}
        <div className="w-full max-w-sm my-auto relative">
          
          <div
            {...getRootProps()}
            className={`
              relative w-full rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300
              border-2 border-dashed
              ${isDragActive ? "border-[#D4A95A] bg-[#D4A95A]/10 scale-102" : "border-[#B5AEA4] hover:border-[#8A785B] bg-[#EFECE4]/60"}
              ${isTransforming ? "cursor-default border-[#D4A95A] shadow-lg" : "shadow-sm hover:shadow-md"}
            `}
          >
            <input {...getInputProps()} />

            {!isTransforming ? (
              <>
                <div className="w-14 h-14 rounded-full bg-[#E5E1D6] flex items-center justify-center mb-4 text-[#4A4742] group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-[#5A564F]" />
                </div>
                <h4 className="text-lg font-serif font-medium text-[#242220] mb-1">
                  Drag & Drop your PDF here
                </h4>
                <p className="text-xs uppercase tracking-widest text-[#7C766D] mt-1">
                  or click to select file
                </p>
                <span className="text-[10px] text-[#A39D93] mt-3">Supports PDF, DOCX, PPTX</span>
              </>
            ) : (
              /* Transforming / Scanning View */
              <div className="w-full flex flex-col items-center py-2">
                <div className="relative mb-3">
                  <FileText className="w-10 h-10 text-[#5A564F]" />
                  <motion.div
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-[#D4A95A] shadow-[0_0_8px_#D4A95A]"
                  />
                </div>

                <p className="text-xs font-serif font-medium text-[#2C2925] truncate max-w-[200px] mb-2">
                  {droppedFile?.name}
                </p>

                {/* Progress Bar (Matching Video 00:10) */}
                <div className="w-full bg-[#DCD7CB] h-2.5 rounded-full overflow-hidden mt-3 relative">
                  <motion.div
                    className="bg-[#D4A95A] h-full rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                    transition={{ ease: "easeOut", duration: 0.3 }}
                  />
                </div>

                <div className="w-full flex justify-between items-center text-[11px] text-[#6A655C] font-mono mt-2">
                  <span>{uploadProgress < 100 ? "Analyzing..." : "Complete"}</span>
                  <span className="font-semibold text-[#D4A95A]">{uploadProgress}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Fountain Pen Writing Animation (00:08 - 00:11 in video) */}
          <AnimatePresence>
            {isTransforming && (
              <motion.div
                initial={{ opacity: 0, x: 20, y: -20 }}
                animate={{ 
                  opacity: 1, 
                  x: [0, 15, -10, 20, 0], 
                  y: [0, -8, 4, -12, 0] 
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-8 pointer-events-none z-30"
              >
                {/* Nib graphic / Fountain pen */}
                <div className="relative">
                  <svg
                    width="70"
                    height="70"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1C1A17"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="rotate-45 drop-shadow-md text-[#1C1A17]"
                  >
                    <path d="m12 19 7-7 3 3-7 7-3-3z" fill="#181818" />
                    <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" fill="#D4A95A" />
                    <path d="m2 2 7.586 7.586" stroke="#FFFFFF" />
                    <circle cx="11" cy="11" r="2" fill="#1C1A17" />
                  </svg>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Signature ink flourish on the right page margin like in video */}
          <div className="absolute -bottom-10 right-2 pointer-events-none opacity-70">
            <svg width="100" height="40" viewBox="0 0 120 40" fill="none">
              <path
                d="M 5 25 C 20 10, 35 35, 55 18 C 75 5, 85 30, 110 15"
                stroke="#333"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {errorMsg && (
            <p className="text-xs text-red-600 mt-4 text-center font-medium">{errorMsg}</p>
          )}
        </div>

        {/* Bottom Status Prompt */}
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#8C877E]">
            {isTransforming ? "Crystallizing knowledge..." : "Ready for archival upload"}
          </p>
        </div>

      </div>
    </div>
  );
}

