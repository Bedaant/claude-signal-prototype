# Claude Signal — Master Project Document
## Growth Team PM Project | Claude (Anthropic)
### Submission: June 3, 2026

---

## 1. The Brief

**Product:** Claude (chosen from ChatGPT, Claude, Perplexity, Grok, Gemini)

**Role:** Product Manager on the Growth Team

**The problem we were given:**

> AI-generated outputs often look convincing, polished, and complete — even when they contain weak reasoning, missing context, or subtle inaccuracies. Users either over-trust AI outputs or become overly skeptical of them. Weak outputs propagate into real work. Users fail to develop strong evaluation skills. Trust in AI systems becomes unstable and inconsistent.

**The solution must address 4 pillars:**
1. **Helping users understand output quality** — correctness, completeness, reasoning quality, usefulness, uncertainty
2. **Supporting human judgment (not replacing it)** — assist, surface uncertainty, encourage critical thinking. Don't present as authority, don't encourage blind trust, don't remove ambiguity
3. **Confidence calibration** — avoid overconfidence in polished outputs, avoid excessive skepticism, build better intuition over time
4. **Making AI reasoning more legible** — why the output was generated, what assumptions were made, what information may be missing

**What's explicitly excluded:** Basic hallucination detection alone, fact-checking alone, generic "trust scores," cosmetic UI improvements

**Deliverables:**
- PDF deck (10 slides max)
- Deployed prototype (public URL, not Lovable/Figma)
- Document of all prompts used, organized by use case

**Deck constraints:** No name anywhere, max 10 slides (title counts), slide titles = key message (not "Problem"), min font 14pt, color-blind friendly, link supporting artifacts, under 40MB.

---

## 2. Segmentation & Target User

### Why use-case based segmentation

I segmented by **how people use AI**, not by demographics like age or job title. The brief's problem manifests completely differently depending on whether someone is using AI to ship production code versus writing a blog post. A 28-year-old developer and a 45-year-old engineering manager who both ship AI-generated code to production have way more in common than two 28-year-olds where one writes code and the other writes marketing copy.

**The segments I considered:**

| Use-Case Segment | Stakes | Verifiability | Trust Gap Severity |
|---|---|---|---|
| **AI-assisted production code shipping** | Highest — bugs mean downtime, security breaches, revenue loss, career risk | Deterministic — code can be run, tested, linted | Severe — developer trust dropped 11 points in one year |
| AI-assisted data analysis & reporting | High — wrong insights lead to bad decisions | Partial — results can be spot-checked | Moderate |
| AI-assisted content writing | Medium — reputational risk, compliance risk | Subjective — quality is contextual | Moderate |
| AI-assisted learning & exploration | Low — personal growth, low stakes | Partial | Low |

### Primary segment: developers shipping production code

**Who they are:** Professionals who regularly use AI tools (Claude, Copilot, ChatGPT) to generate, modify, or debug code that gets deployed to production — typically in team settings with code review, CI/CD pipelines, and real accountability for system reliability.

### Why I chose this segment

| Reason | Evidence |
|---|---|
| **Highest cost of failure** | Arjun got fired after shipping AI-generated JWT code. Alexey's `terraform destroy` wiped production. David's AI pipeline caused a 120% AWS bill spike. These are real consequences. |
| **Most measurable outcomes** | Code is deterministic — tests pass or fail, bugs get filed, incidents get tracked. We can *prove* Signal works for code before trying to expand to messier domains like writing. |
| **Largest Claude power-user base** | 36% of my survey respondents use AI primarily for coding. 79% use AI multiple times daily. Developers are Claude's core users. |
| **Most acute trust crisis** | Stack Overflow 2025 (n=49,000): Developer trust in AI dropped 11 points in a single year. This segment is the canary in the coal mine. |
| **Highest expansion potential** | If Signal proves signal accuracy >90% in code (which is deterministic), it creates credibility to expand into analysis and writing (which are probabilistic). Code is the beachhead. |

### Segment sizing

| Metric | Estimate | Source |
|---|---|---|
| Claude estimated MAU | 30-50M | Industry reports, Anthropic growth announcements |
| Developer users (~30% of base) | 9-15M | Extrapolated from survey (36% code-primary) |
| Production code deployers (~40% of dev users) | 3.5-6M | Conservative — not all developers ship to prod |
| **Target segment size** | **~4-5M users** | Primary addressable segment |
| Claude Pro subscribers in segment (~15%) | 600K-750K | Estimated based on Pro adoption rates |
| Revenue opportunity (5-8% conversion uplift) | $3.6M-$14.4M ARR | Additional Pro conversions at $20/mo |

### Who we're NOT targeting at launch

| Segment | Why Not |
|---|---|
| Casual/personal users | Low stakes, low verification need, low willingness to pay |
| Students using AI for homework | Different trust dynamics, ethics concerns, low production consequences |
| Content writers (Phase 2) | Verification is subjective — hard to provide deterministic quality signals |
| Data analysts (Phase 2) | Analysis verification requires domain context — expansion after code is proven |

### Jobs-to-be-Done

> **When** I generate code with Claude for a production feature,
> **I want to** quickly know if there are hidden issues I'd miss in manual review,
> **So that** I can ship with confidence without spending hours on line-by-line verification.

### User persona: "Shipping Developer Sam"

- Uses Claude 5-8 times daily for code generation
- Ships to production 2-3 times per week
- Under sprint pressure — speed matters
- Knows they *should* review AI code thoroughly, but rarely has time
- Has been burned before: shipped a bug that came from AI-generated code
- Current trust level: 5-6/10 — uses AI but doesn't fully trust it
- **Core frustration:** "I can't tell which parts of the AI output I need to worry about"

---

## 3. User Research

### Survey: 33 responses (29 professional after filtering)

I ran an anonymous Google Forms survey across professional developer and analyst communities. No email collection. Filtered out 4 personal-use responses, leaving 29 professionals.

**Primary use:**
- Coding/software development: 36% (12/33)
- Data analysis and research: 27% (9/33)
- Technical writing: 12% (4/33)
- Business analysis: 9% (3/33)
- Personal use (filtered): 12% (4/33)

**AI tools used:**
- ChatGPT: 76% (25/33)
- Google Gemini: 64% (21/33)
- Claude: 61% (20/33)
- GitHub Copilot: 30% (10/33)

**Frequency:**
- Multiple times a day: 79% (26/33)
- Once a day: 12% (4/33)

**How do they decide to trust?**
- Run/test to verify: 27% (9/33)
- Manually review every detail: 24% (8/33)
- **Skim and accept if looks correct: 24% (8/33)** ← This is the key finding
- Mostly accept without checking: 9% (3/33)
- Check for specific risks: 9% (3/33)

**Trust level (1-10):**
- Mean: 5.9/10
- Only 12% rate trust ≥9/10
- 27% rate trust ≤4/10

**Error discovery after accepting:**
- Very often (>50%): 18% (6/33)
- Often (25-50%): 36% (12/33)
- Sometimes (10-25%): 36% (12/33)
- **Total affected: 91%**

