# Prompt Document — Claude Signal Prototype

This document catalogs the AI prompts I used to build the deployed prototype, as required by the project brief. I used Claude as my primary implementation partner for the codebase, with some cross-checking via ChatGPT for architecture decisions.

The professor's guidance was clear: use AI where it helps (like building a prototype), but do the thinking yourself. That's exactly what I did — every strategic decision, every segment call, every metric rationale, and the entire deck are my own work. This document only covers the prompts that generated code.

---

## Prompt 1: Initial Prototype Build

**What I needed:** A complete React + TypeScript + Tailwind prototype from scratch.

**The prompt:**

> Build me a React + TypeScript + Tailwind CSS prototype for "Claude Signal" — a soft verification gate for AI-generated code. Here's the full spec:
>
> Tech stack: React 18, TypeScript, Vite, Tailwind CSS v4, Framer Motion, react-syntax-highlighter, lucide-react, react-router-dom.
>
> Pages needed:
> 1. Home — landing page with hero, stats (91%, 87%, <3s), how-it-works steps, 3 demo scenario cards, 4 pillars section
> 2. Demo (/demo/:scenarioId) — mock Claude chat with typewriter code, Signal tag, expandable panel, override button
> 3. Calibration — timeline showing how signals adapt over 50+ interactions
> 4. About — research summary
>
> Design: Dark mode only (#1a1a2e background, #7c6fe0 accent). Glassmorphism navbar. Mobile responsive.
>
> The demo needs 3 pre-built scenarios:
> - Clean (green signal, all checks pass)
> - Risky (yellow signal, CVE + edge case found)
> - Unsafe (red signal, SQL injection + data leak)
>
> Progressive disclosure must work: tag → checks → detail. Override flow must show feedback. Signal tag appears AFTER typewriter code finishes. Use framer-motion for all animations. No TODOs. No placeholders. Production-ready.
>
> Deploy to Vercel.

**What happened:** This was the big bang prompt. It generated the initial scaffold, all components, routing, and mock data. I had to iterate about 8-10 times to fix animation glitches, mobile layout issues, and to get the typewriter effect smooth.

---

## Prompt 2: Smoothing the Typewriter & Animations

**The prompt:**

> The typewriter effect on the code block is choppy and causes the whole page to jank. Fix it. Also:
> - Add a subtle glow pulse animation on the Signal tag when it appears
> - The override feedback card should slide in with a spring animation, not just appear
> - Mobile nav is missing — add a hamburger menu with AnimatePresence
> - The scenario tab switcher should have an active indicator that slides between tabs
>
> Make sure all animations run at 60fps. Use framer-motion's layoutId for the tab indicator.

**What happened:** The typewriter choppiness was because react-syntax-highlighter was re-rendering on every single character. We fixed it by batching character updates. The layoutId tab indicator was a nice touch that made the UI feel polished.

---

## Prompt 3: Adding the Calibration Demo Page

**The prompt:**

> Add a /calibration page that shows how Signal adapts over time. Use a horizontal stepper with 4 steps:
> 1. First Use — full signal, default strength
> 2. Pattern Detected (~15 interactions) — "You've overridden 3 security warnings. 2 led to issues."
> 3. Calibrating (~30 interactions) — security amplified, syntax reduced
> 4. Well-Calibrated (50+) — minimal signal, only high-priority items
>
> Each step should show a mock Signal tag + panel with different content. Click through steps. Use framer-motion AnimatePresence for transitions between steps. Make it feel like a timeline, not a form wizard.

**What happened:** Worked well on first try. The stepper became one of the more impressive parts of the demo because it tells a story.

---

## Prompt 4: Visual Overhaul — Purple to Warm Amber

**The prompt:**

> I want to completely overhaul the visual design. Move away from the purple Claude look to something warmer and more premium — like Linear's UI or a Zentry clone.
>
> New palette:
> - Background: #08080a (deep charcoal)
> - Surface: #111114
> - Accent: #f5a623 (warm amber)
> - Text primary: #f0f0f5
> - Text secondary: #8a8a98
>
> Changes needed:
> - Abstract sonar pulse logo instead of robot/shield icon
> - Glass navigation with backdrop blur
> - Hero section with a subtle amber glow behind the logo
> - Staggered scroll animations on the landing page (stats, steps, demo cards, pillars)
> - All signal colors updated: green → #22c55e, yellow → #f5a623, red → #ef4444
> - Hover effects on cards: border glow with accent color
> - Update every component to match the new palette

**What happened:** This was a massive change that touched almost every file. The amber aesthetic immediately felt more premium than the original purple. The sonar pulse logo (SVG-based, no external assets) was a good call because it loads instantly and scales perfectly.

---

## Prompt 5: IDE-Style Playground with Monaco Editor

**The prompt:**

> Replace the fake code blocks with a real IDE-style playground. Requirements:
> - Monaco Editor (@monaco-editor/react) for actual code editing
> - File explorer sidebar showing multiple files
> - Tab bar showing open files with modified indicators
> - Terminal panel at the bottom showing analysis logs
> - Users can paste their own code OR load sample projects
> - Sample projects: Python Flask API (3 files) and React Login Dashboard (4 files)
> - When analysis runs, show line-level findings in Monaco using decorations
> - A FixPanel sidebar showing before/after code suggestions
> - Users can click a finding to jump to the file + line
>
> Make it feel like VS Code Lite. Dark theme. Monaco should use the 'vs-dark' theme.

**What happened:** This was the most complex feature. Monaco integration had several gotchas: decorations don't apply if the editor mounts after the signal is set, the editor language must switch per-file, and deleting the active file while analysis is running causes state inconsistencies. We fixed all of these through multiple iteration rounds.

---

## Prompt 6: Full-Stack Backend

**The prompt:**

> Build an Express backend for the prototype with these requirements:
> - SQLite database (local file) for storing interactions and calibration profiles
> - /api/generate endpoint — calls NVIDIA NIM API (build.nvidia.com, meta/llama-3.1-8b-instruct) for code generation
> - /api/analyze endpoint — runs real static analysis (pattern-based) for Python and JavaScript, checks OSV CVE database for dependency vulnerabilities
> - /api/override endpoint — logs user override decisions
> - /api/calibration/:userId endpoint — returns user's calibration profile
> - CORS enabled for all origins (frontend is on Vercel)
> - Rate limiting: 20 requests/minute per IP
> - Input validation: max 512KB body, max 100KB code, max 2000 char prompts
> - Deploy to Render using render.yaml blueprint
>
> Use dotenv for env vars. NVIDIA_API_KEY should be set in Render dashboard.

**What happened:** The backend worked well but had several issues discovered during audit:
- Rate limiting broke behind Render's reverse proxy (needed trust proxy)
- OSV CVE lookup was implemented but never actually called in the analysis pipeline (dead code)
- SQLite path was hardcoded to /tmp/signal.db which Render wipes on restart
- Error details were leaked to client (err.message containing potential internal info)

All fixed in the second audit pass.

---

## Prompt 7: Multi-File Project Analysis

**The prompt:**

> The analyze endpoint needs to support multi-file projects. When a user pastes multiple files, analyze each one individually, then merge the results. Also add cross-file analysis:
> - Detect if an API key is hardcoded in one file and used in another
> - Detect if HTTP (not HTTPS) is used across files
> - Line-level findings should reference the correct file and line number
> - Return a merged response with combined checks, all findings, and per-file results
>
> If the backend doesn't support arrays yet, add a client-side fallback that analyzes files individually and merges results.

**What happened:** The multi-file analysis works but revealed a design flaw — the backend uses a single global `language` parameter, so mixed-language projects (Python + JavaScript) get analyzed with the wrong rules. We fixed this in the deep audit by detecting language per-file from extension and analyzing language buckets separately.

---

## Prompt 8: Deep Audit & Bug Fixes (Round 1)

**The prompt:**

> Do a comprehensive code audit of the entire codebase — frontend and backend. Find every bug, crash possibility, logic flaw, and edge case. Be extremely thorough. I'm submitting this to professors who will test it.
>
> Specifically check:
> - Every useEffect dependency array
> - Every state update that could be stale
> - Every API error path
> - Every regex in the analyzer
> - Memory leaks (timers, intervals, event listeners)
> - Type safety gaps
> - CORS and security issues
> - Responsive breakpoint issues
>
> Return findings as: File → Issue → Severity → Fix.

**What happened:** Found 12 issues. The most critical were:
1. `handleDeleteFile` used stale `files` reference inside `setActiveFile` updater
2. `addLog` had unbounded growth — would crash after enough logs
3. `handleSelectFinding` created timeouts that weren't cleaned up on unmount
4. `decorationsRef` wasn't cleared when signal was reset
5. Backend rate limiter used `req.ip` without trust proxy (all users shared one bucket)
6. `editorLanguage` didn't handle `plaintext` for requirements.txt
7. `analysis.findings?.length` could crash on old backend responses

All fixed and redeployed.

---

## Prompt 9: Deeper Audit (Round 2)

**The prompt:**

> I need MORE issues. Dig deeper. Look for:
> - Subtle race conditions
> - False positives/negatives in the analyzer regex patterns
> - Missing error boundaries
> - LocalStorage failures in Safari private mode
> - Monaco editor mount races with decorations
> - Backend memory leaks
> - Any path that produces a white screen
>
> Don't stop at surface-level bugs. Find the ones that only show up under specific user action sequences.

**What happened:** Found 14 more critical issues:
1. Monaco decorations never applied if editor mounted after analysis completed (race condition)
2. OSV CVE lookup was dead code — function defined but never called
3. Mixed-language projects analyzed with wrong rules (all files forced to global language)
4. No error boundary — any React crash = white screen
5. `localStorage.setItem` throws in Safari private mode = app crash on load
6. Analyzer `cond` function for timeout checks was file-level, causing false negatives
7. `os.environ.get("API_KEY")` matched hardcoded secret regex = false positive
8. Calibration page made double health checks due to dependency array issue
9. No 404 route or /demo redirect
10. Navbar scroll listener fired 60x/second unthrottled
11. TypewriterCode caused re-render storm — SyntaxHighlighter retokenized every character
12. Backend error details leaked to client
13. Rate limiter Map grew unbounded (memory leak)
14. `getUserId` used `Math.random()` with collision risk

All fixed and redeployed.

---

## Prompts I Did NOT Use

These are the things I did **not** ask AI to do, per the professor's guidance:

| Task | Why I Did It Myself |
|---|---|
| **Deck writing** | Professor explicitly forbids AI on the deck. Detection is run. |
| **Segmentation decision** | Strategic call based on my own survey analysis and judgment. |
| **5-Why root cause** | I built the chain myself; AI only critiqued it after I drafted it. |
| **Metrics framework** | I chose ARR as North Star based on my own reasoning about what matters. |
| **Failure analysis** | I identified the 9 risks myself; AI helped structure the write-up but the thinking was mine. |

---

## How I Used AI Responsibly

1. **Prototype only:** Every prompt in this document was for building, iterating, or debugging the deployed prototype.
2. **I reviewed everything:** No code went live without me reading and understanding it.
3. **I fixed AI's mistakes:** The two deep audits exist because I didn't blindly trust the first output.
4. **Cross-validated architecture:** I ran key architecture decisions through both Claude and ChatGPT to catch blind spots.
5. **Transparent about scope:** This document exists so evaluators can see exactly what AI built and what I built myself.

---

*This document is honest about what AI was used for: building and refining the deployed prototype. All strategic thinking, research analysis, problem framing, solution design, metric selection, and deck writing were done independently.*
