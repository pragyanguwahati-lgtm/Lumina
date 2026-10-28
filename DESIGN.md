# Design System Specification: Lumina (Dark Archival & Gilded Tome)

## 1. Identity & Archetype
- **Archetype**: Bespoke Obsidian & Gilded Archival (inspired by `lumina-landing-v4.html`, 21st.dev spotlight mechanics, and Awwwards tactile editorial craftsmanship).
- **Core Principle**: Transform lecture materials into enduring academic mastery through the physical metaphor of a luxury illuminated manuscript.
- **Theme Mode**: Dark-first with high-contrast accessibility (WCAG 2.1 AA compliant).

## 2. Palette Tokens
```css
:root {
  --bg: #0b0a09;             /* Obsidian velvet base */
  --gold: #d6ad5f;           /* Archival gold accent */
  --gold-hi: #f6d78c;        /* Luminous gold edge highlight */
  --gold-dim: #8a6d3b;       /* Muted antique brass */
  --gold-subtle: rgba(214, 173, 95, 0.08);
  --gold-border: rgba(214, 173, 95, 0.18);
  --ivory: #ece6d8;          /* Antique parchment text */
  --mute: #8d877a;           /* Muted annotation copy */
  --page: #16140f;           /* Tome page substrate */
  --edge: #2a251b;           /* Gilded page edge */
  --success: #7fb77e;        /* Verified correct state */
  --error: #e58a7e;          /* Remediation callout */
}
```

## 3. Typographic Hierarchy
- **Display Serif**: `Cormorant Garamond` (weights 400, 500, 600)
  - Book Cover Title: `clamp(3rem, 6.4vw, 5rem)`, leading: `1.0`, letter-spacing: `0.005em`
  - Chapter Headings: `clamp(1.9rem, 3vw, 2.6rem)`, leading: `1.05`, color: `var(--gold)`
- **Body & Controls Sans**: `Inter` (weights 400, 500, 600)
  - Prose: `0.92rem` (14.7px), line-height: `1.6`, color: `var(--ivory)`
  - Micro-metadata & Tags: `0.78rem` (12.5px), tracking: `0.16em` to `0.22em`, uppercase
  - Monospace / Folio: `0.75rem` (12px), tabular numbers

## 4. Tactile & Micro-Interaction Specifications
1. **Interactive 3D Book Tilt**:
   - Closed book calculates pointer position relative to viewport center: `rotateY(dx * 9deg) rotateX(-dy * 6deg)`.
2. **21st.dev Spotlight Borders (`.ring`)**:
   - Cursor-following radial gradient masked along element hairline borders using `-webkit-mask-composite: xor`.
3. **Procedural SVG Marble Texture**:
   - Dual-octave `feTurbulence` with golden matrix filters for non-repeating natural stone binding.
4. **Metallic Sweep Sheen (`.sheen-sweep`)**:
   - Specular light streak traversing buttons and book titles on hover.
5. **Harmonic Spacing Scale**:
   - 4pt/8pt rhythm: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px.
6. **Mobile Resilience**:
   - Viewport adaptive book scale (`--h: min(660px, calc(100vh - 150px)); --w: min(calc(var(--h) * 0.76), 42vw);`). On screens <= 768px, gracefully simplifies to single-sheet focus with touch scrolling.
