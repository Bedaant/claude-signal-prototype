# Prompt Document — Building the Claude Signal Prototype

This is a record of the AI prompts I used to build the interactive prototype for my PM graduation project. The brief requires us to document all AI prompts, organized by use case.

**Important context:** By the time I started building the prototype, all the strategic work was already done. I had already defined the problem (users over-trust AI-generated code and ship bugs to production), chosen my segment (developers shipping production code), validated it with a 33-person survey and 6 case studies, designed the solution (Claude Signal — an independent verification gate with progressive disclosure and a calibration engine), and mapped out the metrics, risks, and GTM plan. All of that thinking is documented in the Master Project Document. 

What I used AI for was **implementation only** — turning that product vision into working, deployed software. I am not a developer, so I collaborated with AI (Claude) as my build partner. I described what I needed, AI wrote the code, and I tested, reviewed, and directed fixes until it matched the vision.

---

## The Product I Was Building

Before getting into the prompts, here's what the prototype needed to demonstrate:

**The Problem:** My research showed that 91% of AI users discover errors after they've already accepted the output, and 87% have shipped buggy AI-generated work to production. Users can't tell if AI code is "almost right" or actually right because current tools provide no independent quality signals.

**My Solution — Claude Signal:** A soft verification gate that runs independent checks on AI-generated code (static analysis, security vulnerability scans, complexity scoring) and surfaces specific, actionable findings before the user ships. It uses progressive disclosure — a one-line summary by default, expandable details on demand — so it never overwhelms. The calibration engine learns from user override patterns and adjusts signal strength over time, building user judgment rather than tool dependence.

**What the prototype needed to show:**
1. Three realistic scenarios (clean code passing all checks, risky code with a CVE warning, unsafe code with critical security flaws)
2. Progressive disclosure working in three levels (tag → checks → full reasoning)
3. Override flow with feedback, demonstrating the calibration concept
4. A live playground where users can paste real code and see analysis
5. A calibration demo showing how the system adapts over time

---

## Step 1: Building the Foundation

**Where I was in the process:** I had the full product vision, the technical spec, and the mock data ready. I needed a live, deployed website that brought this to life.

**My prompt:**

> I need to build an interactive prototype for my PM graduation project. The product is called "Claude Signal" — it's a verification gate for AI-generated code. Before a developer ships code that Claude (or ChatGPT, or Copilot) generated, Signal independently checks it for bugs, security issues, and edge cases, then shows the results inline.
>
> Here's what the prototype needs to demonstrate:
> - A landing page with my research stats: 91% of users discover errors after accepting AI output, 87% have shipped buggy code, average trust is only 5.9/10. Also show how it works in 3 steps (Generate → Verify → Calibrate) and link to the three demo scenarios.
> - A live demo page with 3 pre-built scenarios:
>   1. Clean code — all checks pass, green signal
>   2. Risky code — CVE found in a dependency + edge case failure, yellow signal
>   3. Unsafe code — SQL injection + data leak + no authentication, red signal
> - Each demo shows a mock chat where the user asks for code, the code appears with a typing effect, and then a Signal tag pops up with the confidence level.
> - The user can click the tag to expand details, see guided verification prompts, and choose to override the warning.
> - A calibration page showing how the system learns from user behavior over time.
> - An about page summarizing the research.
>
> Dark mode. Mobile-friendly. Deployed to Vercel with a public URL.

**What came back:** A complete working website with all four pages, the chat interface, the typing effect, the Signal tag, expandable details panel, and override button. It was functional but looked generic — purple colors, basic layout.

**What I did next:** I tested every scenario, every button, every link on both desktop and mobile. I compared it against my mental picture from the spec and made a list of what felt off.

---

## Step 2: Polish — Animations, Mobile, and Flow

**What was wrong:** The typing effect stuttered. The Signal tag just appeared instead of animating in. The mobile experience was broken — no hamburger menu, buttons too small, text overflowing.

**My prompt:**

> The prototype works but needs polish to feel professional. Three issues:
> 1. The code typing effect is jerky — it should feel smooth, like real code being generated.
> 2. When the Signal tag appears, it should animate in with a subtle glow, not just pop up instantly. The glow should match the signal color (green/yellow/red).
> 3. On mobile, the navigation is unusable — add a hamburger menu that slides down smoothly.
>
> Also, when the user clicks "Override & Accept," the feedback card should slide in nicely with a spring animation.

**What came back:** Smooth typing, glowing Signal tags, and a proper mobile menu. The animations made the whole experience feel intentional rather than raw.

---

## Step 3: The Calibration Story

**Where this fits in the product:** The calibration engine is one of my two core innovations (the other being independent verification). It tracks user override decisions, checks outcomes 48 hours later, and personalizes signal strength over time. Well-calibrated users see less signal, not more — the goal is to build THEIR judgment, not create permanent dependence on the tool.

**My prompt:**

