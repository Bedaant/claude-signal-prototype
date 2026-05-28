import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronDown, FileCode, FolderOpen, Folder } from 'lucide-react';

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

export default function FileExplorer({ files, activeFile, onSelect }: FileExplorerProps) {
  const [expanded, setExpanded] = useState(true);

  const getIcon = (name: string) => {
    if (name.endsWith('.py')) return <span className="text-signal-yellow text-xs">🐍</span>;
    if (name.endsWith('.js')) return <span className="text-signal-yellow text-xs">𝐉𝐒</span>;
    if (name.endsWith('.ts')) return <span className="text-accent text-xs">𝐓𝐒</span>;
    if (name.endsWith('.json')) return <span className="text-text-muted text-xs">{ }</span>;
    return <FileCode className="w-3.5 h-3.5 text-text-muted" />;
  };

  return (
    <div className="w-full h-full bg-surface border-r border-border flex flex-col">
      <div className="px-3 py-2 text-[11px] font-bold text-text-muted uppercase tracking-wider border-b border-border">
        Explorer
      </div>
      
      <div className="flex-1 overflow-y-auto py-1">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center gap-1 px-2 py-1 text-text-secondary hover:text-text-primary transition-colors"
        >
          {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          {expanded ? <FolderOpen className="w-3.5 h-3.5 text-accent" /> : <Folder className="w-3.5 h-3.5 text-text-muted" />}
          <span className="text-xs font-medium">claude-signal-project</span>
        </button>
        
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            className="overflow-hidden"
          >
            {files.map((file) => (
              <button
                key={file.id}
                onClick={() => onSelect(file.id)}
                className={`w-full flex items-center gap-2 px-5 py-1.5 text-xs transition-colors ${
                  activeFile === file.id
                    ? 'bg-accent/15 text-text-primary border-l-2 border-accent'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover border-l-2 border-transparent'
                }`}
              >
                {getIcon(file.name)}
                <span className="truncate">{file.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
