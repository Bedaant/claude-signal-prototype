import { motion } from 'framer-motion'
import CalibrationPreview from '../components/CalibrationPreview'

export default function Calibration() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
          Calibration Engine
        </h1>
        <p className="text-text-secondary max-w-xl mx-auto">
          Signal adapts to your patterns over time. The more you use it, the better it gets at
          surfacing what matters — and staying quiet when you don't need it.
        </p>
      </motion.div>

      <CalibrationPreview />

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            title: 'Pattern Detection',
            desc: 'Tracks override decisions and correlates with downstream outcomes over 48 hours.',
          },
          {
            title: 'Personalized Strength',
            desc: 'Amplifies signals for dimensions where you tend to miss issues. Reduces noise where you are already careful.',
          },
          {
            title: 'Judgment Building',
            desc: 'Well-calibrated users see less intervention. The goal is to make YOU better, not make you depend on Signal.',
          },
        ].map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="rounded-xl p-5 bg-surface border border-border"
          >
            <h3 className="text-sm font-semibold text-text-primary mb-1">{card.title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{card.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
