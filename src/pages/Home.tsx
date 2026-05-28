import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Shield,
  Zap,
  Eye,
  Brain,
  ArrowRight,
  Code2,
  Search,
  TrendingUp,
} from 'lucide-react'
import FeatureCard from '../components/FeatureCard'

const stats = [
  { value: '91%', label: 'find errors after accepting' },
  { value: '87%', label: 'have shipped buggy AI code' },
  { value: '<3s', label: 'verification gate time' },
]

const steps = [
  {
    icon: Code2,
    title: 'Generate',
    desc: 'Claude writes code based on your prompt',
  },
  {
    icon: Search,
    title: 'Verify',
    desc: 'Signal runs independent checks in parallel',
  },
  {
    icon: Brain,
    title: 'Learn',
    desc: 'Calibration builds your judgment over time',
  },
]

const demos = [
  {
    id: 'clean',
    label: 'Clean Code',
    desc: 'All checks pass',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.1)',
  },
  {
    id: 'risky',
    label: 'Risky Code',
    desc: 'CVE found + edge case',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
  },
  {
    id: 'unsafe',
    label: 'Unsafe Code',
    desc: 'SQL injection + data leak',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.1)',
  },
]

const pillars = [
  {
    icon: Eye,
    title: 'Output Quality',
    desc: 'Independent static analysis, CVE checks, auto-generated tests',
  },
  {
    icon: Brain,
    title: 'Human Judgment',
    desc: 'Soft gate — recommends, never blocks. User always decides',
  },
  {
    icon: TrendingUp,
    title: 'Confidence Calibration',
    desc: 'Override feedback loop builds user judgment over time',
  },
  {
    icon: Zap,
    title: 'Reasoning Legibility',
    desc: 'Progressive disclosure from tag to full reasoning on demand',
  },
]

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      {/* Hero */}
      <section className="py-16 sm:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/15 mb-6"
        >
          <Shield className="w-8 h-8 text-accent" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-bold text-text-primary mb-4"
        >
          Claude Signal
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-lg sm:text-xl text-text-secondary mb-2 font-medium"
        >
          Know before you ship.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base text-text-muted max-w-xl mx-auto mb-8 leading-relaxed"
        >
          Independent verification + trust calibration for AI-generated code.
          See issues before they become production incidents.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex items-center justify-center gap-3 flex-wrap"
        >
          <Link
            to="/playground"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors shadow-[0_0_20px_rgba(124,111,224,0.3)]"
          >
            Try Live Playground <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/demo/risky"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-text-secondary text-sm font-medium hover:border-text-muted hover:text-text-primary transition-colors"
          >
            View Scenarios
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-text-secondary text-sm font-medium hover:border-text-muted hover:text-text-primary transition-colors"
          >
            Learn More
          </a>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-xl p-5 bg-surface border border-border text-center"
            >
              <div className="text-3xl font-bold text-accent mb-1">{stat.value}</div>
              <div className="text-sm text-text-secondary">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-text-primary mb-2">How It Works</h2>
          <p className="text-text-secondary">Three steps to calibrated trust</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {steps.map((step, i) => (
            <FeatureCard key={step.title} icon={step.icon} title={step.title} description={step.desc} delay={i * 0.1} />
          ))}
        </div>
      </section>

      {/* Demo cards */}
      <section className="py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-text-primary mb-2">Live Demos</h2>
          <p className="text-text-secondary">See Signal in action across three scenarios</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {demos.map((demo, i) => (
            <motion.div
              key={demo.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Link
                to={`/demo/${demo.id}`}
                className="block rounded-xl p-5 border border-border bg-surface hover:shadow-[0_0_24px_rgba(124,111,224,0.12)] hover:border-accent/30 transition-all"
              >
                <div
                  className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mb-3"
                  style={{ background: demo.bg, color: demo.color }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: demo.color }} />
                  {demo.label}
                </div>
                <p className="text-sm text-text-secondary">{demo.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className="py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-text-primary mb-2">Four Pillars</h2>
          <p className="text-text-secondary">Addressing the core problem from every angle</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((p, i) => (
            <FeatureCard key={p.title} icon={p.icon} title={p.title} description={p.desc} delay={i * 0.1} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-border text-center">
        <p className="text-sm text-text-muted">
          PM Graduation Project | Claude Signal
        </p>
        <p className="text-xs text-text-muted mt-1">
          No name — blind review submission
        </p>
      </footer>
    </div>
  )
}
