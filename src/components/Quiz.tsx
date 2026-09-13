"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QuizQuestion } from "@/types";
import { Check, X } from "lucide-react";
import { audioEngine } from "@/utils/AudioEngine";

interface Props {
  data: { questions: QuizQuestion[] };
}

export default function Quiz({ data }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [shortAnswerText, setShortAnswerText] = useState("");

  const question = data.questions[currentQuestion];
  const isLastQuestion = currentQuestion === data.questions.length - 1;

  const handleSelectOption = (option: string) => {
    if (isRevealed) return;
    setSelectedAnswer(option);
  };

  const handleCheckAnswer = () => {
    if (question.type === "short" && !shortAnswerText) return;
    if (question.type !== "short" && !selectedAnswer) return;
    audioEngine.playPageTurn();
    setIsRevealed(true);
  };

  const handleNext = () => {
    audioEngine.playPageTurn();
    setIsRevealed(false);
    setSelectedAnswer(null);
    setShortAnswerText("");
    if (!isLastQuestion) setCurrentQuestion((prev) => prev + 1);
  };

  return (
    <section id="quiz" className="py-24 px-6 min-h-screen flex items-center justify-center relative z-10">
      <div className="w-full max-w-3xl">
        
        {/* Progress Indicator */}
        <div className="mb-12 flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-serif text-brand-primary">Examination</h2>
            <p className="text-brand-muted uppercase tracking-widest text-xs mt-2">Knowledge Assessment</p>
          </div>
          <div className="text-brand-gold font-serif text-2xl">
            0{currentQuestion + 1} <span className="text-brand-muted text-lg">/ 0{data.questions.length}</span>
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel p-10 md:p-16 rounded-2xl relative overflow-hidden shadow-2xl"
          >
            {/* Texture */}
            <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'1.5\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />

            <h3 className="text-2xl md:text-3xl font-serif text-brand-primary leading-relaxed mb-10 relative z-10">
              {question.question}
            </h3>

            <div className="space-y-4 relative z-10">
              {(question.type === "mcq" || question.type === "tf") && question.options?.map((option, idx) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === question.correctAnswer;
                const showStatus = isRevealed && (isSelected || isCorrect);

                return (
                  <motion.button
                    key={idx}
                    whileHover={!isRevealed ? { scale: 1.01 } : {}}
                    whileTap={!isRevealed ? { scale: 0.99 } : {}}
                    onClick={() => handleSelectOption(option)}
                    className={`
                      w-full text-left p-6 rounded-xl border transition-all duration-500
                      ${isSelected ? "border-brand-gold bg-brand-gold/10" : "border-brand-border/50 bg-brand-surface/20"}
                      ${showStatus ? (isCorrect ? "border-brand-success bg-brand-success/10" : "border-red-500/50 bg-red-500/10") : ""}
                      ${!isRevealed ? "hover:border-brand-gold/50 cursor-pointer" : "cursor-default"}
                    `}
                    style={{
                      boxShadow: isSelected && !isRevealed ? "inset 0 2px 4px rgba(0,0,0,0.5)" : "none" // Embossed press effect
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`text-lg ${showStatus ? (isCorrect ? "text-brand-success" : "text-red-400") : (isSelected ? "text-brand-gold" : "text-brand-muted")}`}>
                        {option}
                      </span>
                      {showStatus && (
                        isCorrect ? <Check className="text-brand-success" /> : <X className="text-red-400" />
                      )}
                    </div>
                  </motion.button>
                );
              })}

              {question.type === "short" && (
                <div className="space-y-4">
                  <textarea
                    value={shortAnswerText}
                    onChange={(e) => setShortAnswerText(e.target.value)}
                    disabled={isRevealed}
                    placeholder="Formulate your answer..."
                    className="w-full bg-brand-surface/20 border border-brand-border/50 rounded-xl p-6 text-brand-primary min-h-[150px] focus:outline-none focus:border-brand-gold/50 transition-colors resize-none disabled:opacity-50"
                  />
                  {isRevealed && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="p-6 border border-brand-success/30 bg-brand-success/10 rounded-xl"
                    >
                      <span className="text-xs uppercase tracking-widest text-brand-success block mb-2">Expected Answer</span>
                      <p className="text-brand-primary">{question.correctAnswer}</p>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            <AnimatePresence>
              {isRevealed && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 pt-8 border-t border-brand-border/30 relative z-10"
                >
                  <span className="text-xs uppercase tracking-widest text-brand-muted block mb-2">Explanation</span>
                  <p className="text-brand-primary leading-relaxed font-light">{question.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex justify-end">
          {!isRevealed ? (
            <button
              onClick={handleCheckAnswer}
              disabled={(question.type !== "short" && !selectedAnswer) || (question.type === "short" && !shortAnswerText)}
              className="px-10 py-4 border border-brand-gold text-brand-gold rounded-full tracking-widest text-sm uppercase transition-all hover:bg-brand-gold hover:text-brand-bg disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-brand-gold"
            >
              Confirm
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-10 py-4 bg-brand-primary text-brand-bg rounded-full tracking-widest text-sm uppercase transition-all hover:bg-white"
            >
              {isLastQuestion ? "Complete" : "Next Question"}
            </button>
          )}
        </div>

      </div>
    </section>
  );
}
