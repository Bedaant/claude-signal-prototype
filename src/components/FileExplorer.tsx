import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, FolderOpen, Folder, FileJson, FileText } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  language: string;
  content: string;
}

interface FileExplorerProps {
  files: FileItem[];
  activeFile: string;
  onSelect: (id: string) => void;
}

function FileIcon({ name }: { name: string }) {
  if (name.endsWith('.py')) return <span className="text-[10px] font-bold text-signal-green">PY</span>;
  if (name.endsWith('.js')) return <span className="text-[10px] font-bold text-signal-yellow">JS</span>;
  if (name.endsWith('.ts')) return <span className="text-[10px] font-bold text-accent">TS</span>;
  if (name.endsWith('.json')) return <FileJson className="w-3.5 h-3.5 text-text-muted" />;
  if (name.endsWith('.txt')) return <FileText className="w-3.5 h-3.5 text-text-muted" />;
  return <span className="text-[10px] font-bold text-text-muted">{name.split('.').pop()?.toUpperCase()}</span>;
}

export default function FileExplorer({ files, activeFile, onSelect }: FileExplorerProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="w-full h-full bg-code-bg border-r border-border-subtle flex flex-col">
      <div className="px-3 py-2 text-[11px] font-bold text-text-dim uppercase tracking-widest border-b border-border-subtle flex items-center justify-between">
        <span>Explorer</span>
        <span className="text-[10px] font-normal text-text-dim/60">{files.length} files</span>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center gap-1 px-2 py-1 text-text-secondary hover:text-text-primary transition-colors"
        >
          <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.15 }}>
            <ChevronRight className="w-3 h-3" />
          </motion.div>
          {expanded ? <FolderOpen className="w-3.5 h-3.5 text-accent/70" /> : <Folder className="w-3.5 h-3.5 text-text-dim" />}
          <span className="text-xs font-medium">signal-project</span>
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {files.map((file) => (
                <button
                  key={file.id}
                  onClick={() => onSelect(file.id)}
                  className={`w-full flex items-center gap-2 px-6 py-1.5 text-xs transition-all ${
                    activeFile === file.id
                      ? 'bg-accent/[0.08] text-text-primary border-l-2 border-accent'
                      : 'text-text-muted hover:text-text-secondary hover:bg-surface-hover/50 border-l-2 border-transparent'
                  }`}
                >
                  <FileIcon name={file.name} />
                  <span className="truncate">{file.name}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
