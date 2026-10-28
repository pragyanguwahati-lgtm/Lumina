export interface CodeSnippet {
  language: string;
  title: string;
  code: string;
  explanation: string;
  complexity?: string;
}

export interface NumericalExample {
  title: string;
  problemStatement: string;
  formulaUsed: string;
  stepByStepSolution: string[];
  finalAnswer: string;
}

export interface DiagramData {
  title: string;
  type: "flowchart" | "mindmap" | "sequence";
  mermaidCode: string;
  caption: string;
}

export interface RevisionNotes {
  chapterTitle: string;
  executiveSummary: string;
  keyConcepts: string[];
  importantDefinitions: { term: string; definition: string }[];
  formulas?: { name: string; formula: string }[];
  examFocusedPoints: string[];
  memoryShortcuts: string[];
  codeSnippets?: CodeSnippet[];
  numericals?: NumericalExample[];
  diagram?: DiagramData;
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
