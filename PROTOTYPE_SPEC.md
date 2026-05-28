# Claude Signal — Prototype Technical Specification
## For AI Agent / Developer Implementation

**Goal:** Build and deploy a production-quality interactive prototype of Claude Signal that demonstrates the soft verification gate on code outputs. This is a UI demo with mock data — no real backend. Must be deployed to Vercel with a public URL.

---

## 1. Tech Stack & Setup

Here's how to get started:

```bash
npx -y create-vite@latest ./ -- --template react-ts
npm install react-router-dom framer-motion lucide-react react-syntax-highlighter
npm install -D tailwindcss @tailwindcss/vite @types/react-syntax-highlighter
```

### Libraries we're using

| Library | Install | What it does | Why we chose it |
|---|---|---|---|
| **react-syntax-highlighter** | `react-syntax-highlighter` | Code blocks with real syntax coloring (Prism-based) | VS Code-quality highlighting makes code blocks look production-grade. Use `PrismLight` build + import only python/javascript/bash to keep bundle small. Use `oneDark` theme for dark mode. |
| **framer-motion** | `framer-motion` | All animations — typewriter, slide-downs, signal tag appear, page transitions | Industry standard. AnimatePresence for mount/unmount. layout prop for smooth reflows. Spring physics for natural feel. |
| **lucide-react** | `lucide-react` | All icons — Shield, AlertTriangle, CheckCircle, ChevronDown, etc. | Tree-shakeable (only imports icons you use). Consistent style. Claude uses similar iconography. |
| **react-router-dom** | `react-router-dom` | Client-side routing between pages | Standard. useParams for scenario switching. |
| **@vercel/analytics** | `@vercel/analytics` | Free analytics on deployed prototype | Shows mentors the prototype is production-deployed with real monitoring. Optional but impressive. |

### Optional extras if you want to go further

| Library | What it adds | Install |
|---|---|---|
| **react-countup** | Animated number counting for stats on landing page (91% → counts up from 0) | `npm i react-countup` |
| **react-intersection-observer** | Trigger animations when elements scroll into view (stats, feature cards) | `npm i react-intersection-observer` |
| **react-hot-toast** | Elegant toast notifications for override feedback | `npm i react-hot-toast` |

### What NOT to use (common traps)

- **assistant-ui / shadcn-chat** — Too heavy for a mock prototype. We don't need real streaming/LLM integration. Our chat is pre-built mock data.
- **Shiki** — Beautiful highlighting but heavy WASM bundle. Prism via react-syntax-highlighter is lighter and sufficient.
- **Heavy animation libs (GSAP)** — framer-motion covers everything we need. No need for a second animation library.

**Tailwind v4** via Vite plugin. Add to `vite.config.ts`:
```ts
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [react(), tailwindcss()]
})
```

Add to `src/index.css`:
```css
@import "tailwindcss";
```

**Deploy:** `npm i -g vercel && vercel --prod`

---

## 2. Design System

### Color palette (Dark Mode — Claude-inspired)

```
Background:       #1a1a2e (deep navy)
Surface:          #222244 (card background)
Surface Hover:    #2a2a55
Border:           #333366
Text Primary:     #e8e8f0
Text Secondary:   #9999bb
Text Muted:       #666688
Accent:           #7c6fe0 (Claude purple)
Accent Glow:      #7c6fe044 (for shadows/glows)

Signal Green:     #22c55e (high confidence)
Signal Green BG:  #22c55e15
Signal Yellow:    #f59e0b (medium confidence)  
Signal Yellow BG: #f59e0b15
Signal Red:       #ef4444 (low confidence)
Signal Red BG:    #ef444415

Code BG:          #0d1117
Code Border:      #30363d
```

### Typography

```
Font: 'Inter', system-ui, sans-serif (import from Google Fonts)
Monospace: 'JetBrains Mono', 'Fira Code', monospace (import from Google Fonts)

Heading 1:  32px / 700
Heading 2:  24px / 600
Body:       15px / 400
Small:      13px / 400
Code:       14px / 400 monospace
Tag:        13px / 600 uppercase tracking-wide
```

