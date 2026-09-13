"use client";

import { motion, useAnimation } from "framer-motion";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileText, CheckCircle } from "lucide-react";
import { audioEngine } from "@/utils/AudioEngine";

interface DeskUploadProps {
  onFileAccepted: (file: File) => void;
}

export default function DeskUpload({ onFileAccepted }: DeskUploadProps) {
  const [isHovering, setIsHovering] = useState(false);
  const controls = useAnimation();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setIsHovering(false);
        audioEngine.init();
        audioEngine.playUploadSuccess();
        audioEngine.startFocusMode();
        // Animate the drop weight
        await controls.start({
          scale: 0.95,
          y: 10,
          transition: { type: "spring", stiffness: 400, damping: 15 },
        });
        await controls.start({
          scale: 1,
          y: 0,
          transition: { type: "spring", stiffness: 300, damping: 20 },
        });
        
        onFileAccepted(acceptedFiles[0]);
      }
    },
    [controls, onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/vnd.ms-powerpoint": [".ppt"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
    },
    maxFiles: 1,
  });

  return (
    <section className="relative min-h-screen flex items-center justify-center py-24 px-6 z-10">
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl font-serif text-brand-primary mb-6">Archival Deposit</h2>
          <p className="text-brand-muted tracking-wide text-lg max-w-lg mx-auto font-light">
            Place your lecture material upon the desk. The transformation will begin immediately.
          </p>
        </motion.div>

        <motion.div
          animate={controls}
          className="relative w-full aspect-[4/3] max-w-2xl"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div
            {...getRootProps()}
            className={`
              absolute inset-0 cursor-pointer flex flex-col items-center justify-center
              rounded-lg transition-all duration-700 ease-out
              ${isDragActive ? "border-brand-gold bg-brand-gold/5" : "border-brand-border bg-brand-surface/40"}
              ${isDragReject ? "border-red-500 bg-red-500/5" : ""}
            `}
            style={{
              borderWidth: "1px",
              boxShadow: isHovering || isDragActive 
                ? "0 30px 60px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(212,169,90,0.3)" 
                : "0 20px 40px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(255,255,255,0.02)",
              transform: isHovering || isDragActive ? "translateY(-8px) scale(1.02)" : "translateY(0px) scale(1)",
            }}
          >
            <input {...getInputProps()} />
            
            {/* Paper texture overlay for the "archival folder" look */}
            <div 
              className="absolute inset-0 rounded-lg pointer-events-none opacity-20"
              style={{
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E\")",
                mixBlendMode: "overlay"
              }}
            />

            <motion.div 
              className="flex flex-col items-center z-10"
              animate={{ 
                y: isDragActive ? -10 : 0,
                opacity: isHovering || isDragActive ? 1 : 0.7 
              }}
              transition={{ duration: 0.4 }}
            >
              <div className={`p-6 rounded-full mb-6 transition-colors duration-500 ${
                isDragActive ? "bg-brand-gold/20 text-brand-gold" : "bg-brand-bg text-brand-muted"
              }`}>
                {isDragReject ? (
                  <FileText size={32} className="text-red-400" />
                ) : isDragActive ? (
                  <UploadCloud size={32} className="text-brand-gold" />
                ) : (
                  <FileText size={32} />
                )}
              </div>
              
              <h3 className="text-2xl font-serif text-brand-primary mb-3">
                {isDragActive ? "Release to Deposit" : "Drop Document"}
              </h3>
              
              <p className="text-brand-muted text-sm uppercase tracking-widest font-light">
                PDF, DOCX, PPT, PPTX
              </p>
            </motion.div>
            
            {/* Soft glow following hover (simulated by a static gradient on hover for now) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovering && !isDragActive ? 1 : 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0 rounded-lg bg-[radial-gradient(circle_at_50%_50%,rgba(212,169,90,0.08)_0%,transparent_60%)] pointer-events-none"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