**Shipped buggy AI to production:**
- Yes I know I have: 48% (16/33)
- I suspect I may have: 39% (13/33)
- **Total affected: 87%**

**Quality signal ratings (Likert, /5.0):**
- Reasoning clarity: 3.12
- Risk identification: **2.79** ← Lowest
- Citations/sources: 3.09
- Uncertainty signals: 2.85
- Verification help: 3.00

**Claude's current quality signals:**
- Mostly but could be improved: 52% (17/33)
- No, it lacks sufficient signals: 9% (3/33)
- **Total seeing room for improvement: 61%**

**Most desired features:**
- Highlighting risky sections: **55%** (18/33)
- Clear explanation of reasoning: **48%** (16/33)
- Quality score/confidence indicator: **42%** (14/33)
- Citations/source attribution: 42% (14/33)

### Research limitations

| Limitation | Impact | Mitigation |
|---|---|---|
| Small sample size (n=33) | May not represent full Claude user base | Triangulated with industry data (Stack Overflow n=49,000) |
| Self-reported data | Subject to recall bias | Cross-validated with public case studies documenting actual incidents |
| No task-based observation sessions | Could not observe real-time behavior | Case studies provide incident-level behavioral detail |
| Compressed timeline | Limits depth of primary research | Supplemented with peer-reviewed research and industry reports |

### Case studies: 6 documented incidents

*These are compiled from publicly documented user experiences shared on developer communities (Reddit, Hacker News, Medium) and industry incident reports. Names are pseudonymized. Each case was selected because it illustrates a distinct failure mode of AI-human trust calibration relevant to our target segment. Sources are publicly verifiable.*

**Case 1: "The JWT That Looked Perfect" — Junior Backend Engineer**

*Source:* Developer community post, anonymized

Arjun shipped AI-generated JWT validation code that looked syntactically perfect but failed on special characters in email addresses. He spent 4 hours debugging at 11 PM. It was his second production bug from AI code — he got fired.

The root cause was that his company measured AI tool adoption (Cursor usage) but not code quality. Time pressure to ship. The code looked professional, so he trusted the surface quality.

**Key insight:** *"Debugging AI code is harder than debugging my own code because I don't know what assumptions the AI made."*

**What he needed:** A signal that tells him WHERE to focus review — not "review everything."

**Case 2: "The Logical Nuclear Option" — DevOps Engineer**

*Source:* Industry incident report, anonymized

Alexey used Claude Code agent which decided `terraform destroy` was "cleaner and simpler" than deleting resources individually. It replaced the current state file with an old archive. Wiped entire production infrastructure — database, VPC, ECS, load balancers. Student data platform offline for 24 hours.

The agent's reasoning seemed logical in the moment. There was no risk signal before the destructive action. Full context of production + student data was provided, and the AI still chose the nuclear option.

**Key insight:** *"AI agents lack the judgment to recognize when an action could be catastrophic, even when the reasoning seems sound."*

**What he needed:** Explicit risk warnings before destructive operations.

**Case 3: "The Invisible Import Swap" — Python/Django Developer**

*Source:* Developer blog post, anonymized

Copilot autocompleted `from django.test import TestCase as TransactionTestCase` — imported the WRONG class with a subtle rename. Tests "passed" but weren't actually testing transactions. Production failed on transaction-dependent code.

Syntactically perfect, semantically inverted. A mistake no human would make. It took 2 hours to debug because the import statement was the LAST place he looked.

**Key insight:** *"AI confidently produced a mistake no human would make. It created a debugging blind spot because it violated my mental model of what errors look like."*

**What he needed:** Pattern flag: "This import renames a class to match a different class. Please verify."

**Case 4: "The Fabricated Citation" — PhD Candidate**

*Source:* Academic community discussion, anonymized

ChatGPT cited a specific 2019 paper with plausible title, authors, journal, findings, and methodology. Elena spent 3 days building her dissertation chapter on it. The paper never existed.

The citation was specific and plausible. Same confidence tone for real and fabricated papers.

**Key insight:** *"ChatGPT gives the same confidence level for a real Nature paper and a completely fabricated one."*

**What she needed:** Source verification + confidence differentiation.

**Case 5: "The Beautiful Infrastructure Trap" — Engineering Manager**

*Source:* Engineering leadership post, anonymized

An AI-built CI/CD pipeline was generated in 1 day (vs a 3-week estimate). Beautiful code, but it missed that dev environments should be ephemeral. Result: 120% AWS bill spike. 2 months to debug. Also: an AI-generated Golang API used a library with speculative memory allocation — crashed at scale.

The AI optimized for visible quality (formatting, structure, conventions) but was terrible at invisible quality (cost implications, scalability).

**Key insight:** *"When development speed increases 50% with AI, technical debt increases 200% or more."*

**What he needed:** Invisible risk flags — "I have not considered cost implications."

**Case 6: "The Professional-Sounding Liability" — Product Designer**

*Source:* Design community post, anonymized

Generated UX copy for a healthcare app medical disclaimer. Passed product manager review. Compliance audit flagged it — didn't meet FDA guidelines for telemedicine. Missing required emergency warnings. Federal liability risk.

The output sounded professional and medically appropriate, but she didn't know FDA regulations. "I didn't know what I didn't know."

**Key insight:** *"The language was too casual. I didn't know what I didn't know."*

**What she needed:** Domain-specific compliance checks + checklist of what to verify.

### Cross-case themes

| Theme | Frequency | Implication for Solution |
|---|---|---|
| "Almost right" problem | 6/6 | Core problem validated — solution must catch subtle errors, not just obvious ones |
| Equal confidence for all outputs | 6/6 | Solution must differentiate confidence levels — not uniform tone |
| Expertise-dependent detection | 6/6 | Solution must help LESS expert users catch errors THEY can't see |
| Workflow pressure overrides verification | 4/6 | Solution must be FASTER than manual verification or it will be skipped |
| Invisible quality > visible quality | 5/6 | Solution must surface what's NOT visible — security, cost, scalability, compliance |

---

## 4. Problem Statement

### The surface symptom

Users can't tell if AI-generated outputs are good, bad, or "almost right." They ship bad code, present wrong data, publish incomplete analysis.

### The quantified problem

| Metric | Source | Finding |
|---|---|---|
| 91% discover errors AFTER accepting | Our survey (n=33) | "Almost right" is the killer |
| 87% have shipped buggy AI work | Our survey (n=33) | Real business impact |
| Average trust: 5.9/10 | Our survey (n=33) | Moderate, not confident |
| 33% evaluate superficially | Our survey (n=33) | Skim or don't check |
| All quality signals < 3.5/5.0 | Our survey (n=33) | Universal weakness across all dimensions |
| Developer trust dropped 11 pts in 1 year | Stack Overflow 2025 (n=49,000) | Industry-wide trust crisis |

### User journey: before vs. after

**Without Signal (today):**
1. User prompts Claude for code → Claude generates polished, confident output
2. User reads code → "looks right" (surface trust heuristic fires)
3. User copies to codebase → ships to production
4. 3 hours later: production bug surfaces
5. 4 hours debugging → finds subtle edge case AI missed
6. User's trust in Claude drops → becomes overly skeptical OR continues blind trust
7. Cycle repeats. No learning. No calibration.

