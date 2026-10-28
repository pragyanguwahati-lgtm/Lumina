"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBook } from "@/context/BookContext";
import BookLayout from "@/components/BookLayout";
import {
  BookUploadLeftPage,
  BookUploadRightPage,
} from "@/components/pages/BookUploadPage";
import {
  BookNotesLeftPage,
  BookNotesRightPage,
} from "@/components/pages/BookNotesPage";
import {
  BookQuizLeftPage,
  BookQuizRightPage,
} from "@/components/pages/BookQuizPage";
import {
  BookExportLeftPage,
  BookExportRightPage,
} from "@/components/pages/BookExportPage";

export default function Home() {
  const { currentPage, isBookOpen } = useBook();
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [quizRevealed, setQuizRevealed] = useState<Record<number, boolean>>({});

  // Determine active spread content
  let leftContent: React.ReactNode = null;
  let rightContent: React.ReactNode = null;

  switch (currentPage) {
    case "upload":
      leftContent = <BookUploadLeftPage />;
      rightContent = <BookUploadRightPage />;
      break;
    case "notes":
      leftContent = <BookNotesLeftPage />;
      rightContent = <BookNotesRightPage />;
      break;
    case "quiz":
      leftContent = (
        <BookQuizLeftPage
          currentIdx={currentQuizIdx}
          setCurrentIdx={setCurrentQuizIdx}
          revealed={quizRevealed}
        />
      );
      rightContent = (
        <BookQuizRightPage
          currentIdx={currentQuizIdx}
          setCurrentIdx={setCurrentQuizIdx}
          revealed={quizRevealed}
          setRevealed={setQuizRevealed}
        />
      );
      break;
    case "export":
      leftContent = <BookExportLeftPage />;
      rightContent = <BookExportRightPage />;
      break;
    default:
      leftContent = <BookUploadLeftPage />;
      rightContent = <BookUploadRightPage />;
  }

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden">
      <BookLayout
        leftPageContent={
          <AnimatePresence mode="wait">
            <motion.div
              key={`left-${currentPage}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full flex flex-col justify-between"
            >
              {leftContent}
            </motion.div>
          </AnimatePresence>
        }
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`right-${currentPage}`}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full flex flex-col justify-between"
          >
            {rightContent}
          </motion.div>
        </AnimatePresence>
      </BookLayout>
    </div>
  );
}
