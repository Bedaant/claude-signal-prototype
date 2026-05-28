import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  delay?: number
}

export default function FeatureCard({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay }}
      className="rounded-xl p-5 bg-surface border border-border-subtle hover:border-accent/20 hover:shadow-[0_0_24px_rgba(245,166,35,0.06)] transition-all group"
    >
      <div className="w-10 h-10 rounded-lg bg-accent-dim border border-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent/15 transition-colors">
        <Icon className="w-5 h-5 text-accent" />
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
    </motion.div>
  )
}
