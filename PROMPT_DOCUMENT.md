# Prompt Document — Building the Claude Signal Prototype

This is a record of the prompts I gave to AI to build the interactive prototype for my PM graduation project. The professor asked us to document all AI prompts used, so here they are — written exactly as they happened, step by step.

**Quick context:** I am not a developer. I know enough about products and user experience to know what I want, but I cannot write production code myself. So I used AI (Claude, mainly) as my implementation partner — I described what I needed, AI wrote the code, and I tested, reviewed, and asked for fixes until it worked. Every strategic decision about the product itself — the segment, the problem, the solution, the metrics — that was all my own thinking, documented in the master project document.

---

## Step 1: Getting Started — "Build Me a Working Demo"

**What I needed:** A live, clickable prototype that demonstrates how Claude Signal would work. Something I could share a public link to. The professor specifically said "don't give me a Figma or Lovable link — deploy it to production."

**My prompt:**

> I need to build an interactive prototype for my PM graduation project. It's called "Claude Signal" — a verification gate that checks AI-generated code for bugs and security issues before the user ships it.
>
> I need a website with these pages:
> 1. A landing page that explains what Signal is, with some stats from my research (91% of users find errors after accepting AI output, 87% have shipped buggy code, etc.)
> 2. A live demo page showing 3 scenarios — clean code that passes all checks, risky code with a security warning, and unsafe code with multiple critical issues
> 3. A page showing how the system learns from the user's choices over time (calibration)
> 4. An about page with my research summary
>
> The demo should feel like you're chatting with Claude — the user types a prompt, the code appears with a typing effect, and then a "Signal" tag pops up saying whether the code is safe or not. The user can click to see details, and they can choose to "override" the warning.
>
> Dark mode. Mobile-friendly. Deployed to Vercel so anyone can open it.

**What came back:** A complete working website with all four pages, the chat interface, the typing effect, the Signal tag, and the expandable details panel. It looked decent but a bit basic — purple colors, simple layout.

**What I did next:** Tested every button, every link, every scenario on both my laptop and phone. Made a list of what felt clunky.

---

## Step 2: Fixing Animations and Mobile

**What was wrong:** The code typing effect was jerky. The Signal tag just appeared instead of sliding in nicely. On mobile, the navigation was broken — everything was squished together with no menu.

**My prompt:**

> The demo needs polish. Three things:
> 1. The typing effect on the code feels choppy — can you make it smoother?
> 2. When the Signal tag appears, it should animate in nicely, not just pop up. Maybe a gentle glow effect?
> 3. On mobile, the top navigation is completely broken — I need a hamburger menu that opens and closes smoothly.

**What came back:** Smooth typing, a glowing Signal tag with a subtle pulse, and a proper mobile menu that slides down when you tap the hamburger icon. Much better.

---

## Step 3: Adding the Calibration Story

**What I needed:** One of the key innovations in my product is the "calibration engine" — the idea that Signal learns from your choices and adapts over time. I needed a page that shows this story visually.

**My prompt:**

> I need another page called Calibration that shows how Signal adapts to a user over time. Think of it like a timeline with 4 steps:
> - First time using Signal: shows everything, default settings
> - After about 15 uses: detects a pattern — "you keep ignoring security warnings and they keep causing issues"
> - After about 30 uses: Signal adjusts — security warnings become more prominent, syntax warnings become quieter
> - After 50+ uses: you're well-calibrated, Signal only shows the most important warnings
>
> Make it feel like a story, not a settings panel. Each step should show a preview of what the Signal tag looks like at that stage.

**What came back:** A clean horizontal timeline where you click through each step and see how the Signal interface changes. This became one of my favorite parts of the demo because it communicates the core product idea in 30 seconds.

---

## Step 4: Complete Visual Redesign

**What I needed:** The original design looked like a generic AI tool — purple background, standard layout. I wanted something that felt premium and unique, like the apps I admire (Linear, Vercel, Zentry).

**My prompt:**

> I want to completely change the look and feel. Move away from purple to something warmer and more premium.
>
> Here's what I'm imagining:
> - Deep dark background (almost black)
> - Warm amber/gold as the accent color
> - A simple, abstract logo instead of a robot or shield
> - Glass-like navigation bar that blurs the background
> - Subtle glow behind the main logo on the landing page
> - Cards that light up with the accent color when you hover over them
> - Everything should feel expensive and thoughtful

