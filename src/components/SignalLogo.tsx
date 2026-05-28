import { motion } from 'framer-motion';

interface SignalLogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export default function SignalLogo({ size = 32, className = '', animated = true }: SignalLogoProps) {
  const strokeWidth = size * 0.08;
  const center = size / 2;
  const maxRadius = size * 0.42;

  const arcs = [
    { r: maxRadius * 0.35, delay: 0 },
    { r: maxRadius * 0.6, delay: 0.15 },
    { r: maxRadius * 0.85, delay: 0.3 },
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className={className}
    >
      {/* Central dot */}
      <motion.circle
        cx={center}
        cy={center}
        r={strokeWidth * 0.7}
        fill="currentColor"
        initial={animated ? { scale: 0 } : undefined}
        animate={animated ? { scale: [1, 1.2, 1] } : undefined}
        transition={animated ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : undefined}
      />

      {/* Concentric arcs */}
      {arcs.map((arc, i) => (
        <motion.circle
          key={i}
          cx={center}
          cy={center}
          r={arc.r}
          stroke="currentColor"
          strokeWidth={strokeWidth * 0.6}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${arc.r * Math.PI * 0.5} ${arc.r * Math.PI * 2}`}
          strokeDashoffset={arc.r * Math.PI * 0.25}
          initial={animated ? { opacity: 0, scale: 0.8 } : undefined}
          animate={animated ? {
            opacity: [0.25, 0.7, 0.25],
            scale: [1, 1.05, 1],
          } : undefined}
          transition={animated ? {
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: arc.delay,
          } : undefined}
        />
      ))}
    </svg>
  );
}
