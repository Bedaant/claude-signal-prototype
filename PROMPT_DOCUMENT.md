# Prompt Log — Claude Signal Project

This is my record of AI prompts used throughout the project, which the brief asks us to submit. I've organized them roughly by what I was working on at each stage, rather than by some perfect taxonomy — because that's how projects actually go.

**Tools I used:** Claude (main workhorse), ChatGPT (for cross-checking claims), Gemini (for search grounding when I needed sources).

**How I thought about AI usage:** I used it as a research assistant and implementation partner, not a replacement for thinking. Every strategic decision — which segment to target, what the 5-Why chain should look like, how to position against competitors — that was my call. The deck is written entirely by me (the professor runs AI detection, so that's non-negotiable). But for analyzing survey data, finding research papers, critiquing my ideas, and building the prototype? AI was invaluable.

---

## Part 1: Survey Work

### Getting the survey drafted

My first prompt to Claude was pretty open-ended because I wasn't sure yet what angles would matter:

> I'm putting together a quick survey to see how people evaluate AI output quality (like code, writing, etc.). Target audience is professionals using Claude/ChatGPT/Copilot every day. Can you help me draft like 12-15 questions? I want to cover what they use it for, how they decide if they can trust the output, when they discover errors, whether current tools give them any useful quality signals, and what features they'd want to make evaluating easier. Mix up the question types — multiple choice, Likert, a couple open-ended. Needs to be under 5 minutes. And no PII, fully anonymous.

Claude gave me a solid first draft. I iterated on it twice — mostly cutting questions that felt redundant and rewording a couple that seemed leading. The final survey went out as a Google Form.

### Analyzing responses

I got 33 responses, which honestly felt small but it was what I could get in the time I had. I dumped the CSV into Claude and asked:

> Hey, I've got 33 responses from my survey. Can you run some analysis? I'm looking for: (1) basic distributions for each question, (2) cross-tabs — trust level vs how often they find errors, usage frequency vs trust, (3) does the data actually support my hypothesis that users lack quality signals?, (4) given the sample size is only 33, what's statistically significant vs just noise?, and (5) anything surprising that goes against expectations? Give it to me in structured tables so I can drop it into my research doc.

The cross-tab on trust vs error discovery was the most useful finding — it showed that even people who rated their trust high were still finding errors frequently, which supported my core argument that current trust signals are broken.

---

## Part 2: Competitive Research

### Mapping the competitive landscape

I needed to understand how competitors handle trust, so I asked:

> I need a competitive breakdown of how these 5 AI platforms handle output quality and user trust: Claude (extended thinking), ChatGPT (o3/o4-mini reasoning), Perplexity (search grounding), Gemini (sources button and deep thinking), and GitHub Copilot. For each, what trust/quality features do they have today, how do they communicate confidence, and where are they falling short on trust calibration? Just focus on end-user UI/UX, not API stuff.

This gave me a solid foundation, but I cross-checked it myself by actually opening each product and using them. Claude's analysis was mostly accurate but missed that Gemini's Sources button is actually pretty misleading — it shows sources even when the model is hallucinating, which I discovered through hands-on testing.

### Finding industry data

> Can you find me some recent industry data (2024-2025) on: (1) developer trust levels in AI generated code, (2) error rates in AI code from academic studies, (3) how users behave when they see AI confidence signals, and (4) hallucination rates across platforms? I need actual numbers and sources I can cite. Large sample sizes preferred.

The Stack Overflow 2025 survey (n=49,000) was the goldmine here — the 11-point trust drop in one year became a cornerstone of my problem statement. I verified every source independently; one paper Claude cited didn't exist when I checked, so I dropped it.

---

## Part 3: Problem Analysis

### Stress-testing my 5-Why

I had drafted a 5-Why chain and wanted to know if it was actually logical or if I was fooling myself:

> I'm working on a 5-Why root cause analysis for "why users ship bad AI outputs." Here's what I have:
> 
> Why 1: They accept without checking thoroughly (33% just skim)
> Why 2: Checking takes too much brainpower and they're rushed
> Why 3: AI outputs look "almost right" — polished but subtly wrong
> Why 4: LLMs optimize for sounding coherent and confident, not necessarily being correct
> Why 5: Human trust heuristics evolved for human communication, so AI hijacks these surface cues
> 
> Critique this. Does each why logically flow? Did I miss a branch? Is Why 5 actually deeper than Why 4 or am I reaching? What evidence would I need to back up each level?

Claude's critique was genuinely useful — it pointed out that Why 3 and Why 4 were closely related and suggested I reframe Why 4 around training objectives rather than just "optimization." I rewrote the chain based on this feedback.

### Academic grounding

> I need academic papers supporting these two points: (1) "LLMs produce longer, more confident explanations that increase user trust even when accuracy doesn't improve" and (2) "AI systems express similar confidence for correct and incorrect outputs." Anything from 2023-2025? Give me titles, authors, journals, and main findings. Please double-check these are real papers.

The Nature Machine Intelligence 2025 paper on explanation length and trust was exactly what I needed. I found it through Claude's suggestion but read the abstract and methodology myself before citing it.

---

## Part 4: Case Studies

I had collected 6 incidents from Reddit, Hacker News, and Medium. I needed help structuring them:

> I've pulled together 6 case studies of AI failures from public sources. I need to structure each one as: (1) what happened, (2) root cause tied back to trust calibration, (3) key insight in one sentence, and (4) what product feature would have prevented it. Can you analyze each as a "trust heuristic failure" — why did their judgment break down?

The JWT case and the terraform destroy case were the strongest. The PhD citation fabrication case was interesting but less relevant to my developer-focused segment, so I kept it brief.

---

## Part 5: Solution Design

### Architecture reality check

Before committing to the full architecture, I wanted to know what was technically delusional:

> I'm designing "Claude Signal" — a soft verification gate for AI-generated code. Here's the architecture: [described the parallel verification pipeline]. Tear this apart. Is static analysis actually runnable in under 2 seconds? Will OSV CVE lookups take less than 1 sec? Can auto-generated tests run in a sandbox in under 3s? Does this parallel execution model make sense? What are the biggest technical hurdles? Be brutal.

Claude flagged three things: (1) sandboxed test execution in <3s is optimistic without warm containers, (2) OSV queries are fast but unreliable if the service is down, and (3) the calibration engine's 48-hour feedback loop assumes CI/CD integration that doesn't exist yet. All three became explicit risks in my failure analysis.

### Metrics framework

> I'm figuring out the North Star metric for an AI trust product. Options: A) Appropriate Reliance Rate (decisions matching actual quality), B) Verification Time Saved, C) Override-to-Bug Rate, D) Signal Engagement Rate. Break down what each actually measures, how people might game them, and which best captures "users trust Claude when they should and verify when they should."

I went with ARR (Appropriate Reliance Rate) based on this analysis, though I still worry it's hard to measure in practice.

---

## Part 6: Pre-Mortem

> I've designed Claude Signal. Now do a pre-mortem — how does this fail? Tech failures, user behavior failures (what if they just ignore it?), strategic failures (what if OpenAI copies it?), product failures (what if it makes the problem worse?). For each: severity, likelihood, mitigation. Be pessimistic.

The "users click Override without reading" risk became my highest-priority concern. It's what drove the <3s latency requirement and the positive reinforcement design (green signals, not just warnings).

---

## Part 7: Prototype Build

### Initial build

> I need a React + TypeScript + Tailwind prototype for "Claude Signal." Here's my spec: [attached PROTOTYPE_SPEC.md]. Needs to deploy to Vercel, dark mode, 3 demo scenarios, progressive disclosure UI, override flow with feedback, framer-motion animations, react-syntax-highlighter for code, mobile responsive. Write complete code for all components. No TODOs or placeholders. Production-ready look.

This was the longest prompt chain — probably 15+ back-and-forths to get from the initial build to the final polished version. The biggest pain point was getting the progressive disclosure animations smooth; it took several iterations to get the height animations working properly with framer-motion's AnimatePresence.

### Iteration tweaks

After the first deploy, I asked for specific fixes:

> The typewriter effect is choppy. Can we make it smoother? Also the Signal tag needs a subtle glow pulse, the override feedback card should slide in nicely, the mobile nav is broken and needs a hamburger menu, and can we add a calibration demo page showing how signals adapt over time?

Then later, after a visual overhaul:

> I want to pivot the whole look from purple to warm amber — like Linear's UI or a Zentry clone. Deep charcoal backgrounds, amber accent (#f5a623), glass navigation, hero glow effects, staggered scroll animations. Also replace the robot icon with an abstract sonar pulse logo.

Then the IDE-style playground:

> Can we turn the playground into a full IDE experience? File explorer sidebar, tab bar, terminal panel at the bottom, Monaco editor instead of fake code blocks. Users should be able to paste multi-file projects and see line-level findings with decorations.

And the backend:

> Build me an Express backend with SQLite, real static analysis, OSV CVE lookups, and NVIDIA NIM integration for code generation. Deploy to Render.

---

## Part 8: Cross-Validation

I ran this same prompt through ChatGPT to see if it would catch things Claude missed:

> I'm pitching "Claude Signal" for Anthropic — a soft verification gate running static analysis, CVE checks, and tests on AI code, showing results inline before the user accepts. Poke holes in this: Why won't it work? What's my weakest assumption? Who will hate this and why? What am I missing? Is there a simpler way? Don't hold back — this is for my PM graduation project.

ChatGPT raised a concern Claude didn't: the "alarm fatigue" problem. If Signal flags too many things, users learn to ignore it entirely. I added the false positive rate guardrail metric (<15%) and the gradual calibration approach specifically because of this feedback.

---

## What I Did NOT Use AI For

| Task | Why |
|---|---|
| **Deck writing** | Professor explicitly said no AI. Runs detection on it. |
| **Segmentation decision** | Had to be my judgment call based on survey + case studies. |
| **5-Why construction** | I built the chain myself; AI only critiqued it after. |
| **Prioritization** | RICE scoring and option selection were my calls. |
| **Case study curation** | I picked which incidents to include based on relevance to my segment. |

---

## A Few Principles I Tried to Follow

1. **AI analyzes; I decide.** I used it for data crunching, research, and coding — never for strategic calls.
2. **Cross-check everything.** If Claude said something surprising, I asked ChatGPT or Gemini the same thing. If they disagreed, I dug deeper myself.
3. **Critique > generation.** My most useful prompts were "what's wrong with this?" not "do this for me."
4. **Verify sources.** AI-surfaced papers and data points were independently checked before citing.
5. **Be transparent.** This document exists so evaluators can see exactly what I used AI for — and what I didn't.

---

*This log is honest about where AI helped and where it didn't. The thinking is mine. The prototype code is AI-assisted. The deck is entirely human-written. That's the balance I tried to strike.*
