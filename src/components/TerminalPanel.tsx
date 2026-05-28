import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, AlertTriangle, CheckCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { AnalysisResponse } from '../api/client';
import SignalPanel from './SignalPanel';

interface TerminalPanelProps {
  logs: string[];
  signal: AnalysisResponse | null;
  isAnalyzing: boolean;
}

export default function TerminalPanel({ logs, signal, isAnalyzing }: TerminalPanelProps) {
  const [activeTab, setActiveTab] = useState<'terminal' | 'signal'>('terminal');
  const [expanded, setExpanded] = useState(true);

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="w-full flex items-center justify-center py-1 bg-surface border-t border-border-subtle hover:bg-surface-hover transition-colors"
      >
        <ChevronUp className="w-3.5 h-3.5 text-text-dim" />
      </button>
    );
  }

  return (
    <div className="flex flex-col bg-code-bg border-t border-border-subtle" style={{ height: '200px' }}>
      {/* Tab bar */}
      <div className="flex items-center border-b border-border-subtle">
        <button
          onClick={() => setActiveTab('terminal')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium transition-colors ${
            activeTab === 'terminal' ? 'text-text-primary bg-bg border-t-2 border-t-accent' : 'text-text-dim hover:text-text-muted'
          }`}
        >
          <Terminal className="w-3 h-3" />
          Terminal
        </button>
        <button
          onClick={() => setActiveTab('signal')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium transition-colors ${
            activeTab === 'signal' ? 'text-text-primary bg-bg border-t-2 border-t-accent' : 'text-text-dim hover:text-text-muted'
          }`}
        >
          {signal?.level === 'green' && <CheckCircle className="w-3 h-3 text-signal-green" />}
          {signal?.level === 'yellow' && <AlertTriangle className="w-3 h-3 text-signal-yellow" />}
          {signal?.level === 'red' && <Shield className="w-3 h-3 text-signal-red" />}
          {!signal && <Shield className="w-3 h-3 text-text-dim" />}
          Signal
          {signal && (
            <span className={`text-[10px] px-1 rounded ${
              signal.level === 'green' ? 'bg-signal-green/15 text-signal-green' :
              signal.level === 'yellow' ? 'bg-signal-yellow/15 text-signal-yellow' :
              'bg-signal-red/15 text-signal-red'
            }`}>
              {signal.itemCount}
            </span>
          )}
        </button>
        <div className="flex-1" />
        <button
          onClick={() => setExpanded(false)}
          className="px-2 py-1 text-text-dim hover:text-text-muted transition-colors"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-2.5">
        <AnimatePresence mode="wait">
          {activeTab === 'terminal' ? (
            <motion.div
              key="terminal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-mono text-[11px] space-y-0.5 leading-relaxed"
            >
              {logs.length === 0 && !isAnalyzing && (
                <span className="text-text-dim">Ready. Generate code to see analysis output.</span>
              )}
              {isAnalyzing && (
                <div className="flex items-center gap-2 text-accent">
                  <span className="animate-pulse">▎</span>
                  <span>Running static analysis...</span>
                </div>
              )}
              {logs.map((log, i) => (
                <div key={i} className={`${
                  log.startsWith('✓') ? 'text-signal-green' :
                  log.startsWith('✗') ? 'text-signal-red' :
                  log.startsWith('⚠') ? 'text-signal-yellow' :
                  log.startsWith('>') ? 'text-accent' :
                  'text-text-muted'
                }`}>
                  {log}
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="signal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full overflow-auto"
            >
              {signal ? (
                <div className="space-y-2">
                  <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-[11px] font-semibold ${
                    signal.level === 'green' ? 'bg-signal-green/10 text-signal-green' :
                    signal.level === 'yellow' ? 'bg-signal-yellow/10 text-signal-yellow' :
                    'bg-signal-red/10 text-signal-red'
                  }`}>
                    {signal.level === 'green' && <CheckCircle className="w-3 h-3" />}
                    {signal.level === 'yellow' && <AlertTriangle className="w-3 h-3" />}
                    {signal.level === 'red' && <Shield className="w-3 h-3" />}
                    {signal.label} — {signal.itemCount} item{signal.itemCount !== 1 ? 's' : ''}
                  </div>
                  <SignalPanel checks={signal.checks} notChecked={signal.notChecked} isVisible={true} />
                </div>
              ) : (
                <span className="text-text-dim text-xs">No analysis results yet.</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
