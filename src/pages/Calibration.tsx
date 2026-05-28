import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CalibrationPreview from '../components/CalibrationPreview';
import { getCalibration, checkHealth } from '../api/client';
import { getUserId } from '../config';
import SignalLogo from '../components/SignalLogo';

export default function Calibration() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    checkHealth().then(online => {
      if (cancelled) return;
      if (online) {
        getCalibration(getUserId())
          .then(data => { if (!cancelled) setProfile(data.profile); })
          .catch(() => { if (!cancelled) setProfile(null); });
      }
    });
    return () => { cancelled = true; };
  }, []);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };
  const item = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center justify-center mb-4">
          <SignalLogo size={28} className="text-accent" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mb-3">
          Calibration Engine
        </h1>
        <p className="text-sm text-text-muted max-w-xl mx-auto leading-relaxed">
          Signal adapts to your patterns over time. The more you use it, the better it gets at
          surfacing what matters — and staying quiet when you don't need it.
        </p>
        {profile && profile.interaction_count > 0 && (
          <div className="mt-6 inline-flex items-center gap-4 px-5 py-3 rounded-xl bg-surface border border-border-subtle">
            <div className="text-center">
              <div className="text-xl font-bold text-gradient-amber">{profile.interaction_count}</div>
              <div className="text-[10px] text-text-dim uppercase tracking-widest mt-0.5">Interactions</div>
            </div>
            <div className="w-px h-8 bg-border-subtle" />
            <div className="text-center">
              <div className="text-xl font-bold text-signal-yellow">{profile.override_count}</div>
              <div className="text-[10px] text-text-dim uppercase tracking-widest mt-0.5">Overrides</div>
            </div>
            <div className="w-px h-8 bg-border-subtle" />
            <div className="text-center">
              <div className="text-xl font-bold text-text-primary capitalize">{profile.signal_strength}</div>
              <div className="text-[10px] text-text-dim uppercase tracking-widest mt-0.5">Strength</div>
            </div>
          </div>
        )}
      </motion.div>

      <CalibrationPreview />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
        className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
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
        ].map((card) => (
          <motion.div
            key={card.title}
            variants={item}
            className="rounded-xl p-5 bg-surface border border-border-subtle hover:border-border-hover transition-colors"
          >
            <h3 className="text-sm font-semibold text-text-primary mb-2">{card.title}</h3>
            <p className="text-[13px] text-text-muted leading-relaxed">{card.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
