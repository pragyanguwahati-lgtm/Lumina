"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { GeneratedData } from "@/types";

export type BookPage = "upload" | "notes" | "quiz" | "export";

interface BookContextType {
  isBookOpen: boolean;
  currentPage: BookPage;
  flipDirection: "next" | "prev";
  uploadedFile: File | null;
  uploadedText: string;
  generatedData: GeneratedData | null;
  isTransforming: boolean;
  uploadProgress: number;
  soundEnabled: boolean;

  openBook: () => void;
  closeBook: () => void;
  turnToPage: (page: BookPage) => void;
  setUploadedFile: (file: File | null) => void;
  setUploadedText: (text: string) => void;
  setGeneratedData: (data: GeneratedData | null) => void;
  setIsTransforming: (val: boolean) => void;
  setUploadProgress: React.Dispatch<React.SetStateAction<number>>;

  toggleSound: () => void;
  playTactileSound: (type?: "open" | "page" | "select") => void;
  resetBook: () => void;
  loadSampleLecture: () => void;
}

export const SAMPLE_GENERATED_DATA: GeneratedData = {
  notes: {
    chapterTitle: "Quantum Mechanics & Wavepacket Dynamics",
    executiveSummary: "A rigorous mathematical derivation of Schrödinger's wave formulation, probability conservation, and localized wavepacket transmission across finite potential barriers.",
    keyConcepts: [
      "Superposition Principle: Linear combination of orthogonal eigenstates defines the total system state Ψ(x, t).",
      "Heisenberg Uncertainty Relation: Canonical conjugate observables obey Δx · Δp ≥ ℏ/2 fundamentally.",
      "Probability Current Density: Continuity equation guarantees conservation of quantum probability flux across interfaces.",
      "Stationary States: Energy eigenstates with constant spatial probability density |ψ(x)|² and harmonic phase factor e^(-iEt/ℏ)."
    ],
    importantDefinitions: [
      {
        term: "Wavefunction Collapse",
        definition: "The discontinuous reduction of a quantum state superposition into a single discrete eigenstate upon measurement interaction."
      },
      {
        term: "Quantum Tunneling",
        definition: "Finite transmission probability of a wavepacket penetrating a barrier whose potential energy exceeds particle total energy."
      },
      {
        term: "Hermitian Operator",
        definition: "A self-adjoint linear operator in Hilbert space with strictly real eigenvalues representing physical observables."
      }
    ],
    formulas: [
      { name: "Time-Dependent Schrödinger Equation", formula: "iℏ ∂Ψ/∂t = ĤΨ" },
      { name: "Probability Flux J(x, t)", formula: "J = (ℏ / 2mi) [ Ψ* ∇Ψ - Ψ ∇Ψ* ]" },
      { name: "De Broglie Relation", formula: "λ = h / p = 2π / k" }
    ],
    examFocusedPoints: [
      "Derive continuity equation ∇·J + ∂P/∂t = 0 from Schrödinger's equation directly.",
      "Verify normalization ∫|Ψ|² dx = 1 before calculating expectation values <x> or <p>.",
      "Remember: Phase velocity v_p = ω/k differs from packet group velocity v_g = dω/dk."
    ],
    memoryShortcuts: [
      "Rule of ℏ/2: Commutator [x̂, p̂] = iℏ directly dictates the ℏ/2 minimum uncertainty bound.",
      "Parity check: Symmetric potentials strictly yield alternating even and odd parity eigenfunctions."
    ],
    codeSnippets: [
      {
        language: "python",
        title: "Wavepacket Crank-Nicolson Time Stepping",
        code: `import numpy as np\n\ndef simulate_wavepacket(N=1000, dt=0.01, dx=0.1):\n    # Discrete spatial grid and Hamiltonian tridiagonal matrix\n    x = np.linspace(-50, 50, N)\n    psi_0 = np.exp(-(x**2) / 4) * np.exp(1j * 5 * x)\n    # Normalization\n    psi_0 /= np.sqrt(np.sum(np.abs(psi_0)**2) * dx)\n    return x, psi_0`,
        explanation: "Discretizes the 1D Schrödinger PDE using unitary Crank-Nicolson implicit stepping preserving norm probability ∫|Ψ|²dx = 1.",
        complexity: "Time: O(N) per step via Thomas algorithm, Space: O(N)"
      }
    ],
    numericals: [
      {
        title: "Tunneling Transmission Coefficient Calculation",
        problemStatement: "An electron with energy E = 2.0 eV encounters a rectangular barrier of height V₀ = 5.0 eV and width L = 0.50 nm. Calculate the transmission coefficient T.",
        formulaUsed: "T ≈ 16(E/V₀)(1 - E/V₀) e^(-2κL), where κ = √(2m(V₀ - E)) / ℏ",
        stepByStepSolution: [
          "Step 1: Calculate energy difference: V₀ - E = 5.0 eV - 2.0 eV = 3.0 eV = 4.806 × 10^(-19) J",
          "Step 2: Attenuation constant: κ = √(2 · 9.109×10^(-31) kg · 4.806×10^(-19) J) / (1.055×10^(-34) J·s) = 8.87 × 10^9 m^(-1)",
          "Step 3: Exponent factor: 2κL = 2 · (8.87 × 10^9) · (0.50 × 10^(-9)) = 8.87",
          "Step 4: Prefactor: 16 · (2/5) · (1 - 2/5) = 16 · 0.4 · 0.6 = 3.84",
          "Step 5: Compute T: T = 3.84 · e^(-8.87) = 3.84 · 1.405 × 10^(-4) = 5.40 × 10^(-4)"
        ],
        finalAnswer: "T = 5.40 × 10^(-4) (0.054% probability)"
      }
    ],
    diagram: {
      title: "Wavepacket Barrier Interaction Pipeline",
      type: "flowchart",
      mermaidCode: `graph LR\n  Incident[Incident Wave e^ikx] --> Barrier[Barrier Interface x=0]\n  Barrier --> Reflected[Reflected Flux R]\n  Barrier --> Evanescent[Decaying Wave e^-κx]\n  Evanescent --> Transmitted[Transmitted Wave T e^ikx]`,
      caption: "Quantum flux split across a finite rectangular potential barrier."
    }
  },
  quiz: {
    questions: [
      {
        type: "mcq",
        question: "Which mathematical condition guarantees that the eigenvalues of an observable operator are strictly real?",
        options: [
          "The operator must be Unitary (Û†Û = I)",
          "The operator must be Hermitian (Ĥ = Ĥ†)",
          "The operator must commute with the Hamiltonian ([Â, Ĥ] = 0)",
          "The operator must be anti-symmetric"
        ],
        correctAnswer: "The operator must be Hermitian (Ĥ = Ĥ†)",
        explanation: "Hermitian (self-adjoint) operators have spectral decompositions with strictly real eigenvalues, which correspond to physically measurable experimental outcomes."
      },
      {
        type: "mcq",
        question: "In the case of a particle colliding with a 1D rectangular barrier (E < V₀), how does the wavefunction behave inside the barrier?",
        options: [
          "It drops abruptly to zero at the boundary",
          "It oscillates with doubled frequency",
          "It decays exponentially as e^(-κx)",
          "It forms an infinite standing wave"
        ],
        correctAnswer: "It decays exponentially as e^(-κx)",
        explanation: "For E < V₀, the wave vector κ = √(2m(V₀ - E))/ℏ becomes real, resulting in an evanescent exponentially decaying solution rather than sinusoidal oscillations."
      },
      {
        type: "tf",
        question: "True or False: The spatial probability density P(x) of a stationary state changes dynamically with time.",
        options: ["True", "False"],
        correctAnswer: "False",
        explanation: "In a stationary state Ψ(x,t) = ψ(x)e^(-iEt/ℏ), the time-dependent phase factors cancel when computing |Ψ(x,t)|² = |ψ(x)|², remaining completely static in time."
      },
      {
        type: "short",
        question: "State the physical significance of the Born interpretation of the wavefunction.",
        correctAnswer: "The square modulus of the wavefunction |Ψ(r, t)|² represents the probability density of finding the particle at position r at time t.",
        explanation: "Max Born established that quantum mechanics predicts probabilities rather than deterministic classical trajectories, foundational to modern physics."
      }
    ]
  }
};

