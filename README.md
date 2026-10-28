# 🕯️ LUMINA

<div align="center">
  <h3>Turn raw lectures into enduring academic mastery.</h3>
  <p>An archival, 3D-bound illuminated workspace powered by open-source intelligence and zero-key local synthesis.</p>

  [![Next.js](https://img.shields.io/badge/Next.js-16_%7C_Turbopack-000000?style=for-the-badge&logo=next.js&logoColor=white)](#)
  [![Groq](https://img.shields.io/badge/Groq_LPU-500+_tok/s-F55036?style=for-the-badge&logo=fastapi&logoColor=white)](#)
  [![Ollama](https://img.shields.io/badge/Ollama-Zero_Keys_Local-FFFFFF?style=for-the-badge&logo=ollama&logoColor=black)](#)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](#)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-Tactile_3D-E10098?style=for-the-badge&logo=framer&logoColor=white)](#)
</div>

---

## 📖 Overview

**Lumina** reimagines lecture summarization through the physical metaphor of a luxury illuminated manuscript. Built with an obsidian archival aesthetic, interactive 3D cover tilt, floating dust motes, and cursor-following hairline spotlight borders, Lumina transforms dense lecture PDFs, documents, or raw notes into a multi-spread academic tome.

Under the hood, Lumina pairs a **parallel multi-agent intelligence pipeline** (Groq LPU open-source models & local Ollama) with a **pure-JavaScript local synthesizer** that runs in ~50ms with **zero external API keys**.

---

## ✨ Key Features

### 📚 1. Tactile 3D Archival Tome
* **180° Double-Page Spreads**: Smooth page-turning transitions powered by Framer Motion and procedural marble textures.
* **Interactive 3D Cover Physics**: Gyroscopic tilt reacting dynamically to mouse movement.
* **Spotlight Hairline Borders**: 21st.dev-inspired cursor-following radial masks along 1px gold hairline borders.
* **Tactile Audio Feedback**: Synthesized Web Audio parchment page flips and seal strikes.
* **Fluid Responsive Geometry**: Adapts seamlessly from 1440px desktop workstations down to 375px mobile screens.

### 🧠 2. Specialized Academic Breakdown
* **Executive Summary & Key Concepts**: Extractive semantic ranking distilling foundational invariants and principles.
* **`</> Code` Terminal**: Identifies algorithms and data structures, highlights syntax, provides one-click copy, and automatically calculates **Big-O time and space complexity**.
* **Worked Numerical Derivations**: Parses mathematical parameters, physics units (`eV`, `ns`, `m/s`, `Hz`), and formats step-by-step boxed derivation cards.
* **Mermaid Architecture Flowcharts**: Generates clean, topological concept hierarchy maps.
* **Adaptive Practice Quiz**: 5-question examination (MCQs, True/False, and Short Answer) with immediate scoring, rationale, and feedback.

### 📄 3. In-Memory PDF Processing & Print Export
* **Pure-JS Serverless PDF Parsing**: In-memory text extraction via `unpdf` with zero native dependencies or binary bloat.
* **Distraction-Free PDF Export**: Client-side compiled PDF notebook binding executive notes, code routines, numerical solutions, and practice quizzes for offline mastery.

---

## ⚡ 3 Flexible Execution Modes

Lumina is designed to work anywhere—from a completely offline airplane mode to high-speed cloud serverless:

| Execution Mode | API Key Needed? | Where It Runs | Response Latency | Ideal For |
| :--- | :--- | :--- | :--- | :--- |
| **1. Built-in Local Engine** *(Default)* | **None (0 keys)** | In-memory on client / Vercel | **~50 ms** | Zero-setup, instant offline execution |
| **2. Groq Cloud Open-Source** | Free Key (`gsk_...`) | Cloud LPUs (Llama 3.3 & Qwen) | **~1 - 3 sec** | Live production hosting on Vercel |
| **3. Local Ollama LLMs** | **None (0 keys)** | Your computer's CPU/GPU | **~2 - 5 sec** | 100% private local neural network execution |

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18.0.0 or higher)
* `npm` or `pnpm`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/pragyanguwahati-lgtm/Lumina.git
   cd Lumina
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment (Optional):**
   Lumina works **out of the box with zero keys**! If you want to enable cloud open-source LLMs or local Ollama, create a `.env.local` file:

   ```bash
   # Option A: Groq Cloud Open-Source (Recommended for Vercel)
   GROQ_API_KEY=gsk_your_free_groq_key_here

   # Option B: Local Ollama (Zero API keys, runs on your GPU)
   # USE_OLLAMA=true
   # OLLAMA_BASE_URL=http://127.0.0.1:11434
   ```

4. **Launch development server:**
   ```bash
   npm run dev
   ```

5. **Open Lumina:**
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🌐 Deploying to Vercel

Lumina is optimized for free Vercel serverless deployment:

1. Push your repository to GitHub.
2. Import the project in your [Vercel Dashboard](https://vercel.com/new).
3. In **Project Settings → Environment Variables**, add:
   * **`GROQ_API_KEY`**: `your_free_key_from_console.groq.com`
4. Click **Deploy**.

> **Note:** If no `GROQ_API_KEY` is provided, Lumina automatically falls back to its built-in JavaScript synthesis engine with zero configuration.

---

## 🔬 Multi-Agent Orchestrator Architecture

When cloud or Ollama inference is enabled, Lumina runs a parallel 6-agent delegation graph:

```
                  ┌──────────────────────┐
                  │    Uploaded PDF      │
                  └──────────┬───────────┘
                             │ (unpdf in-memory)
                             ▼
                  ┌──────────────────────┐
                  │   Delegator Agent    │
                  └──────────┬───────────┘
                             │
     ┌───────────────────────┼───────────────────────┐
     ▼                       ▼                       ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Conceptual  │     │     Code     │     │  Numericals  │
│  Notes Agent │     │  Specialist  │     │  Specialist  │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       ├────────────────────┴────────────────────┤
       ▼                                         ▼
┌──────────────┐                          ┌──────────────┐
│   Diagram    │                          │     Quiz     │
│  Specialist  │                          │  Assessment  │
└──────┬───────┘                          └──────┬───────┘
       │                                         │
       └────────────────────┬────────────────────┘
                            ▼
              ┌───────────────────────────┐
              │    Compiled Archival      │
              │       Master Tome         │
              └───────────────────────────┘
```

* **Delegator Agent**: Analyzes document layout, extracts refined chapter titles, and flags code/numerical domains.
* **Conceptual Notes Agent**: Distills executive summaries, core principles, definitions, formulas, and mnemonic shortcuts.
* **Code & Algorithm Specialist**: Synthesizes clean implementations and audits Big-O time and space complexity.
* **Math & Numericals Specialist**: Isolates variables, identifies governing formulas, and formats step-by-step derivations.
* **Visual Diagram Specialist**: Generates valid topological Mermaid.js flowchart hierarchies.
* **Assessment & Quiz Agent**: Drafts a rigorous 5-question examination with diagnostic rationale.

---

## 🧪 Testing

Lumina includes an automated Jest and React Testing Library suite verifying navigation, accessibility, and component rendering:

```bash
# Run unit tests
npm test

# Run TypeScript type safety check
npx tsc --noEmit
```

---

## 🛠️ Tech Stack

* **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
* **Styling & Design System**: Vanilla CSS tokens, Tailwind CSS, custom marble SVGs
* **Animation**: [Framer Motion](https://www.framer.com/motion/) (3D perspective transforms, tactile page flips)
* **LLM Engine**: [Groq](https://groq.com/) (`openai/gpt-oss-120b`, `qwen/qwen3.8-27b`), [Ollama](https://ollama.ai/), and built-in pure-JS synthesizer
* **PDF Extraction**: [`unpdf`](https://github.com/unjs/unpdf) (Pure JavaScript, serverless-native)
* **PDF Export**: [`@react-pdf/renderer`](https://react-pdf.org/)
* **Diagrams**: [Mermaid.js](https://mermaid.js.org/)
* **Typography**: Cormorant Garamond, Inter, JetBrains Mono

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for details.
