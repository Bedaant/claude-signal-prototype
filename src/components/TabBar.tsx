interface Tab {
  id: string;
  name: string;
  language: string;
  modified?: boolean;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onSelect: (id: string) => void;
}

function LangBadge({ lang }: { lang: string }) {
  const cls = lang === 'python'
    ? 'text-signal-green bg-signal-green/8'
    : lang === 'typescript'
    ? 'text-accent bg-accent/8'
    : lang === 'javascript'
    ? 'text-signal-yellow bg-signal-yellow/8'
    : 'text-text-muted bg-surface-active';

  const label = lang === 'python' ? 'PY' : lang === 'typescript' ? 'TS' : lang === 'javascript' ? 'JS' : lang.toUpperCase().slice(0, 2);

  return (
    <span className={`text-[9px] font-bold px-1 py-px rounded ${cls}`}>
      {label}
    </span>
  );
}

export default function TabBar({ tabs, activeTab, onSelect }: TabBarProps) {
  return (
    <div className="flex items-center bg-code-bg border-b border-border-subtle overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSelect(tab.id)}
          className={`flex items-center gap-2 px-3 py-2 text-xs min-w-[100px] max-w-[180px] border-r border-border-subtle transition-all ${
            activeTab === tab.id
              ? 'bg-bg text-text-primary border-t-2 border-t-accent'
              : 'bg-code-bg text-text-muted hover:text-text-secondary hover:bg-surface-hover/30'
          }`}
        >
          <LangBadge lang={tab.language} />
          <span className="truncate flex-1">{tab.name}</span>
          {tab.modified && <span className="w-1.5 h-1.5 rounded-full bg-accent/60 flex-shrink-0" />}
        </button>
      ))}
    </div>
  );
}
