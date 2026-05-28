import { motion } from 'framer-motion'
import {
  AlertTriangle,
  HelpCircle,
  Search,
  BrainCircuit,
  MessageSquareWarning,
} from 'lucide-react'
import SignalLogo from '../components/SignalLogo'

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

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
}

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="inline-flex items-center gap-2 mb-3">
          <SignalLogo size={20} className="text-accent" />
          <span className="text-[11px] font-semibold text-accent uppercase tracking-widest">Methodology</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mb-2">
          Research & Methodology
        </h1>
        <p className="text-sm text-text-muted leading-relaxed">
          The thinking behind Signal, grounded in user research and industry data.
        </p>
      </motion.div>

      {/* Stats */}
      <section className="mb-12">
        <h2 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">Key Findings</h2>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          {stats.map((s) => (
            <motion.div
              key={s.label}
              variants={item}
              className="rounded-xl p-5 bg-surface border border-border-subtle text-center"
            >
              <s.icon className="w-4 h-4 text-accent mx-auto mb-2" />
              <div className="text-xl font-bold text-gradient-amber mb-1 tracking-tight">{s.value}</div>
              <div className="text-[11px] text-text-muted">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 5-Why */}
      <section className="mb-12">
        <h2 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">The 5-Why Root Cause</h2>
        <div className="space-y-2">
          {whyData.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="rounded-xl p-4 bg-surface border border-border-subtle"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-dim border border-accent/15 text-accent text-[11px] font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary mb-0.5">{item.q}</p>
                  <p className="text-[13px] text-text-muted leading-relaxed">{item.a}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-3 rounded-xl p-4 bg-accent-dim border border-accent/15"
        >
          <p className="text-sm text-text-secondary leading-relaxed">
            <span className="text-accent font-semibold">Root cause:</span> Human trust heuristics (surface quality = reliable) collide with AI
            output characteristics (surface quality optimized regardless of correctness), and current AI tools
            provide no structured, independent quality signals to break this cycle.
          </p>
        </motion.div>
      </section>

      {/* Pillars */}
      <section className="mb-12">
        <h2 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">How Signal Addresses Each Pillar</h2>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-2"
        >
          {pillars.map((p) => (
            <motion.div
              key={p.title}
              variants={item}
              className="rounded-xl p-4 bg-surface border border-border-subtle flex items-start gap-3"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent-dim border border-accent/15 flex items-center justify-center">
                <p.icon className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary mb-0.5">{p.title}</p>
                <p className="text-[13px] text-text-muted leading-relaxed">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Survey link */}
      <section className="mb-12">
        <h2 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider">Research Methods</h2>
        <ul className="space-y-2 text-[13px] text-text-muted">
          {[
            'Anonymous survey (n=33, Google Forms) across professional developer communities',
            'Triangulated with Stack Overflow 2025 Developer Survey (n=49,000)',
            'Six documented case studies from public developer community posts and incident reports',
            'Peer-reviewed research: Nature Machine Intelligence 2025, Columbia Journalism Review',
          ].map((text, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="w-1 h-1 rounded-full bg-accent mt-1.5 flex-shrink-0" />
              {text}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