**What came back:** A gorgeous redesign. The amber-on-charcoal palette immediately felt more premium. The abstract sonar-pulse logo was perfect — simple, memorable, no external image files needed. The hover effects on cards made the whole site feel alive.

**What I did:** Tested on my phone again. The glow effects were a bit heavy on older phones, so I asked for lighter shadows. Took two tries to get right.

---

## Step 5: The Playground — Let Users Paste Real Code

**What I needed:** The original demo only showed pre-built scenarios. But for the prototype to feel real, users needed to paste their own code and see Signal analyze it. I also wanted it to look like a real developer environment — not just a text box.

**My prompt:**

> I want to add a "Playground" where users can paste their own code and see Signal analyze it in real time. But I don't want a boring text box — I want it to feel like a real code editor, like VS Code.
>
> Here's what I need:
> - A real code editor (not a fake one) where users can type or paste code
> - A file list on the left so users can work with multiple files
> - Tabs at the top showing open files
> - A "terminal" panel at the bottom showing what Signal is checking
> - Pre-loaded sample projects users can try (like a Python API and a React app)
> - When analysis finds issues, highlight the exact line in the code
> - A sidebar showing "before and after" fixes the user can copy
>
> This should feel like a lite version of an IDE.

**What came back:** A full IDE-style interface with a real code editor, file explorer, tabs, terminal, and fix panel. This was by far the most complex feature.

**Problems we hit:**
- The line highlighting didn't work if the editor loaded after the analysis finished (race condition)
- If you deleted a file while analysis was running, the whole app crashed
- Switching between different types of files (Python, JavaScript, text) didn't always switch the editor mode correctly
- The terminal would keep growing forever and eventually slow down the browser

**How we fixed them:** I tested each scenario, reported what broke, and asked for fixes one by one. Took about 6 rounds of back-and-forth to get stable.

---

## Step 6: Adding a Real Backend

**What I needed:** Up to this point, the analysis was fake — just mock data. I wanted a real backend that could actually analyze code, look up security vulnerabilities, and generate code using an AI model.

**My prompt:**

> I need a backend server for the prototype. Here's what it should do:
> - Store user interactions in a database
> - When someone asks for code generation, call an AI model and return the generated code
> - When someone submits code for analysis, run actual checks — syntax, security patterns, dependency vulnerabilities
> - Track when users "override" a warning so we can show the calibration concept
> - Allow the frontend to talk to it without any login or authentication
> - Deploy it to Render so it's always online
>
> Keep it simple. I don't need enterprise-grade security — this is a student project prototype.

**What came back:** An Express server with a SQLite database, connected to NVIDIA's AI API for code generation, and a pattern-based analysis engine for Python and JavaScript. Deployed on Render.

**Problems we hit:**
- The backend kept going to sleep on Render's free tier (takes 30 seconds to wake up)
- All users were sharing the same rate limit because the server didn't know who was who behind Render's proxy
- The database file was getting wiped every time Render restarted
- Error messages from the backend were leaking internal details to users

**How we fixed them:** Added a health-check endpoint so the frontend can show "waking up" messages. Fixed the rate limiter to read the correct user IP. Moved the database to persistent storage. Stripped internal error details from user-facing responses.

---

## Step 7: Multi-File Projects

**What I needed:** Real developers don't work with single files — they have projects with multiple files. I wanted Signal to analyze entire projects and find issues that span across files.

**My prompt:**

> Can you make the analysis work with multiple files? Like if someone pastes a Python project with an app.py, a config.py, and a utils.py, Signal should analyze all three and find issues across them — not just in one file.
>
> For example, if the API key is hardcoded in config.py but used in app.py, that should be flagged as a cross-file issue.

**What came back:** Multi-file analysis that checks each file individually, then does a cross-file pass. It found cross-file issues like hardcoded secrets and insecure HTTP URLs.

**Problem we discovered later:** If someone uploaded both Python and JavaScript files, the system analyzed ALL files as the same language. So JavaScript files were checked with Python rules, which obviously made no sense. We fixed this in a later audit by detecting the language from the file extension.