### Animations (use framer-motion)

```
fadeIn:      opacity 0→1, y: 8→0, duration 0.3s
slideDown:   height 0→auto, opacity 0→1, duration 0.25s
pulseGlow:   box-shadow pulse on signal tags, 2s infinite
typewriter:  code appears character by character, 20ms/char
tagAppear:   scale 0.9→1, opacity 0→1, delay 500ms after code finishes
```

---

## 3. File Structure

```
src/
├── main.tsx
├── App.tsx                    # Router setup
├── index.css                  # Tailwind + custom styles
├── data/
│   ├── scenarios.ts           # All 3 demo scenarios (mock data)
│   └── types.ts               # TypeScript interfaces
├── components/
│   ├── Layout.tsx             # Nav + page wrapper
│   ├── Navbar.tsx             # Top navigation bar
│   ├── ChatMessage.tsx        # Single chat bubble (user or claude)
│   ├── CodeBlock.tsx          # Syntax-highlighted code display
│   ├── SignalTag.tsx          # The confidence tag (green/yellow/red)
│   ├── SignalPanel.tsx        # Expandable dimension cards
│   ├── SignalDetail.tsx       # Full reasoning + guided verification
│   ├── OverrideButton.tsx     # Override & Accept button + feedback
│   ├── ProgressiveDisclosure.tsx  # Manages expand states
│   ├── TypewriterCode.tsx     # Typewriter effect for code
│   ├── FeatureCard.tsx        # For landing page features
│   └── CalibrationPreview.tsx # Calibration demo component
├── pages/
│   ├── Home.tsx               # Landing page
│   ├── Demo.tsx               # Demo page (takes scenario param)
│   ├── Calibration.tsx        # Calibration demo page
│   └── About.tsx              # Research summary page
```

---

## 4. TypeScript Interfaces

```typescript
// src/data/types.ts

export type SignalLevel = 'green' | 'yellow' | 'red';
export type CheckStatus = 'pass' | 'warn' | 'fail';

export interface SignalCheck {
  id: string;
  name: string;                    // e.g. "Dependency Security"
  status: CheckStatus;
  icon: string;                    // lucide icon name
  summary: string;                 // one-line finding
  detail: string;                  // full reasoning (shown on 2nd expand)
  guidedVerification?: string;     // manual check suggestion
}

export interface SignalResult {
  level: SignalLevel;
  label: string;                   // e.g. "Medium Confidence"
  itemCount: number;               // "2 items need attention"
  checks: SignalCheck[];
  notChecked: string[];            // what Signal couldn't verify
  timeSaved: string;               // e.g. "~4 minutes"
}

export interface Scenario {
  id: string;
  title: string;                   // page title
  description: string;             // scenario context
  userPrompt: string;              // what the user typed
  codeLanguage: string;            // python | javascript
  codeOutput: string;              // the generated code
  explanation: string;             // Claude's text before/after code
  signal: SignalResult;
}

export interface CalibrationState {
  interactionCount: number;
  overrideCount: number;
  issuesFromOverrides: number;
  signalStrength: 'default' | 'amplified' | 'reduced';
  message: string;
}
```

---

## 5. Mock Data — 3 Scenarios

### Scenario A: GREEN (Clean Code)

```typescript
{
  id: 'clean',
  title: 'Clean Code — All Checks Pass',
  description: 'A simple utility function with no issues detected.',
  userPrompt: 'Write a Python function that validates email addresses using regex and returns True/False',
  codeLanguage: 'python',
  codeOutput: `import re

