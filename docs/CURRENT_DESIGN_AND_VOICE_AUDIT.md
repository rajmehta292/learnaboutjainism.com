# Current Design and Voice Audit

**Date:** July 2026
**Objective:** Transform the initial prototype into a calm, beautiful, deeply usable, source-first Jain learning library.

## Initial State & Issues Identified

### Visual & Architectural Overcrowding
*   The original homepage presented a 4-box grid resembling a generic dashboard or a tech startup's landing page rather than a sacred or scholarly resource.
*   The Ontology page attempted to render all 1,600+ JSON topics simultaneously, causing the browser to lock up and creating an overwhelming "warehouse inventory" feel.
*   Cards were heavily nested, used excessive borders, and sometimes employed generic glowing hover effects.
*   Internal database IDs (e.g., `D05.T010`) were prominently displayed in UI elements and URLs, making the site feel like an administrative portal.

### Writing & Voice Mismatch
*   There were instances of promotional or dramatic religious language (e.g., "Unlock ancient wisdom," "Transform your life").
*   The AI assistant was positioned with inappropriate authority ("JainGPT") rather than as a quiet retrieval tool.
*   Certain sections mixed lay and monastic practices without providing sufficient context or warnings regarding health and safety (e.g., extreme fasting).

## Principles Established for the Redesign

To correct these issues, the following principles were established and implemented:

### 1. The Voice: Patient Teacher + Careful Librarian + Welcoming Host
*   The site must sound calm, clear, warm, specific, and respectful.
*   It must attribute claims (e.g., "Jain texts describe...").
*   It must never act as a religious authority, guru, or Maharaj Saheb.

### 2. The Metaphor: The Quiet Courtyard and The Library
*   **Restraint and Whitespace:** Content must have room to breathe. Use an 8px spacing rhythm with generous vertical margins (96–128px between major sections).
*   **Warm Palette:** The interface is built on warm neutrals—Marble Canvas (`#F6F3EC`), Paper Surface (`#FCFAF5`), and Temple Ink (`#2E2C28`)—avoiding stark pure whites and pure blacks. Neon colors and artificial glows are prohibited.
*   **Typography:** A robust serif (`Cormorant Garamond` and `Source Serif 4`) handles reading and long-form text, while a clean sans-serif (`Inter`) is used strictly for metadata and navigation.

### 3. Structural Adjustments
*   **Homepage:** Rewritten to offer clear, intentional entry points (Foundations, Primary Sources, Learning Paths) rather than a raw database dump.
*   **Library Navigation:** The 1,600+ topic ontology was refactored into a grouped accordion list organized by domain. This restored performance and made the library navigable by humans.
*   **Topic Pages:** URLs and headers were cleaned to remove internal IDs. Topics now have proper semantic structure, breadcrumbs, and clear hierarchical relationships.
*   **Practice (Āradhana):** A dedicated section was created to cleanly separate daily practice (Navkar Mantra, Pratikraman, Paryushana) from academic ontology, presenting practices without pressure or gamification.

### 4. SmartLinker and Tooltips
*   Cross-linking definitions are now constrained to the *first* occurrence of a term per paragraph.
*   Hover states open a non-intrusive, styled tooltip rather than forcing a page navigation immediately, improving reading flow.

## AI Repositioning
*   The AI feature has been conceptually reframed from an oracle ("JainGPT") to a search and retrieval assistant ("Ask the Library").
*   Its role is to locate primary passages, summarize traditional commentaries, and link to verified sources within the corpus—never to issue rulings or offer spiritual advice.

## Conclusion
The redesign successfully shifts the tone from a crowded digital tool to a calm, respectful, living archive. Future expansions (especially regarding AI content generation) must adhere strictly to these principles, ensuring that technology remains invisible while the texts and teachings remain central.
