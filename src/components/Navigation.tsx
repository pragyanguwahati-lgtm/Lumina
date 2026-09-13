"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { id: "upload", label: "Upload" },
  { id: "notes", label: "Notes" },
  { id: "quiz", label: "Quiz" },
  { id: "export", label: "Export" },
];

export default function Navigation() {
  const [active, setActive] = useState("upload");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Simple scroll spy logic
      const sections = NAV_ITEMS.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActive(NAV_ITEMS[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-brand-bg/80 backdrop-blur-md border-b border-brand-border/30" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <div className="font-serif text-2xl tracking-widest text-brand-primary">
          LUMINA
        </div>
        
        <div className="flex space-x-8">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                const el = document.getElementById(item.id);
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="relative text-sm tracking-widest uppercase transition-colors duration-500 hover:text-brand-primary text-brand-muted"
            >
              <span className={active === item.id ? "text-brand-primary" : ""}>
                {item.label}
              </span>
              
              {active === item.id && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-gold"
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