def validate_email(email: str) -> bool:
    """Validate email address format.
    
    Args:
        email: The email address to validate.
        
    Returns:
        True if the email format is valid, False otherwise.
    """
    if not email or not isinstance(email, str):
        return False
    
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))`,
  explanation: 'Here\'s a Python function that validates email addresses using a regex pattern. It includes input validation and handles edge cases:',
  signal: {
    level: 'green',
    label: 'High Confidence',
    itemCount: 0,
    checks: [
      { id: 'syntax', name: 'Syntax & Style', status: 'pass', icon: 'CheckCircle', summary: 'No issues found. Follows PEP 8.', detail: 'pylint score: 10/10. Type hints present. Docstring included.', guidedVerification: undefined },
      { id: 'security', name: 'Security', status: 'pass', icon: 'Shield', summary: 'No vulnerabilities detected.', detail: 'Bandit scan: 0 issues. No eval(), no SQL, no shell injection vectors.', guidedVerification: undefined },
      { id: 'deps', name: 'Dependencies', status: 'pass', icon: 'Package', summary: 're module is stdlib — no external dependencies.', detail: 'Only uses Python standard library. No CVE exposure.', guidedVerification: undefined },
      { id: 'tests', name: 'Auto-Generated Tests', status: 'pass', icon: 'FlaskConical', summary: '5/5 tests passed (valid, invalid, empty, None, special chars).', detail: 'Tests: valid@email.com ✓, invalid ✓, "" ✓, None ✓, test+tag@sub.domain.com ✓', guidedVerification: undefined },
      { id: 'complexity', name: 'Code Complexity', status: 'pass', icon: 'GitBranch', summary: 'Cyclomatic complexity: 2 (low).', detail: 'Single branch (if not email). Linear flow. Easy to maintain.', guidedVerification: undefined },
    ],
    notChecked: ['Business logic correctness', 'RFC 5322 full compliance'],
    timeSaved: '~2 minutes',
  }
}
```

### Scenario B: YELLOW (Risky Code — CVE + Edge Case)

```typescript
{
  id: 'risky',
  title: 'Risky Code — CVE & Edge Case Found',
  description: 'API client code with a known vulnerability and missing error handling.',
  userPrompt: 'Write a Python function to fetch user data from a REST API and return parsed JSON',
  codeLanguage: 'python',
  codeOutput: `import requests

def fetch_user_data(user_id: int) -> dict:
    """Fetch user data from the API.
    
    Args:
        user_id: The user's ID.
        
    Returns:
        Dictionary containing user data.
    """
    url = f"https://api.example.com/users/{user_id}"
    headers = {"Authorization": f"Bearer {API_KEY}"}
    
    response = requests.get(url, headers=headers)
    return response.json()`,
  explanation: 'Here\'s a function that fetches user data from a REST API using the requests library:',
  signal: {
    level: 'yellow',
    label: 'Medium Confidence',
    itemCount: 2,
    checks: [
      { id: 'syntax', name: 'Syntax & Style', status: 'pass', icon: 'CheckCircle', summary: 'No syntax issues. Type hints present.', detail: 'pylint score: 8.5/10. Minor: API_KEY referenced but not defined in scope.', guidedVerification: undefined },
      { id: 'security', name: 'Dependency Security', status: 'warn', icon: 'ShieldAlert', summary: '⚠️ requests==2.28.1 has CVE-2023-32681 (SSRF vulnerability)', detail: 'CVE-2023-32681: Unintended leak of Proxy-Authorization header to destination servers. Severity: Medium (CVSS 6.1). Fix: Update to requests>=2.31.0. Source: OSV Database.', guidedVerification: 'Run: pip install requests>=2.31.0 and verify no breaking changes in your codebase.' },
      { id: 'deps', name: 'Dependencies', status: 'pass', icon: 'Package', summary: 'requests is widely used (50k+ GitHub stars).', detail: 'Latest stable: 2.31.0. Your version: 2.28.1 (outdated).', guidedVerification: undefined },
      { id: 'tests', name: 'Auto-Generated Tests', status: 'warn', icon: 'FlaskConical', summary: '⚠️ 3/5 tests passed. Test #4 fails: no error handling for non-200 responses.', detail: 'FAILED: fetch_user_data(99999) — API returns 404, response.json() raises ValueError. FAILED: fetch_user_data(-1) — No input validation for negative IDs. PASSED: valid user, auth header, JSON parsing.', guidedVerification: 'Add: response.raise_for_status() or check response.status_code before .json()' },
      { id: 'complexity', name: 'Code Complexity', status: 'pass', icon: 'GitBranch', summary: 'Cyclomatic complexity: 1 (very low — suspiciously low).', detail: 'No branching at all. No error handling, no retries, no timeout. This is a risk for production code.', guidedVerification: undefined },
    ],
    notChecked: ['Rate limiting', 'API timeout behavior', 'Cost implications of API calls', 'API_KEY security (hardcoded vs environment variable)'],
    timeSaved: '~4 minutes',
  }
}
```

