import { motion } from 'framer-motion'
import { User, Bot } from 'lucide-react'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  children: React.ReactNode
  delay?: number
}

export default function ChatMessage({ role, children, delay = 0 }: ChatMessageProps) {
  const isUser = role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-accent/20 text-accent' : 'bg-surface border border-border text-text-secondary'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div
        className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
          isUser
            ? 'bg-accent/15 text-text-primary rounded-br-md'
            : 'bg-surface border border-border text-text-primary rounded-bl-md'
        }`}
      >
        {children}
      </div>
    </motion.div>
  )
}
