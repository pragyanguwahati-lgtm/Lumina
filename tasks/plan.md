# Implementation Plan: Lumina Book-Style Multi-Page Experience & Page Flip Animations

## Overview
Overhaul the Lumina application from a single vertical continuous scrolling page into a cohesive, tactile **open-book experience** matching the visual aesthetic and interaction flow shown in ok_NICE_now_i_want_to_extend.mp4.

## Architecture Decisions
- Centralize book state (currentPage, flipDirection, file, generatedData, isTransforming) in BookContext.
- Replace vertical scrolling sections with a two-page notebook layout with 3D page flip animations powered by Framer Motion.
- Top book edge tabs (UPLOAD, NOTES, QUIZ, EXPORT) allow instant flipping between pages.
- When an archival file is uploaded, show the signature fountain pen and scanning animation, then trigger an automatic realistic page flip directly into the generated Summary (Notes) page.

## Task List

### Phase 1: Foundations & Book Model
- [ ] Task 1.1: Configure 3D transforms, notebook styling, ruled paper & leather book styles in src/app/globals.css.
- [ ] Task 1.2: Create src/context/BookContext.tsx with stage definitions and state management.

### Checkpoint: Foundation
- [ ] App compiles cleanly with new CSS tokens and context.

### Phase 2: Cover & 3D Page Turn Engine
- [ ] Task 2.1: Build BookCover.tsx with dark marble texture, gold foil typography, and opening transition.
- [ ] Task 2.2: Build BookLayout.tsx with two-page spread, spine depth, and 3D page flip effect.
- [ ] Task 2.3: Integrate book top tabs navigation (UPLOAD, NOTES, QUIZ, EXPORT).

### Checkpoint: Cover & Navigation
- [ ] Book opens smoothly from cover to notebook spread.
- [ ] Navigation tabs flip between mock pages.

### Phase 3: Upload Spread & Fountain Pen Animation
- [ ] Task 3.1: Create BookUploadPage.tsx with left ruled notebook sheet and right deposit area.
- [ ] Task 3.2: Implement fountain pen writing/signing animation and scan progress indicator during document processing.
- [ ] Task 3.3: Trigger automatic page turn from Upload to Notes once generation completes.

### Checkpoint: Upload Flow
- [ ] Uploading a document triggers fountain pen animation and scan progress.
- [ ] Completing generation turns page to Notes automatically.

### Phase 4: Notes, Quiz & Export Spreads
- [ ] Task 4.1: Implement BookNotesPage.tsx with chapter summary and keyed keywords layout.
- [ ] Task 4.2: Implement BookQuizPage.tsx with academic journal exam formatting and interactive questions.
- [ ] Task 4.3: Implement BookExportPage.tsx with PDF icon and animated download button.

### Checkpoint: Spreads Complete
- [ ] All four core pages render correctly within the book spreads.

### Phase 5: Verification & Polish
- [ ] Task 5.1: Run Jest unit tests and update tests for new navigation and page states.
- [ ] Task 5.2: Test build (npm run build) for clean compilation.
- [ ] Task 5.3: Verify interactive experience against ok_NICE_now_i_want_to_extend.mp4.