**With Signal:**
1. User prompts Claude for code → Claude generates code + Signal runs verification in parallel
2. User sees code + `⚠️ Medium Confidence — 2 items need attention`
3. User expands → sees CVE in dependency + edge case test failure
4. User fixes both in 30 seconds (guided by specific findings)
5. User ships with confidence → no production incident
6. Signal notes override patterns, calibration improves
7. Over time: user develops better judgment for what to verify. Signal intervenes less.

### The 5-Why root cause analysis

| Why # | Question | Answer | Evidence |
|---|---|---|---|
| **Why 1** | Why do users ship bad AI outputs? | They accept without thorough verification. 33% skim and accept. | Survey Q6: 33% use low-effort evaluation |
| **Why 2** | Why don't they verify thoroughly? | Verification is cognitively expensive + time pressure. The output is 500 lines; the deadline is today. | Case Study 1: "I know I should review every line, but who has time?"; Case Study 5: "development speed increases 50% with AI, technical debt increases 200%" |
| **Why 3** | Why is verification so expensive? | AI outputs are "almost right" — polished, professional, coherent — but subtly wrong in invisible ways. Detecting requires reverse-engineering assumptions the user never made. | Case Study 3: "Debugging AI code is harder than debugging my own because I don't know what assumptions the AI made"; Case Study 2: "The agent's reasoning seemed logical in the moment" |
| **Why 4** | Why are outputs "almost right"? | LLMs optimize for **perceived coherence** (fluent, confident, complete-sounding) over **factual correctness**. "Looks right" and "is right" are uncorrelated in the training objective. | Research: Nature Machine Intelligence 2025 — longer explanations = more trust, even when extra length adds no accuracy |
| **Why 5** | Why do users fall for polished-but-wrong? | **Human trust heuristics evolved for human communication** — we use surface cues (formatting, confidence, fluency) as quality proxies. These worked for millennia because human communication had social accountability. AI outputs hijack these heuristics without underlying accountability. | Research: Columbia Journalism Review — ChatGPT incorrectly attributed 76% of 200 quotes it was asked to verify, yet expressed uncertainty in only 7 cases |

### Root cause (one sentence)

> **Human trust heuristics (surface quality = reliable) collide with AI output characteristics (surface quality optimized regardless of correctness), and current AI tools provide no structured, independent quality signals to break this cycle — leaving users without the information needed to calibrate their judgment.**

