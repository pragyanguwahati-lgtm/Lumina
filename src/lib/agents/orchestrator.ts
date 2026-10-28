import { GoogleGenAI } from "@google/genai";
import { GeneratedData, RevisionNotes, QuizQuestion, CodeSnippet, NumericalExample, DiagramData } from "@/types";

interface AgentPayload {
  textContent: string;
  sourceTitle: string;
  pdfBase64?: string;
  pdfMimeType?: string;
}

/**
 * Universal LLM caller: Uses Groq (open-source Llama 3.3 / Qwen Coder) if GROQ_API_KEY is configured,
 * otherwise defaults to Google GenAI (Gemini Flash). Both run smoothly on free Vercel hosting.
 */
async function callLLM({
  systemPrompt,
  userPrompt,
  modelType = "general",
}: {
  systemPrompt: string;
  userPrompt: string;
  modelType?: "general" | "code" | "math";
}): Promise<string> {
  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  const ollamaBase = process.env.OLLAMA_BASE_URL || (process.env.USE_OLLAMA === "true" ? "http://127.0.0.1:11434" : undefined);

  // 1. Try Groq (Open Source ultra-fast cloud inference on LPUs: 500+ tok/s, 100% free tier on Vercel)
  if (groqKey) {
    const candidateGroqModels = modelType === "code" || modelType === "math"
      ? ["qwen/qwen3.8-27b", "openai/gpt-oss-120b", "openai/gpt-oss-20b"]
      : ["openai/gpt-oss-120b", "qwen/qwen3.8-27b", "openai/gpt-oss-20b"];

    for (const model of candidateGroqModels) {
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            temperature: 0.2,
            response_format: { type: "json_object" },
          }),
        });

        if (res.ok) {
          const json = await res.json();
          const content = json.choices?.[0]?.message?.content;
          if (content) return content;
        } else {
          const errText = await res.text();
          console.warn(`Groq model ${model} returned ${res.status}:`, errText);
        }
      } catch (e) {
        console.warn(`Groq model ${model} call failed, trying next:`, e);
      }
    }
  }

  // 2. Try Local Ollama (Zero API keys, runs 100% locally on your machine's GPU/CPU)
  if (ollamaBase) {
    try {
      const model = modelType === "code" 
        ? (process.env.OLLAMA_CODE_MODEL || "qwen2.5-coder:latest")
        : (process.env.OLLAMA_MODEL || "llama3.2:latest");

      const res = await fetch(`${ollamaBase}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.2,
          response_format: { type: "json_object" },
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const content = json.choices?.[0]?.message?.content;
        if (content) return content;
      }
    } catch (e) {
      console.warn("Local Ollama call failed:", e);
    }
  }

  // 3. Optional Google GenAI fallback if GEMINI_API_KEY is configured
  if (geminiKey) {
    const ai = new GoogleGenAI({ apiKey: geminiKey });
    const candidateModels = ["gemini-3.7-flash", "gemini-3.5-flash-lite", "gemini-3.8-flash"];

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemPrompt}\n\nMaterial:\n${userPrompt}` }],
            },
          ],
          config: {
            responseMimeType: "application/json",
          },
        });

        if (response.text) {
          return response.text;
        }
      } catch {
        // try next candidate model
      }
    }
  }

  throw new Error("No active LLM available. Falling back to built-in algorithmic synthesizer.");
}

/**
 * Clean and parse raw LLM JSON output safely
 */
function cleanAndParseJSON<T>(raw: string, fallback: T): T {
  try {
    const clean = raw.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(clean) as T;
  } catch {
    return fallback;
  }
}

/* ========================================================================= */
/*                         PARALLEL SPECIALIST AGENTS                        */
/* ========================================================================= */

/**
 * Agent 1: Delegator & Router Agent
 * Quickly inspects material to discover chapter title and detect specialized domain signals.
 */
async function runDelegatorAgent(text: string, defaultTitle: string): Promise<{
  chapterTitle: string;
  hasCode: boolean;
  hasNumericals: boolean;
  hasArchitecture: boolean;
}> {
  const prompt = `Analyze this lecture preview. Return JSON:
{
  "chapterTitle": "Short refined title",
  "hasCode": true or false,
  "hasNumericals": true or false,
  "hasArchitecture": true or false
}
Analyze this text slice:
${text.slice(0, 3000)}`;

  try {
    const res = await callLLM({
      systemPrompt: "You are an academic curriculum router. Respond in raw JSON.",
      userPrompt: prompt,
    });
    return cleanAndParseJSON(res, {
      chapterTitle: defaultTitle,
      hasCode: false,
      hasNumericals: false,
      hasArchitecture: true,
    });
  } catch {
    return {
      chapterTitle: defaultTitle,
      hasCode: false,
      hasNumericals: false,
      hasArchitecture: true,
    };
  }
}

