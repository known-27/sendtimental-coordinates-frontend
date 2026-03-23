'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GiftCard from './GiftCard';

interface LockedStateProps {
  giftId: string;
  locationName: string;
  coordinates: { lat: number; lng: number };
  radiusMeters: number;
  onVerifyAttempt: (lat: number, lng: number) => Promise<{ unlocked: boolean; distanceAway?: number }>;
  onUnlocked: () => void;
}

export default function LockedState({
  giftId,
  locationName,
  coordinates,
  radiusMeters,
  onVerifyAttempt,
  onUnlocked,
}: LockedStateProps) {
  const [gpsStatus, setGpsStatus] = useState<'acquiring' | 'locked' | 'error' | 'too-far' | 'in-range'>('acquiring');
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [distanceAway, setDistanceAway] = useState<number | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Watch GPS position and auto-verify on first lock
  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsStatus('error');
      return;
    }

    let verifying = false;

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentCoords({ lat: latitude, lng: longitude });

        // Don't downgrade from in-range on subsequent GPS updates
        setGpsStatus((prev) => (prev === 'in-range' ? 'in-range' : 'locked'));

        if (verifying) return;
        verifying = true;
        setIsVerifying(true);
        try {
          const result = await onVerifyAttempt(latitude, longitude);
          if (result.unlocked) {
            setGpsStatus('in-range');
          } else if (result.distanceAway !== undefined) {
            setDistanceAway(result.distanceAway);
            setGpsStatus('too-far');
          }
        } catch (error) {
          console.error('Verification error:', error);
        } finally {
          verifying = false;
          setIsVerifying(false);
        }
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setGpsStatus('error');
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Periodic re-verification every 5s when too far
  useEffect(() => {
    if (gpsStatus !== 'too-far' || !currentCoords) return;

    const interval = setInterval(async () => {
      if (isVerifying) return;
      setIsVerifying(true);
      try {
        const result = await onVerifyAttempt(currentCoords.lat, currentCoords.lng);
        if (result.unlocked) {
          setGpsStatus('in-range');
        } else if (result.distanceAway !== undefined) {
          setDistanceAway(result.distanceAway);
        }
      } catch (error) {
        console.error('Re-verification error:', error);
      } finally {
        setIsVerifying(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [gpsStatus, currentCoords, isVerifying]);

  // Manual retry
  const handleRetry = () => {
    if (!currentCoords || isVerifying) return;
    setIsVerifying(true);
    onVerifyAttempt(currentCoords.lat, currentCoords.lng)
      .then((result) => {
        if (result.unlocked) {
          setGpsStatus('in-range');
        } else if (result.distanceAway !== undefined) {
          setDistanceAway(result.distanceAway);
          setGpsStatus('too-far');
        }
      })
      .catch(console.error)
      .finally(() => setIsVerifying(false));
  };

  // Trigger reveal
  const handleOpenGift = () => {
    onUnlocked();
  };

  return (
    <div className="w-full flex justify-center">
      <GiftCard className="w-full max-w-md z-10" tiltEffect>
        <div className="text-center space-y-6">

          {/* Icon — switches between lock and gift box */}
          <motion.div
            key={gpsStatus === 'in-range' ? 'gift' : 'lock'}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center border ${
              gpsStatus === 'in-range'
                ? 'bg-accent-gold/20 border-accent-gold shadow-[0_0_24px_rgba(212,175,55,0.45)] animate-pulse'
                : 'bg-bg-tertiary border-border-medium'
            }`}
          >
            {gpsStatus === 'in-range' ? (
              /* Gift / package icon */
              <svg className="w-8 h-8 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            ) : (
              /* Lock icon */
              <svg className="w-8 h-8 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )}
          </motion.div>

          {/* Title / subtitle */}
          <div>
            <motion.h2
              key={gpsStatus === 'in-range' ? 'here' : 'location'}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="editorial text-2xl text-text-primary mb-2"
            >
              {gpsStatus === 'in-range' ? "You've arrived! 🎉" : locationName || 'A Special Location'}
            </motion.h2>
            <p className="text-text-secondary text-sm">
              {gpsStatus === 'in-range'
                ? 'Your gift is waiting to be opened'
                : 'A gift awaits you at this coordinate'}
            </p>
          </div>

          {/* GPS status panel — hidden once in range */}
          {gpsStatus !== 'in-range' && (
            <div className="bg-bg-tertiary rounded-lg p-4 border border-border-subtle">
              <div className="flex items-center justify-between mb-3">
                <span className="text-text-muted text-xs uppercase tracking-wider">GPS Signal</span>
                <span
                  className={`text-xs font-medium ${
                    gpsStatus === 'locked'
                      ? 'text-accent-gold'
                      : gpsStatus === 'too-far'
                      ? 'text-accent-rose'
                      : gpsStatus === 'error'
                      ? 'text-red-400'
                      : 'text-text-muted'
                  }`}
                >
                  {gpsStatus === 'locked'
                    ? 'Acquired'
                    : gpsStatus === 'too-far'
                    ? `${distanceAway}m away`
                    : gpsStatus === 'error'
                    ? 'No signal'
                    : 'Acquiring...'}
                </span>
              </div>

              <div className="signal-bars">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`signal-bar ${
                      gpsStatus === 'locked' && i <= 3
                        ? 'active'
                        : gpsStatus === 'too-far' && i <= 2
                        ? 'active'
                        : ''
                    }`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Action area */}
          {gpsStatus === 'in-range' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 180 }}
              className="space-y-3"
            >
              <motion.button
                onClick={handleOpenGift}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="btn-3d w-full py-4 px-6 bg-accent-gold text-bg-primary text-lg font-bold rounded-xl shadow-3d-hard-sm"
              >
                Open Gift 🎁
              </motion.button>
              <p className="text-text-muted text-xs">Tap to reveal your gift</p>
            </motion.div>
          ) : gpsStatus === 'too-far' && distanceAway ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <p className="text-accent-rose text-sm font-medium">
                You&apos;re {distanceAway}m away from the gift location
              </p>
              <button
                onClick={handleRetry}
                disabled={isVerifying}
                className="btn-3d w-full py-3 px-4 bg-accent-gold text-bg-primary font-semibold rounded-lg shadow-3d-hard-sm disabled:opacity-50"
              >
                {isVerifying ? 'Checking...' : 'Check Again'}
              </button>
            </motion.div>
          ) : gpsStatus === 'error' ? (
            <div className="text-red-400 text-sm">
              Unable to access your location. Please enable GPS permissions.
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-text-muted text-xs"
            >
              {gpsStatus === 'locked' ? 'Verifying your location...' : 'Acquiring GPS signal...'}
            </motion.div>
          )}

        </div>
      </GiftCard>
    </div>
  );
}
