import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Play, Plus, Trash2, FileCode, Sparkles, Wand2 } from 'lucide-react';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import FileExplorer from '../components/FileExplorer';
import TabBar from '../components/TabBar';
import TerminalPanel from '../components/TerminalPanel';
import FixPanel from '../components/FixPanel';
import SignalLogo from '../components/SignalLogo';
import { generateCode, analyzeFiles, AnalysisResponse } from '../api/client';
import { sampleProjects } from '../data/sampleProjects';

interface ProjectFile {
  id: string;
  name: string;
  language: string;
  content: string;
}

type Mode = 'samples' | 'generate' | 'paste';

export default function Playground() {
  const [mode, setMode] = useState<Mode>('samples');
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
  const [showFixPanel, setShowFixPanel] = useState(false);

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const decorationsRef = useRef<string[]>([]);

  const addLog = useCallback((msg: string) => {
    setTerminalLogs(prev => [...prev, msg]);
  }, []);

  // Load sample project
  const loadSampleProject = useCallback((projectId: string) => {
    const project = sampleProjects.find(p => p.id === projectId);
    if (!project) return;

    setFiles(project.files);
    setOriginalContents(project.files.reduce((acc, f) => ({ ...acc, [f.id]: f.content }), {}));
    setActiveFile(project.files[0]?.id || '');
    setLanguage(project.language);
    setSignal(null);
    setTerminalLogs([]);
    setError(null);
    setShowIDE(true);
    setShowFixPanel(false);
    addLog(`> Loaded sample project: ${project.title}`);
    addLog(`> ${project.files.length} file(s) ready for analysis`);
  }, [addLog]);

  // Generate from prompt
  const handleGenerate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError(null);
    setSignal(null);
    setTerminalLogs([]);
    setShowFixPanel(false);

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

      const projectFiles: ProjectFile[] = [mainFile];
      if (language === 'python') {
        projectFiles.push({
          id: 'requirements',
          name: 'requirements.txt',
          language: 'plaintext',
          content: 'flask>=2.0.0\nrequests>=2.28.0',
        });
      } else {
        projectFiles.push({
          id: 'package',
          name: 'package.json',
          language: 'json',
          content: JSON.stringify({ name: 'app', version: '1.0.0' }, null, 2),
        });
      }

      setFiles(projectFiles);
      setOriginalContents(projectFiles.reduce((acc, f) => ({ ...acc, [f.id]: f.content }), {}));
      setActiveFile('main');
      setShowIDE(true);
      addLog('✓ Code generated');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
      addLog(`✗ Error: ${err instanceof Error ? err.message : 'Unknown'}`);
    } finally {
      setLoading(false);
    }
  }, [prompt, loading, language, addLog]);

  // Analyze all files
  const handleAnalyze = useCallback(async () => {
    if (files.length === 0) return;

    setAnalyzing(true);
    setSignal(null);
    setTerminalLogs([]);
    setShowFixPanel(false);
    addLog(`> Analyzing ${files.length} file(s)...`);

    try {
      const filesToAnalyze = files.map(f => ({ name: f.name, content: f.content }));
      const analysis = await analyzeFiles(filesToAnalyze, language);
      setSignal(analysis);

      analysis.checks.forEach(check => {
        const icon = check.status === 'pass' ? '✓' : check.status === 'warn' ? '⚠' : '✗';
        addLog(`${icon} ${check.name}: ${check.summary}`);
      });
      addLog(`> Signal: ${analysis.label} — ${analysis.itemCount} item(s)`);
      if (analysis.findings.length > 0) {
        addLog(`> ${analysis.findings.length} finding(s) with suggested fixes`);
      }

      // Auto-show fix panel if there are findings
      if (analysis.findings.length > 0) {
        setShowFixPanel(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      addLog(`✗ Error: ${err instanceof Error ? err.message : 'Unknown'}`);
    } finally {
      setAnalyzing(false);
    }
  }, [files, language, addLog]);

  // Monaco decorations for findings
  useEffect(() => {
    if (!editorRef.current || !signal?.findings || !activeFile) return;

    const fileFindings = signal.findings.filter(f => {
      const activeFileName = files.find(file => file.id === activeFile)?.name;
      return f.file === activeFileName || f.file === activeFile;
    });

    const model = editorRef.current.getModel();
    if (!model) return;

    // Remove old decorations
    if (decorationsRef.current.length > 0) {
      editorRef.current.removeDecorations(decorationsRef.current);
    }

    const newDecorations: editor.IModelDeltaDecoration[] = fileFindings.map(f => ({
      range: {
        startLineNumber: f.line,
        startColumn: 1,
        endLineNumber: f.line,
        endColumn: model.getLineLength(f.line) + 1,
      },
      options: {
        isWholeLine: true,
        className: f.severity === 'critical' ? 'bg-signal-red/10' : 'bg-signal-yellow/10',
        glyphMarginClassName: f.severity === 'critical' ? 'signal-red-gutter' : 'signal-yellow-gutter',
        hoverMessage: { value: `**${f.severity.toUpperCase()}**: ${f.message}` },
        overviewRuler: {
          color: f.severity === 'critical' ? '#ef4444' : '#f5a623',
          position: 1,
        },
      },
    }));

    decorationsRef.current = editorRef.current.deltaDecorations([], newDecorations);
  }, [signal, activeFile, files]);

  const handleFileChange = useCallback((value: string | undefined) => {
    setFiles(prev => prev.map(f => f.id === activeFile ? { ...f, content: value || '' } : f));
  }, [activeFile]);

  const handleAddFile = useCallback(() => {
    const id = `file-${Date.now()}`;
    const ext = language === 'python' ? 'py' : language === 'typescript' ? 'ts' : 'js';
    const newFile: ProjectFile = { id, name: `untitled.${ext}`, language, content: '' };
    setFiles(prev => [...prev, newFile]);
    setActiveFile(id);
  }, [language]);

  const handleDeleteFile = useCallback((id: string) => {
    setFiles(prev => {
      const filtered = prev.filter(f => f.id !== id);
      if (activeFile === id && filtered.length > 0) {
        setActiveFile(filtered[0].id);
      }
      return filtered;
    });
  }, [activeFile]);

  const handleSelectFinding = useCallback((file: string, line: number) => {
    const fileId = files.find(f => f.name === file || f.id === file)?.id;
    if (fileId) {
      setActiveFile(fileId);
      setTimeout(() => {
        editorRef.current?.revealLineInCenter(line);
        editorRef.current?.setPosition({ lineNumber: line, column: 1 });
      }, 100);
    }
  }, [files]);

  const activeFileData = files.find(f => f.id === activeFile);
  const editorLanguage = activeFileData?.language === 'python' ? 'python' :
    activeFileData?.language === 'typescript' ? 'typescript' :
    activeFileData?.language === 'json' ? 'json' : 'javascript';

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Mode selector + Prompt bar */}
      <div className="flex-shrink-0 px-4 py-3 bg-bg border-b border-border-subtle">
        {/* Mode tabs */}
        <div className="flex items-center gap-1 mb-3">
          {[
            { id: 'samples' as Mode, label: 'Sample Projects', icon: FileCode },
            { id: 'generate' as Mode, label: 'Generate', icon: Wand2 },
            { id: 'paste' as Mode, label: 'Paste Your Code', icon: Sparkles },
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                mode === m.id
                  ? 'bg-accent/10 text-accent border border-accent/20'
                  : 'text-text-muted hover:text-text-secondary border border-transparent'
              }`}
            >
              <m.icon className="w-3.5 h-3.5" />
              {m.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {mode === 'generate' && (
            <motion.form
              key="generate"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleGenerate}
              className="flex flex-col sm:flex-row gap-2"
            >
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-2 rounded-lg bg-surface border border-border-subtle text-text-primary text-sm focus:outline-none focus:border-accent transition-colors"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
              </select>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Build a user authentication API with SQLite..."
                className="flex-1 px-4 py-2 rounded-lg bg-surface border border-border-subtle text-text-primary text-sm placeholder:text-text-dim focus:outline-none focus:border-accent transition-colors"
              />
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="px-4 py-2 rounded-lg bg-accent text-bg text-sm font-semibold hover:bg-accent-hover disabled:opacity-50 flex items-center gap-2 transition-colors glow-amber-sm"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                Generate
              </button>
            </motion.form>
          )}

          {mode === 'paste' && (
            <motion.div
              key="paste"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-col sm:flex-row gap-2"
            >
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-2 rounded-lg bg-surface border border-border-subtle text-text-primary text-sm focus:outline-none focus:border-accent transition-colors"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
              </select>
              <p className="flex-1 text-sm text-text-muted flex items-center">
                Paste your AI-generated code into the editor files below, then click Analyze.
              </p>
              <button
                onClick={handleAddFile}
                className="px-3 py-2 rounded-lg bg-surface border border-border-subtle text-text-primary text-sm font-medium hover:bg-surface-hover flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add File
              </button>
              {showIDE && (
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="px-4 py-2 rounded-lg bg-accent text-bg text-sm font-semibold hover:bg-accent-hover disabled:opacity-50 flex items-center gap-2 transition-colors"
                >
                  {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  Analyze
                </button>
              )}
            </motion.div>
          )}

          {mode === 'samples' && (
            <motion.div
              key="samples"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2"
            >
              {sampleProjects.map(project => (
                <button
                  key={project.id}
                  onClick={() => loadSampleProject(project.id)}
                  className="px-3 py-2 rounded-lg bg-surface border border-border-subtle hover:border-accent/30 hover:bg-surface-hover text-left transition-all group"
                >
                  <p className="text-xs font-semibold text-text-primary group-hover:text-accent transition-colors">{project.title}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">{project.description} · {project.files.length} files</p>
                </button>
              ))}
              {showIDE && (
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="px-4 py-2 rounded-lg bg-accent text-bg text-sm font-semibold hover:bg-accent-hover disabled:opacity-50 flex items-center gap-2 transition-colors"
                >
                  {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  Analyze Project
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex-shrink-0 px-4 py-2 bg-signal-red-bg border-b border-signal-red/20 text-signal-red text-xs"
        >
          {error}
        </motion.div>
      )}

      {/* IDE Layout */}
      {showIDE ? (
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar: File Explorer */}
          <div className="w-48 flex-shrink-0 hidden sm:flex flex-col border-r border-border-subtle">
            <div className="flex-1 overflow-hidden">
              <FileExplorer
                files={files}
                activeFile={activeFile}
                onSelect={setActiveFile}
              />
            </div>
            {mode === 'paste' && (
              <div className="p-2 border-t border-border-subtle flex gap-2">
                <button
                  onClick={handleAddFile}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md bg-surface-hover text-[11px] text-text-muted hover:text-text-secondary transition-colors"
                >
                  <Plus className="w-3 h-3" /> File
                </button>
                {files.length > 1 && (
                  <button
                    onClick={() => handleDeleteFile(activeFile)}
                    className="flex items-center justify-center px-2 py-1.5 rounded-md bg-surface-hover text-[11px] text-text-muted hover:text-signal-red transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Main area: Editor + Terminal */}
          <div className="flex-1 flex flex-col min-w-0">
            <TabBar
              tabs={files.map(f => ({
                id: f.id,
                name: f.name,
                language: f.language,
                modified: f.content !== originalContents[f.id],
              }))}
              activeTab={activeFile}
              onSelect={setActiveFile}
            />

            <div className="flex-1 min-h-0 relative">
              <Editor
                height="100%"
                language={editorLanguage}
                value={activeFileData?.content || ''}
                theme="vs-dark"
                onChange={handleFileChange}
                onMount={editor => { editorRef.current = editor; }}
                options={{
                  minimap: { enabled: true, scale: 1 },
                  scrollBeyondLastLine: false,
                  fontSize: 13,
                  fontFamily: "'JetBrains Mono', monospace",
                  lineNumbers: 'on',
                  readOnly: false,
                  automaticLayout: true,
                  padding: { top: 8 },
                  glyphMargin: true,
                }}
              />
            </div>

            <TerminalPanel
              logs={terminalLogs}
              signal={signal}
              isAnalyzing={analyzing}
            />
          </div>

          {/* Right sidebar: Fix Panel */}
          <AnimatePresence>
            {showFixPanel && signal && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex-shrink-0 border-l border-border-subtle bg-code-bg overflow-hidden"
              >
                <FixPanel
                  findings={signal.findings}
                  activeFile={activeFileData?.name || ''}
                  onSelectFile={handleSelectFinding}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* Empty state */
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface border border-border-subtle mb-5">
              <SignalLogo size={36} className="text-text-dim" animated={false} />
            </div>
            <h2 className="text-lg font-semibold text-text-primary mb-2">Verify Your AI-Generated Code</h2>
            <p className="text-sm text-text-muted mb-6 leading-relaxed">
              Paste code from ChatGPT, Cursor, or Copilot. Signal will find security issues, bugs, and logic flaws — and show you exactly how to fix them.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                onClick={() => setMode('samples')}
                className="px-4 py-2 rounded-lg bg-accent text-bg text-sm font-semibold hover:bg-accent-hover transition-colors"
              >
                Try a Sample Project
              </button>
              <button
                onClick={() => setMode('paste')}
                className="px-4 py-2 rounded-lg border border-border-subtle text-text-secondary text-sm hover:border-border-hover hover:text-text-primary transition-colors"
              >
                Paste Your Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
