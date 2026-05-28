import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python'
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import oneDark from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark'
import { Copy, Check } from 'lucide-react'

SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('javascript', javascript)

interface TypewriterCodeProps {
  code: string
  language: string
  speed?: number
  onComplete?: () => void
}

export default function TypewriterCode({ code, language, speed = 12, onComplete }: TypewriterCodeProps) {
  const [displayed, setDisplayed] = useState('')
  const [copied, setCopied] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    setDisplayed('')
    setDone(false)
    const interval = setInterval(() => {
      if (i >= code.length) {
        clearInterval(interval)
        setDone(true)
        onComplete?.()
        return
      }
      // Batch updates: append 3 chars at a time to reduce SyntaxHighlighter re-renders
      const batch = Math.min(i + 3, code.length)
      setDisplayed(code.slice(0, batch))
      i = batch
    }, speed)
    return () => clearInterval(interval)
  }, [code, speed, onComplete])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg overflow-hidden border border-code-border bg-code-bg my-3"
    >
      <div className="flex items-center justify-between px-4 py-2 bg-code-bg border-b border-code-border">
        <span className="text-xs font-medium text-text-muted uppercase tracking-wider">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors"
          aria-label="Copy code"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-signal-green" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="relative">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: '#0d1117',
            fontSize: '13px',
            lineHeight: '1.6',
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            minHeight: '120px',
          }}
          showLineNumbers
          lineNumberStyle={{
            color: '#484f58',
            paddingRight: '1rem',
            minWidth: '2.5rem',
          }}
        >
          {displayed}
        </SyntaxHighlighter>
        {!done && (
          <span className="absolute bottom-3 right-4 w-2 h-5 bg-accent animate-pulse" />
        )}
      </div>
    </motion.div>
  )
}
