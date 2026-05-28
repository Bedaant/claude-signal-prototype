

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

export default function TabBar({ tabs, activeTab, onSelect }: TabBarProps) {
  const getLangColor = (lang: string) => {
    if (lang === 'python') return 'text-signal-yellow';
    if (lang === 'typescript') return 'text-accent';
    if (lang === 'javascript') return 'text-signal-yellow';
    return 'text-text-muted';
  };

  return (
    <div className="flex items-center bg-surface border-b border-border overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSelect(tab.id)}
          className={`flex items-center gap-2 px-3 py-2 text-xs min-w-[120px] max-w-[200px] border-r border-border transition-colors ${
            activeTab === tab.id
              ? 'bg-bg text-text-primary border-t-2 border-t-accent'
              : 'bg-surface text-text-muted hover:bg-surface-hover'
          }`}
        >
          <span className={`text-[10px] font-bold ${getLangColor(tab.language)}`}>
            {tab.language === 'python' ? 'PY' : tab.language === 'typescript' ? 'TS' : 'JS'}
          </span>
          <span className="truncate flex-1">{tab.name}</span>
          {tab.modified && <span className="text-text-muted">●</span>}
        </button>
      ))}
    </div>
  );
}