---

## Step 8: First Deep Audit — Finding What's Broken

**What I needed:** Before submitting, I wanted to make sure nothing crashes, nothing leaks, and there are no obvious bugs. I asked AI to audit the entire codebase like a QA engineer.

**My prompt:**

> I need you to audit the entire prototype — frontend and backend — and find every bug, crash, and logic flaw. Pretend you're a professor testing this for a grade. Be brutal.
>
> Check things like: does anything crash if I click buttons in a weird order? Are there memory leaks? Is the mobile layout broken anywhere? Does the backend accept garbage input? Are there any paths that lead to a white screen?

**What came back:** 12 issues, several of them serious:
- Deleting a file while analysis was running crashed the app
- The terminal panel would grow forever and eventually freeze the browser
- Clicking on an analysis result to jump to a line created memory leaks
- The backend rate limiter was broken behind Render's proxy
- The code editor didn't handle plain text files (like requirements.txt)

**What I did:** Prioritized the critical ones, asked for fixes, tested each fix manually, and redeployed.

---

## Step 9: Second Deep Audit — Digging Deeper

**What I needed:** I had a feeling there were more subtle bugs hiding. The kind that only show up when you do things in a specific order.

**My prompt:**

> I need you to dig deeper. Find the bugs that don't show up immediately — the race conditions, the false positives in the security checker, the edge cases. What happens if the internet is slow and the editor loads after the analysis? What happens in Safari private mode? What if someone rapid-clicks the analyze button?

**What came back:** 14 more critical issues:
- If the code editor loaded slowly, the line highlighting never appeared at all
- The security vulnerability checker (OSV) was implemented but never actually called — dead code
- Safari private mode blocks local storage, which crashed the entire app on first load
- A regex in the security checker was flagging safe code as dangerous
- The scroll listener on the navigation bar fired 60 times per second, causing lag
- There was no error boundary — any single crash would white-screen the entire app

**What I did:** Fixed all 14. The dead code one was embarrassing — we had written a CVE lookup function but forgot to actually call it. The Safari crash was nasty because it happened before anything even rendered. Added a try-catch wrapper and a fallback.

---

## What This Prototype Demonstrates

The prototype shows the core experience of Claude Signal:

1. **Generate** — User asks for code (or pastes their own)
2. **Verify** — Signal independently checks the code for syntax issues, security vulnerabilities, missing error handling, and complexity problems
3. **Decide** — User sees a clear signal (green/yellow/red), can expand for details, and chooses whether to accept or override
4. **Learn** — The calibration concept shows how the system would adapt to each user's patterns over time

The deployed version is live at: `https://claude-signal-prototype.vercel.app`

---

## What I Did Myself vs. What AI Did

| What AI Built | What I Did |
|---|---|
| All the code (frontend + backend) | Designed the product concept, features, and user flow |
| Fixed bugs when I reported them | Found the bugs by testing every path |
| Suggested technical approaches | Chose which suggestions to accept or reject |
| Deployed to Vercel and Render | Defined what success looks like and validated against it |
| Wrote the analysis engine patterns | Defined what the analyzer should look for and why |

**What I did NOT use AI for:**
- The 10-slide deck (professor checks for AI)
- The segmentation and problem analysis
- The competitive research and case studies
- The metrics framework and failure analysis
- Any strategic or product decisions

---

## My Takeaway on Using AI for Prototypes

AI is an incredibly powerful prototyping partner if you know how to direct it. I couldn't have built this alone — I'm not a developer. But I also couldn't have just said "build me a website" and gotten something useful. The value I added was:

1. **Knowing what to build** — the product vision, the user flow, the scenarios
2. **Knowing what good looks like** — I tested every interaction and rejected things that felt off
3. **Finding the gaps** — AI generates working code, but it doesn't think about edge cases. I had to actively break things to find what was missing
4. **Iterating with intent** — each round of fixes was driven by my testing, not random suggestions

The prototype is not perfect. There are bugs I'm sure we haven't found. But it demonstrates the core concept clearly, it's publicly accessible, and it shows that I understand both the product AND how to ship working software. That's what matters for this project.
