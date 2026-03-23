'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import GiftCard from './GiftCard';

interface RevealAnimationProps {
  message: string;
  recipientName: string;
  mediaUrl?: string | null;
  mediaType?: 'image' | 'video' | 'none';
  onRevealComplete?: () => void;
}

export default function RevealAnimation({
  message,
  recipientName,
  mediaUrl,
  mediaType = 'none',
  onRevealComplete,
}: RevealAnimationProps) {
  const [particlesVisible, setParticlesVisible] = useState(false);

  useEffect(() => {
    setParticlesVisible(true);
    const timer = setTimeout(() => {
      setParticlesVisible(false);
      onRevealComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center p-4 overflow-hidden">
      {/* Particle/Confetti Animation */}
      <AnimatePresence>
        {particlesVisible && (
          <>
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: ['#c9a962', '#d4a574', '#ffffff'][i % 3],
                }}
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -20,
                  opacity: 1,
                }}
                animate={{
                  y: window.innerHeight + 20,
                  opacity: 0,
                  rotate: Math.random() * 720,
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 0.5,
                  ease: 'easeOut',
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Revealed Card */}
      <GiftCard className="w-full max-w-lg" tiltEffect>
        <div className="space-y-6">
          {/* Recipient greeting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <p className="text-accent-gold text-sm uppercase tracking-widest mb-2">
              For
            </p>
            <h2 className="editorial text-3xl text-text-primary mb-4">
              {recipientName}
            </h2>
          </motion.div>

          {/* Media display */}
          {mediaUrl && mediaType !== 'none' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="relative aspect-square rounded-lg overflow-hidden border border-border-medium shadow-3d-hard-sm"
            >
              {mediaType === 'video' ? (
                <video
                  src={mediaUrl}
                  controls
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                />
              ) : (
                <img
                  src={mediaUrl}
                  alt="Gift memory"
                  className="w-full h-full object-cover"
                />
              )}
            </motion.div>
          )}

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-bg-tertiary rounded-lg p-6 border border-border-subtle"
          >
            <p className="editorial text-xl text-text-primary leading-relaxed">
              {message}
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center pt-4"
          >
            <p className="text-text-muted text-xs uppercase tracking-wider mb-4">
              Memory Unlocked
            </p>
            {mediaUrl && (
              <a
                href={mediaUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block btn-3d py-3 px-6 bg-accent-gold text-bg-primary font-semibold rounded-lg shadow-3d-hard-sm"
              >
                Save This Memory
              </a>
            )}
          </motion.div>
        </div>
      </GiftCard>
    </div>
  );
}