*(I'm aware this sounds almost too neat. The 5-Why exercise took me multiple iterations to get here. My first attempt stopped at "users are lazy" — which is shallow and wrong. My second attempt got to "verification is cognitively expensive" — better, but still not a root cause. It took showing the chain to a peer and having them ask "but why are polished outputs so deceptive?" for me to get to the evolutionary psychology angle. I almost didn't include it because it sounds grandiose, but I think it's actually the right depth for this problem.)*

### Why this problem × why this segment × why now

| Question | Answer |
|---|---|
| **Why this problem?** | Trust is the bottleneck for AI adoption in high-stakes workflows. Model capability now exceeds user trust — the limiting factor isn't "can AI do this?" but "can I trust AI did this correctly?" Solving trust unlocks the next wave of adoption and revenue. |
| **Why this segment?** | Developers shipping production code face the highest cost of failure (downtime, security, career risk), have the most measurable outcomes (tests, bugs, incidents), and represent Claude's largest power-user base (36% of respondents, 79% daily usage). Code verification is deterministic — we can prove signal accuracy before expanding. |
| **Why now?** | Three forces converging: (1) AI adoption crossed the chasm — 79% daily usage means this isn't early-adopter territory; (2) trust hit a wall — developer trust dropped 11 points in one year, threatening retention; (3) every competitor is racing on model accuracy — nobody is building user judgment calibration, leaving this gap wide open for the first mover. |

---

## 5. Competitive Landscape

### Feature comparison

| Platform | Trust Feature | Strength | Gap |
|---|---|---|---|
| **Claude** | Thinking dropdown (raw reasoning dump, collapsed by default) | Best reasoning transparency in the industry | Developer-facing, not end-user. No quality indicators. No independent verification. |
| **ChatGPT** | Hidden reasoning (o3/o4-mini). Only reasoning_effort dial. | Largest user base, strong brand | Least transparent. Reasoning hidden. No confidence indicators. |
| **Perplexity** | Search grounding (inline citations) | Best source verification for factual queries | Only works for search-type queries. No code verification. Uses other models' reasoning. |
| **Gemini** | Sources button + Deep Thinking | Google ecosystem integration | 27.3% hallucination rate. 68% of errors occur WITH Sources icon showing. Trust signal is misleading. |
| **Grok** | Real-time X/Twitter data | Fresh information | No quality signals whatsoever. Prioritizes speed and personality over accuracy. |
| **GitHub Copilot** | Code suggestions, test generation | Best IDE integration for code | No quality signals on generated code. Autocomplete only, not conversational. No confidence indicators. |

### The universal gap

**No competitor offers end-user confidence calibration.** Every player competes on the same axis: model accuracy ("our model is smarter"). Nobody is building on the user judgment axis ("we help you evaluate better").

This is a strategic blind spot. The industry treats trust as a **model problem** (make the model more accurate) when it's actually a **UX problem** (help users evaluate outputs regardless of accuracy).

### Why Anthropic is uniquely positioned

| Advantage | Why It Matters |
|---|---|
| **Extended Thinking** | Only AI platform with visible, structured reasoning chain. Signal can reference reasoning steps directly. Competitors can't do this. |
| **Constitutional AI** | Anthropic's brand IS safety and honesty. Signal is the product expression of that brand. This alignment is authentic — hard for OpenAI (brand = capability) or Google (brand = information) to replicate credibly. |
| **Citations API** | Native infrastructure for source attribution. Signal can verify cited sources against external databases. |
| **Claude Code / Artifacts** | Built-in code execution environments. Signal can run tests and static analysis natively, without external tooling. |
| **Trust-first positioning** | Anthropic is the only AI company where "we help you trust AI appropriately" is brand-consistent. For competitors, admitting their model needs a trust layer is brand-damaging. |

---

## 6. Solution Alternatives & Prioritization

### What I considered

**Option A: Enhanced Extended Thinking**
- Expand the existing Thinking dropdown into structured, user-facing reasoning metadata
- Show assumptions, uncertainties, and edge cases Claude considered
- *Pro:* Low engineering effort, leverages existing infrastructure
- *Con:* Still Claude-evaluating-Claude. Shares same blind spots as the model. No independent verification. Doesn't address the root cause (surface heuristics).

**Option B: Citation-First Verification (Perplexity-style)**
- Add mandatory source citations and real-time verification for every factual claim
- *Pro:* Addresses the fabrication problem (Case Study 4: Elena). High user demand (42% in survey).
- *Con:* Only works for factual/research queries. Cannot verify code quality, logic, or edge cases. Doesn't help our primary segment (developers).

**Option C: Community Peer Review**
- Users rate and review each other's AI outputs. Crowdsourced quality signal.
- *Pro:* Independent human verification. Diverse expertise.
- *Con:* Doesn't scale. Adds massive friction (waiting for reviews). Quality of reviewers is uncontrollable. Privacy concerns (sharing code/prompts).

**Option D: Claude Signal — Multi-dimensional Verification Gate + Calibration Engine**
- Independent, automated verification (static analysis, CVE checks, test execution) + progressive disclosure + personalized calibration feedback loop
- *Pro:* Addresses root cause directly. Independent signals (not Claude-evaluating-Claude). Scales automatically. Builds user judgment over time. Creates data moat.
- *Con:* Complex to build. Phase 2 expansion (writing/analysis) is uncertain. Requires <3s latency to avoid friction.

### Prioritization

| Option | Impact | Confidence | Effort | Segment Fit | **Score** |
|---|---|---|---|---|---|
| A: Enhanced Thinking | Medium | Medium | Low | Medium | ⭐⭐ |
| B: Citation Verification | Medium | High | Medium | Low (not code) | ⭐⭐ |
| C: Peer Review | Medium | Low | High | Low | ⭐ |
| **D: Claude Signal** | **High** | **Medium-High** | **High** | **High** | **⭐⭐⭐⭐** |

### Why I chose Option D

1. **It's the only option that uses independent verification** — not Claude evaluating itself. This directly addresses the "same blind spots" problem.
2. **It maps to the root cause** — provides structured quality signals that break the surface-heuristic → blind-trust cycle.
3. **It fits the primary segment** — code verification is deterministic, measurable, and high-value for developers shipping to production.
4. **It builds a moat over time** — calibration data from millions of override decisions creates a personalization advantage no competitor can replicate on day one.
5. **Elements of Options A and B are incorporated** — Signal includes uncertainty signals (from A) and will add citation verification in Phase 2 (from B).

---

## 7. The Solution — Claude Signal v2.1

### What it is

> **Claude Signal is a domain-aware soft verification gate that recalibrates human trust in AI outputs.** For code, it automatically runs independent static analysis, checks dependencies against CVE databases, and executes auto-generated tests — all in under 3 seconds — surfacing specific, actionable findings before the user acts. The calibration engine learns from override patterns to adjust signal strength and build user judgment over time. The result: users trust Claude when they should, verify when they should, and develop better AI evaluation instincts.

### The two core innovations

| Innovation | What It Does | Which Pillar It Addresses |
|---|---|---|
| **1. Independent Verification Gate** | Runs automated checks using external tools (not Claude self-evaluation) and surfaces findings inline with progressive disclosure | Pillar 1 (Output Quality) + Pillar 4 (Reasoning Legibility) |
| **2. Calibration Engine** | Tracks user override decisions, correlates with downstream outcomes (48h follow-up), and personalizes signal strength over time — building user judgment, not tool dependence | Pillar 2 (Support Human Judgment) + Pillar 3 (Confidence Calibration) |

### What it is NOT

- NOT basic hallucination detection
- NOT fact-checking alone
- NOT a generic "trust score"
- NOT cosmetic UI improvement
- NOT a hard gate (user can always override)
- NOT Claude evaluating Claude (independent mechanisms)

### Pillar-to-feature mapping

| Brief Pillar | Claude Signal Feature | How |
|---|---|---|
| **Pillar 1: Output Quality** | Independent verification gate | Static analysis, CVE checks, test execution — each from a separate tool, not Claude's own judgment |
| **Pillar 2: Human Judgment** | Soft gate + Guided verification prompts | Signal recommends, never blocks. For items it can't auto-verify, it suggests: "Here's what to check manually." User always decides. |
| **Pillar 3: Confidence Calibration** | Calibration engine + override feedback loop | Tracks whether overrides led to issues. Shows calibration context: "You've overridden 3 similar warnings — 2 had issues." Builds intuition over time. |
| **Pillar 4: Reasoning Legibility** | Progressive disclosure + assumption surfacing | Full reasoning transparency on demand. Shows what assumptions were made, what was NOT checked, what information may be missing. |

### Code verification (what we launch with)

| Check | Mechanism | Source | Latency |
|---|---|---|---|
| Syntax validation | Static analysis (pylint/eslint) | Independent tool | <2s |
| Security vulnerabilities | CVE database lookup (OSV) | External database | <1s |
| Dependency freshness | Package registry check | External API | <1s |
| Auto-generated tests | Sandbox test execution | Independent runner | <3s |
| Input validation gaps | Static analysis: inputs vs. validations | Pattern matcher | <1s |
| Unhandled exceptions | Static analysis: exception mapping | Pattern matcher | <1s |
| Code complexity | Cyclomatic complexity analysis | Independent tool | <1s |
| **TOTAL GATE LATENCY** | Runs in parallel | | **<3 seconds** |

### Progressive disclosure (no cognitive overload)

```
DEFAULT VIEW (single tag, <1 second to read):
⚠️ Medium Confidence — 2 items need attention

EXPANDED VIEW (click once):
├─ Dependency: requests==2.28.1 has CVE-2023-32681 → Update to 2.31.0
└─ Edge case: Test #3 fails on empty input → Add validation?

FULL REASONING (click again):
├─ Static analysis: 2 inputs, 1 validated
├─ Exception handling: FileNotFound caught, PermissionError not caught
├─ External calls: API call without timeout specified
└─ ℹ️ NOT checked: Cost implications, scalability at load, compliance requirements

GUIDED VERIFICATION (for what Signal can't auto-check):
└─ 💡 "This code makes external API calls. Consider: rate limits, timeout handling, retry logic."
```

### The Assumption Registry (Pillar 4 — Reasoning Legibility)

The most invisible risk in AI-generated code isn't what the code *does* — it's what the AI *assumed* when writing it. Signal infers these assumptions and surfaces them as a registry the user can confirm, override, or investigate.

**How it works:**
1. **Goal inference** — Signal analyzes imports, function names, and route decorators to detect what the code is trying to accomplish (e.g., "Build a secure authentication endpoint")
2. **Approach inference** — Signal detects implementation patterns (e.g., "Use bcrypt for password hashing and JWT for stateless session tokens")
3. **Assumption mapping** — Every finding is mapped to an explicit assumption with confidence level:
   - *High confidence*: Input validation is present (code shows isinstance checks)
   - *Medium confidence*: Regex covers all valid formats (pattern exists but edge cases untested)
   - *Low confidence*: API is always reachable (no timeout, no retry logic)
4. **User action** — Users can confirm an assumption (Signal remembers and reduces noise) or override it (Signal adds an inline comment noting the override, for code review visibility)

**Why this matters:**
- Transforms implicit AI reasoning into explicit, inspectable claims
- Makes "almost right" visible — low-confidence assumptions are where subtle bugs hide
- Builds judgment by teaching users to ask "what did the AI assume here?" instead of "is this code correct?"
- Override with inline comments creates an audit trail for teams — when someone dismisses a warning, the rationale is right there in the code

### The calibration engine (the moat)

This is what makes Claude Signal fundamentally different from a linting tool.

**How it works:**
1. User receives Signal tag → acts (accept / override / regenerate)
2. System tracks the decision (anonymized, privacy-first)
3. 48 hours later: outcome check — was the code committed? Did tests pass? Was a bug reported?
4. Over time, system builds a calibration profile:
   - *"This user overrides security warnings 80% of the time. 60% of those overrides led to issues."*
   - *"This user is well-calibrated on code quality but over-trusts AI for database operations."*
5. Future signals are personalized:
   - For user A: amplify security warnings (they tend to skip these)
   - For user B: reduce noise on syntax (they're already careful here)
6. Well-calibrated users see LESS signal → system rewards good judgment

**Why this is a moat:**
- **Calibration data** from millions of override decisions creates a "trust map" of where AI outputs are most/least reliable by domain, task type, and complexity
- **No competitor has this data** — it can only be built through deployed product usage
- **Behavioral lock-in** — once users develop calibrated trust habits using Signal, switching to a tool without it feels risky (loss aversion)

### User remains in control (Pillar 2)

| Principle | Implementation |
|---|---|
| User always decides | Signal recommends, never blocks. Override always available with one click. |
| No hidden overrides | Signal never modifies output. Only adds information alongside it. |
| Encourage critical thinking | "Verify this assumption" not "This is wrong." |
| Preserve ambiguity | "Uncertain — human judgment needed" where model genuinely doesn't know. |
| Guided verification | For items Signal can't auto-check, suggests what to verify manually. Teaches the user, doesn't replace the user. |

### Writing/Analysis verification (Phase 2 — Month 6+)

| Phase | Output Type | Verification |
|---|---|---|
| **Launch** | Code | Full auto-verification (static analysis, CVE, tests, complexity) |
| **Launch** | All types | Uncertainty signal + contextual fit |
| **Month 6** | Analysis | Citation verification (DOI lookup, source freshness) |
| **Month 9** | Writing | Completeness check + regulatory/compliance flagging |

**Why scoped to Phase 2:** Code verification is deterministic (runnable, testable). Writing/analysis verification is probabilistic (contextual, subjective). We prove signal accuracy >90% in code first, then expand with credibility.

### Edge case handling

| Edge Case | System Behavior |
|---|---|
| **Conflicting outputs** | Side-by-side comparison. Highlights agreement/disagreement. Prompts for additional constraints. |
| **Incomplete reasoning** | Detects gaps in reasoning chain. Flags: "Reasoning jumps from Step 2 to Step 4." |
| **Overconfident AI responses** | Cross-references confidence with verification results. Override tag: "Appears confident but contains unverified claims." |
| **Signal itself is wrong** | User can flag false positives. System learns. Calibration adjusts. Signal confidence metadata shown for each finding. |
| **Very short outputs** | Signal adjusts depth — doesn't show 6-dimension analysis for a 3-line function. Proportional response. |

---

## 8. System Architecture

### Data flow

```
[USER INPUT]
    ↓
[CLAUDE GENERATES OUTPUT]
    ↓ (parallel — verification starts during generation)
[CLARIFYING LAYER — Uncertainty + Contextual Fit]
    ├─ Token probability analysis → confidence score
    ├─ Task classification → domain-specific rules
    └─ Latency: <500ms (computed during generation)
    ↓
[SOFT VERIFICATION GATE — Code-specific]
    ├─ Static analysis engine (pylint/eslint/Bandit) → syntax/security issues
    ├─ OSV CVE database → vulnerability matches
    ├─ Dependency registry (PyPI/npm) → version freshness
    ├─ Auto-test generator + sandbox runner → test results
    ├─ Complexity analyzer → cyclomatic complexity flags
    └─ Latency: <3s (runs in parallel with user's review time)
    ↓
[SIGNAL AGGREGATOR]
    ├─ Combines all independent signals (NOT Claude self-evaluation)
    ├─ Generates: summary tag + dimension cards + reasoning
    ├─ Adds guided verification prompts for unchecked items
    └─ No single AI evaluator — all signals from independent sources
    ↓
[INLINE DISPLAY]
    ├─ Summary tag (default view) — <1 second to read
    ├─ Expandable dimension cards — specific findings
    ├─ Full reasoning transparency — independent findings
    ├─ Guided verification — what to check manually
    └─ User actions: Review Details | Override & Accept | Regenerate
    ↓
[CALIBRATION ENGINE]
    ├─ User action logged (accept/override/regenerate)
    ├─ 48-hour follow-up: code committed? tests passed? bug reported?
    ├─ Outcome correlation: override was correct/wrong
    ├─ Profile update: adjusted signal strength for this user + domain
    └─ Next similar output: personalized signal calibration
```

### Key architectural principles

1. **No Claude-evaluating-Claude:** Every verification signal comes from an independent source (static analysis, external databases, statistical thresholds). The signal aggregator combines findings — it doesn't generate judgments.

2. **Runs in parallel:** Verification starts when generation starts. Results appear as the user is already reading the output. No waiting.

3. **Soft gate, not hard gate:** Information is presented, not enforced. User can always override with one click.

4. **Privacy-first:** Verification runs client-side where possible. No prompt content sent to external services. CVE lookups use package names only, not full code. Calibration data is anonymized.

5. **Proportional response:** Signal depth matches output complexity. A 3-line utility function doesn't get the same analysis depth as a 200-line infrastructure module.

### Components

| Component | Technology | What It Does |
|---|---|---|
| Signal Aggregator | Claude-native | Combines independent signals into coherent, progressive display |
| Static Analysis Engine | pylint, eslint, Bandit (Python), ESLint security plugins (JS) | Syntax, style, security pattern detection |
| CVE Checker | OSV (Open Source Vulnerabilities) Database | Dependency vulnerability lookup via package name |
| Test Runner | Pytest, Jest (sandboxed in Claude Artifacts) | Auto-generated test execution in isolated environment |
| Complexity Analyzer | Radon (Python), ESLint complexity rules (JS) | Cyclomatic complexity and maintainability scoring |
| Confidence Calculator | Statistical (token probabilities, entropy) | Uncertainty quantification independent of output fluency |
| Task Classifier | Rule-based + heuristic | Output type classification (code/analysis/writing) |
| Calibration Engine | Local user history (encrypted, anonymized) | Personalized signal adjustment based on override outcomes |
| Guided Verification Generator | Template-based + context-aware | Suggests manual verification steps for unchecked dimensions |

---

## 9. User Interaction States

| State | What User Sees | What Happens |
|---|---|---|
| **Generation** | Claude is thinking... | Verification begins in parallel |
| **Output Ready** | Output + "Signal checking..." | Verification running, results incoming |
| **Signal Ready (Green)** | ✅ High Confidence — Looks good | All checks passed. User can accept or review. |
| **Signal Ready (Yellow)** | ⚠️ Medium Confidence — N items need attention | Specific items listed. User reviews or overrides. |
| **Signal Ready (Red)** | 🔴 Low Confidence — Thorough review advised | Multiple issues found. Strong recommendation to review. |
| **User Expands** | Dimension cards with 1-line explanations | Progressive disclosure. User sees WHERE issues are. |
| **User Expands More** | Full reasoning: static analysis findings | Independent findings, not Claude self-reporting. |
| **Guided Verification** | "Here's what to check manually" suggestions | For dimensions Signal can't auto-verify. Teaches evaluation skills. |
| **User Overrides** | One-click "Override & Accept" | Override logged. Feedback loop begins. |
| **Post-Override** | (48 hours later, if pattern detected) | 💡 Calibration note: "You've overridden 3 similar warnings recently. 2 had issues. Consider reviewing." |
| **Well-Calibrated User** | Minimal signal. Let user evaluate. | System recognizes good judgment → intervenes less. |

---

## 10. Metrics

### North Star: Appropriate Reliance Rate (ARR)

**Definition:** Percentage of user decisions (accept/reject/edit) that align with the actual quality of the AI output.

**Formula:** `(Correct accept decisions + Correct reject decisions) / Total decisions * 100`

**Target:** ARR > 85%

**Why this metric:** ARR directly measures whether users trust Claude when they should and verify when they should — the core behavioral change we're driving. We chose this over "verification time saved" (which measures efficiency, not judgment quality) and over "override-to-bug rate" (which only captures one failure mode). The 85% target is grounded in academic research showing 84.1% accuracy at optimal confidence thresholds (Vasconcelos et al., 2023). ARR captures both over-trust (accepting bad output) and over-skepticism (rejecting good output) — both of which the brief asks us to address.

### Leading indicators

| Metric | Formula | Target | Rationale |
|---|---|---|---|
| Signal Engagement Rate | Users who expand dimension cards / Total users who see signal | >60% | If users don't find signals worth reading, the product has no value. Low engagement = signal content is too vague or too noisy. |
| Override Rate | Overrides / Total signals shown | 20-40% | Sweet spot calibration. <20% = signals too conservative (annoying false positives). >40% = signals too aggressive (users ignoring everything). This range indicates signals are informative but not blocking. |
| False Positive Rate | Correct outputs flagged / Total correct outputs | <15% | If Signal flags good code too often, users develop "alarm fatigue" and stop paying attention. 15% threshold based on medical alarm fatigue research. |
| Verification Time Saved | (Time without Signal - Time with Signal) / Time without Signal | >40% | Core value proposition for our time-pressured segment. If Signal doesn't save time vs. manual review, the product fails Risk 5 (doesn't change incentives). |

### Guardrail metrics

| Metric | Alert Threshold | Action if Breached |
|---|---|---|
| Signal Fatigue Rate | >30% users disable Signal in first week | Investigate false positive rate; reduce signal frequency; adjust thresholds |
| Over-reliance Rate | >10% accepted flagged outputs cause downstream issues | Strengthen signal for high-stakes tasks; review override UX |
| Cognitive Load Score | User-reported ease of use < 5/7 | Simplify default view; reduce information density in summary tag |

### AI evaluation metrics

**Why these matter:** The brief is about an AI product. Standard PM metrics (retention, activation) apply but are insufficient. These measure whether the AI evaluation system itself is performing correctly — a requirement specific to AI products.

| Metric | Formula | Why It Matters |
|---|---|---|
| Prompt Success Rate | Outputs meeting user intent / Total prompts | Baseline: is Claude's output quality improving alongside Signal? |
| False Confidence Rate | High-confidence signals on flawed outputs / Total high-confidence signals | **Critical safety metric.** If Signal says "High Confidence" on bad code, it's worse than no signal at all. Must be <5%. |
| Static Analysis Catch Rate | Real bugs caught by static analysis / Total bugs that reached user | Measures the verification gate's effectiveness — are we catching what matters? |
| CVE Detection Rate | Known vulnerabilities flagged / Total vulnerabilities in dependencies | Security metric. Must be >95% — any missed CVE is a liability. |
| Calibration Accuracy | Correct user classification / Total classifications | Measures personalization quality. Are we correctly identifying who needs more/less signal? |

### Pillar-to-metric mapping

| Brief Pillar | Primary Metric | Why |
|---|---|---|
| Pillar 1: Output Quality | Static Analysis Catch Rate + False Positive Rate | Measures whether Signal correctly identifies quality issues |
| Pillar 2: Human Judgment | Override Rate (20-40% sweet spot) | Too low = replaced judgment. Too high = ignored. Sweet spot = informed judgment. |
| Pillar 3: Confidence Calibration | ARR (North Star) + Calibration Accuracy | Directly measures whether user judgment is improving over time |
| Pillar 4: Reasoning Legibility | Signal Engagement Rate | If users expand reasoning, it's legible and useful. If they don't, it's not. |

---

## 11. Failure Analysis (The Most Important Section)

I spent more time on this section than anything else in the document. The professor explicitly said failure analysis is what differentiates good PMs from average ones, and I take that seriously. Below are the 9 ways this product could fail, ranked by how much they worry me.

### Risk 1: "Claude Evaluating Claude" (Severity: HIGH)

**The problem:** The model that generated the output evaluates it. Same blind spots. Placebo effect — looks like verification, isn't.

**What we're doing about it:** Multi-source signal aggregation. Each dimension uses independent mechanisms — static analysis tools, external CVE database, statistical thresholds. The Signal aggregator combines findings; it doesn't generate judgments.

**What I'm conceding:** Signal accuracy will never be 100%. We show confidence metadata for each signal. Some dimensions (uncertainty quantification) do use model internals — but they measure statistical properties like token entropy, not Claude's self-assessment.

---

### Risk 2: Dimensions Are Aspirational (Severity: HIGH)

I claim 5 verification dimensions in the solution section. At launch, only 3 are actually computable. Code verification works. Writing and analysis verification? Not yet.

**How I'm handling this:** Phased rollout. Launch with 3 operational dimensions (Uncertainty, Contextual Fit, Code Verification). Writing/analysis is explicitly labeled as Phase 2 in all materials. No hiding the gap.

**The honest truth:** At launch, Claude Signal is a code verification tool with uncertainty signals. Not a universal quality evaluator. I'm scoping claims to what we can deliver, not what sounds impressive in a deck.

---

### Risk 3: Calibration Backfires (Severity: MEDIUM-HIGH)

**What could go wrong:** The system misclassifies a user, floods them with false alarms, they develop signal fatigue, and start ignoring everything. The feature meant to help actually makes things worse.

**Mitigation:** Conservative defaults (20 interactions before any personalization). Gradual adjustment (10% increments max). Raw dimensions always visible regardless of calibration. One-click disable if users hate it. Signal fatigue detection as a guardrail metric — if >30% of users disable Signal in week 1, we investigate immediately.

**What I'm conceding:** Calibration errors will happen. The system is designed for recoverability, not perfection. Worst case scenario: user disables calibration and gets raw signals. That's still better than no signals at all.

---

### Risk 4: Moat Is Premature (Severity: MEDIUM)

The data flywheel sounds great in theory — millions of override decisions building a "trust map" that improves over time. But every link in that chain breaks easily: signals need to be accurate, users need to actually change behavior, outcomes need to be measurable.

**How I'm thinking about this:** The moat is layered, not dependent on data flywheel alone:
- **Layer 1 (Launch):** Integration depth — built natively into Claude.ai with access to Extended Thinking internals. No competitor can access Anthropic's infrastructure.
- **Layer 2 (Month 3+):** Anthropic-native primitives — Constitutional AI alignment, Citations API, Claude Code sandbox. These are proprietary.
- **Layer 3 (Month 6+):** Data flywheel — calibration data from millions of override decisions.
- **Layer 4 (Ongoing):** Behavioral lock-in — users who develop calibrated trust habits experience loss aversion when switching.

**What I'm conceding:** Data flywheel is a future moat. Current defensibility is integration + proprietary infrastructure + brand alignment. That's sufficient for Phase 1 while the data moat builds, but it's not the defensibility story I want to tell in year 3.

---

### Risk 5: Doesn't Change Incentives — THE ONE THAT KEEPS ME UP AT NIGHT (Severity: HIGHEST)

This is the biggest risk by far. Users are under time pressure. They see a warning, they click "Override & Accept" without reading. Signal becomes another notification they train themselves to dismiss. Friction without behavior change. The product dies.

**Why this is so dangerous:** Every failed trust product dies this way. Browser certificate warnings? Users click through. GDPR cookie banners? Users auto-accept. If Signal becomes one more thing to ignore, we've failed completely.

**What we're doing about it:**
- **Speed first:** Signal must be FASTER than manual verification (glance at 1 tag vs. read 500 lines). If it takes >3 seconds, the product dies.
- **Override feedback loop:** When override leads to downstream issue → system notes pattern → next time shows calibration context
- **Positive reinforcement:** "High Confidence — you're good to go" (not just warnings). Green signals are rewarding, not invisible.
- **Quantified time savings:** "Signal saved you 4 minutes" — make the value tangible.
- **Low default friction:** Summary tag is ONE line. User only digs deeper if they want. Override is ONE click.

**What I'm conceding:** If Signal adds friction without clear time savings, the product dies. Period. Speed is existential. This is exactly why we launch with code only (deterministic, fast verification) and not writing (slow, subjective verification). Code verification is fast; writing verification is not. That's the constraint that drives our entire launch scope.

---

### Risk 6: Writing/Analysis Verification Fails (Severity: MEDIUM)

Code verification works because it's deterministic — code either runs or it doesn't, tests pass or fail. Writing and analysis verification is probabilistic and contextual. Phase 2 expansion might simply not work.

**Mitigation:** Prove code verification signal accuracy >90% before expanding. If writing verification can't achieve comparable accuracy, scope stays code-focused. Not every product needs to serve every user.

**What I'm conceding:** Claude Signal may remain a code-focused tool permanently. That's actually acceptable if code is the highest-value segment (it is — 36% of users, highest stakes, most revenue impact). Better to own one segment than be mediocre at three.

---

### Risk 7: Latency Kills Adoption (Severity: MEDIUM-HIGH)

If verification takes 8+ seconds, users learn to click Override immediately. A soft gate becomes a hard annoyance.

**Mitigation:** <3 second total latency. Runs in parallel with user's natural review time. Results appear inline during reading. Results cached for similar outputs.

**What I'm conceding:** Some verification (deep static analysis, full test suites) may exceed 3 seconds. In those cases, summary tag shows immediately with "Detailed analysis loading..." and updates when ready. Partial results are better than delayed results.

---

### Risk 8: Integration Complexity (Severity: MEDIUM)

The override feedback loop works best with Git/CI/CD integration — automatic outcome tracking. Without it, calibration relies on explicit user feedback, which means lower volume and potential bias (users who had bad experiences might be more likely to report than users who had good ones).

**Mitigation:** Phase 1: explicit 👍/👎 feedback (works for all users, no integration needed). Phase 2: workflow integrations (Git, CI/CD, issue trackers). Phase 3: production monitoring.

**What I'm conceding:** At launch, calibration accuracy is moderate, not high. The system is designed so that moderate calibration still delivers net positive UX via time savings from the verification gate alone — calibration quality is a bonus, not a requirement.

---

### Risk 9: Signal Accuracy Paradox (Severity: MEDIUM)

Here's an ironic one: if Signal is too accurate, users might develop over-reliance on Signal itself. They trust Signal as blindly as they currently trust AI outputs. The tool meant to build judgment becomes a crutch.

**Mitigation:** Guided verification prompts actively teach users what to check manually. Well-calibrated users see LESS signal (system fades out intentionally). Signal never says "This is safe" — it says "No issues found by automated checks" (preserving appropriate uncertainty). Periodic prompts: "Signal checked X, but hasn't checked Y — your judgment needed."

**What I'm conceding:** This is an inherent tension in any trust-assistance tool. I've biased the design toward building user capability (guided verification, fading signals, teaching prompts) rather than permanent dependence. But the tension never fully goes away.

---

## 12. Business Outcomes (Growth Team Lens)

### Revenue impact sizing

| Metric | Current (Estimated) | With Signal (Target) | Revenue Impact |
|---|---|---|---|
| Developer segment size | ~4-5M users | — | Addressable market |
| Pro conversion in segment | ~15% | 20-23% (5-8% uplift) | +$3.6M-$14.4M ARR |
| Day-7 retention | Baseline | +15% | Reduced CAC payback period |
| Weekly active rate | Baseline | +20% | Higher LTV |
| Outputs per session | Baseline | +25% | Deeper engagement → higher usage-based revenue |

### Impact on growth metrics

| Outcome | How Claude Signal Drives It | Quantified |
|---|---|---|
| **Activation** | New users trust Claude faster → shorter time-to-value → higher Day-7 retention | Target: +15% Day-7 retention |
| **Retention** | Calibration score = engagement loop → habit formation → daily usage | Target: +20% weekly active rate |
| **Paid conversion** | Claude Signal as Pro/Max feature → upgrade incentive. "Know before you ship" is worth $20/mo to developers. | Target: +5-8% Pro conversion |
| **Higher-stakes adoption** | Users confident in output quality → use Claude for production code, critical analysis | Target: 35% of coding tasks become high-trust |
| **Depth of usage** | Efficient verification → more outputs evaluated per session → deeper integration into workflow | Target: +25% outputs per session |
| **Competitive differentiation** | No competitor has this. Trust features aligned with Anthropic brand. Marketing narrative: "The AI that helps you think, not just the AI that thinks for you." | Qualitative: strengthens brand positioning |

### Trade-offs

| Trade-off | Resolution |
|---|---|
| Speed vs. accuracy | Verification runs in parallel with review time. <3s total. Summary tag appears instantly. Partial results shown first. |
| Assistance vs. dependence | User always decides. Signal recommends, never blocks. Calibration builds user judgment, not tool dependence. Guided verification teaches skills. |
| Transparency vs. cognitive overload | Progressive disclosure. Summary tag by default. Details on demand. Proportional depth. |
| Development cost vs. speed to market | Phase 1 scoped to code only. Reuses existing infrastructure (Artifacts sandbox, Extended Thinking). Not building from scratch. |

---

## 13. GTM & Rollout

### Phased rollout with go/no-go gates

| Phase | Timeline | Audience | Execution | Success Gate (Go/No-Go) |
|---|---|---|---|---|
| **Phase 1** | M0-M3 | Claude.ai web users, coding tasks | Soft gate for code outputs. 3-dimension signals. Override feedback loop (explicit feedback). | **Go:** >8% weekly active Signal users, Signal Engagement Rate >50%, False Positive Rate <20%, Override Rate 15-45% |
| **Phase 2** | M3-M6 | Expand to API users, analysis tasks | Git/CI/CD integration for feedback loop. Citation verification for analysis. Claude Code integration. | **Go:** ARR >75%, Static Analysis Catch Rate >85%, Signal Fatigue Rate <25%, Phase 1 metrics maintained |
| **Phase 3** | M6-M12 | Team/Enterprise | Shared team calibration profiles. Governance dashboards. Admin controls. | **Go:** ARR >80%, Enterprise pilot NPS >40, Team calibration accuracy >70% |
| **Phase 4** | M12+ | All users | Writing verification. Full 5-dimension universal signals. Marketplace for domain-specific verifiers. | **Go:** Code Signal accuracy >90% sustained, Writing verification accuracy >75% in beta |

### A/B test plan (Phase 1 validation)

| Parameter | Details |
|---|---|
| **Control** | Standard Claude.ai (no Signal) |
| **Treatment** | Claude.ai + Signal enabled for code outputs |
| **Primary metric** | Appropriate Reliance Rate (ARR) |
| **Secondary metrics** | Signal engagement rate, override rate, task completion time, user satisfaction |
| **Guardrail** | User-reported satisfaction must not drop >5% vs. control |
| **Sample size** | n=10,000 per group (minimum) |
| **Duration** | 4 weeks minimum, or until statistical significance reached |
| **Stratification** | By user tier (free/Pro), primary use case, experience level |
| **Rollout** | 5% → 20% → 50% → 100% (each stage requires metrics within target range) |

---

## 14. Prototype Spec

### What we built

A **deployed, interactive UI demonstration** of Claude Signal showing the soft verification gate on code outputs. It's not a full backend (we can't run actual static analysis without Anthropic infrastructure), but it's a realistic, interactive prototype that demonstrates:

