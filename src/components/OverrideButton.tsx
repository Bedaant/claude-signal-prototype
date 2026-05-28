import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, RefreshCw } from 'lucide-react'

interface OverrideButtonProps {
  onOverride: () => void
  isOverridden: boolean
  timeSaved: string
}

export default function OverrideButton({ onOverride, isOverridden, timeSaved }: OverrideButtonProps) {
  const [showFeedback, setShowFeedback] = useState(false)

  const handleOverride = () => {
    onOverride()
    setShowFeedback(true)
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center gap-3">
        <button
          onClick={handleOverride}
          disabled={isOverridden}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
            isOverridden
              ? 'bg-signal-green/15 border-signal-green/30 text-signal-green cursor-default'
              : 'bg-transparent border-border text-text-secondary hover:border-text-muted hover:text-text-primary'
          }`}
        >
          {isOverridden && <Check className="w-4 h-4" />}
          {isOverridden ? 'Accepted' : 'Override & Accept'}
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-accent/30 text-accent hover:bg-accent/10 transition-all">
          <RefreshCw className="w-4 h-4" />
          Regenerate
        </button>
      </div>

      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 8, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="rounded-lg p-4 bg-surface border border-border">
              <p className="text-sm text-text-secondary leading-relaxed">
                📝 Override logged. In 48h, Signal will check if this code had issues — building your calibration profile.
              </p>
              <p className="mt-2 text-sm font-medium text-accent">
                ⏱ Signal saved you {timeSaved}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
