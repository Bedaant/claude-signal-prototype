import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Shield,
  ShieldAlert,
  ShieldX,
  Package,
  FlaskConical,
  GitBranch,
  Eye,
  LockOpen,
  ChevronDown,
  Lightbulb,
} from 'lucide-react'
import { SignalCheck, CheckStatus } from '../data/types'

const iconMap: Record<string, React.ElementType> = {
  CheckCircle,
  Shield,
  ShieldAlert,
  ShieldX,
  Package,
  FlaskConical,
  GitBranch,
  Eye,
  LockOpen,
}

const statusConfig: Record<CheckStatus, { color: string; bg: string; Icon: React.ElementType }> = {
  pass: { color: '#22c55e', bg: 'rgba(34,197,94,0.08)', Icon: CheckCircle },
  warn: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', Icon: AlertTriangle },
  fail: { color: '#ef4444', bg: 'rgba(239,68,68,0.08)', Icon: XCircle },
}

interface SignalPanelProps {
  checks: SignalCheck[]
  notChecked: string[]
  isVisible: boolean
}

export default function SignalPanel({ checks, notChecked, isVisible }: SignalPanelProps) {
  const [expandedCheck, setExpandedCheck] = useState<string | null>(null)

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <div className="mt-2 space-y-1">
        {checks.map((check) => {
          const cfg = statusConfig[check.status]
          const StatusIcon = cfg.Icon
          const CustomIcon = iconMap[check.icon]
          const isOpen = expandedCheck === check.id

          return (
            <div key={check.id} className="rounded-lg overflow-hidden border border-border bg-surface/60">
              <button
                onClick={() => setExpandedCheck(isOpen ? null : check.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-surface-hover transition-colors"
              >
                <StatusIcon className="w-4 h-4 flex-shrink-0" style={{ color: cfg.color }} />
                <CustomIcon className="w-4 h-4 flex-shrink-0 text-text-muted" />
                <span className="text-sm font-medium text-text-primary">{check.name}</span>
                <span className="flex-1 text-xs text-text-secondary truncate">{check.summary}</span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 pt-1 space-y-3">
                      <div className="rounded-md p-3 text-sm text-text-secondary leading-relaxed" style={{ background: cfg.bg }}>
                        {check.detail}
                      </div>
                      {check.guidedVerification && (
                        <div className="rounded-md p-3 bg-accent/10 border border-accent/20 flex gap-2.5">
                          <Lightbulb className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-1">Guided Verification</p>
                            <p className="text-sm text-text-secondary leading-relaxed">{check.guidedVerification}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}

        {notChecked.length > 0 && (
          <div className="rounded-lg p-3 border border-dashed border-border bg-surface/40">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Not Checked</p>
            <ul className="space-y-1">
              {notChecked.map((item) => (
                <li key={item} className="text-xs text-text-muted flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-text-muted" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  )
}
