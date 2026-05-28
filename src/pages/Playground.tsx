import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Terminal, AlertCircle, CheckCircle2 } from 'lucide-react';
import ChatMessage from '../components/ChatMessage';
import TypewriterCode from '../components/TypewriterCode';
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
  const [error, setError] = useState<string | null>(null);
  
  const [generatedCode, setGeneratedCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [language, setLanguage] = useState('python');
  const [signal, setSignal] = useState<AnalysisResponse | null>(null);
  const [codeDone, setCodeDone] = useState(false);
  const [tagExpanded, setTagExpanded] = useState(false);
  const [overridden, setOverridden] = useState(false);

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

    try {
      const gen = await generateCode(prompt, language);
      setGeneratedCode(gen.code);
      setExplanation(gen.explanation);

      const analysis = await analyzeCode(gen.code, language);
      setSignal(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [prompt, language, loading]);

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
      // Silently fail — demo should still work
      setOverridden(true);
    }
  }, [signal, generatedCode, prompt, language]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-xl font-bold text-text-primary mb-1">Live Playground</h1>
        <p className="text-sm text-text-secondary">
          Type a coding prompt. Claude Signal will generate code and run real verification.
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

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-2.5 rounded-lg bg-surface border border-border text-text-primary text-sm focus:outline-none focus:border-accent"
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
            className="px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
          className="mb-6 p-4 rounded-lg bg-signal-red-bg border border-signal-red/30 text-signal-red text-sm"
        >
          <div className="flex items-center gap-2 font-medium mb-1">
            <AlertCircle className="w-4 h-4" />
            Generation failed
          </div>
          {error}
        </motion.div>
      )}

      {generatedCode && (
        <div className="space-y-6">
          <ChatMessage role="user" delay={0}>
            {prompt}
          </ChatMessage>

          <ChatMessage role="assistant" delay={0.2}>
            <div>
              <p className="mb-2">{explanation}</p>
              <TypewriterCode
                key={generatedCode}
                code={generatedCode}
                language={language}
                speed={8}
                onComplete={() => setCodeDone(true)}
              />

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

      {!generatedCode && !loading && (
        <div className="text-center py-16 text-text-muted">
          <Terminal className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Enter a prompt above to generate and analyze code.</p>
          <p className="text-xs mt-1 opacity-60">Powered by NVIDIA Llama 3.1 + real static analysis</p>
        </div>
      )}
    </div>
  );
}