> I need a Calibration page that tells the story of how Signal adapts to a user over time. Use a step-by-step timeline with 4 stages:
>
> Stage 1 — "First Use" (1st interaction): Full signal, default strength. Shows all checks.
>
> Stage 2 — "Pattern Detected" (~15 interactions): The system notices "You've overridden 3 security warnings recently. 2 of them led to issues." Security warnings become slightly more prominent.
>
> Stage 3 — "Calibrating" (~30 interactions): Signal adjusts per-user. Security warnings amplified, syntax warnings reduced. Message: "Signal is adapting to your patterns."
>
> Stage 4 — "Well-Calibrated" (50+ interactions): Minimal intervention. Only high-priority items shown. Message: "You've developed strong evaluation instincts. Signal intervenes less."
>
> Each stage should show a preview of what the Signal interface looks like at that point. Make it feel like a story, not a settings panel.

**What came back:** A clean horizontal timeline. Clicking through the steps shows how the same code would get different Signal treatments based on the user's history. This became one of the strongest parts of the demo because it communicates the product's unique value in under a minute.

---

## Step 4: Premium Visual Redesign

**Why this mattered:** The original design looked like every other AI tool — purple gradient, generic. My product is about trust and judgment; it needed to feel precise, premium, and credible. I took inspiration from products I admire like Linear and Vercel.

**My prompt:**

> I want to completely redesign the visual identity. Move away from purple to something warmer and more premium.
>
> New direction:
> - Deep charcoal background (near-black)
> - Warm amber/gold as the accent color
> - A simple abstract logo — not a robot, not a shield. Something that suggests a signal or pulse.
> - Navigation bar with a frosted glass effect
> - Subtle glow behind the hero logo
> - Cards that light up on hover with the accent color
> - Everything should feel expensive and intentional
>
> Update every page and component to match.

**What came back:** The amber-on-charcoal palette transformed the product. The abstract sonar-pulse logo (SVG-based, no external files) was perfect — distinctive, scalable, and instantly memorable. The hover effects and glass navigation made the site feel like a real product, not a student project.

---

## Step 5: The Playground — Real Code, Real Analysis

**Where this fits in the product:** The pre-built scenarios are great for demos, but the real test is whether users can paste their own code and get useful feedback. This feature demonstrates the core value proposition: "Paste code from Cursor, Copilot, or ChatGPT — Signal will find the issues you'd miss."

**My prompt:**

> I need to add a Playground where users can paste their own code and see Signal analyze it. But I want it to feel like a real developer environment, not a basic text box.
>
> Features needed:
> - A real code editor where users can type or paste code
> - File list on the left for multi-file projects
> - Tabs at the top for switching between open files
> - Terminal panel at the bottom showing the analysis progress
> - Two pre-loaded sample projects users can try: a Python Flask API and a React login dashboard
> - When Signal finds issues, highlight the exact line in the code
> - A sidebar showing the suggested fix with before/after code the user can copy
> - Clicking a finding jumps directly to that file and line
>
> This should feel like a lightweight IDE.

**What came back:** A full IDE-style interface with file explorer, tabs, terminal, and fix panel. This was the most complex feature by far.

**Problems we discovered during testing:**
- If the editor loaded slowly, line highlighting never appeared
- Deleting a file during analysis crashed the entire app
- Switching between file types didn't always update the editor correctly
- The terminal kept growing forever and eventually froze the browser

**How we fixed them:** I broke each issue, described exactly what I did to trigger it, and asked for a fix. Took about 6 rounds to get stable.

---

## Step 6: Real Backend — Not Just Mock Data

**Why this mattered:** A prototype with fake analysis is fine for a concept demo, but I wanted to go further. A real backend that can actually generate code and run security checks makes the prototype credible. The professor specifically said deployed prototypes score higher than static ones.

**My prompt:**

> I need a backend server for the prototype. Requirements:
> - Store user interactions in a database
> - Code generation endpoint: when a user asks for code, call an AI model and return the result
> - Analysis endpoint: when a user submits code, run real checks — syntax, security patterns, dependency vulnerabilities against a real CVE database
> - Override tracking: log when users dismiss a warning
> - Calibration endpoint: retrieve a user's profile showing their interaction history
> - No login required — the prototype should be instantly accessible
> - Deploy to Render so it's always online
>
> Keep it practical. This is a student project, not enterprise software.

**What came back:** An Express server with a SQLite database, connected to NVIDIA's AI API for code generation, and a pattern-based analysis engine. Deployed on Render.

**Problems we hit after deployment:**
- Render's free tier puts the server to sleep after inactivity — 30-second wake-up time
- The rate limiter counted all users as one person because Render uses a reverse proxy
- The database file got wiped on every server restart
- Error messages exposed internal details to users

**How we fixed them:** Added a health-check endpoint so the frontend can show "waking up." Fixed the rate limiter to read the real user IP. Moved the database to persistent storage. Sanitized error messages.

---

## Step 7: Multi-File Project Analysis

