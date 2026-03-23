'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* Header */}
      <header className="border-b border-border-subtle bg-bg-secondary/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="editorial text-lg text-text-primary">
              Sentimental Coordinates
            </h1>
            <p className="text-text-muted text-xs mt-1">
              Geo-locked gift reveals
            </p>
          </div>
          <Link
            href="/create"
            className="btn-3d py-2 px-4 bg-accent-gold text-bg-primary text-sm font-semibold rounded-lg shadow-3d-hard-sm"
          >
            Create Gift
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-lg text-center space-y-8">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="w-24 h-24 mx-auto bg-bg-card rounded-2xl border border-border-medium shadow-3d-hard-lg flex items-center justify-center"
          >
            <svg
              className="w-12 h-12 text-accent-gold"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="editorial text-4xl text-text-primary mb-4">
              Hide a gift in the world
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              Set GPS coordinates for a special place. Your recipient must
              travel there to unlock your hidden message and memory.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link
              href="/create"
              className="btn-3d py-3 px-6 bg-accent-gold text-bg-primary font-semibold rounded-lg shadow-3d-hard-lg min-w-[140px]"
            >
              Create Gift
            </Link>
            <a
              href="https://github.com/yourusername/sentimental-coordinates"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-6 bg-bg-tertiary text-text-primary font-medium rounded-lg border border-border-medium hover:border-accent-gold transition-colors min-w-[140px]"
            >
              How It Works
            </a>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="grid grid-cols-2 gap-4 text-left pt-8"
          >
            <div className="bg-bg-card rounded-lg p-4 border border-border-subtle">
              <div className="w-8 h-8 bg-accent-gold/20 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <p className="text-text-primary font-medium text-sm">GPS Locked</p>
              <p className="text-text-muted text-xs mt-1">Must be at location to unlock</p>
            </div>
            <div className="bg-bg-card rounded-lg p-4 border border-border-subtle">
              <div className="w-8 h-8 bg-accent-gold/20 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012 2l-6 6m-2-5V5a2 2 0 012-2h6a2 2 0 012 2v6m-2 2h-2" />
                </svg>
              </div>
              <p className="text-text-primary font-medium text-sm">Add Media</p>
              <p className="text-text-muted text-xs mt-1">Photo or video memory</p>
            </div>
            <div className="bg-bg-card rounded-lg p-4 border border-border-subtle">
              <div className="w-8 h-8 bg-accent-gold/20 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-text-primary font-medium text-sm">Secure Reveal</p>
              <p className="text-text-muted text-xs mt-1">Server-side verification</p>
            </div>
            <div className="bg-bg-card rounded-lg p-4 border border-border-subtle">
              <div className="w-8 h-8 bg-accent-gold/20 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-text-primary font-medium text-sm">Mobile Ready</p>
              <p className="text-text-muted text-xs mt-1">Optimized for GPS on phone</p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle py-6">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-text-muted text-xs">
            Built with Next.js 14, Express, MongoDB, Mapbox GL, and Framer Motion
          </p>
        </div>
      </footer>
    </div>
  );
}
