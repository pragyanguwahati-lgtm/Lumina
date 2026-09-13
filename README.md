# 🕯️ LUMINA

<div align="center">
  <p><strong>Turn raw lectures into mastery. An AI-powered, cinematic workspace for students.</strong></p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-16+-black?style=for-the-badge&logo=next.js)](#)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](#)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-E10098?style=for-the-badge&logo=framer)](#)
  [![Gemini AI](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google)](#)
</div>

---

## 📖 About The Project

**LUMINA** is a premium, Awwwards-inspired educational platform designed to help students extract high-yield knowledge from their study materials. By simply dragging and dropping a lecture document, LUMINA uses Google's Gemini 3.5 Flash AI to instantly synthesize the material into comprehensive **Revision Notes**, a **Practice Quiz**, and a beautifully bound **PDF Export**.

Designed with deep focus in mind, the UI features a "late-night study" aesthetic—blending analog film grain, faint graph paper, and a cozy cinematic desk-lamp glow to create a mesmerizing but distraction-free environment.

### ✨ Features
- **Cinematic Workflow**: Smooth, framer-motion powered transitions that make interacting with the app feel like magic.
- **Instant Synthesis**: Automatically extracts Executive Summaries, Key Concepts, Definitions, Formulas, and Memory Shortcuts.
- **Interactive Quizzing**: Dynamically generates MCQs, True/False, and short answer questions to test your mastery.
- **One-Click Export**: Binds your generated notes into a clean, distraction-free PDF for offline studying.
- **Deep Focus UI**: A dark-mode exclusive, archival-paper aesthetic built to reduce eye strain and keep you in the flow.

---

## 🚀 Live Demo

*(Vercel deployment link coming soon)*

---

## 💻 Running Locally

To run LUMINA on your local machine, follow these steps:

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

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

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

---

## 🛠️ Built With

- **[Next.js 16](https://nextjs.org/)** (App Router & Turbopack)
- **[Google Gemini AI SDK](https://ai.google.dev/)** (`gemini-3.5-flash`)
- **[Tailwind CSS](https://tailwindcss.com/)** for styling
- **[Framer Motion](https://www.framer.com/motion/)** for cinematic animations
- **[@react-pdf/renderer](https://react-pdf.org/)** for client-side PDF generation
- **[Lenis](https://lenis.studiofreight.com/)** for buttery smooth scrolling

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