/**
 * Agent 2: Conceptual Notes Agent
 * Distills executive summary, core principles, definitions, formulas, and memory cues.
 */
async function runConceptualNotesAgent(text: string, title: string): Promise<Partial<RevisionNotes>> {
  const prompt = `Topic: "${title}".
Extract the core revision notes from this material in JSON:
{
  "executiveSummary": "2-3 sentence high-density academic summary",
  "keyConcepts": ["3-5 clear bullet principles"],
  "importantDefinitions": [{"term": "string", "definition": "string"}],
  "formulas": [{"name": "string", "formula": "LaTeX or plain formula string"}],
  "examFocusedPoints": ["3 high-yield exam takeaways"],
  "memoryShortcuts": ["2 mnemonics or memory shortcuts"]
}
Material:
${text.slice(0, 15000)}`;

  const res = await callLLM({
    systemPrompt: "You are a master academic synthesizer. Output pure JSON.",
    userPrompt: prompt,
  });

  return cleanAndParseJSON<Partial<RevisionNotes>>(res, {
    executiveSummary: "Comprehensive academic synthesis decomposing core concepts, foundational structures, and operational paradigms.",
    keyConcepts: ["Primary structural principles", "Fundamental boundary conditions"],
    importantDefinitions: [],
    formulas: [],
    examFocusedPoints: [],
    memoryShortcuts: [],
  });
}

/**
 * Agent 3: Code & Algorithm Specialist Agent
 * Extracts or synthesizes concrete source code, identifies algorithm mechanics and complexity.
 */
async function runCodeSpecialistAgent(text: string, title: string): Promise<CodeSnippet[]> {
  const prompt = `Topic: "${title}".
Inspect this lecture for any code snippets, pseudo-code, data structures, or algorithms.
If code exists or is relevant to "${title}", produce 1-2 practical code implementations with complexity analysis in JSON:
{
  "snippets": [
    {
      "language": "python or javascript or cpp or sql",
      "title": "Title of Implementation",
      "code": "executable, clean code",
      "explanation": "Clear line-by-line explanation of algorithm mechanics",
      "complexity": "Time: O(n), Space: O(1)"
    }
  ]
}
If absolutely no coding concepts exist in the text, return {"snippets": []}.
Material:
${text.slice(0, 12000)}`;

  try {
    const res = await callLLM({
      systemPrompt: "You are a principal software engineer and CS professor. Output pure JSON.",
      userPrompt: prompt,
      modelType: "code",
    });
    const parsed = cleanAndParseJSON<{ snippets: CodeSnippet[] }>(res, { snippets: [] });
    return parsed.snippets || [];
  } catch {
    return [];
  }
}

/**
 * Agent 4: Math & Numericals Specialist Agent
 * Formats step-by-step problem solutions and mathematical derivations.
 */
async function runNumericalsSpecialistAgent(text: string, title: string): Promise<NumericalExample[]> {
  const prompt = `Topic: "${title}".
Detect if there are numerical calculations, physics/engineering problems, or quantitative derivations in this lecture.
Extract or synthesize 1-2 worked numerical problems in JSON:
{
  "numericals": [
    {
      "title": "Problem Title",
      "problemStatement": "Clear problem statement with given variables",
      "formulaUsed": "Exact formula applied",
      "stepByStepSolution": [
        "Step 1: Identify given variables...",
        "Step 2: Substitute into formula...",
        "Step 3: Solve..."
      ],
      "finalAnswer": "Boxed final result with units"
    }
  ]
}
If no quantitative math or numericals exist in this text, return {"numericals": []}.
Material:
${text.slice(0, 12000)}`;

  try {
    const res = await callLLM({
      systemPrompt: "You are an applied mathematician and physics educator. Output pure JSON.",
      userPrompt: prompt,
      modelType: "math",
    });
    const parsed = cleanAndParseJSON<{ numericals: NumericalExample[] }>(res, { numericals: [] });
    return parsed.numericals || [];
  } catch {
    return [];
  }
}

/**
 * Agent 5: Visual Diagram Specialist Agent
 * Generates Mermaid.js diagrams (flowcharts, mindmaps, state sequences).
 */