**Where this fits in the product:** Real projects have multiple files. A hardcoded API key in config.py that gets used in app.py is a cross-file issue — no single-file analyzer would catch it. This feature shows that Signal understands project-level context, not just isolated snippets.

**My prompt:**

> Can you make the analysis work across multiple files? If someone uploads a project with several files, Signal should analyze each one AND check for issues that span files.
>
> Examples of cross-file issues:
> - An API key hardcoded in one file but imported and used in another
> - Insecure HTTP URLs used across the project
> - Missing authentication on routes defined in one file but handled in another
>
> Return a merged report with per-file findings and cross-file issues highlighted separately.

**What came back:** Multi-file analysis with individual file checks plus a cross-file pass. It successfully detected hardcoded secrets and insecure URLs across files.

**A bug we found later:** If someone uploaded both Python and JavaScript files, the system analyzed ALL files as the same language. JavaScript files were checked with Python rules, which produced nonsense results. We fixed this in the second audit by detecting language from the file extension.

---

## Step 8: First Deep Audit — 12 Critical Issues

**Why I did this:** Before submitting, I wanted to be confident nothing crashes, nothing leaks, and there are no embarrassing bugs. I asked AI to review the entire codebase like a QA engineer.

**My prompt:**

> I need a full audit of the prototype — frontend and backend. Find every bug, crash possibility, logic flaw, and edge case. Approach this like a professor testing it for a grade. Be thorough and honest.
>
> Check: What happens if buttons are clicked in weird orders? Are there memory leaks? Is the mobile layout broken anywhere? Does the backend crash on bad input? Are there paths that lead to a white screen?

**What came back:** 12 issues. The most serious were:
- Deleting a file while analysis was running crashed the app
- The terminal panel grew unbounded until the browser froze
- Clicking a finding to jump to a line leaked memory
- The backend rate limiter was broken behind Render's proxy
- The editor didn't handle plain text files

**What I did:** Ranked by severity, asked for fixes one by one, tested each fix manually, and redeployed.

---

## Step 9: Second Deep Audit — 14 More Issues

**Why I did this:** I suspected there were deeper bugs hiding — the kind that only surface under specific timing or browser conditions.

**My prompt:**

> Dig deeper. Find the subtle bugs — race conditions, false positives in the security checker, edge cases. What if the network is slow? What if someone uses Safari private mode? What if someone clicks Analyze ten times in a row?

**What came back:** 14 more critical issues:
- If the editor loaded after analysis finished, line highlights never appeared
- The CVE vulnerability checker was implemented but never actually called
- Safari private mode blocks local storage, crashing the app immediately
- A security regex falsely flagged safe environment-variable reads as hardcoded secrets
- The navigation scroll listener fired 60 times per second, causing lag
- No error boundary meant any crash would white-screen the entire app

**What I did:** Fixed all 14. The dead CVE code was the most embarrassing — we had built the feature but forgot to wire it up. The Safari crash was the nastiest because users couldn't even see the site. Added proper fallbacks.

---

## Summary: What the Prototype Demonstrates

The deployed prototype at `https://claude-signal-prototype.vercel.app` shows the complete Claude Signal experience:

1. **Landing page** — explains the problem with real data, shows how Signal works, links to demos
2. **Three demo scenarios** — clean, risky, and unsafe code, each showing how Signal surfaces different levels of concern
3. **Playground** — users can paste real code or load sample projects and see live analysis with line-level findings
4. **Calibration demo** — shows how the system would adapt to a user's patterns over 50+ interactions
5. **About page** — research methodology and project context

---

## What I Did vs. What AI Did

| My Role | AI's Role |
|---|---|
| Defined the product vision, problem, segment, and solution | Wrote all the code (frontend + backend) |
| Designed the user flow and interaction states | Implemented the designs I described |
| Found bugs by testing every path | Fixed bugs when I reported them |
| Chose which features to build and in what order | Suggested technical approaches |
| Defined what the analyzer should look for and why | Built the analysis engine patterns |
| Reviewed and approved every iteration | Deployed to Vercel and Render |

**What I did NOT use AI for:**
- The 10-slide deck (professor runs AI detection)
- Segmentation, problem analysis, and 5-Why construction
- Competitive research and case study selection
- Metrics framework and failure analysis
- Any strategic or product decisions

---

## Reflection: Using AI as a Prototyping Partner

I couldn't have built this prototype without AI — I'm not a developer. But I also couldn't have just said "build me a website" and gotten something useful. The value I added as a PM was:

1. **Knowing WHAT to build** — the product vision, user flow, and scenarios were my design
2. **Knowing what GOOD looks like** — I tested every interaction and rejected anything that felt off
3. **Finding the gaps** — AI writes working code, but it doesn't think about edge cases. I had to actively break things
4. **Iterating with intent** — every round of fixes was driven by my testing, not random suggestions

The prototype isn't perfect. But it demonstrates the core concept clearly, it's publicly accessible, and it proves I can translate product thinking into working software. That's what this project was meant to show.
