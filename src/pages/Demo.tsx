import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Route, AlertTriangle, ShieldCheck } from 'lucide-react'
import ChatMessage from '../components/ChatMessage'
import TypewriterCode from '../components/TypewriterCode'
import SignalTag from '../components/SignalTag'
import SignalPanel from '../components/SignalPanel'
import OverrideButton from '../components/OverrideButton'
import { getScenario } from '../data/scenarios'

export default function Demo() {
  const { scenarioId } = useParams<{ scenarioId: string }>()
  const navigate = useNavigate()
  const scenario = getScenario(scenarioId || '')

  const [codeDone, setCodeDone] = useState(false)
  const [tagExpanded, setTagExpanded] = useState(false)
  const [overridden, setOverridden] = useState(false)

  useEffect(() => {
    setCodeDone(false)
    setTagExpanded(false)
    setOverridden(false)
  }, [scenarioId])

  const handleCodeComplete = useCallback(() => {
    setCodeDone(true)
  }, [])

  if (!scenario) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Scenario not found</h1>
        <p className="text-text-secondary mb-4">The demo scenario you requested does not exist.</p>
        <button
          onClick={() => navigate('/demo/risky')}
          className="px-4 py-2 rounded-lg bg-accent text-bg text-sm font-semibold hover:bg-accent-hover transition-colors"
        >
          Go to Risky Demo
        </button>
      </div>
    )
  }

  const tabs = [
    { id: 'clean', label: 'Clean', color: 'bg-signal-green', text: 'text-signal-green' },
    { id: 'risky', label: 'Risky', color: 'bg-signal-yellow', text: 'text-signal-yellow' },
    { id: 'unsafe', label: 'Unsafe', color: 'bg-signal-red', text: 'text-signal-red' },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <p className="text-[11px] font-semibold text-accent uppercase tracking-widest mb-2">Live Demo</p>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary mb-1">{scenario.title}</h1>
        <p className="text-sm text-text-muted">{scenario.description}</p>
      </motion.div>

      {/* Scenario tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => navigate(`/demo/${tab.id}`)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              scenarioId === tab.id
                ? 'bg-surface border-border-hover text-text-primary'
                : 'bg-transparent border-border-subtle text-text-muted hover:text-text-secondary hover:border-border-hover'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${tab.color}`} />
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Chat interface */}
      <div className="space-y-6">
        <ChatMessage role="user" delay={0}>
          {scenario.userPrompt}
        </ChatMessage>

        <ChatMessage role="assistant" delay={0.3}>
          <div>
            <p className="mb-2">{scenario.explanation}</p>
            <TypewriterCode
              key={scenario.id}
              code={scenario.codeOutput}
              language={scenario.codeLanguage}
              speed={10}
              onComplete={handleCodeComplete}
            />

            <SignalTag
              level={scenario.signal.level}
              label={scenario.signal.label}
              itemCount={scenario.signal.itemCount}
              onClick={() => setTagExpanded(!tagExpanded)}
              isExpanded={tagExpanded}
              visible={codeDone}
            />

            <SignalPanel
              checks={scenario.signal.checks}
              notChecked={scenario.signal.notChecked}
              isVisible={tagExpanded}
            />

            {/* Assumptions Preview */}
            <AnimatePresence>
              {tagExpanded && scenario.signal.reasoning && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-3 overflow-hidden"
                >
                  <div className="border border-border-subtle rounded-xl bg-surface/50 p-4 space-y-3">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-accent mb-2">Detected Assumptions</p>
                    
                    <div className="flex items-start gap-2">
                      <Target size={14} className="text-signal-coral mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] text-text-dim uppercase tracking-wider">Goal</p>
                        <p className="text-xs text-text-primary">{scenario.signal.reasoning.goal}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Route size={14} className="text-signal-yellow mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] text-text-dim uppercase tracking-wider">Approach</p>
                        <p className="text-xs text-text-primary">{scenario.signal.reasoning.approach}</p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      {scenario.signal.reasoning.assumptions.map((a) => (
                        <div key={a.id} className="flex items-start gap-2 text-xs">
                          {a.confidence === 'low' ? (
                            <AlertTriangle size={12} className="text-signal-red mt-0.5 flex-shrink-0" />
                          ) : a.confidence === 'medium' ? (
                            <AlertTriangle size={12} className="text-signal-yellow mt-0.5 flex-shrink-0" />
                          ) : (
                            <ShieldCheck size={12} className="text-signal-green mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold mr-1.5 ${
                              a.confidence === 'low' ? 'bg-signal-red/20 text-signal-red' :
                              a.confidence === 'medium' ? 'bg-signal-yellow/20 text-signal-yellow' :
                              'bg-signal-green/20 text-signal-green'
                            }`}>
                              {a.type.replace(/_/g, ' ')}
                            </span>
                            <span className="text-text-secondary">{a.assumption}</span>
                            {a.status === 'overridden' && (
                              <span className="ml-1.5 text-[10px] text-signal-coral font-semibold">overridden</span>
                            )}
                            {a.status === 'confirmed' && (
                              <span className="ml-1.5 text-[10px] text-signal-green font-semibold">confirmed</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <OverrideButton
              onOverride={() => setOverridden(true)}
              isOverridden={overridden}
              timeSaved={scenario.signal.timeSaved}
            />
          </div>
        </ChatMessage>
      </div>
    </div>
  )
}
