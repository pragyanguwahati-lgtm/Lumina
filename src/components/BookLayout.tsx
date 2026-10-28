"use client";

import React, { useRef, useEffect } from "react";
import { useBook } from "@/context/BookContext";
import { RotateCcw } from "lucide-react";

interface BookLayoutProps {
  children: React.ReactNode;
  leftPageContent: React.ReactNode;
}

export default function BookLayout({ children, leftPageContent }: BookLayoutProps) {
  const { isBookOpen, openBook, closeBook, currentPage, turnToPage, generatedData } = useBook();
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const tiltRef = useRef<HTMLDivElement | null>(null);
  const frontRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);

  // 3D Tilt & Cursor Tracking Spotlight (21st.dev spotlight mechanics)
  useEffect(() => {
    const scene = sceneRef.current;
    const tilt = tiltRef.current;
    const front = frontRef.current;
    const frame = frameRef.current;
    if (!scene || !tilt) return;

    const handlePointerMove = (e: PointerEvent) => {
      // If book is closed, perform full 3D tome tilt
      if (!isBookOpen) {
        const s = scene.getBoundingClientRect();
        const cx = s.left + s.width / 2;
        const cy = s.top + s.height / 2;
        const dx = Math.max(-1, Math.min(1, (e.clientX - cx) / (s.width / 2)));
        const dy = Math.max(-1, Math.min(1, (e.clientY - cy) / (s.height / 2)));

        tilt.style.setProperty("--ry", `${dx * 8.5}deg`);
        tilt.style.setProperty("--rx", `${-dy * 5.5}deg`);

        if (front) {
          const r = front.getBoundingClientRect();
          front.style.setProperty("--mx", `${e.clientX - r.left}px`);
          front.style.setProperty("--my", `${e.clientY - r.top}px`);
        }
        if (frame) {
          const r = frame.getBoundingClientRect();
          frame.style.setProperty("--fx", `${e.clientX - r.left}px`);
          frame.style.setProperty("--fy", `${e.clientY - r.top}px`);
        }
      } else {
        tilt.style.setProperty("--rx", "0deg");
        tilt.style.setProperty("--ry", "0deg");
      }

      // Propagate cursor spotlight coords to any hovered .ring elements
      const activeRing = (e.target as HTMLElement)?.closest(".ring") as HTMLElement | null;
      if (activeRing) {
        const r = activeRing.getBoundingClientRect();
        activeRing.style.setProperty("--fx", `${e.clientX - r.left}px`);
        activeRing.style.setProperty("--fy", `${e.clientY - r.top}px`);
      }
    };

    const handlePointerLeave = () => {
      if (!isBookOpen && tilt) {
        tilt.style.setProperty("--rx", "0deg");
        tilt.style.setProperty("--ry", "0deg");
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [isBookOpen]);

  return (
    <div className={`relative w-full flex flex-col items-center justify-center transition-all duration-700 ${isBookOpen ? "opened" : ""}`}>
      {/* Ambient Backlight Golden Halo */}
      <div 
        aria-hidden="true"
        className="halo-tome"
      />

      {/* 3D Scene */}
      <div 
        ref={sceneRef}
        id="scene"
        className="scene-tome"
      >
        {/* Soft Floor Shadow beneath the Book */}
        <div 
          className="floor-tome"
        />

        {/* 3D Tilt Wrapper */}
        <div 
          ref={tiltRef}
          id="tilt"
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
          }}
        >
          {/* Main Book Object */}
          <div 
            className="book-tome"
          >
            {/* ================= RIGHT PAGE (The Base Page) ================= */}
            <div 
              className={`
                absolute inset-0 w-[var(--w)]
                bg-gradient-to-r from-[#0f0d0a] to-[#16140f]
                rounded-r-2xl border border-[#2a251b]
                book-page-stack-right flex flex-col overflow-hidden
                transition-all duration-700
                ${isBookOpen 
                  ? "opacity-100 pointer-events-auto z-10" 
                  : "opacity-0 pointer-events-none z-0"}
              `}
            >
              {/* Gold Ribbon Bookmark pinned to top right */}
              <div className="bookmark-ribbon" aria-hidden="true" />

              {/* Central Spine Shadow overlay */}
              <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black/50 to-transparent pointer-events-none z-20" />

              {/* Right Page Interactive Content */}
              <div className="relative z-10 w-full h-full flex flex-col p-5 sm:p-7 md:p-8 archival-scroll overflow-y-auto">
                {children}
              </div>
            </div>

            {/* ================= COVER / LEFT SPREAD ================= */}
            <div 
              className="cover-tome"
              onClick={!isBookOpen ? openBook : undefined}
            >
              {/* --- FRONT COVER FACE (Visible when closed) --- */}
              <div 
                ref={frontRef}
                className="absolute inset-0 rounded-r-2xl rounded-l-sm bg-[#0d0c0b] border border-[#26221a] overflow-hidden shadow-[inset_14px_0_0_#070706,inset_16px_0_14px_-8px_#000,0_40px_80px_rgba(0,0,0,0.7)] group"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                {/* Dual procedural SVG marble textures */}
                <svg className="absolute -inset-[20%] w-[140%] h-[140%] -rotate-[32deg] pointer-events-none opacity-90" viewBox="0 0 800 1000" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <filter id="v1" x="0" y="0" width="100%" height="100%">
                      <feTurbulence type="turbulence" baseFrequency="0.0045 0.014" numOctaves="4" seed="7" />
                      <feColorMatrix values="0 0 0 0 .84  0 0 0 0 .68  0 0 0 0 .37  -13 0 0 0 2.35" />
                    </filter>
                    <filter id="v2" x="0" y="0" width="100%" height="100%">
                      <feTurbulence type="turbulence" baseFrequency="0.006 0.02" numOctaves="5" seed="19" />
                      <feColorMatrix values="0 0 0 0 .92  0 0 0 0 .92  0 0 0 0 .9  -16 0 0 0 2.5" />
                    </filter>
                  </defs>
                  <rect width="800" height="1000" filter="url(#v1)" opacity="0.55" />
                  <rect width="800" height="1000" filter="url(#v2)" opacity="0.28" />
                </svg>

                {/* Lit marble on cursor spotlight hover */}
                <svg 
                  className="absolute -inset-[20%] w-[140%] h-[140%] -rotate-[32deg] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 [filter:brightness(1.7)_saturate(1.2)]"
                  style={{
                    WebkitMaskImage: "radial-gradient(260px circle at var(--mx,50%) var(--my,50%), #000, transparent 70%)",
                    maskImage: "radial-gradient(260px circle at var(--mx,50%) var(--my,50%), #000, transparent 70%)",
                  }}
                  viewBox="0 0 800 1000" 
                  preserveAspectRatio="none" 
                  aria-hidden="true"
                >
                  <rect width="800" height="1000" filter="url(#v1)" />
                </svg>

                {/* Dynamic sheen flash on hover */}
                <div 
                  className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-screen pointer-events-none"
                  style={{
                    background: "radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgba(214,173,95,0.18), transparent 60%)",
                  }}
                />

                {/* Ambient vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_30%,rgba(0,0,0,0.55)_100%)] pointer-events-none" />

                {/* Left book spine binding */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/80 via-black/40 to-transparent border-r border-white/5 pointer-events-none" />
                <div className="absolute left-3.5 top-0 bottom-0 w-[1px] bg-[#d6ad5f]/20 pointer-events-none" />

                {/* Center Inset Frame with 21st.dev Spotlight */}
                <div 
                  ref={frameRef}
                  className="ring absolute z-20 border border-[#d6ad5f]/30 rounded-xl flex flex-col items-center justify-center p-6 text-center transition-colors group-hover:border-[#d6ad5f]/50"
                  style={{
                    top: "clamp(18px, 2.6vw, 32px)",
                    right: "clamp(18px, 2.6vw, 32px)",
                    bottom: "clamp(54px, 6.5vw, 72px)",
                    left: "clamp(32px, 4vw, 48px)",
                  }}
                >
                  {/* Gilded Seal with Celestial Star */}
                  <div className="w-12 h-12 rounded-full border border-[#8a6d3b] bg-[#0b0a09]/80 backdrop-blur-xs flex items-center justify-center mb-5 shadow-md">
                    <svg className="w-5 h-5 stroke-[#d6ad5f] fill-none stroke-[1.4]" viewBox="0 0 24 24" strokeLinecap="round">
                      <path d="M9 4l1.6 4.4L15 10l-4.4 1.6L9 16l-1.6-4.4L3 10l4.4-1.6z" />
                      <path d="M17.5 3v4M15.5 5h4M18 14v5M15.5 16.5h5" />
                    </svg>
                  </div>

                  {/* Title with metallic shimmer sweep */}
                  <h1 className="sheen-gold-text text-5xl sm:text-6xl md:text-7xl font-serif font-medium tracking-tight mb-3">
                    Lumina
                  </h1>

                  {/* Gold hairline divider rule */}
                  <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#d6ad5f] to-transparent my-2.5 opacity-80" />

                  {/* Subtitle */}
                  <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-[#c5bfb0] font-light max-w-xs leading-relaxed">
                    Turn lectures into mastery
                  </p>
                </div>

                {/* Bottom Open Prompt with gentle breath animation */}
                <div className="absolute z-20 left-0 right-0 bottom-5 sm:bottom-6 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#d6ad5f] animate-[breathe_3s_infinite_ease-in-out] pointer-events-none">
                  <svg className="w-4 h-4 stroke-[#d6ad5f] fill-none stroke-[1.5]" viewBox="0 0 24 24" strokeLinejoin="round">
                    <path d="M3 5.5C5 4.5 8.5 4.5 12 6.5c3.5-2 7-2 9-1V19c-2-1-5.5-1-9 1-3.5-2-7-2-9-1zM12 6.5V20" />
                  </svg>
                  <span>Click to open notebook</span>
                </div>
              </div>

              {/* --- BACK COVER FACE = INSIDE LEFT SPREAD (Visible when open) --- */}
              <div 
                className="absolute inset-0 rounded-l-2xl border border-[#2a251b] bg-gradient-to-l from-[#0f0d0a] to-[#16140f] book-page-stack-left flex flex-col overflow-hidden p-5 sm:p-7 md:p-8 archival-scroll overflow-y-auto"
                style={{
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                {/* Spine crease shadow on inside left */}
                <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-black/50 to-transparent pointer-events-none z-20" />

                {/* Left Page Custom Content (Summary / Orientation / Assessment Index / Certificate) */}
                <div className="relative z-10 w-full h-full flex flex-col justify-between">
                  {leftPageContent}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Quick-Nav when Book is Open */}
      {isBookOpen && (
        <div className="mt-8 flex items-center gap-4 z-20">
          <button
            onClick={closeBook}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2a251b] bg-[#16140f]/80 text-[#8d877a] hover:text-[#d6ad5f] hover:border-[#8a6d3b] text-xs font-sans uppercase tracking-widest transition-all shadow-md"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Close Tome</span>
          </button>

          {/* Chapters Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-full border border-[#2a251b] bg-[#16140f]/80">
            {(["upload", "notes", "quiz", "export"] as const).map((tab) => {
              const isActive = currentPage === tab;
              const isAllowed = tab === "upload" || Boolean(generatedData);

              return (
                <button
                  key={tab}
                  disabled={!isAllowed}
                  onClick={() => turnToPage(tab)}
                  className={`
                    px-3 py-1 rounded-full text-[10px] font-sans uppercase tracking-[0.18em] transition-all
                    ${isActive 
                      ? "bg-[#d6ad5f] text-[#0b0a09] font-bold shadow-sm" 
                      : isAllowed 
                        ? "text-[#8d877a] hover:text-[#ece6d8]" 
                        : "text-[#4a463e] cursor-not-allowed opacity-30"}
                  `}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