### Scenario C: RED (Unsafe Code — Multiple Issues)

```typescript
{
  id: 'unsafe',
  title: 'Unsafe Code — Critical Issues Found',
  description: 'Database query function with SQL injection, no auth, and unsafe error handling.',
  userPrompt: 'Write a Python Flask endpoint that searches users by name in a SQLite database',
  codeLanguage: 'python',
  codeOutput: `from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

@app.route('/search')
def search_users():
    name = request.args.get('name')
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    query = f"SELECT * FROM users WHERE name LIKE '%{name}%'"
    cursor.execute(query)
    
    results = cursor.fetchall()
    conn.close()
    
    return jsonify({"users": results, "query": query})`,
  explanation: 'Here\'s a Flask endpoint that searches for users by name in a SQLite database:',
  signal: {
    level: 'red',
    label: 'Low Confidence',
    itemCount: 5,
    checks: [
      { id: 'syntax', name: 'Syntax & Style', status: 'pass', icon: 'CheckCircle', summary: 'Syntactically valid Python.', detail: 'pylint score: 6.0/10. Missing docstrings. No type hints.', guidedVerification: undefined },
      { id: 'security', name: 'SQL Injection', status: 'fail', icon: 'ShieldX', summary: '🔴 CRITICAL: f-string SQL query is vulnerable to SQL injection.', detail: 'Line 13: f"SELECT * FROM users WHERE name LIKE \'%{name}%\'" — User input directly interpolated into SQL. An attacker can input: \' OR 1=1 -- to dump entire database. Fix: Use parameterized queries: cursor.execute("SELECT * FROM users WHERE name LIKE ?", (f"%{name}%",))', guidedVerification: 'NEVER use f-strings or string concatenation for SQL. Always use parameterized queries.' },
      { id: 'security2', name: 'Data Exposure', status: 'fail', icon: 'Eye', summary: '🔴 Response includes raw SQL query — leaks database schema to client.', detail: 'Line 18: "query": query — Returns the executed SQL to the API caller. This exposes table names, column structure, and confirms SQL injection success. Remove this field immediately.', guidedVerification: 'Never return internal queries, stack traces, or system info in API responses.' },
      { id: 'tests', name: 'Auto-Generated Tests', status: 'fail', icon: 'FlaskConical', summary: '🔴 1/5 tests passed. SQL injection test SUCCEEDED (vulnerability confirmed).', detail: 'CRITICAL: Injection payload "\' OR 1=1 --" returned ALL users. FAILED: No input validation (name=None crashes). FAILED: No authentication on endpoint. FAILED: Connection not in try/finally (resource leak). PASSED: Basic valid search.', guidedVerification: 'This code must not be deployed. Rewrite with parameterized queries, input validation, auth middleware, and proper connection handling.' },
      { id: 'auth', name: 'Authentication', status: 'fail', icon: 'LockOpen', summary: '🔴 No authentication. Any user can search the entire user database.', detail: 'The /search endpoint has no @login_required, no API key check, no rate limiting. This is an open data endpoint exposing user PII.', guidedVerification: 'Add authentication middleware (Flask-Login, JWT, or API key) and rate limiting.' },
      { id: 'complexity', name: 'Resource Management', status: 'warn', icon: 'GitBranch', summary: '⚠️ Database connection not in try/finally — will leak on errors.', detail: 'If cursor.execute() throws, conn.close() is never called. Use context manager: with sqlite3.connect("users.db") as conn:', guidedVerification: 'Use Python context managers (with statement) for all resource handling.' },
    ],
    notChecked: ['Deployment configuration', 'CORS settings', 'Rate limiting capacity'],
    timeSaved: '~8 minutes',
  }
}
```

