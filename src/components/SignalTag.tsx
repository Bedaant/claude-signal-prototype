import { motion } from 'framer-motion'
import { CheckCircle, AlertTriangle, XCircle, ChevronDown } from 'lucide-react'
import { SignalLevel } from '../data/types'

interface SignalTagProps {
  level: SignalLevel
  label: string
  itemCount: number
  onClick: () => void
  isExpanded: boolean
  visible: boolean
}

const config = {
  green: {
    icon: CheckCircle,
    color: '#34d399',
    bg: 'rgba(52,211,153,0.08)',
    border: '#34d399',
    glow: 'rgba(52,211,153,0.12)',
  },
  yellow: {
    icon: AlertTriangle,
    color: '#f5a623',
    bg: 'rgba(245,166,35,0.08)',
    border: '#f5a623',
    glow: 'rgba(245,166,35,0.12)',
  },
  red: {
    icon: XCircle,
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.08)',
    border: '#ef4444',
    glow: 'rgba(239,68,68,0.12)',
  },
}

export default function SignalTag({ level, label, itemCount, onClick, isExpanded, visible }: SignalTagProps) {
  const c = config[level]
  const Icon = c.icon
  const text = level === 'green' ? `${label} — Looks good` : `${label} — ${itemCount} item${itemCount !== 1 ? 's' : ''} need${itemCount === 1 ? 's' : ''} attention`

  if (!visible) return null

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      onClick={onClick}
      className="w-full text-left rounded-lg px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors hover:brightness-110"
      style={{
        background: c.bg,
        borderLeft: `3px solid ${c.border}`,
        boxShadow: `0 0 20px ${c.glow}`,
      }}
    >
      <Icon className="w-5 h-5 flex-shrink-0" style={{ color: c.color }} />
      <span className="flex-1 text-sm font-semibold" style={{ color: c.color }}>
        {text}
      </span>
      <motion.div
        animate={{ rotate: isExpanded ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <ChevronDown className="w-4 h-4" style={{ color: c.color }} />
      </motion.div>
    </motion.button>
  )
}
