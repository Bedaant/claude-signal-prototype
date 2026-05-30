import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Route, AlertTriangle, ShieldCheck, ChevronDown, ChevronUp, HelpCircle, Lightbulb } from 'lucide-react';
import type { Assumption, Reasoning } from '../api/client';

const TYPE_CONFIG: Record<string, { label: string; color: string; border: string; bg: string }> = {
  security: { label: 'Security', color: '#E07A5F', border: 'border-l-[#E07A5F]', bg: 'bg-[#E07A5F]/10' },
  infra: { label: 'Infrastructure', color: '#60A5FA', border: 'border-l-[#60A5FA]', bg: 'bg-[#60A5FA]/10' },
  env: { label: 'Environment', color: '#A78BFA', border: 'border-l-[#A78BFA]', bg: 'bg-[#A78BFA]/10' },
  validation: { label: 'Validation', color: '#FBBF24', border: 'border-l-[#FBBF24]', bg: 'bg-[#FBBF24]/10' },
  perf: { label: 'Performance', color: '#34D399', border: 'border-l-[#34D399]', bg: 'bg-[#34D399]/10' },
  input_validation: { label: 'Input', color: '#FBBF24', border: 'border-l-[#FBBF24]', bg: 'bg-[#FBBF24]/10' },
  input_safety: { label: 'Safety', color: '#E07A5F', border: 'border-l-[#E07A5F]', bg: 'bg-[#E07A5F]/10' },
  network: { label: 'Network', color: '#60A5FA', border: 'border-l-[#60A5FA]', bg: 'bg-[#60A5FA]/10' },
  resource: { label: 'Resource', color: '#A78BFA', border: 'border-l-[#A78BFA]', bg: 'bg-[#A78BFA]/10' },
  auth: { label: 'Auth', color: '#E07A5F', border: 'border-l-[#E07A5F]', bg: 'bg-[#E07A5F]/10' },
  dependency: { label: 'Dependency', color: '#FBBF24', border: 'border-l-[#FBBF24]', bg: 'bg-[#FBBF24]/10' },
  reliability: { label: 'Reliability', color: '#A78BFA', border: 'border-l-[#A78BFA]', bg: 'bg-[#A78BFA]/10' },
  general: { label: 'General', color: '#9CA3AF', border: 'border-l-[#9CA3AF]', bg: 'bg-[#9CA3AF]/10' },
};

const CONFIDENCE_CONFIG = {
  high: { text: 'text-signal-green', bg: 'bg-signal-green/10', border: 'border-signal-green/20', label: 'High' },
  medium: { text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'Medium' },
  low: { text: 'text-signal-coral', bg: 'bg-signal-coral/10', border: 'border-signal-coral/20', label: 'Low' },
};

