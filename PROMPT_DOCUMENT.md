# Prompt Document — Building the Claude Signal Prototype

This is a record of the AI prompts I used to build the interactive prototype for my PM graduation project. The brief requires us to document all AI prompts, organized by use case.

**Quick context:** By the time I started building, all the strategic thinking was done — problem definition, segmentation, survey, case studies, solution design, metrics, risks, GTM. That's all in the Master Project Document. What I used AI for was purely implementation — turning the product vision into working software. I'm not a developer, so I used Claude as basically my engineering partner. I'd describe what I needed, it would write code, I'd test it, break it, and ask for fixes until it matched what I had in my head.

---

## The Product Context

Before diving into prompts, here's what the prototype needed to demonstrate:

**The Problem:** My research showed 91% of AI users find errors only after they've already accepted the output, and 87% have shipped buggy AI-generated work to production. Users can't tell if code is "almost right" or actually right because current tools give no independent quality signals.

**My Solution — Claude Signal:** A soft verification gate that runs independent checks on AI-generated code (static analysis, security scans, complexity scoring) and surfaces specific, actionable findings before the user ships. Progressive disclosure — one-line summary by default, expandable details if you want them. The calibration engine learns from override patterns and adjusts signal strength over time. Goal is to build the user's judgment, not create tool dependence.

**What the prototype needed to show:**
1. Three realistic scenarios (clean code passing all checks, risky code with a CVE warning, unsafe code with critical security flaws)
2. Progressive disclosure in three levels (tag → checks → full reasoning)
3. Override flow with feedback, demonstrating calibration concept
4. A live playground where users can paste real code and see analysis
5. A calibration demo showing how the system adapts over time

---

## Step 1: Building the Foundation

I had the full product vision, the spec, and the mock data ready. I just needed a live, deployed website.

