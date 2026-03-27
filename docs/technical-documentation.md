# Technical Documentation

**Project:** 202265440-Abdullah-Alzahrani-assignment2  
**Author:** Abdullah Alzahrani | 202265440  
**Course:** SWE Foundation — Assignment 2

---

## Architecture Overview

The project is a **client-side static web application** built with plain HTML, CSS, and JavaScript. There is no backend, no build tool, and no external framework dependency. All functionality runs in the browser.

```
Browser
  └── index.html          (structure)
      ├── css/styles.css  (presentation)
      └── js/script.js    (behavior)
            ├── Theme system
            ├── Scroll reveal
            ├── Project filter + search
            ├── GitHub API integration
            └── Form validation
```

---

## Feature Implementation Details

### 1. Theme Toggle (localStorage)

**File:** `js/script.js` — Lines 14–35

The theme system uses CSS custom properties (`--bg`, `--text`, `--accent`, etc.) defined in two blocks: `:root` (light) and `[data-theme="dark"]` (dark). JavaScript toggles the `data-theme` attribute on `<html>`.

User preference is saved to `localStorage` under the key `portfolio-theme` so the theme persists across browser sessions.

On page load, the system checks:
1. `localStorage` for a saved preference
2. `window.matchMedia('(prefers-color-scheme: dark)')` as a fallback

```javascript
function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
```

---

### 2. Scroll Reveal Animations (IntersectionObserver)

**File:** `js/script.js` — Lines 39–49  
**File:** `css/styles.css` — `.reveal`, `.reveal.visible` classes

Elements marked with the `.reveal` CSS class start invisible (`opacity: 0`, `transform: translateY(28px)`). An `IntersectionObserver` watches them and adds `.visible` when they enter the viewport, triggering a CSS transition.

This approach is **performant** — it uses no `setInterval` or scroll event listeners, and each element is unobserved after it becomes visible.

```javascript
const revealObserver = new IntersectionObserver(
    entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target); // stop watching
        }
    }),
    { threshold: 0.12 }
);
```

---

### 3. Project Filter & Search

**File:** `js/script.js` — Lines 52–82

Each project `<article>` has a `data-tags` attribute (e.g., `data-tags="figma uml"`). Filter buttons set the active filter category, and the search input captures a text query. Both run through a single `filterProjects()` function that:

1. Checks if the card's `data-tags` includes the active filter
2. Checks if the card's text content includes the search query
3. Toggles the `.hidden-card` class (CSS: `display: none`)
4. Shows/hides an empty-state message based on visible count

This provides **two independent dimensions of filtering** that work together.

---

### 4. GitHub API Integration

**File:** `js/script.js` — Lines 85–140  
**Endpoint:** `https://api.github.com/users/AbdullahAlzahrani/repos?sort=updated&per_page=6`

The section follows a strict **loading → success/error → empty** state machine:

| State | Element shown |
|---|---|
| Fetching | `#github-loading` (spinner) |
| Success with data | `#github-grid` (repo cards) |
| No repos found | `#github-empty` |
| Network/API error | Fallback static data is shown; no broken UI |

Forked repositories are filtered out using `repo.fork === false` to only show original work.

**Error handling strategy:** Rather than showing a red error screen, the app falls back to static placeholder repo data so the section always has meaningful content. A `console.warn` records the failure for debugging.

---

### 5. Contact Form Validation

**File:** `js/script.js` — Lines 143–210

The form uses `novalidate` on the `<form>` element to disable native browser validation, giving full control to custom JavaScript validation.

**Validation rules:**

| Field | Rules |
|---|---|
| Name | Required, minimum 2 characters |
| Email | Required, must match email regex pattern |
| Message | Required, minimum 10 characters |

**UX considerations:**
- Errors appear inline below each field
- Errors clear immediately as the user types (live feedback)
- Submit button is disabled and shows "Sending…" during the simulated submission
- On success, the form hides and a green confirmation message appears
- All error/success elements use `role="alert"` and `aria-live="polite"` for screen reader accessibility

---

## CSS Architecture

Styles are organized into logical sections:

1. CSS Custom Properties (variables)
2. Reset & base styles
3. Utility classes
4. Reveal animations
5. Header & navigation
6. Buttons
7. Hero section
8. Section layout
9. About section
10. Filter & search
11. Project grid
12. GitHub API section
13. Contact form
14. Footer
15. Responsive breakpoints

**Breakpoints:**
- `960px` — 2-column → 1-column hero and about; 3-col grid → 2-col
- `680px` — Mobile: hide nav links, 1-column grids

---

## Browser Compatibility

Tested and functional in:

| Browser | Version | Status |
|---|---|---|
| Chrome | 120+ | ✅ Full support |
| Firefox | 120+ | ✅ Full support |
| Safari | 17+ | ✅ Full support |
| Edge | 120+ | ✅ Full support |
| Mobile Safari (iOS) | 17+ | ✅ Full support |
| Chrome Android | 120+ | ✅ Full support |

APIs used (`IntersectionObserver`, `localStorage`, `fetch`, CSS custom properties) are all **baseline-supported** in all modern browsers.

---

## Performance Optimizations

- Images use `loading="lazy"` to defer off-screen image loading
- `IntersectionObserver` is used instead of scroll event listeners (no layout thrashing)
- Google Fonts are loaded with `rel="preconnect"` for faster DNS resolution
- No external JavaScript libraries or frameworks (zero JS bundle overhead)
- CSS transitions use `transform` and `opacity` only (GPU-composited, no repaints)

---

## Accessibility

- All images have descriptive `alt` attributes
- Form inputs have associated `<label>` elements
- Error messages use `role="alert"` and `aria-live="polite"`
- Form inputs use `aria-describedby` linking to their error spans
- Theme toggle has a descriptive `aria-label`
- Navigation links are in a `<ul>` with `role="list"`
- Color contrast meets WCAG AA standards in both light and dark themes
- The site is keyboard-navigable (tab order follows visual order)
