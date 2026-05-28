import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Play, LayoutTemplate } from 'lucide-react';
import Editor from '@monaco-editor/react';
import FileExplorer from '../components/FileExplorer';
import TabBar from '../components/TabBar';
import TerminalPanel from '../components/TerminalPanel';
import { generateCode, analyzeCode } from '../api/client';
import { AnalysisResponse } from '../api/client';

interface ProjectFile {
  id: string;
  name: string;
  language: string;
  content: string;
}

export default function Playground() {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('python');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [originalContents, setOriginalContents] = useState<Record<string, string>>({});
  const [activeFile, setActiveFile] = useState('');
  const [signal, setSignal] = useState<AnalysisResponse | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [showIDE, setShowIDE] = useState(false);

  const addLog = useCallback((msg: string) => {
    setTerminalLogs(prev => [...prev, msg]);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError(null);
    setSignal(null);
    setTerminalLogs([]);
    setShowIDE(false);

    try {
      addLog(`> Generating ${language} code for: "${prompt}"`);
      const gen = await generateCode(prompt, language);

      const ext = language === 'python' ? 'py' : language === 'typescript' ? 'ts' : 'js';
      const mainFile: ProjectFile = {
        id: 'main',
        name: `main.${ext}`,
        language,
        content: gen.code,
      };

      // Create mock project files for IDE feel
      const projectFiles: ProjectFile[] = [mainFile];
      if (language === 'python') {
        projectFiles.push({
          id: 'requirements',
          name: 'requirements.txt',
          language: 'plaintext',
          content: 'flask>=2.0.0\nrequests>=2.28.0\npython-dotenv>=0.19.0',
        });
      } else {
        projectFiles.push({
          id: 'package',
          name: 'package.json',
          language: 'json',
          content: JSON.stringify({ name: 'generated-app', version: '1.0.0', dependencies: {} }, null, 2),
        });
      }

      setFiles(projectFiles);
      setOriginalContents(projectFiles.reduce((acc, f) => ({ ...acc, [f.id]: f.content }), {}));
      setActiveFile('main');
      setShowIDE(true);
      addLog('✓ Code generated successfully');
      addLog('> Running static analysis...');

      const analysis = await analyzeCode(gen.code, language);
      setSignal(analysis);

      analysis.checks.forEach(check => {
        const icon = check.status === 'pass' ? '✓' : check.status === 'warn' ? '⚠' : '✗';
        addLog(`${icon} ${check.name}: ${check.summary}`);
      });
      addLog(`> Signal: ${analysis.label} — ${analysis.itemCount} item(s) need attention`);
      addLog(`> Time saved: ${analysis.timeSaved}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      addLog(`✗ Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [prompt, loading, language]);

  const handleAnalyze = useCallback(async () => {
    const currentFile = files.find(f => f.id === activeFile);
    if (!currentFile) return;

    setAnalyzing(true);
    setSignal(null);
    setTerminalLogs([]);
    addLog('> Re-running static analysis on modified code...');

    try {
      const analysis = await analyzeCode(currentFile.content, currentFile.language);
      setSignal(analysis);

      analysis.checks.forEach(check => {
        const icon = check.status === 'pass' ? '✓' : check.status === 'warn' ? '⚠' : '✗';
        addLog(`${icon} ${check.name}: ${check.summary}`);
      });
      addLog(`> Signal: ${analysis.label} — ${analysis.itemCount} item(s) need attention`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      addLog(`✗ Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setAnalyzing(false);
    }
  }, [files, activeFile, addLog]);

  const handleFileChange = useCallback((value: string | undefined) => {
    setFiles(prev => prev.map(f => f.id === activeFile ? { ...f, content: value || '' } : f));
  }, [activeFile]);

  const activeFileData = files.find(f => f.id === activeFile);
  const editorLanguage = activeFileData?.language === 'python' ? 'python' :
    activeFileData?.language === 'typescript' ? 'typescript' :
    activeFileData?.language === 'json' ? 'json' : 'javascript';

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Top prompt bar */}
      <div className="flex-shrink-0 px-4 py-3 bg-bg border-b border-border">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-2 rounded-md bg-surface border border-border text-text-primary text-sm focus:outline-none focus:border-accent"
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
          </select>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to build..."
            className="flex-1 px-4 py-2 rounded-md bg-surface border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="px-4 py-2 rounded-md bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {loading ? 'Generating...' : 'Generate'}
            </button>
            {showIDE && (
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={analyzing}
                className="px-4 py-2 rounded-md bg-surface border border-border text-text-primary text-sm font-medium hover:bg-surface-hover disabled:opacity-50 flex items-center gap-2"
              >
                {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 text-accent" />}
                Analyze
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Error banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex-shrink-0 px-4 py-2 bg-signal-red-bg border-b border-signal-red/30 text-signal-red text-xs"
        >
          {error}
        </motion.div>
      )}

      {/* IDE Layout */}
      {showIDE ? (
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-52 flex-shrink-0 hidden sm:block">
            <FileExplorer
              files={files}
              activeFile={activeFile}
              onSelect={setActiveFile}
            />
          </div>

          {/* Main editor area */}
          <div className="flex-1 flex flex-col min-w-0">
            <TabBar
              tabs={files.map(f => ({ id: f.id, name: f.name, language: f.language, modified: f.content !== originalContents[f.id] }))}
              activeTab={activeFile}
              onSelect={setActiveFile}
            />

            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                language={editorLanguage}
                value={activeFileData?.content || ''}
                theme="vs-dark"
                onChange={handleFileChange}
                options={{
                  minimap: { enabled: true, scale: 1 },
                  scrollBeyondLastLine: false,
                  fontSize: 13,
                  fontFamily: "'JetBrains Mono', monospace",
                  lineNumbers: 'on',
                  readOnly: false,
                  automaticLayout: true,
                  padding: { top: 8 },
                }}
              />
            </div>

            <TerminalPanel
              logs={terminalLogs}
              signal={signal}
              isAnalyzing={analyzing}
            />
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="flex-1 flex items-center justify-center text-text-muted">
          <div className="text-center">
            <LayoutTemplate className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-sm">Enter a prompt above to generate code in the IDE.</p>
            <p className="text-xs mt-2 opacity-50">Powered by NVIDIA Llama 3.1 + real static analysis</p>
          </div>
        </div>
      )}
    </div>
  );
}
