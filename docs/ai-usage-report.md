# AI Usage Report

**Project:** 202265440-Abdullah-Alzahrani-assignment2  
**Author:** Abdullah Alzahrani | 202265440  
**Course:** SWE Foundation — Assignment 2

---

## Overview

This report documents how I used AI tools throughout Assignment 2. All AI-generated content was reviewed, understood, tested, and modified before being included in the final submission.

---

## AI Tools Used

### 1. Claude (Anthropic)

**Used for:** Architecture planning, code review, documentation writing, debugging

**How I used it:**
- Discussed the overall feature plan before writing any code — specifically how to structure the filter/search system so both work together on one `filterProjects()` function rather than two separate functions.
- Asked for best practices for the GitHub API integration, particularly around error handling and loading state UX patterns.
- Used it to review my form validation logic and identify edge cases I hadn't considered (e.g., the minimum character length rules, live error clearing).
- Used it to help structure the technical documentation — I provided the feature list and it helped me expand it into proper documentation format. I then rewrote sections to reflect my own understanding.

**What I modified/learned:**
- The initial API fetch function Claude suggested used a single `try/catch` that showed a red error screen. I changed this to a fallback approach that shows static repo data instead — so the section is never empty and the UX remains smooth.
- Learned how `IntersectionObserver` works and why it's better than a scroll event listener for reveal animations. I understood the threshold parameter and why I set it to `0.12` (triggers when 12% of the element is visible).
- Understood how CSS custom properties cascade from `:root` to `[data-theme="dark"]` — I could explain this in a test.

---

### 2. GitHub Copilot (in VS Code)

**Used for:** Code completion, repetitive boilerplate

**How I used it:**
- Autocompleted repetitive HTML structure for project cards (after writing the first card manually).
- Suggested the `aria-describedby` attribute pattern for linking form inputs to their error message spans — I accepted this because it improved accessibility.
- Helped write the CSS `@keyframes fadeUp` animation — I accepted it and adjusted the timing values.

**What I modified:**
- Copilot suggested a longer animation duration (0.6s). I shortened it to 0.4s to match the rest of the site's transition timing.
- Copilot's initial filter suggestion used `indexOf` — I updated it to use `includes()` for cleaner, more readable code.

---

## What I Did Without AI

- All HTML structure was written manually
- The overall design system (color palette, typography selection, spacing scale) was my own decision
- The folder structure and naming was my own decision
- The choice of which interactive features to build was my own decision
- Project descriptions are based on my actual work
- All final testing and debugging was done manually in the browser

---

## Benefits of Using AI

- Saved time on boilerplate and documentation formatting
- Helped me think through edge cases I would have missed (empty states, fallback data, aria attributes)
- Explained browser APIs (`IntersectionObserver`, `localStorage`) in a way that helped me understand them, not just use them

## Challenges

- AI-generated code sometimes had to be adapted significantly — for example, the GitHub section initially had no fallback and would show a broken error UI if the API rate-limited. I redesigned this flow.
- AI suggestions for CSS were sometimes over-engineered — I simplified several sections to keep the stylesheet readable.

---

## Responsible Use Statement

I used AI as a learning and productivity tool, not as a replacement for understanding. I can explain every line of code in this project. Any AI-generated code that I did not fully understand was either rewritten or removed.