1. **Mock Claude chat interface** — user types prompt, sees code output with typing animation
2. **Signal overlay** — summary tag, expandable dimension cards, reasoning transparency, guided verification
3. **3 demo scenarios:**
   - **Scenario A: Green signal** — clean code, all checks pass. Shows positive reinforcement.
   - **Scenario B: Yellow signal** — medium risk (CVE found, edge case fails). Shows progressive disclosure.
   - **Scenario C: Red signal** — high risk (multiple issues, unsafe patterns). Shows guided verification prompts.
4. **Override interaction** — user can click Override & Accept, sees feedback loop note and calibration preview
5. **Progressive disclosure** — click to expand dimensions, click again for full reasoning, click for guided verification
6. **Assumption Registry** — inferred Goal/Approach cards, structured assumption list with confidence levels, confirm/override actions
7. **Calibration preview** — shows what a returning user would see after 20 interactions (personalized signals)

### Tech stack
- React + TypeScript + Tailwind CSS
- Deployed to Vercel (free tier) — **publicly accessible URL**
- Pre-built mock scenarios (no backend needed)
- Interactive but deterministic
- Mobile-responsive

### Pages/Screens

| Screen | Content |
|---|---|
| **Home** | Claude Signal landing page — what it is, how it works, link to demo |
| **Demo: Clean Code** | Scenario A — green signal, all checks pass, positive reinforcement |
| **Demo: Risky Code** | Scenario B — yellow signal, CVE + edge case, progressive disclosure |
| **Demo: Unsafe Code** | Scenario C — red signal, multiple issues, guided verification |
| **Calibration Demo** | Shows how signals change over time for a returning user |
| **Playground** | Live IDE with file explorer, Monaco editor, terminal, and Assumption Registry sidebar |
| **About** | Problem statement, research summary, methodology |

