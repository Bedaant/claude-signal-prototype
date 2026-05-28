import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertTriangle, ShieldAlert, ChevronRight } from 'lucide-react'

interface Step {
  id: number
  label: string
  message: string
  signalLevel: 'green' | 'yellow' | 'red'
  signalText: string
  checks: { name: string; status: 'pass' | 'warn' | 'fail' }[]
}

const steps: Step[] = [
  {
    id: 1,
    label: 'First Use',
    message: 'Full signal shown, default strength. All checks displayed.',
    signalLevel: 'yellow',
    signalText: 'Medium Confidence — 2 items need attention',
    checks: [
      { name: 'Syntax & Style', status: 'pass' },
      { name: 'Dependency Security', status: 'warn' },
      { name: 'Auto-Generated Tests', status: 'warn' },
      { name: 'Code Complexity', status: 'pass' },
    ],
  },
  {
    id: 2,
    label: 'Pattern Detected',
    message: "You've overridden 3 security warnings. 2 led to issues. Security checks now amplified.",
    signalLevel: 'red',
    signalText: 'Low Confidence — Security warning amplified',
    checks: [
      { name: 'Syntax & Style', status: 'pass' },
      { name: 'Dependency Security', status: 'fail' },
      { name: 'Auto-Generated Tests', status: 'pass' },
      { name: 'Code Complexity', status: 'pass' },
    ],
  },
  {
    id: 3,
    label: 'Calibrating',
    message: 'Signal is adapting to your patterns. Security warnings amplified, syntax noise reduced.',
    signalLevel: 'yellow',
    signalText: 'Medium Confidence — 1 item needs attention',
    checks: [
      { name: 'Syntax & Style', status: 'pass' },
      { name: 'Dependency Security', status: 'warn' },
      { name: 'Auto-Generated Tests', status: 'pass' },
      { name: 'Code Complexity', status: 'pass' },
    ],
  },
  {
    id: 4,
    label: 'Well-Calibrated',
    message: "You've developed strong evaluation instincts. Signal intervenes less. Only high-priority items shown.",
    signalLevel: 'green',
    signalText: 'High Confidence — Looks good',
    checks: [
      { name: 'Syntax & Style', status: 'pass' },
      { name: 'Dependency Security', status: 'pass' },
      { name: 'Auto-Generated Tests', status: 'pass' },
      { name: 'Code Complexity', status: 'pass' },
    ],
  },
]

const levelColors = {
  green: { text: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: '#22c55e' },
  yellow: { text: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: '#f59e0b' },
  red: { text: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: '#ef4444' },
}

const statusIcons = {
  pass: <CheckCircle className="w-3.5 h-3.5 text-signal-green" />,
  warn: <AlertTriangle className="w-3.5 h-3.5 text-signal-yellow" />,
  fail: <ShieldAlert className="w-3.5 h-3.5 text-signal-red" />,
}

export default function CalibrationPreview() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <div className="max-w-3xl mx-auto">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 -z-0" />
        {steps.map((step, idx) => {
          const isActive = idx === activeStep
          const isCompleted = idx < activeStep
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                isActive
                  ? 'bg-accent border-accent text-white scale-110'
                  : isCompleted
                  ? 'bg-signal-green border-signal-green text-white'
                  : 'bg-bg border-border text-text-muted hover:border-text-secondary'
              }`}
            >
              {isCompleted ? <CheckCircle className="w-5 h-5" /> : step.id}
            </button>
          )
        })}
      </div>

      {/* Labels */}
      <div className="flex justify-between mb-8 -mt-4">
        {steps.map((step, idx) => (
          <div key={step.id} className="w-10 text-center">
            <span className={`text-[11px] font-medium ${idx === activeStep ? 'text-accent' : 'text-text-muted'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Active step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl border border-border bg-surface p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border"
              style={{
                background: levelColors[steps[activeStep].signalLevel].bg,
                borderColor: levelColors[steps[activeStep].signalLevel].border,
                color: levelColors[steps[activeStep].signalLevel].text,
              }}
            >
              {steps[activeStep].signalText}
            </div>
          </div>

          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            {steps[activeStep].message}
          </p>

          <div className="space-y-2">
            {steps[activeStep].checks.map((check) => (
              <div key={check.name} className="flex items-center gap-2.5 text-sm">
                {statusIcons[check.status]}
                <span className="text-text-primary">{check.name}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <button
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
              className="text-sm text-text-muted hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>
            <button
              onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
              disabled={activeStep === steps.length - 1}
              className="flex items-center gap-1 text-sm text-accent hover:text-accent/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
