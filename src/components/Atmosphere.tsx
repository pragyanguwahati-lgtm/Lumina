"use client";

import React, { useEffect, useRef } from "react";
import { useBook } from "@/context/BookContext";

export default function Atmosphere() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isBookOpen } = useBook();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = window.innerWidth;
    let H = window.innerHeight;
    const D = Math.min(window.devicePixelRatio || 1, 2);

    const size = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * D;
      canvas.height = H * D;
      ctx.setTransform(D, 0, 0, D, 0, 0);
    };

    size();
    window.addEventListener("resize", size);

    interface Particle {
      x: number;
      y: number;
      z: number;
      r: number;
      a: number;
      ph: number;
    }

    const particles: Particle[] = [];
    for (let i = 0; i < 75; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        z: 0.2 + Math.random() * 0.8,
        r: 0.5 + Math.random() * 1.6,
        a: 0.15 + Math.random() * 0.45,
        ph: Math.random() * 6.283,
      });
    }

    let px = 0;
    let py = 0;
    let boost = isBookOpen ? 0.8 : 0;

    const handlePointerMove = (e: PointerEvent) => {
      px = e.clientX / window.innerWidth - 0.5;
      py = e.clientY / window.innerHeight - 0.5;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    let lastTime = 0;
    const render = (t: number) => {
      ctx.clearRect(0, 0, W, H);

      particles.forEach((p) => {
        p.y -= (0.00006 + 0.00018 * p.z) * (1 + boost * 4.5);
        p.x += Math.sin(t * 0.0004 + p.ph) * 0.00008;

        if (p.y < -0.02) {
          p.y = 1.02;
          p.x = Math.random();
        }

        const twinkle = p.a * (0.6 + 0.4 * Math.sin(t * 0.002 + p.ph)) * (1 + boost * 1.1);
        ctx.globalAlpha = Math.min(twinkle, 0.9);
        ctx.fillStyle = "#e9c47c";
        ctx.beginPath();
        ctx.arc(
          p.x * W - px * 40 * p.z,
          p.y * H - py * 30 * p.z,
          p.r * p.z + 0.3,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });

      boost *= 0.985;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", size);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [isBookOpen]);

  return (
    <>
      {/* 1. Dust motes canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* 2. Ambient Study Lamp Glow (Warm Top-Left) */}
      <div 
        aria-hidden="true"
        className="fixed -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full pointer-events-none z-0 blur-[130px] opacity-40 bg-[radial-gradient(circle,rgba(214,173,95,0.18)_0%,transparent_70%)]" 
      />

      {/* 3. Subtle Midnight Tint (Bottom-Right) */}
      <div 
        aria-hidden="true"
        className="fixed -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full pointer-events-none z-0 blur-[140px] opacity-25 bg-[radial-gradient(circle,rgba(80,95,130,0.12)_0%,transparent_70%)]" 
      />
    </>
  );
}