const BookContext = createContext<BookContextType | undefined>(undefined);

const PAGE_ORDER: BookPage[] = ["upload", "notes", "quiz", "export"];

export function BookProvider({ children }: { children: React.ReactNode }) {
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<BookPage>("upload");
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedText, setUploadedText] = useState<string>("");
  const [generatedData, setGeneratedData] = useState<GeneratedData | null>(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const playTactileSound = (type: "open" | "page" | "select" = "page") => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;
      const audioCtx = new AudioCtxClass();

      if (type === "open") {
        // Deep warm resonant leather/tome opening sound
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(140, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(55, audioCtx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.36);
      } else if (type === "select") {
        // High delicate chime
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(987, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.13);
      } else {
        // Parchment / page rustle
        const bufferSize = audioCtx.sampleRate * 0.18;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
        }

        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;

        const filter = audioCtx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(1100, audioCtx.currentTime);
        filter.Q.setValueAtTime(2, audioCtx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(350, audioCtx.currentTime + 0.18);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.09, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
        noise.start();
      }
    } catch {
      // Audio playback fails silently if blocked by browser policy
    }
  };

  const openBook = () => {
    if (isBookOpen) return;
    playTactileSound("open");
    setIsBookOpen(true);
  };

  const closeBook = () => {
    playTactileSound("open");
    setIsBookOpen(false);
  };

  const turnToPage = (newPage: BookPage) => {
    if (newPage === currentPage && isBookOpen) return;
    const currentIndex = PAGE_ORDER.indexOf(currentPage);
    const newIndex = PAGE_ORDER.indexOf(newPage);
    setFlipDirection(newIndex > currentIndex ? "next" : "prev");
    playTactileSound("page");
    if (!isBookOpen) {
      setIsBookOpen(true);
    }
    setCurrentPage(newPage);
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const loadSampleLecture = () => {
    setGeneratedData(SAMPLE_GENERATED_DATA);
    setIsBookOpen(true);
    setCurrentPage("notes");
    playTactileSound("page");
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const shouldOpen = params.get("open") === "1" || Boolean(params.get("page"));
    const pageParam = params.get("page") as BookPage;
    const hasSample = params.get("sample") === "1";

    if (hasSample || (pageParam && pageParam !== "upload")) {
      setGeneratedData(SAMPLE_GENERATED_DATA);
    }
    if (pageParam && PAGE_ORDER.includes(pageParam)) {
      setCurrentPage(pageParam);
    }
    if (shouldOpen) {
      setIsBookOpen(true);
    }
  }, []);

  const resetBook = () => {
    setIsBookOpen(false);
    setCurrentPage("upload");
    setFlipDirection("prev");
    setUploadedFile(null);
    setUploadedText("");
    setGeneratedData(null);
    setIsTransforming(false);
    setUploadProgress(0);
  };

  return (
    <BookContext.Provider
      value={{
        isBookOpen,
        currentPage,
        flipDirection,
        uploadedFile,
        uploadedText,
        generatedData,
        isTransforming,
        uploadProgress,
        soundEnabled,
        openBook,
        closeBook,
        turnToPage,
        setUploadedFile,
        setUploadedText,
        setGeneratedData,
        setIsTransforming,
        setUploadProgress,
        toggleSound,
        playTactileSound,
        resetBook,
        loadSampleLecture,
      }}
    >
      {children}
    </BookContext.Provider>
  );
}

export function useBook() {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("useBook must be used within a BookProvider");
  }
  return context;
}
