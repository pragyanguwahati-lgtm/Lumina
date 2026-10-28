import { NextRequest } from "next/server";
import { runOrchestratedSynthesis } from "@/lib/agents/orchestrator";
import { synthesizeWithoutAPI } from "@/lib/agents/localSynthesizer";
import { GeneratedData } from "@/types";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const textContent = formData.get("text") as string | null;

    if (!file && (!textContent || textContent.trim().length === 0)) {
      return new Response(JSON.stringify({ error: "No lecture file or text provided" }), { status: 400 });
    }

    const hasGroq = Boolean(process.env.GROQ_API_KEY);
    const hasGemini = Boolean(process.env.GEMINI_API_KEY);
    const hasOllama = Boolean(process.env.OLLAMA_BASE_URL || process.env.USE_LOCAL_OLLAMA === "true");

    const sourceTitle = file 
      ? file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : "Computational Foundations & Architecture";

    let extractedText = textContent?.trim() || "";

    // If PDF uploaded, extract text directly in Node using unpdf (pure JS, 0 external API calls)
    if (file) {
      try {
        const buffer = await file.arrayBuffer();
        const { extractText } = await import("unpdf");
        const pdfResult = await extractText(buffer);
        const joinedText = Array.isArray(pdfResult.text) ? pdfResult.text.join("\n\n") : String(pdfResult.text || "");
        
        if (joinedText && joinedText.trim().length > 0) {
          extractedText = joinedText.trim();
        } else {
          extractedText = `Lecture title: ${sourceTitle}. Academic lecture material focusing on core principles, definitions, formulas, and practical implementations.`;
        }
      } catch (pdfErr) {
        console.warn("Direct PDF extraction notice:", pdfErr);
        extractedText = `Lecture title: ${sourceTitle}. Academic notes and assessment review.`;
      }
    }

    // ZERO-API-KEY MODE: If no LLM keys are configured, use the built-in algorithmic engine
    if (!hasGroq && !hasGemini && !hasOllama) {
      const localSynthesized = synthesizeWithoutAPI(extractedText, sourceTitle);
      return new Response(JSON.stringify(localSynthesized), {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      });
    }

    // Run parallel multi-agent synthesis pipeline (Groq Llama 3.3 / Qwen Coder, Ollama, or Gemini)
    try {
      const orchestratedData = await runOrchestratedSynthesis({
        textContent: extractedText,
        sourceTitle,
      });

      return new Response(JSON.stringify(orchestratedData), {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      });
    } catch (agentErr) {
      console.warn("Orchestrator encountered error, falling back to local algorithmic engine:", agentErr);
      const localSynthesized = synthesizeWithoutAPI(extractedText, sourceTitle);
      return new Response(JSON.stringify(localSynthesized), {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      });
    }
  } catch (error: unknown) {
    console.error("API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to process document";
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
