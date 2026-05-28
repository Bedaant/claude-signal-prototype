import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Terminal, AlertCircle, CheckCircle2, Code2, Play } from 'lucide-react';
import Editor from '@monaco-editor/react';
import ChatMessage from '../components/ChatMessage';
import SignalTag from '../components/SignalTag';
import SignalPanel from '../components/SignalPanel';
import OverrideButton from '../components/OverrideButton';
import { generateCode, analyzeCode, logOverride, checkHealth } from '../api/client';
import { getUserId } from '../config';
import { AnalysisResponse } from '../api/client';

export default function Playground() {
  const [prompt, setPrompt] = useState('');
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [generatedCode, setGeneratedCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [language, setLanguage] = useState('python');
  const [signal, setSignal] = useState<AnalysisResponse | null>(null);
  const [codeDone, setCodeDone] = useState(false);
  const [tagExpanded, setTagExpanded] = useState(false);
  const [overridden, setOverridden] = useState(false);
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    checkHealth().then(setBackendOnline);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError(null);
    setGeneratedCode('');
    setSignal(null);
    setCodeDone(false);
    setTagExpanded(false);
    setOverridden(false);
    setShowCode(false);

    try {
      const gen = await generateCode(prompt, language);
      setGeneratedCode(gen.code);
      setExplanation(gen.explanation);
      setShowCode(true);

      const analysis = await analyzeCode(gen.code, language);
      setSignal(analysis);
      setCodeDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [prompt, language, loading]);

  const handleAnalyze = useCallback(async () => {
    if (!generatedCode) return;
    setAnalyzing(true);
    setTagExpanded(false);
    try {
      const analysis = await analyzeCode(generatedCode, language);
      setSignal(analysis);
      setCodeDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  }, [generatedCode, language]);

  const handleOverride = useCallback(async () => {
    if (!signal || !generatedCode) return;
    try {
      await logOverride(getUserId(), {
        prompt,
        generated_code: generatedCode,
        language,
        signal_level: signal.level,
        override_decision: 'override',
      });
      setOverridden(true);
    } catch {
      setOverridden(true);
    }
  }, [signal, generatedCode, prompt, language]);

  const editorLanguage = language === 'python' ? 'python' : language === 'typescript' ? 'typescript' : 'javascript';

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 sm:mb-6"
      >
        <h1 className="text-lg sm:text-xl font-bold text-text-primary mb-1 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-accent" />
          Live Playground
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary">
          Type a coding prompt. Claude Signal generates code and runs real verification.
        </p>
        {backendOnline === false && (
          <div className="mt-2 flex items-center gap-2 text-xs text-signal-yellow">
            <AlertCircle className="w-3.5 h-3.5" />
            Backend offline — using fallback mode
          </div>
        )}
        {backendOnline === true && (
          <div className="mt-2 flex items-center gap-2 text-xs text-signal-green">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Backend connected — real AI + real analysis
          </div>
        )}
      </motion.div>

      <form onSubmit={handleSubmit} className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-2.5 rounded-lg bg-surface border border-border text-text-primary text-sm focus:outline-none focus:border-accent w-full sm:w-auto"
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
          </select>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Write a Python function to validate email using regex"
            className="flex-1 px-4 py-2.5 rounded-lg bg-surface border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent"
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </form>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg bg-signal-red-bg border border-signal-red/30 text-signal-red text-sm"
        >
          <div className="flex items-center gap-2 font-medium mb-1">
            <AlertCircle className="w-4 h-4" />
            Error
          </div>
          {error}
        </motion.div>
      )}

      {showCode && generatedCode && (
        <div className="space-y-4 sm:space-y-6">
          <ChatMessage role="user" delay={0}>
            {prompt}
          </ChatMessage>

          <ChatMessage role="assistant" delay={0.2}>
            <div>
              <p className="mb-2 text-sm">{explanation}</p>
              
              <div className="rounded-lg overflow-hidden border border-code-border my-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between px-3 py-1.5 bg-code-bg border-b border-code-border gap-2">
                  <span className="text-xs font-medium text-text-muted uppercase tracking-wider">{editorLanguage}</span>
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="flex items-center justify-center gap-1.5 px-3 py-1 rounded-md bg-accent/20 text-accent text-xs font-medium hover:bg-accent/30 disabled:opacity-50 transition-colors w-full sm:w-auto"
                  >
                    {analyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                    {analyzing ? 'Analyzing...' : 'Analyze This Code'}
                  </button>
                </div>
                <Editor
                  height="300px"
                  language={editorLanguage}
                  value={generatedCode}
                  theme="vs-dark"
                  onChange={(value) => setGeneratedCode(value || '')}
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 13,
                    fontFamily: "'JetBrains Mono', monospace",
                    lineNumbers: 'on',
                    readOnly: false,
                    automaticLayout: true,
                  }}
                />
              </div>

              {signal && (
                <>
                  <SignalTag
                    level={signal.level}
                    label={signal.label}
                    itemCount={signal.itemCount}
                    onClick={() => setTagExpanded(!tagExpanded)}
                    isExpanded={tagExpanded}
                    visible={codeDone}
                  />

                  <SignalPanel
                    checks={signal.checks}
                    notChecked={signal.notChecked}
                    isVisible={tagExpanded}
                  />

                  <OverrideButton
                    onOverride={handleOverride}
                    isOverridden={overridden}
                    timeSaved={signal.timeSaved}
                  />
                </>
              )}
            </div>
          </ChatMessage>
        </div>
      )}

      {!showCode && !loading && (
        <div className="text-center py-12 sm:py-16 text-text-muted">
          <Terminal className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Enter a prompt above to generate and analyze code.</p>
          <p className="text-xs mt-1 opacity-60">Powered by NVIDIA Llama 3.1 + real static analysis</p>
        </div>
      )}
    </div>
  );
}