**My prompt (more or less — I don't have exact transcripts, this is reconstructed from memory):**

> I need to build an interactive prototype for my PM graduation project. The product is called "Claude Signal" — it's basically a verification gate for AI-generated code. Before a developer ships code that Claude (or ChatGPT, or Copilot) generated, Signal independently checks it for bugs, security issues, and edge cases, then shows the results inline.
>
> Here's what I need:
> - Landing page with my research stats: 91% of users discover errors after accepting AI output, 87% have shipped buggy code, average trust is only 5.9/10. Show how it works in 3 steps (Generate → Verify → Calibrate) and link to three demo scenarios.
> - A demo page with 3 pre-built scenarios:
>   1. Clean code — all checks pass, green signal
>   2. Risky code — CVE found in a dependency + edge case failure, yellow signal  
>   3. Unsafe code — SQL injection + data leak + no auth, red signal
> - Each demo shows a mock chat where the user asks for code, code appears with a typing effect, then a Signal tag pops up with the confidence level.
> - User can click the tag to expand details, see verification prompts, and choose to override the warning.
> - A calibration page showing how the system learns from user behavior over time.
> - An about page with research summary.
>
> Dark mode. Mobile-friendly. Deployed to Vercel with a public URL.

**What came back:** A complete working website — all four pages, chat interface, typing effect, Signal tag, expandable panel, override button. Functional but looked generic. Purple colors, basic layout. Nothing that felt like a real product.

**What I did:** Spent an hour clicking through everything on both desktop and my phone. Made a list of what felt off. Then moved to the next round.

---

## Step 2: Polish — Animations, Mobile, and Flow

**What was bugging me:** The typing effect stuttered. The Signal tag just appeared out of nowhere instead of animating in. On my phone the whole thing was basically unusable — no hamburger menu, buttons too small, text spilling off the screen.

**My prompt:**

> The prototype works but looks amateur. Three things I need fixed:
> 1. The typing effect is jerky — make it smooth, like actual code being typed out
> 2. When the Signal tag appears, it should animate in with a subtle glow matching the color (green/yellow/red), not just pop up instantly
> 3. Mobile navigation is broken — I need a hamburger menu that slides down smoothly
>
> Also the "Override & Accept" feedback card should slide in with a nice animation.

**What came back:** Smooth typing, glowing Signal tags, proper mobile menu. Much better. The animations made it feel intentional instead of thrown together.

---

## Step 3: The Calibration Story

The calibration engine is one of my two core ideas (the other being independent verification). It tracks override decisions, checks outcomes 48 hours later, and personalizes signal strength. Well-calibrated users see *less* signal over time — the goal is to build their judgment, not make them dependent on the tool.

**My prompt:**

> I need a Calibration page that tells the story of how Signal adapts to a user over time. Use a step-by-step timeline with 4 stages:
>
> Stage 1 — "First Use" (1st interaction): Full signal, default strength. Shows all checks.
>
> Stage 2 — "Pattern Detected" (~15 interactions): System notices "You've overridden 3 security warnings recently. 2 of them led to issues." Security warnings become more prominent.
>
> Stage 3 — "Calibrating" (~30 interactions): Signal adjusts per-user. Security warnings amplified, syntax warnings reduced. Message: "Signal is adapting to your patterns."
>
> Stage 4 — "Well-Calibrated" (50+ interactions): Minimal intervention. Only high-priority items shown. Message: "You've developed strong evaluation instincts. Signal intervenes less."
>
> Each stage should show a preview of what the Signal interface looks like at that point. Make it feel like a story, not a settings panel.

**What came back:** A clean horizontal timeline. Clicking through the steps shows how the same code would get different Signal treatments based on user history. This turned into one of the strongest parts of the demo because it communicates the product's unique value in under a minute.

---

## Step 4: Visual Redesign

The original design looked like every other AI tool — purple gradient, completely generic. My product is about trust and judgment; it needed to feel precise and credible. I took inspiration from Linear and Vercel.

**My prompt:**

> I want to completely redo the visual identity. Move away from purple to something warmer and more premium.
>
> Direction:
> - Deep charcoal background (near-black)
> - Warm amber/gold as the accent color  
> - A simple abstract logo — not a robot, not a shield. Something that suggests a signal or pulse.
> - Frosted glass navigation bar
> - Subtle glow behind the hero logo
> - Cards that light up on hover with the accent color
> - Everything should feel expensive and intentional
>
> Update every page.

**What came back:** The amber-on-charcoal palette changed everything. The abstract sonar-pulse logo (SVG-based, no external files) was perfect — distinctive and instantly memorable. The hover effects and glass navigation made the site feel like a real product, not a student project.

---

## Step 5: The Playground — Real Code, Real Analysis

The pre-built scenarios are great for demos, but the real test is whether users can paste their own code and get useful feedback. This feature demonstrates the core value: "Paste code from Cursor, Copilot, or ChatGPT — Signal will find the issues you'd miss."

**My prompt:**

> I need to add a Playground where users can paste their own code and see Signal analyze it. But I want it to feel like a real developer environment, not a basic text box.
>
> Features needed:
> - A real code editor where users can type or paste code
> - File list on the left for multi-file projects
> - Tabs at the top for switching between open files
> - Terminal panel at the bottom showing analysis progress
> - Two pre-loaded sample projects: a Python Flask API and a React login dashboard
> - When Signal finds issues, highlight the exact line in the code
> - A sidebar showing the suggested fix with before/after code the user can copy
> - Clicking a finding jumps directly to that file and line
>
> This should feel like a lightweight IDE.

**What came back:** A full IDE-style interface with file explorer, tabs, terminal, and fix panel. Most complex feature by far.

**Problems we discovered during testing:**
- Editor loaded slowly sometimes, and when it did, line highlighting never appeared
- Deleting a file during analysis crashed the whole app
- Switching between file types didn't always update the editor correctly
- The terminal kept growing forever and eventually froze the browser

**How we fixed them:** I broke each issue, described exactly what I did to trigger it, and asked for a fix. Took about 6 rounds to get stable. The line highlighting bug was the most annoying — it only happened when the editor mounted after analysis completed, so I kept missing it during normal testing.

---

## Step 6: Real Backend

A prototype with fake analysis works for a concept demo, but I wanted to go further. A real backend that can actually generate code and run security checks makes the prototype credible. Professor specifically said deployed prototypes with real backends score higher.

**My prompt:**

> I need a backend server for the prototype. Requirements:
> - Store user interactions in a database
> - Code generation endpoint: when a user asks for code, call an AI model and return the result
> - Analysis endpoint: when a user submits code, run real checks — syntax, security patterns, dependency vulnerabilities against a real CVE database
> - Override tracking: log when users dismiss a warning
> - Calibration endpoint: retrieve a user's profile showing interaction history
> - No login required — the prototype should be instantly accessible
> - Deploy to Render so it's always online
>
> Keep it practical. This is a student project, not enterprise software.

**What came back:** Express server with SQLite database, connected to NVIDIA's AI API for code generation, pattern-based analysis engine. Deployed on Render.

**Post-deployment disasters:**
- Render's free tier puts the server to sleep after inactivity — 30-second wake-up time that confused me for a while
- Rate limiter counted all users as one person because Render uses a reverse proxy
- Database file got wiped on every server restart (had to move it to persistent storage)
- Error messages were exposing internal details to users

**How we fixed them:** Added a health-check endpoint so the frontend shows "waking up..." Fixed rate limiter to read the real user IP. Moved database. Sanitized error messages.

---

## Step 7: Multi-File Project Analysis

Real projects have multiple files. A hardcoded API key in config.py that gets used in app.py is a cross-file issue — no single-file analyzer catches that.

**My prompt:**

> Can you make the analysis work across multiple files? If someone uploads a project with several files, Signal should analyze each one AND check for issues that span files.
>
> Examples:
> - API key hardcoded in one file but imported and used in another
> - Insecure HTTP URLs used across the project
> - Missing auth on routes defined in one file but handled in another
>
> Return a merged report with per-file findings and cross-file issues highlighted separately.

**What came back:** Multi-file analysis with individual file checks plus cross-file pass. Detected hardcoded secrets and insecure URLs across files successfully.

**A bug we found later:** If someone uploaded both Python and JavaScript files, the system analyzed ALL files as the same language. JavaScript files checked with Python rules = complete nonsense. Fixed in the second audit by detecting language from file extension.

---

## Step 8: First Deep Audit — 12 Critical Issues

Before submitting, I wanted confidence that nothing crashes, nothing leaks, and there are no embarrassing bugs. I asked AI to review the entire codebase like a QA engineer.

**My prompt:**

> I need a full audit of the prototype — frontend and backend. Find every bug, crash possibility, logic flaw, and edge case. Approach this like a professor testing it for a grade. Be thorough and honest.
>
> Check: What happens if buttons are clicked in weird orders? Memory leaks? Mobile layout broken anywhere? Backend crashes on bad input? Paths that lead to a white screen?

**What came back:** 12 issues. Most serious:
- Deleting a file while analysis was running crashed the app
- Terminal panel grew unbounded until browser froze
- Clicking a finding to jump to a line leaked memory
- Backend rate limiter was broken behind Render's proxy
- Editor didn't handle plain text files

**What I did:** Ranked by severity, asked for fixes one by one, tested each manually, redeployed.

---

## Step 9: Second Deep Audit — 14 More Issues

I suspected deeper bugs hiding — the kind that only surface under specific timing or browser conditions.

**My prompt:**

> Dig deeper. Find the subtle bugs — race conditions, false positives in the security checker, edge cases. What if the network is slow? What if someone uses Safari private mode? What if someone clicks Analyze ten times in a row?

**What came back:** 14 more critical issues:
- If editor loaded after analysis finished, line highlights never appeared
- The CVE vulnerability checker was implemented but never actually called (dead code — most embarrassing one)
- Safari private mode blocks local storage, crashing the app immediately
- Security regex falsely flagged safe environment-variable reads as hardcoded secrets
- Navigation scroll listener fired 60 times per second, causing lag
- No error boundary meant any crash would white-screen the entire app

**What I did:** Fixed all 14. The dead CVE code was the most embarrassing — we had built the feature but forgot to wire it up. Safari crash was the nastiest because users couldn't even see the site. Added proper fallbacks.

---

## Summary: What the Prototype Demonstrates

The deployed prototype at `https://claude-signal-prototype.vercel.app` shows the complete Claude Signal experience:

1. **Landing page** — explains the problem with real data, shows how Signal works, links to demos
2. **Three demo scenarios** — clean, risky, and unsafe code, each showing how Signal surfaces different levels of concern
3. **Playground** — users can paste real code or load sample projects and see live analysis with line-level findings
4. **Calibration demo** — shows how the system adapts to user patterns over 50+ interactions
5. **About page** — research methodology and project context

---

## What I Did vs. What AI Did

**I did:** Defined the product vision, problem, segment, and solution. Designed user flows and interaction states. Found bugs by testing every path. Chose which features to build and in what order. Defined what the analyzer should look for and why. Reviewed and approved every iteration.

**AI did:** Wrote all the code (frontend + backend). Implemented the designs I described. Fixed bugs when I reported them. Suggested technical approaches. Built the analysis engine patterns. Deployed to Vercel and Render.

**What I did NOT use AI for:**
- The 10-slide deck (professor runs AI detection)
- Segmentation, problem analysis, and 5-Why construction
- Competitive research and case study selection
- Metrics framework and failure analysis
- Any strategic or product decisions

---

## Reflection: Using AI as a Prototyping Partner

I couldn't have built this without AI — I'm not a developer. But I also couldn't have just said "build me a website" and gotten something useful. The value I added as a PM was knowing what to build, knowing what good looks like, finding the gaps, and iterating with intent.

That said, there are still things that bug me. The free-tier Render backend means 30-second cold starts, which is a terrible first impression. The analysis engine is pattern-based, not a real static analyzer — it catches obvious issues but would miss subtle ones. The calibration engine in the prototype is simulated, not real — actual calibration would need weeks of user data. 

The prototype isn't perfect. But it demonstrates the core concept clearly, it's publicly accessible, and it proves I can translate product thinking into working software. That's what this project was meant to show.
