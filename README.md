# 202265440-Abdullah-Alzahrani-assignment2

**Abdullah Alzahrani** | Student ID: 202265440  
Software Engineering — King Fahd University of Petroleum & Minerals (KFUPM)  
Course: SWE Foundation | Assignment 2 — Interactive Features

---

## Project Description

This is the second phase of my personal portfolio website, building on Assignment 1. The goal of this assignment was to make the portfolio more **interactive, modern, and user-friendly** through JavaScript-driven dynamic features, live API integration, animations, and proper error handling.

The portfolio showcases my background, featured projects, live GitHub repositories, and a validated contact form — all with a polished dark/light theme system.

**Live Site:** *(Deploy to GitHub Pages — link will appear here once published)*

---

## Features Added in Assignment 2

| Feature | Description |
|---|---|
| **Project Filter** | Click tag buttons (Figma, Java, Design Patterns, UML) to filter projects instantly |
| **Live Search** | Type in the search bar to filter projects in real time |
| **GitHub API** | Fetches live public repositories from the GitHub API with loading/error/empty states |
| **Form Validation** | Full client-side validation on the contact form with inline error messages |
| **Scroll Reveal** | Sections animate in as the user scrolls using IntersectionObserver |
| **Theme Toggle** | Light/dark mode persisted to localStorage across sessions |
| **Responsive Design** | Works on mobile, tablet, and desktop |

---

## Folder Structure

```
202265440-Abdullah-Alzahrani-assignment2/
├── index.html                  # Main HTML file
├── README.md                   # This file
├── .gitignore
├── css/
│   └── styles.css              # All styles with CSS variables
├── js/
│   └── script.js               # All JavaScript functionality
├── assets/
│   └── Abdullah-Alzahrani-CV.pdf
└── docs/
    ├── ai-usage-report.md      # AI tools documentation
    └── technical-documentation.md  # Technical details
```

---

## Setup Instructions

### Run Locally

This is a **static website** — no build tools, no dependencies, no installation required.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Abdullah-Zh/202265440-Abdullah-Alzahrani-assignment2.git
   ```

2. **Navigate into the folder:**
   ```bash
   cd 202265440-Abdullah-Alzahrani-assignment2
   ```

3. **Open in browser:**
   - **Option A (Recommended):** Use the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in VS Code. Right-click `index.html` → "Open with Live Server".
   - **Option B:** Double-click `index.html` to open directly in your browser.
   - **Option C:** Use Python's built-in server:
     ```bash
     python3 -m http.server 8080
     # Then visit http://localhost:8080
     ```

### Deploy to GitHub Pages

1. Push the repository to GitHub.
2. Go to **Settings → Pages**.
3. Set Source to **Deploy from a branch → main → / (root)**.
4. GitHub Pages will publish the site automatically.

---

## Technologies Used

- **HTML5** — Semantic structure, accessibility attributes (ARIA roles, labels)
- **CSS3** — Custom properties (CSS variables), Flexbox, Grid, animations, media queries
- **Vanilla JavaScript (ES6+)** — No frameworks or libraries
- **GitHub REST API** — Fetches public repository data dynamically
- **Google Fonts** — DM Serif Display, DM Mono, DM Sans
- **IntersectionObserver API** — Scroll-triggered reveal animations
- **localStorage API** — Theme preference persistence

---

## AI Tools Summary

AI tools (Claude and GitHub Copilot) were used to assist with code generation, debugging, and documentation. All AI-generated content was reviewed, understood, and modified.

See **[docs/ai-usage-report.md](docs/ai-usage-report.md)** for the full report.

---

## Academic Integrity

This project was completed individually in accordance with KFUPM academic integrity policies. AI tools were used as a learning aid and are fully documented as required by the assignment guidelines.