function AssumptionCard({ assumption, onConfirm, onOverride, isActive, onClick }: {
  assumption: Assumption;
  onConfirm: () => void;
  onOverride: () => void;
  isActive: boolean;
  onClick: () => void;
}) {
  const [showWhy, setShowWhy] = useState(false);
  const [showConfirmOverride, setShowConfirmOverride] = useState(false);
  const type = TYPE_CONFIG[assumption.type] || TYPE_CONFIG.general;
  const conf = CONFIDENCE_CONFIG[assumption.confidence] || CONFIDENCE_CONFIG.medium;

  return (
    <div
      onClick={onClick}
      className={`bg-surface border border-border-subtle rounded-xl p-4 border-l-4 ${type.border} cursor-pointer transition-all hover:border-border-hover ${isActive ? 'ring-2 ring-accent/30' : ''}`}
    >
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: type.color }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-dim">{type.label}</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${conf.bg} ${conf.text} ${conf.border}`}>
              {conf.label}
            </span>
            <span className="text-[10px] text-text-dim font-mono">line {assumption.line}</span>
          </div>
          <p className="text-sm text-text-primary font-medium leading-snug">{assumption.assumption}</p>
          <p className="text-[11px] text-text-muted mt-1">{assumption.inferredFrom}</p>
        </div>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); setShowWhy(!showWhy); }}
        className="flex items-center gap-1 mt-3 text-[11px] text-text-dim hover:text-text-secondary transition-colors"
      >
        <HelpCircle className="w-3 h-3" />
        Why this matters
        <ChevronDown className={`w-3 h-3 transition-transform ${showWhy ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {showWhy && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="mt-2 bg-bg rounded-lg p-3 border border-border-subtle space-y-2">
              {assumption.fix && (
                <div className="flex items-start gap-1.5">
                  <Lightbulb className="w-3 h-3 text-accent shrink-0 mt-0.5" />
                  <p className="text-xs text-text-muted"><span className="text-text-secondary">Suggestion:</span> {assumption.fix.title}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-2 mt-3">
        {!showConfirmOverride ? (
          <>
            <button onClick={(e) => { e.stopPropagation(); onConfirm(); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-signal-green/20 text-signal-green text-xs font-semibold hover:bg-signal-green/30 transition-all border border-signal-green/30">
              <ShieldCheck className="w-3.5 h-3.5" /> Confirm
            </button>
            <button onClick={(e) => { e.stopPropagation(); setShowConfirmOverride(true); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-signal-coral/20 text-signal-coral text-xs font-semibold hover:bg-signal-coral/30 transition-all border border-signal-coral/30">
              <AlertTriangle className="w-3.5 h-3.5" /> Override
            </button>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 bg-signal-coral/10 border border-signal-coral/20 rounded-lg p-2 flex-1">
            <span className="text-xs text-signal-coral flex-1">Mark as accepted risk?</span>
            <button onClick={(e) => { e.stopPropagation(); setShowConfirmOverride(false); }} className="text-xs text-text-dim hover:text-text-primary px-2 py-1">Cancel</button>
            <button onClick={(e) => { e.stopPropagation(); onOverride(); }} className="text-xs bg-signal-coral text-bg font-semibold px-3 py-1.5 rounded hover:opacity-90 transition-all">Yes, override</button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function AssumptionRegistry({
  reasoning,
  onConfirm,
  onOverride,
  activeAssumptionId,
  onAssumptionClick,
}: {
  reasoning?: Reasoning;
  onConfirm: (id: string) => void;
  onOverride: (id: string) => void;
  activeAssumptionId: string | null;
  onAssumptionClick: (id: string) => void;
}) {
  const [showGoal, setShowGoal] = useState(true);
  const [showApproach, setShowApproach] = useState(true);

  if (!reasoning || reasoning.assumptions.length === 0) {
    return (
      <div className="p-4 text-center text-text-muted text-sm">
        <ShieldCheck className="w-6 h-6 mx-auto mb-2 opacity-50" />
        No assumptions detected in this code.
      </div>
    );
  }

  const pending = reasoning.assumptions.filter(a => a.status === 'pending');
  const confirmed = reasoning.assumptions.filter(a => a.status === 'confirmed');
  const overridden = reasoning.assumptions.filter(a => a.status === 'overridden');

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Goal Card */}
      <div className="p-4 border-b border-border-subtle">
        <button onClick={() => setShowGoal(!showGoal)} className="flex items-center justify-between w-full text-left mb-2">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-accent" />
            <span className="text-xs font-bold uppercase tracking-wider text-text-dim">Goal</span>
          </div>
          {showGoal ? <ChevronUp className="w-3.5 h-3.5 text-text-dim" /> : <ChevronDown className="w-3.5 h-3.5 text-text-dim" />}
        </button>
        <AnimatePresence>
          {showGoal && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <p className="text-sm text-text-primary leading-relaxed pl-6">{reasoning.goal}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Approach Card */}
      <div className="p-4 border-b border-border-subtle">
        <button onClick={() => setShowApproach(!showApproach)} className="flex items-center justify-between w-full text-left mb-2">
          <div className="flex items-center gap-2">
            <Route className="w-4 h-4 text-accent" />
            <span className="text-xs font-bold uppercase tracking-wider text-text-dim">Approach</span>
          </div>
          {showApproach ? <ChevronUp className="w-3.5 h-3.5 text-text-dim" /> : <ChevronDown className="w-3.5 h-3.5 text-text-dim" />}
        </button>
        <AnimatePresence>
          {showApproach && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <p className="text-sm text-text-primary leading-relaxed pl-6">{reasoning.approach}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Assumptions */}
      <div className="flex-1 p-4 space-y-3">
        {pending.length > 0 && (
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400">Pending ({pending.length})</span>
          </div>
        )}
        {pending.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
            <AssumptionCard
              assumption={a}
              onConfirm={() => onConfirm(a.id)}
              onOverride={() => onOverride(a.id)}
              isActive={a.id === activeAssumptionId}
              onClick={() => onAssumptionClick(a.id)}
            />
          </motion.div>
        ))}

        {confirmed.length > 0 && (
          <div className="flex items-center gap-2 pt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-signal-green" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-signal-green">Confirmed ({confirmed.length})</span>
          </div>
        )}
        {confirmed.map(a => (
          <div key={a.id} className="bg-surface border border-border-subtle rounded-xl p-3 border-l-2 border-l-signal-green opacity-60">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-signal-green shrink-0" />
              <p className="text-sm text-text-muted line-through">{a.assumption}</p>
            </div>
          </div>
        ))}

        {overridden.length > 0 && (
          <div className="flex items-center gap-2 pt-2">
            <AlertTriangle className="w-3.5 h-3.5 text-signal-coral" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-signal-coral">Accepted Risks ({overridden.length})</span>
          </div>
        )}
        {overridden.map(a => (
          <div key={a.id} className="bg-surface border border-border-subtle rounded-xl p-3 border-l-2 border-l-signal-coral opacity-60">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-signal-coral shrink-0" />
              <p className="text-sm text-text-muted line-through">{a.assumption}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
