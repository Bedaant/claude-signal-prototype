import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Zap,
  Eye,
  Brain,
  ArrowRight,
  Code2,
  Search,
  TrendingUp,
  ShieldCheck,
  Radio,
  ChevronRight,
} from 'lucide-react'
import SignalLogo from '../components/SignalLogo'

const stats = [
  { value: '91%', label: 'find errors after accepting AI code' },
  { value: '87%', label: 'have shipped buggy AI-generated output' },
  { value: '<3s', label: 'verification gate latency' },
]

const steps = [
  {
    icon: Code2,
    title: 'Generate',
    desc: 'Claude writes code from your prompt in the IDE',
  },
  {
    icon: Search,
    title: 'Verify',
    desc: 'Signal runs independent static analysis + CVE checks',
  },
  {
    icon: Brain,
    title: 'Calibrate',
    desc: 'Override feedback trains your judgment over time',
  },
]

const demos = [
  {
    id: 'clean',
    label: 'Clean',
    desc: 'All checks pass — high confidence green signal',
    color: 'text-signal-green',
    dot: 'bg-signal-green',
    border: 'hover:border-signal-green/30',
    glow: 'hover:shadow-[0_0_30px_rgba(52,211,153,0.08)]',
  },
  {
    id: 'risky',
    label: 'Risky',
    desc: 'CVE found + edge case — medium confidence yellow',
    color: 'text-signal-yellow',
    dot: 'bg-signal-yellow',
    border: 'hover:border-signal-yellow/30',
    glow: 'hover:shadow-[0_0_30px_rgba(245,166,35,0.08)]',
  },
  {
    id: 'unsafe',
    label: 'Unsafe',
    desc: 'SQL injection + data leak — low confidence red',
    color: 'text-signal-red',
    dot: 'bg-signal-red',
    border: 'hover:border-signal-red/30',
    glow: 'hover:shadow-[0_0_30px_rgba(239,68,68,0.08)]',
  },
]

const pillars = [
  {
    icon: Eye,
    title: 'Output Quality',
    desc: 'Static analysis, CVE checks, complexity scoring, and auto-generated test stubs',
  },
  {
    icon: ShieldCheck,
    title: 'Soft Gate',
    desc: 'Recommends, never blocks. You always decide whether to accept or override',
  },
  {
    icon: TrendingUp,
    title: 'Calibration',
    desc: 'Override feedback loop builds your risk intuition over time',
  },
  {
    icon: Radio,
    title: 'Legibility',
    desc: 'Progressive disclosure — tag → summary → full reasoning on demand',
  },
]

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

export default function Home() {
  return (
    <div className="relative">
      {/* Hero glow background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_50%_50%_at_50%_0%,rgba(245,166,35,0.08),transparent)]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <section className="py-20 sm:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' as const }}
            className="inline-flex items-center justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-accent/10 rounded-3xl blur-2xl" />
              <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-surface border border-border">
                <SignalLogo size={40} className="text-accent" />
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-bold tracking-tight mb-5"
          >
            <span className="text-gradient">Know before you ship.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="text-base sm:text-lg text-text-secondary max-w-lg mx-auto mb-3 leading-relaxed"
          >
            Independent verification and trust calibration for AI-generated code.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="text-sm text-text-muted max-w-md mx-auto mb-10 leading-relaxed"
          >
            Signal catches security issues, CVEs, and logic flaws in LLM output
            — before they reach production.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              to="/playground"
              className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-accent text-bg text-sm font-semibold hover:bg-accent-hover transition-all glow-amber-sm"
            >
              Open Playground
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/demo/risky"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-border text-text-secondary text-sm font-medium hover:border-border-hover hover:text-text-primary transition-colors"
            >
              View Demos
            </Link>
          </motion.div>
        </section>

        {/* Stats */}
        <motion.section
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="py-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={item}
                className="relative rounded-xl p-5 bg-surface border border-border-subtle text-center overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="text-2xl sm:text-3xl font-bold text-gradient-amber mb-1 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-[13px] text-text-muted">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* How it works */}
        <section id="how-it-works" className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-[11px] font-semibold text-accent uppercase tracking-widest mb-3">
              How It Works
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mb-2">
              Three steps to calibrated trust
            </h2>
            <p className="text-sm text-text-muted">
              Generate, verify, and learn — all in one flow
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                variants={item}
                className="relative rounded-xl p-6 bg-surface border border-border-subtle group hover:border-border-hover transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent-dim border border-accent/15">
                    <step.icon className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-[11px] font-bold text-text-dim uppercase tracking-wider">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-text-primary mb-1.5">
                  {step.title}
                </h3>
                <p className="text-[13px] text-text-muted leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Live Demos */}
        <section className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-[11px] font-semibold text-accent uppercase tracking-widest mb-3">
              Live Demos
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mb-2">
              See Signal in action
            </h2>
            <p className="text-sm text-text-muted">
              Three scenarios, three confidence levels
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            {demos.map((demo) => (
              <motion.div key={demo.id} variants={item}>
                <Link
                  to={`/demo/${demo.id}`}
                  className={`block rounded-xl p-5 border border-border-subtle bg-surface ${demo.border} ${demo.glow} transition-all group`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${demo.dot}`} />
                      <span className={`text-sm font-semibold ${demo.color}`}>
                        {demo.label}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-dim group-hover:text-text-secondary group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[13px] text-text-muted leading-relaxed">
                    {demo.desc}
                  </p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Four Pillars */}
        <section className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-[11px] font-semibold text-accent uppercase tracking-widest mb-3">
              Four Pillars
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mb-2">
              Built for real-world judgment
            </h2>
            <p className="text-sm text-text-muted">
              Addressing the core problem from every angle
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
          >
            {pillars.map((p) => (
              <motion.div
                key={p.title}
                variants={item}
                className="rounded-xl p-5 bg-surface border border-border-subtle hover:border-border-hover transition-colors"
              >
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent-dim border border-accent/15 mb-4">
                  <p.icon className="w-4 h-4 text-accent" />
                </div>
                <h3 className="text-sm font-semibold text-text-primary mb-1.5">
                  {p.title}
                </h3>
                <p className="text-[13px] text-text-muted leading-relaxed">
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="py-16 text-center"
        >
          <div className="relative rounded-2xl p-10 sm:p-14 bg-surface border border-border-subtle overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(245,166,35,0.06),transparent)]" />
            <div className="relative">
              <SignalLogo size={32} className="text-accent mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary mb-3">
                Ready to verify your AI-generated code?
              </h2>
              <p className="text-sm text-text-muted max-w-md mx-auto mb-6">
                Open the playground, type a prompt, and see Signal analyze the output in real time.
              </p>
              <Link
                to="/playground"
                className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-accent text-bg text-sm font-semibold hover:bg-accent-hover transition-all glow-amber-sm"
              >
                Try Signal Now
                <Zap className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="py-10 border-t border-border-subtle text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <SignalLogo size={16} className="text-text-dim" animated={false} />
            <span className="text-xs font-medium text-text-dim tracking-tight">Signal</span>
          </div>
          <p className="text-xs text-text-dim">
            PM Graduation Project — Blind review submission
          </p>
        </footer>
      </div>
    </div>
  )
}