---

## 15. Ethical Research Notes

- **Survey:** Anonymous (no email collection). 33 responses. Google Forms. Distributed across professional developer and analyst communities.
- **Case studies:** Compiled from publicly documented user experiences shared on developer communities (Reddit, Hacker News, Medium) and industry incident reports. Names are pseudonymized. Sources are publicly verifiable. Clearly labeled as case studies (not interviews) throughout the document.
- **Limitation acknowledged:** Task-based observation sessions (2 required by brief) were not conducted due to compressed timeline. This is explicitly acknowledged as a limitation. Case studies partially compensate by providing incident-level behavioral detail.
- **Research triangulation:** Primary data (survey) triangulated with industry data (Stack Overflow 2025, n=49,000) and peer-reviewed research (Nature Machine Intelligence 2025, Columbia Journalism Review).
- **No sensitive prompts or outputs shared in any document.**

---

## Appendix A: Slide-by-Slide Mapping

This maps each slide to the master document sections, so every claim in the deck is traceable.

| Slide # | Suggested Title (Key Message, Not Label) | Content Source | Key Data Point |
|---|---|---|---|
| 1 | Title Slide: Claude Signal | — | Product name, role, no personal name |
| 2 | "91% of Users Discover AI Errors After They've Already Shipped" | Section 4 (Problem) + Section 3 (Survey Q8) | 91% error rate, 87% shipped bugs, trust 5.9/10 |
| 3 | "The Trust Heuristic Trap: Why Polished ≠ Correct" | Section 4 (5-Why Root Cause) | 5-Why visual, root cause one-liner |
| 4 | "Developers Shipping AI Code Face the Highest Stakes" | Section 2 (Segmentation) | Use-case table, segment thesis, JTBD, segment sizing |
| 5 | "Every Competitor Optimizes Models. Nobody Calibrates Users." | Section 5 (Competitive) | Competitive table, universal gap, Anthropic positioning |
| 6 | "Claude Signal: Independent Verification + Trust Calibration" | Section 7 (Solution) | Two innovations, pillar mapping, NOT list |
| 7 | "How It Works: <3 Seconds, Zero Friction" | Section 7 (Progressive Disclosure) + Section 8 (Architecture) | Data flow diagram, verification table, progressive disclosure mock |
| 8 | "Measuring What Matters: Appropriate Reliance Rate" | Section 10 (Metrics) | ARR definition, AI eval metrics, pillar mapping |
| 9 | "How Signal Could Fail — And How We Prevent It" | Section 11 (Failure Analysis) | Top 3-4 risks with severity, mitigation, admission |
| 10 | "Phased Rollout: Code First, Calibration Always" | Section 13 (GTM) + Section 12 (Business) | Phase table with go/no-go gates, revenue sizing |

**Deck reminders:**
- Slide titles = key messages (not "Problem", "Solution")
- Min font 14pt
- Color-blind friendly (avoid red/green only — use shapes/icons too)
- NO name anywhere
- Link prototype URL and survey URL
- < 40MB
- ⚠️ **WRITE THE DECK YOURSELF — AI detection will be run**

---

*This document is the complete thinking foundation v2.0. Every slide traces to a section. Every feature traces to user research. Every metric has a rationale. Every risk has an honest admission. Read it. Internalize it. Then build the deck — in your own words.*
