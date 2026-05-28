import { motion } from 'framer-motion'
import {
  AlertTriangle,
  HelpCircle,
  Search,
  BrainCircuit,
  MessageSquareWarning,
} from 'lucide-react'

const whyData = [
  {
    q: 'Why do users ship bad AI outputs?',
    a: 'They accept without thorough verification. 33% skim and accept.',
  },
  {
    q: "Why don't they verify thoroughly?",
    a: 'Verification is cognitively expensive + time pressure. Output is 500 lines; deadline is today.',
  },
  {
    q: 'Why is verification so expensive?',
    a: 'AI outputs are "almost right" — polished but subtly wrong in invisible ways. Detecting requires reverse-engineering assumptions.',
  },
  {
    q: 'Why are outputs "almost right"?',
    a: 'LLMs optimize for perceived coherence over factual correctness. "Looks right" and "is right" are uncorrelated.',
  },
  {
    q: 'Why do users fall for polished-but-wrong?',
    a: 'Human trust heuristics evolved for human communication. AI outputs hijack these without underlying accountability.',
  },
]

const stats = [
  { value: '91%', label: 'discover errors after accepting', icon: AlertTriangle },
  { value: '87%', label: 'have shipped buggy AI work', icon: MessageSquareWarning },
  { value: '5.9/10', label: 'average trust level', icon: HelpCircle },
]

const pillars = [
  {
    icon: Search,
    title: 'Output Quality',
    desc: 'Independent static analysis, CVE checks, auto-generated tests — each from a separate tool, not Claude self-evaluation.',
  },
  {
    icon: BrainCircuit,
    title: 'Human Judgment',
    desc: 'Signal recommends, never blocks. Guided verification teaches what to check manually. User always decides.',
  },
  {
    icon: AlertTriangle,
    title: 'Confidence Calibration',
    desc: 'Override feedback loop tracks whether overrides led to issues. Builds intuition, not dependence.',
  },
  {
    icon: Search,
    title: 'Reasoning Legibility',
    desc: 'Progressive disclosure from one-line tag to full reasoning. Shows what was checked, what was not, and why.',
  },
]

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">Research & Methodology</h1>
        <p className="text-text-secondary">
          The thinking behind Claude Signal, grounded in user research and industry data.
        </p>
      </motion.div>

      {/* Stats */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Key Findings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-xl p-5 bg-surface border border-border text-center"
            >
              <s.icon className="w-5 h-5 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-text-primary mb-1">{s.value}</div>
              <div className="text-xs text-text-secondary">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5-Why */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-text-primary mb-4">The 5-Why Root Cause</h2>
        <div className="space-y-3">
          {whyData.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="rounded-lg p-4 bg-surface border border-border"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/15 text-accent text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary mb-0.5">{item.q}</p>
                  <p className="text-sm text-text-secondary leading-relaxed">{item.a}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 rounded-lg p-4 bg-accent/10 border border-accent/20">
          <p className="text-sm text-text-primary leading-relaxed">
            <strong>Root cause:</strong> Human trust heuristics (surface quality = reliable) collide with AI
            output characteristics (surface quality optimized regardless of correctness), and current AI tools
            provide no structured, independent quality signals to break this cycle.
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-text-primary mb-4">How Signal Addresses Each Pillar</h2>
        <div className="space-y-3">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="rounded-lg p-4 bg-surface border border-border flex items-start gap-3"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <p.icon className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary mb-0.5">{p.title}</p>
                <p className="text-sm text-text-secondary leading-relaxed">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Survey link */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-text-primary mb-2">Research Methods</h2>
        <ul className="space-y-2 text-sm text-text-secondary">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
            Anonymous survey (n=33, Google Forms) across professional developer communities
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
            Triangulated with Stack Overflow 2025 Developer Survey (n=49,000)
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
            Six documented case studies from public developer community posts and incident reports
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
            Peer-reviewed research: Nature Machine Intelligence 2025, Columbia Journalism Review
          </li>
        </ul>
      </section>
    </div>
  )
}
