import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
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

  // Reset state when scenario changes
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
          className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium"
        >
          Go to Risky Demo
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Scenario context */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-xl font-bold text-text-primary mb-1">{scenario.title}</h1>
        <p className="text-sm text-text-secondary">{scenario.description}</p>
      </motion.div>

      {/* Scenario tabs */}
      <div className="flex items-center gap-2 mb-6">
        {[
          { id: 'clean', label: 'Clean', color: '#22c55e' },
          { id: 'risky', label: 'Risky', color: '#f59e0b' },
          { id: 'unsafe', label: 'Unsafe', color: '#ef4444' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => navigate(`/demo/${tab.id}`)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
              scenarioId === tab.id
                ? 'bg-surface border-text-muted text-text-primary'
                : 'bg-transparent border-border text-text-muted hover:text-text-secondary hover:border-text-muted'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: tab.color }} />
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