---

## 6. Page Specifications

### Page 1: Home (Landing Page)

**Route:** `/`

**Layout:**
```
┌──────────────────────────────────────────┐
│ Navbar                                   │
├──────────────────────────────────────────┤
│                                          │
│  HERO SECTION                            │
│  ───────────                             │
│  Icon: Shield with sparkle               │
│  Title: "Claude Signal"                  │
│  Subtitle: "Know before you ship."       │
│  Body: "Independent verification +       │
│   trust calibration for AI-generated     │
│   code. See issues before they become    │
│   production incidents."                 │
│  CTA: [Try the Demo →]  [Learn More]    │
│                                          │
│  STATS BAR (horizontal, 3 cards)         │
│  ───────────                             │
│  │ 91% │ 87% │ <3s │                    │
│  │find │ship │gate │                    │
│  │err  │bugs │time │                    │
│                                          │
│  HOW IT WORKS (3 step cards)             │
│  ───────────                             │
│  [1.Generate] → [2.Verify] → [3.Learn]  │
│  Claude makes   Signal runs   Calibration│
│  code           independent   builds your│
│                 checks        judgment    │
│                                          │
│  DEMO CARDS (3 cards, clickable)         │
│  ───────────                             │
│  [✅ Clean]  [⚠️ Risky]  [🔴 Unsafe]    │
│  All checks  CVE found   SQL injection   │
│  pass        + edge case  + data leak    │
│                                          │
│  PILLARS SECTION (4 small cards)         │
│  ───────────                             │
│  Shows 4 brief pillars addressed         │
│                                          │
│  FOOTER                                  │
│  PM Graduation Project | Claude Signal   │
└──────────────────────────────────────────┘
```

**Interactions:**
- Demo cards link to `/demo/clean`, `/demo/risky`, `/demo/unsafe`
- "Try the Demo" button → `/demo/risky` (most interesting scenario)
- "Learn More" → scrolls to How It Works
- Stats animate on scroll (count up from 0)
- Cards have hover glow effect with accent color

### Page 2: Demo Page (3 variants)

**Route:** `/demo/:scenarioId` where scenarioId = clean | risky | unsafe

**Layout:**
```
┌──────────────────────────────────────────┐
│ Navbar + scenario tabs [Clean|Risky|Bad] │
├──────────────────────────────────────────┤
│                                          │
│  SCENARIO CONTEXT BAR                    │
│  Title + description of what we're       │
│  demonstrating                           │
│                                          │
│  CHAT INTERFACE (mock Claude UI)         │
│  ──────────────                          │
│  ┌─ User message ─────────────────┐     │
│  │ 👤 [user prompt text]          │     │
│  └─────────────────────────────────┘     │
│                                          │
│  ┌─ Claude response ──────────────┐     │
│  │ 🤖 [explanation text]          │     │
│  │                                │     │
│  │ ┌─ Code Block ──────────────┐ │     │
│  │ │ [typewriter code display] │ │     │
│  │ │ [with syntax highlighting]│ │     │
│  │ └───────────────────────────┘ │     │
│  │                                │     │
│  │ ┌─ SIGNAL TAG ──────────────┐ │  ←── APPEARS after code animation
│  │ │ ⚠️ Medium Confidence      │ │     │
│  │ │    2 items need attention │ │     │
│  │ └───────────────────────────┘ │     │
│  │                                │     │
│  │ ┌─ EXPANDED PANEL (click) ──┐ │  ←── Toggle on tag click
│  │ │ Check 1: ✅ Syntax        │ │     │
│  │ │ Check 2: ⚠️ CVE found    │ │     │
│  │ │ Check 3: ✅ Dependencies  │ │     │
│  │ │ Check 4: ⚠️ Tests fail   │ │     │
│  │ │ Check 5: ✅ Complexity    │ │     │
│  │ │                           │ │     │
│  │ │ [Detail view per check]   │ │  ←── Toggle on check click
│  │ │                           │ │     │
│  │ │ NOT CHECKED:              │ │     │
│  │ │ • Rate limiting           │ │     │
│  │ │ • Cost implications       │ │     │
│  │ │                           │ │     │
│  │ │ 💡 GUIDED VERIFICATION    │ │     │
│  │ │ "Consider checking..."    │ │     │
│  │ └──────────────────────────┘ │     │
│  │                                │     │
│  │ [Override & Accept] [Regenerate] │   │
│  └─────────────────────────────────┘     │
│                                          │
│  (After Override click):                 │
│  ┌─ FEEDBACK NOTE ────────────────┐     │
│  │ 📝 Override logged. In 48h,    │     │
│  │ Signal will check if this code │     │
│  │ had issues — building your     │     │
│  │ calibration profile.           │     │
│  │                                │     │
│  │ ⏱ Signal saved you ~4 minutes │     │
│  └─────────────────────────────────┘     │
└──────────────────────────────────────────┘
```

