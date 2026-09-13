import { GoogleGenAI } from "@google/genai";
import { NextRequest } from "next/server";

export const maxDuration = 60;

// Note: Using standard generateContentStream from the GenAI SDK
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured" }), { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const buffer = await file.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString("base64");

    const prompt = `
You are an expert academic tutor. Analyze the provided lecture material and generate TWO things:
1. Comprehensive Revision Notes
2. A 5-Question Practice Quiz

Please format your entire response exactly in this JSON structure (and do NOT wrap it in markdown code blocks, just return raw JSON):

{
  "notes": {
    "chapterTitle": "string",
    "executiveSummary": "string",
    "keyConcepts": ["string"],
    "importantDefinitions": [{"term": "string", "definition": "string"}],
    "formulas": [{"name": "string", "formula": "string"}],
    "examFocusedPoints": ["string"],
    "memoryShortcuts": ["string"]
  },
  "quiz": {
    "questions": [
      {
        "type": "mcq",
        "question": "string",
        "options": ["string", "string", "string", "string"],
        "correctAnswer": "string (the exact option text)",
        "explanation": "string"
      },
      {
        "type": "tf",
        "question": "string",
        "options": ["True", "False"],
        "correctAnswer": "True or False",
        "explanation": "string"
      },
      {
        "type": "short",
        "question": "string",
        "correctAnswer": "string",
        "explanation": "string"
      }
    ]
  }
}

Ensure exactly 5 questions total: 3 MCQs, 1 TF, and 1 Short Answer.
Do not include any other text outside this JSON.
`;

    // Using gemini-3.5-flash which is fast, advanced, and supports large contexts
    const responseStream = await ai.models.generateContentStream({
      model: "gemini-3.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: base64Data,
                mimeType: file.type || "application/pdf"
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    // Create a ReadableStream to stream the Gemini response back to the client
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            if (chunk.text) {
              controller.enqueue(new TextEncoder().encode(chunk.text));
            }
          }
          controller.close();
        } catch (e) {
          console.error("Streaming error:", e);
          controller.error(e);
        }
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to process document" }), { status: 500 });
  }
}
