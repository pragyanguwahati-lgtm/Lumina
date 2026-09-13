export interface RevisionNotes {
  chapterTitle: string;
  executiveSummary: string;
  keyConcepts: string[];
  importantDefinitions: { term: string; definition: string }[];
  formulas?: { name: string; formula: string }[];
  examFocusedPoints: string[];
  memoryShortcuts: string[];
}

export interface QuizQuestion {
  type: "mcq" | "tf" | "short";
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface GeneratedData {
  notes: RevisionNotes;
  quiz: {
    questions: QuizQuestion[];
  };
}
