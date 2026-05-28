import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, ShieldAlert, ChevronRight, Copy, Check } from 'lucide-react';
import { Finding } from '../api/client';

interface FixPanelProps {
  findings: Finding[] | undefined;
  activeFile: string;
  onSelectFile: (file: string, line: number) => void;
}

function SeverityIcon({ severity }: { severity: string }) {
  if (severity === 'critical') return <ShieldAlert className="w-3.5 h-3.5 text-signal-red" />;
  if (severity === 'warn') return <AlertTriangle className="w-3.5 h-3.5 text-signal-yellow" />;
  return <CheckCircle className="w-3.5 h-3.5 text-signal-green" />;
}

function SeverityBadge({ severity }: { severity: string }) {
  const cls = severity === 'critical'
    ? 'bg-signal-red/10 text-signal-red border-signal-red/20'
    : severity === 'warn'
    ? 'bg-signal-yellow/10 text-signal-yellow border-signal-yellow/20'
    : 'bg-signal-green/10 text-signal-green border-signal-green/20';
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-px rounded border ${cls} uppercase`}>
      {severity}
    </span>
  );
}

export default function FixPanel({ findings, activeFile, onSelectFile }: FixPanelProps) {
  const [expandedFix, setExpandedFix] = useState<number | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  if (!findings || findings.length === 0) {
    return (
      <div className="p-4 text-center">
        <CheckCircle className="w-6 h-6 text-signal-green mx-auto mb-2" />
        <p className="text-xs text-text-muted">No issues found</p>
      </div>
    );
  }

  // Group by file
  const byFile: Record<string, Finding[]> = {};
  findings.forEach(f => {
    if (!byFile[f.file]) byFile[f.file] = [];
    byFile[f.file].push(f);
  });

  const handleCopy = (fix: string, idx: number) => {
    navigator.clipboard.writeText(fix);
    setCopied(idx);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="h-full overflow-auto">
      <div className="px-3 py-2 border-b border-border-subtle">
        <p className="text-[11px] font-bold text-text-dim uppercase tracking-widest">
          Issues & Fixes
        </p>
        <p className="text-[10px] text-text-dim mt-0.5">
          {findings.length} finding{findings.length !== 1 ? 's' : ''} across {Object.keys(byFile).length} file{Object.keys(byFile).length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="divide-y divide-border-subtle">
        {Object.entries(byFile).map(([file, fileFindings]) => (
          <div key={file}>
            <div className={`px-3 py-1.5 text-[11px] font-semibold flex items-center gap-2 ${file === activeFile ? 'text-accent' : 'text-text-muted'}`}>
              <span className="truncate">{file}</span>
              <span className="text-[10px] text-text-dim">({fileFindings.length})</span>
            </div>
            {fileFindings.map((finding) => {
              const globalIdx = findings.indexOf(finding);
              const isOpen = expandedFix === globalIdx;
              return (
                <div key={globalIdx} className={`px-3 py-2 ${file === activeFile ? 'bg-accent/5' : ''}`}>
                  <button
                    onClick={() => {
                      setExpandedFix(isOpen ? null : globalIdx);
                      onSelectFile(file, finding.line);
                    }}
                    className="w-full flex items-start gap-2 text-left"
                  >
                    <SeverityIcon severity={finding.severity} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-text-secondary leading-snug">{finding.message}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-text-dim">Line {finding.line}</span>
                        <SeverityBadge severity={finding.severity} />
                      </div>
                    </div>
                    <motion.div animate={{ rotate: isOpen ? 90 : 0 }}>
                      <ChevronRight className="w-3 h-3 text-text-dim flex-shrink-0 mt-0.5" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isOpen && finding.fix && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 space-y-2">
                          <div className="rounded-md bg-signal-red-bg border border-signal-red/10 p-2">
                            <p className="text-[9px] font-semibold text-signal-red uppercase tracking-wider mb-1">Current</p>
                            <pre className="text-[10px] text-text-secondary font-mono overflow-x-auto whitespace-pre-wrap">{finding.fix.before}</pre>
                          </div>
                          <div className="rounded-md bg-signal-green-bg border border-signal-green/10 p-2">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-[9px] font-semibold text-signal-green uppercase tracking-wider">Suggested Fix</p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(finding.fix!.after, globalIdx);
                                }}
                                className="text-[10px] text-text-muted hover:text-text-primary flex items-center gap-1 transition-colors"
                              >
                                {copied === globalIdx ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                {copied === globalIdx ? 'Copied' : 'Copy'}
                              </button>
                            </div>
                            <pre className="text-[10px] text-text-secondary font-mono overflow-x-auto whitespace-pre-wrap">{finding.fix.after}</pre>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
