'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GiftCardProps {
  children: ReactNode;
  className?: string;
  tiltEffect?: boolean;
}

/**
 * Semi-3D Gift Card Component
 * Matches Stitch design: hard offset shadows, layered depth
 */
export default function GiftCard({ children, className = '', tiltEffect = false }: GiftCardProps) {
  return (
    <motion.div
      className={`
        relative bg-bg-card
        border border-border-subtle
        shadow-3d-hard-md
        rounded-xl
        overflow-hidden
        ${tiltEffect ? 'tilted-frame' : ''}
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{
        boxShadow: '8px 8px 0px #1a1a1a',
        transition: { duration: 0.2 },
      }}
    >
      {/* Decorative border accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-gold/50 via-accent-gold to-accent-gold/50" />

      {/* Content container */}
      <div className="p-6">
        {children}
      </div>
    </motion.div>
  );
}

/**
 * 3D Card Flip Container for reveal animation
 */
export function GiftCardFlip({
  isRevealed,
  lockedFace,
  revealedFace,
}: {
  isRevealed: boolean;
  lockedFace: ReactNode;
  revealedFace: ReactNode;
}) {
  return (
    <div className="card-flip-container w-full h-full">
      <motion.div
        className="card-flip-inner relative w-full h-full"
        initial={{ rotateY: 0 }}
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={{
          duration: 0.8,
          ease: 'easeInOut',
          type: 'spring',
          stiffness: 100,
        }}
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1200px',
        }}
      >
        {/* Front face (locked state) */}
        <div
          className="card-face absolute inset-0"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {lockedFace}
        </div>

        {/* Back face (revealed state) */}
        <div
          className="card-face card-back absolute inset-0"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {revealedFace}
        </div>
      </motion.div>
    </div>
  );
}
