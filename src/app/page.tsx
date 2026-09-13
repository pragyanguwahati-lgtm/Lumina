"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Hero from "@/components/Hero";
import DeskUpload from "@/components/DeskUpload";
import TransformationSequence from "@/components/TransformationSequence";
import RevisionNotes from "@/components/RevisionNotes";
import Quiz from "@/components/Quiz";
import ExportSection from "@/components/ExportSection";
import { GeneratedData } from "@/types";
import { audioEngine } from "@/utils/AudioEngine";

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [generatedData, setGeneratedData] = useState<GeneratedData | null>(null);

  const handleFileAccepted = async (file: File) => {
    setUploadedFile(file);
    setIsTransforming(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to generate content");

      // We read the entire response as text since the API streams the JSON
      // and we just need the final parsed object.
      const text = await response.text();
      // Clean up markdown block if the model returned it despite instructions
      const cleanText = text.replace(/```json\n?|\n?```/g, "").trim();
      const data = JSON.parse(cleanText) as GeneratedData;
      
      setGeneratedData(data);
    } catch (error) {
      console.error(error);
      alert("An error occurred during transformation. Please try again.");
      setUploadedFile(null);
      setIsTransforming(false);
      audioEngine.stopFocusMode();
    }
  };

  const handleTransformationComplete = () => {
    setIsTransforming(false);
    audioEngine.stopFocusMode();
    audioEngine.playSummaryFinished();
    if (generatedData) {
      setIsComplete(true);
      // Wait for DOM to render then scroll to notes
      setTimeout(() => {
        const el = document.getElementById("notes");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <div className="relative" id="upload">
      <AnimatePresence mode="wait">
        {!isComplete && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)", transition: { duration: 1.2 } }}
            className="flex flex-col min-h-screen"
          >
            <Hero />
            <div className="h-32" /> {/* Spacing */}
            <DeskUpload onFileAccepted={handleFileAccepted} />
            <div className="h-64" /> {/* Bottom Spacing */}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isTransforming && uploadedFile && (
          <TransformationSequence 
            key="transformation"
            fileName={uploadedFile.name} 
            onComplete={handleTransformationComplete} 
            isDataReady={!!generatedData}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isComplete && generatedData && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <div id="notes">
              <RevisionNotes data={generatedData.notes} />
            </div>
            <div className="h-32" />
            <div id="quiz">
              <Quiz data={generatedData.quiz} />
            </div>
            <div className="h-32" />
            <div id="export">
              <ExportSection data={generatedData} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