async function runDiagramSpecialistAgent(text: string, title: string): Promise<DiagramData | undefined> {
  const prompt = `Topic: "${title}".
Generate a clean, valid Mermaid.js flowchart or concept map illustrating the workflow or hierarchy of this topic.
Return JSON:
{
  "title": "Diagram Title",
  "type": "flowchart",
  "mermaidCode": "graph TD\\n  A[Start Concept] --> B[Process Step]\\n  B --> C[Outcome]",
  "caption": "Short explanation of the diagram workflow"
}
Ensure the mermaidCode syntax is 100% valid with no markdown wrappers.
Material:
${text.slice(0, 10000)}`;

  try {
    const res = await callLLM({
      systemPrompt: "You are an information architect specializing in Mermaid diagrams. Output pure JSON.",
      userPrompt: prompt,
    });
    return cleanAndParseJSON<DiagramData | undefined>(res, undefined);
  } catch {
    return undefined;
  }
}

/**
 * Agent 6: Assessment & Quiz Agent
 * Produces a rigorous 5-question examination testing comprehension.
 */
async function runQuizAgent(text: string, title: string): Promise<QuizQuestion[]> {
  const prompt = `Topic: "${title}".
Write exactly 5 high-yield practice questions (3 MCQs, 1 True/False, 1 Short Answer) based on this lecture:
{
  "questions": [
    {
      "type": "mcq",
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Exact matching option text",
      "explanation": "Why this answer is correct"
    },
    {
      "type": "tf",
      "question": "Statement",
      "options": ["True", "False"],
      "correctAnswer": "True or False",
      "explanation": "Rationale"
    },
    {
      "type": "short",
      "question": "Conceptual question",
      "correctAnswer": "Model answer",
      "explanation": "Key scoring points"
    }
  ]
}
Material:
${text.slice(0, 12000)}`;

  const res = await callLLM({
    systemPrompt: "You are an assessment author. Output pure JSON with exactly 5 questions.",
    userPrompt: prompt,
  });

  const parsed = cleanAndParseJSON<{ questions: QuizQuestion[] }>(res, { questions: [] });
  return parsed.questions || [];
}

/* ========================================================================= */
/*                          MASTER ORCHESTRATOR                              */
/* ========================================================================= */

/**
 * Dispatches to parallel specialist agents and synthesizes the final mastery tome.
 */
export async function runOrchestratedSynthesis(payload: AgentPayload): Promise<GeneratedData> {
  const { textContent, sourceTitle } = payload;

  // Step 1: Delegator classifies the content and picks chapter title
  const delegation = await runDelegatorAgent(textContent, sourceTitle);
  const chapterTitle = delegation.chapterTitle || sourceTitle;

  // Step 2: Spawn all specialized agents in PARALLEL via Promise.all
  const [notesResult, codeResult, numericalsResult, diagramResult, quizResult] = await Promise.all([
    runConceptualNotesAgent(textContent, chapterTitle),
    runCodeSpecialistAgent(textContent, chapterTitle),
    runNumericalsSpecialistAgent(textContent, chapterTitle),
    runDiagramSpecialistAgent(textContent, chapterTitle),
    runQuizAgent(textContent, chapterTitle),
  ]);

  const compiledNotes: RevisionNotes = {
    chapterTitle,
    executiveSummary: notesResult.executiveSummary || "Synthesized academic principles and operational architectures.",
    keyConcepts: notesResult.keyConcepts && notesResult.keyConcepts.length > 0 ? notesResult.keyConcepts : [
      "Core operational principles and structural boundaries",
      "Execution invariants and theoretical foundations"
    ],
    importantDefinitions: notesResult.importantDefinitions || [],
    formulas: notesResult.formulas || [],
    examFocusedPoints: notesResult.examFocusedPoints || [],
    memoryShortcuts: notesResult.memoryShortcuts || [],
    codeSnippets: codeResult.length > 0 ? codeResult : undefined,
    numericals: numericalsResult.length > 0 ? numericalsResult : undefined,
    diagram: diagramResult,
  };

  return {
    notes: compiledNotes,
    quiz: {
      questions: quizResult.length > 0 ? quizResult : [
        {
          type: "mcq",
          question: `Which fundamental principle is central to ${chapterTitle}?`,
          options: [
            "Conservation of state invariants",
            "Arbitrary execution decoupling",
            "Unconstrained memory allocation",
            "Linear scalar decomposition"
          ],
          correctAnswer: "Conservation of state invariants",
          explanation: "State invariant conservation ensures deterministic execution across system boundaries."
        }
      ],
    },
  };
}
