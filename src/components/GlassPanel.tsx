import React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';

export interface GlassPanelProps extends HTMLMotionProps<'div'> {
  children?: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: 'default' | 'subtle';
  hoverEffect?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className = '',
  delay = 0,
  variant = 'default',
  hoverEffect = false,
  initial,
  whileInView,
  viewport,
  transition,
  ...props
}) => {
  const baseClass = variant === 'subtle' ? 'glass-panel-subtle' : 'glass-panel';

  return (
    <motion.div
      initial={initial ?? { opacity: 0, y: 18 }}
      whileInView={whileInView ?? { opacity: 1, y: 0 }}
      viewport={viewport ?? { once: true, margin: '-30px' }}
      transition={
        transition ?? {
          duration: 0.52,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }
      }
      whileHover={
        hoverEffect
          ? {
              y: -3,
              transition: { duration: 0.22, ease: 'easeOut' },
            }
          : undefined
      }
      className={`${baseClass} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
