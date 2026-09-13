"use client";

import { motion, Variants } from "framer-motion";
import { RevisionNotes as RevisionNotesType } from "@/types";

interface Props {
  data: RevisionNotesType;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
  },
};

export default function RevisionNotes({ data }: Props) {
  return (
    <section id="notes" className="py-24 px-6 min-h-screen relative z-10">
      <div className="max-w-5xl mx-auto flex gap-12 relative">
        
        {/* Knowledge Sidebar (Desktop only) */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-32 glass-panel p-6 rounded-xl">
            <h3 className="text-brand-gold uppercase tracking-widest text-xs font-semibold mb-6">Knowledge Index</h3>
            <ul className="space-y-4">
              <li>
                <a href="#overview" className="text-brand-muted hover:text-brand-primary transition-colors text-sm">Overview</a>
              </li>
              <li>
                <a href="#concepts" className="text-brand-muted hover:text-brand-primary transition-colors text-sm">Key Concepts</a>
              </li>
              <li>
                <a href="#definitions" className="text-brand-muted hover:text-brand-primary transition-colors text-sm">Definitions</a>
              </li>
              {data.formulas && data.formulas.length > 0 && (
                <li>
                  <a href="#formulas" className="text-brand-muted hover:text-brand-primary transition-colors text-sm">Formulas</a>
                </li>
              )}
              <li>
                <a href="#exam" className="text-brand-muted hover:text-brand-primary transition-colors text-sm">Exam Focus</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <motion.div 
          className="flex-grow space-y-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Chapter Title & Overview */}
          <motion.div variants={itemVariants} id="overview" className="space-y-6">
            <h2 className="text-6xl font-serif text-brand-primary leading-tight text-shadow-gold">
              {data.chapterTitle}
            </h2>
            <div className="w-24 h-[1px] bg-brand-gold/50" />
            <p className="text-xl text-brand-muted font-light leading-relaxed">
              {data.executiveSummary}
            </p>
          </motion.div>

          {/* Key Concepts */}
          <motion.div variants={itemVariants} id="concepts" className="space-y-8">
            <h3 className="text-3xl font-serif text-brand-primary">Key Concepts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.keyConcepts.map((concept, i) => (
                <div key={i} className="glass-panel p-8 rounded-xl hover:-translate-y-1 transition-transform duration-500 shadow-xl">
                  <p className="text-brand-primary leading-relaxed">{concept}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Definitions */}
          <motion.div variants={itemVariants} id="definitions" className="space-y-8">
            <h3 className="text-3xl font-serif text-brand-primary">Important Definitions</h3>
            <div className="space-y-6">
              {data.importantDefinitions.map((def, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-4 md:gap-8 border-b border-brand-border/30 pb-6">
                  <div className="md:w-1/3">
                    <h4 className="text-brand-gold font-medium text-lg relative inline-block group">
                      {def.term}
                      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-gold transition-all duration-700 ease-out group-hover:w-full" />
                    </h4>
                  </div>
                  <div className="md:w-2/3">
                    <p className="text-brand-muted">{def.definition}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Formulas */}
          {data.formulas && data.formulas.length > 0 && (
            <motion.div variants={itemVariants} id="formulas" className="space-y-8">
              <h3 className="text-3xl font-serif text-brand-primary">Core Formulas</h3>
              <div className="grid grid-cols-1 gap-4">
                {data.formulas.map((form, i) => (
                  <div key={i} className="glass-panel p-6 rounded-xl flex items-center justify-between">
                    <span className="text-brand-muted uppercase tracking-widest text-sm">{form.name}</span>
                    <span className="font-serif text-2xl text-brand-primary font-style: italic">{form.formula}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Exam Focus & Memory Shortcuts */}
          <motion.div variants={itemVariants} id="exam" className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-serif text-brand-primary">Exam Focus</h3>
              <ul className="space-y-4">
                {data.examFocusedPoints.map((point, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-warning mt-2 shrink-0" />
                    <span className="text-brand-muted text-sm leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-serif text-brand-primary">Memory Shortcuts</h3>
              <ul className="space-y-4">
                {data.memoryShortcuts.map((trick, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-success mt-2 shrink-0" />
                    <span className="text-brand-muted text-sm leading-relaxed">{trick}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
