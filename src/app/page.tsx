"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useBook } from "@/context/BookContext";
import BookCover from "@/components/BookCover";
import BookLayout from "@/components/BookLayout";
import BookUploadPage from "@/components/pages/BookUploadPage";
import BookNotesPage from "@/components/pages/BookNotesPage";
import BookQuizPage from "@/components/pages/BookQuizPage";
import BookExportPage from "@/components/pages/BookExportPage";

export default function Home() {
  const { currentPage, turnToPage } = useBook();

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <AnimatePresence mode="wait">
        {currentPage === "cover" ? (
          <motion.div
            key="cover-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ 
              opacity: 0, 
              rotateY: -70, 
              scale: 0.9, 
              transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } 
            }}
            className="w-full flex items-center justify-center"
          >
            <BookCover onOpen={() => turnToPage("upload")} />
          </motion.div>
        ) : (
          <motion.div
            key="book-layout"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <BookLayout>
              {currentPage === "upload" && <BookUploadPage />}
              {currentPage === "notes" && <BookNotesPage />}
              {currentPage === "quiz" && <BookQuizPage />}
              {currentPage === "export" && <BookExportPage />}
            </BookLayout>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

