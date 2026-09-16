"use client";

import React, { createContext, useContext, useState } from "react";
import { GeneratedData } from "@/types";

export type BookPage = "cover" | "upload" | "notes" | "quiz" | "export";

interface BookContextType {
  currentPage: BookPage;
  flipDirection: "next" | "prev";
  uploadedFile: File | null;
  generatedData: GeneratedData | null;
  isTransforming: boolean;
  uploadProgress: number;
  soundEnabled: boolean;
  turnToPage: (page: BookPage) => void;
  setUploadedFile: (file: File | null) => void;
  setGeneratedData: (data: GeneratedData | null) => void;
  setIsTransforming: (val: boolean) => void;
  setUploadProgress: React.Dispatch<React.SetStateAction<number>>;

  toggleSound: () => void;
  playPageTurnSound: () => void;
  resetBook: () => void;
}


const BookContext = createContext<BookContextType | undefined>(undefined);

const PAGE_ORDER: BookPage[] = ["cover", "upload", "notes", "quiz", "export"];

export function BookProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<BookPage>("cover");
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [generatedData, setGeneratedData] = useState<GeneratedData | null>(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);


  const playPageTurnSound = () => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      
      const bufferSize = audioCtx.sampleRate * 0.15;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }
      
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.15);
      
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start();
    } catch {
      // Audio playback fails silently if blocked
    }
  };

  const turnToPage = (newPage: BookPage) => {
    if (newPage === currentPage) return;
    const currentIndex = PAGE_ORDER.indexOf(currentPage);
    const newIndex = PAGE_ORDER.indexOf(newPage);
    setFlipDirection(newIndex > currentIndex ? "next" : "prev");
    playPageTurnSound();
    setCurrentPage(newPage);
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const resetBook = () => {
    setCurrentPage("cover");
    setFlipDirection("prev");
    setUploadedFile(null);
    setGeneratedData(null);
    setIsTransforming(false);
    setUploadProgress(0);
  };

  return (
    <BookContext.Provider
      value={{
        currentPage,
        flipDirection,
        uploadedFile,
        generatedData,
        isTransforming,
        uploadProgress,
        soundEnabled,
        turnToPage,
        setUploadedFile,
        setGeneratedData,
        setIsTransforming,
        setUploadProgress,
        toggleSound,
        playPageTurnSound,
        resetBook,
      }}
    >
      {children}
    </BookContext.Provider>
  );
}

export function useBook() {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("useBook must be used within a BookProvider");
  }
  return context;
}