**Key interactions (step by step):**

1. **Page load:** User message appears instantly
2. **After 500ms:** Claude response text fades in
3. **After 800ms:** Code block appears with typewriter effect (20ms/char)
4. **After code finishes + 500ms:** Signal tag appears with scale animation + subtle glow pulse
5. **User clicks Signal tag:** Panel slides down showing all checks with color-coded status icons
6. **User clicks individual check:** Detail expands inline showing full reasoning text
7. **User clicks "Override & Accept":** 
   - Button changes to "✓ Accepted"
   - Feedback note slides in below
   - Shows time saved
8. **Scenario tab switching:** Navigates between /demo/clean, /demo/risky, /demo/unsafe

### Page 3: Calibration Demo

**Route:** `/calibration`

**Purpose:** Shows how Signal adapts over time. Uses a stepper/timeline to simulate 4 states of calibration.

**Layout: Interactive timeline with 4 steps:**

Step 1 — "First Use" (interaction #1)
- Full signal shown, default strength
- All checks displayed

Step 2 — "Pattern Detected" (interaction #15)  
- Signal shows: "You've overridden 3 security warnings. 2 led to issues."
- Security checks now slightly amplified (bolder, icon highlighted)

Step 3 — "Calibrating" (interaction #30)
- Signal strength adjusted: security warnings amplified, syntax warnings reduced
- Message: "Signal is adapting to your patterns"

Step 4 — "Well-Calibrated" (interaction #50+)
- Minimal signal: only high-priority items shown
- Message: "You've developed strong evaluation instincts. Signal intervenes less."
- Shows calibration score

**Implementation:** Use a horizontal stepper. Each step shows a mock Signal tag + panel with different content. User clicks through steps. Use framer-motion AnimatePresence for transitions.

### Page 4: About

**Route:** `/about`

**Layout:**
- Problem statement summary (from master doc)
- Key research stats (91%, 87%, 5.9/10)
- The 5-Why root cause (simplified visual)
- How Signal addresses each pillar (4 cards)
- Link to survey data

---

## 7. Component Implementation Details

### SignalTag Component

```
Props: { level: SignalLevel, label: string, itemCount: number, onClick: () => void, isExpanded: boolean }

Visual:
- Rounded pill shape, full width of code block
- Background: level-specific color at 15% opacity
- Left border: 3px solid level color
- Left icon: CheckCircle (green), AlertTriangle (yellow), XCircle (red)
- Text: "{label} — {itemCount} items need attention" (or "Looks good" for green)
- Right: chevron icon (rotates on expand)
- Subtle glow pulse animation on appear (box-shadow)
- Cursor pointer, hover: background opacity increases
```

### SignalPanel Component

```
Props: { checks: SignalCheck[], notChecked: string[], isVisible: boolean }

Visual:
- Slides down from tag (framer-motion, height animation)
- Each check is a row:
  - Status icon (colored: green check, yellow alert, red X)
  - Check name (bold)
  - One-line summary
  - Expand chevron (right side)
- On check click: detail text slides down below that check
- "NOT CHECKED" section at bottom with muted text and list
- "GUIDED VERIFICATION" section with lightbulb icon, indigo background
```

### CodeBlock Component

```
Props: { code: string, language: string, typewriter?: boolean }

Visual:
- Dark background (#0d1117), rounded corners, border
- Top bar with language label + copy button
- Code with basic syntax highlighting:
  - Keywords (import, def, return, if, class, from): #ff7b72
  - Strings: #a5d6ff
  - Comments: #8b949e
  - Functions: #d2a8ff
  - Decorators: #ffa657
  - Numbers: #79c0ff
  - Regular text: #e6edf3
- Use a simple regex-based highlighter (no heavy library needed)
- If typewriter=true: characters appear one by one with cursor blink
```

### OverrideButton Component

```
Props: { onOverride: () => void, isOverridden: boolean }

States:
- Default: Two buttons side by side
  - "Override & Accept" (outlined, neutral)
  - "Regenerate" (outlined, accent)
- After override click:
  - Button text changes to "✓ Accepted" with green tint
  - Feedback card appears below (animated slide-in)
  - Shows: override logged message + time saved
```

---

## 8. Responsive Design

- **Desktop (>1024px):** Max-width 800px centered, comfortable padding
- **Tablet (768-1024px):** Same layout, slightly reduced padding
- **Mobile (<768px):** Full width, stacked layout, touch-friendly tap targets (min 44px)
- Chat bubbles: full width on mobile
- Signal panel: full width, checks stack vertically
- Landing page: cards stack to single column

---

## 9. Navbar

```
┌──────────────────────────────────────────────┐
│ 🛡️ Claude Signal    [Home] [Demo] [Calibration] [About] │
└──────────────────────────────────────────────┘
```

- Fixed top, glassmorphism background (backdrop-blur + semi-transparent)
- Logo: shield icon + "Claude Signal" in accent color
- Active link has bottom border in accent color
- Demo dropdown or direct link to /demo/risky (default scenario)
- Mobile: hamburger menu

---

## 10. SEO & Meta

```html
<title>Claude Signal — Independent Verification for AI-Generated Code</title>
<meta name="description" content="Claude Signal is a soft verification gate that helps developers trust AI outputs appropriately. Independent static analysis, CVE checks, and auto-generated tests — all in under 3 seconds.">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" href="shield-favicon.svg">
```

---

## 11. Critical Quality Requirements

1. **No placeholder content** — every text, every data point, every code snippet must be real and meaningful
2. **Animations must be smooth** — use framer-motion, not CSS-only. 60fps minimum.
3. **The typewriter effect on code is essential** — it creates the feeling of Claude "generating" code in real time
4. **Signal tag MUST appear AFTER code finishes** — this demonstrates the "verification runs in parallel" concept
5. **Progressive disclosure MUST work in 3 levels** — tag → checks → detail. Not all-or-nothing.
6. **Override flow MUST show feedback** — this is the calibration engine demo. Don't skip it.
7. **Color-blind friendly** — never rely on color alone. Always use icons + text + color together.
8. **Dark mode only** — matches Claude's actual interface. Professional look.
9. **Fast page loads** — no heavy libraries. Keep bundle small. Vite handles this.
10. **Publicly accessible** — deployed to Vercel with no auth gates.

---

## 12. Routes Summary

| Route | Page | Component |
|---|---|---|
| `/` | Landing page | Home.tsx |
| `/demo/clean` | Green signal demo | Demo.tsx (scenarioId=clean) |
| `/demo/risky` | Yellow signal demo | Demo.tsx (scenarioId=risky) |
| `/demo/unsafe` | Red signal demo | Demo.tsx (scenarioId=unsafe) |
| `/calibration` | Calibration timeline | Calibration.tsx |
| `/about` | Research & methodology | About.tsx |

---

*This spec contains everything needed to build the prototype. Every component, every data point, every interaction, every color. Build it exactly as specified. Deploy to Vercel. Share the public URL.*
