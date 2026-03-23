'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import LockedState from '../../../components/LockedState';
import RevealAnimation from '../../../components/RevealAnimation';
import { getGift, verifyLocation } from '../../../lib/api';

// Leaflet uses `document`/`window` at module level — must be client-only
const MapView = dynamic(() => import('../../../components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-bg-secondary/60 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-accent-gold border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

interface GiftData {
  giftId: string;
  coordinates: {
    lat: number;
    lng: number;
    radiusMeters: number;
    locationName: string;
  };
  revealed: boolean;
  recipientName: string;
  isLocked: boolean;
}

interface RevealData {
  unlocked: boolean;
  message?: string;
  mediaUrl?: string | null;
  mediaType?: 'image' | 'video' | 'none';
  recipientName?: string;
  distanceAway?: number;
}

export default function GiftPage() {
  const params = useParams();
  const giftId = params.giftId as string;

  const [giftData, setGiftData] = useState<GiftData | null>(null);
  const [revealData, setRevealData] = useState<RevealData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Load gift data
  useEffect(() => {
    getGift(giftId)
      .then((data) => {
        setGiftData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [giftId]);

  // Track user GPS location
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      () => {
        console.warn('Geolocation unavailable');
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

  // Verify location — store revealData but do NOT auto-reveal;
  // the LockedState component will show the "Open Gift" button and call onUnlocked when tapped.
  const handleVerifyAttempt = useCallback(
    async (lat: number, lng: number): Promise<{ unlocked: boolean; distanceAway?: number }> => {
      try {
        const result = await verifyLocation(giftId, lat, lng);
        if (result.unlocked) {
          // Store the reveal payload; actual reveal waits for user button tap
          setRevealData(result);
        }
        return result;
      } catch (err) {
        console.error('Verification error:', err);
        return { unlocked: false };
      }
    },
    [giftId]
  );

  // Called by LockedState when the user taps "Open Gift"
  const handleUnlocked = useCallback(() => {
    setIsRevealed(true);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary text-sm">Loading gift...</p>
        </div>
      </div>
    );
  }

  if (error || !giftData) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-900/20 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="editorial text-xl text-text-primary mb-2">
            Gift Not Found
          </h2>
          <p className="text-text-secondary text-sm">
            {error || 'This gift does not exist or has expired'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="border-b border-border-subtle bg-bg-secondary/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-accent-gold"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span className="text-text-secondary text-sm">
            {giftData.isLocked ? 'Geo-Locked Gift' : 'Gift Revealed'}
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Contained map */}
        {!isRevealed && (
          <div className="h-64 rounded-xl overflow-hidden border border-border-medium shadow-lg">
            <MapView
              center={[giftData.coordinates.lat, giftData.coordinates.lng]}
              zoom={15}
              giftCoordinates={{
                lat: giftData.coordinates.lat,
                lng: giftData.coordinates.lng,
                radiusMeters: giftData.coordinates.radiusMeters,
              }}
              showUserLocation
              interactive={false}
              userLocation={userLocation}
            />
          </div>
        )}

        {/* Gift card / reveal animation */}
        {isRevealed && revealData ? (
          <RevealAnimation
            message={revealData.message || ''}
            recipientName={revealData.recipientName || giftData.recipientName}
            mediaUrl={revealData.mediaUrl}
            mediaType={revealData.mediaType}
          />
        ) : (
          <LockedState
            giftId={giftId}
            locationName={
              giftData.coordinates.locationName ||
              `${giftData.coordinates.lat.toFixed(4)}, ${giftData.coordinates.lng.toFixed(4)}`
            }
            coordinates={{
              lat: giftData.coordinates.lat,
              lng: giftData.coordinates.lng,
            }}
            radiusMeters={giftData.coordinates.radiusMeters}
            onVerifyAttempt={handleVerifyAttempt}
            onUnlocked={handleUnlocked}
          />
        )}
      </main>
    </div>
  );
}
