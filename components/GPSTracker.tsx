'use client';

import { useState, useEffect, useCallback } from 'react';

interface GPSTrackerProps {
  onLocationUpdate: (lat: number, lng: number, accuracy: number | null) => void;
  onError?: (error: string) => void;
  pollingInterval?: number;
}

/**
 * GPS Tracker Component
 * Continuously monitors user's geolocation and reports updates
 */
export default function GPSTracker({
  onLocationUpdate,
  onError,
  pollingInterval = 3000,
}: GPSTrackerProps) {
  const [gpsState, setGpsState] = useState<{
    status: 'idle' | 'acquiring' | 'locked' | 'error' | 'unavailable';
    latitude: number | null;
    longitude: number | null;
    accuracy: number | null;
    timestamp: number | null;
  }>({
    status: 'idle',
    latitude: null,
    longitude: null,
    accuracy: null,
    timestamp: null,
  });

  // Signal strength based on accuracy
  const getSignalStrength = useCallback((accuracy: number | null): number => {
    if (!accuracy) return 0;
    if (accuracy < 10) return 4; // Excellent
    if (accuracy < 30) return 3; // Good
    if (accuracy < 100) return 2; // Fair
    if (accuracy < 500) return 1; // Poor
    return 0; // No signal
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsState((prev) => ({ ...prev, status: 'unavailable' }));
      onError?.('Geolocation is not supported by your browser');
      return;
    }

    setGpsState((prev) => ({ ...prev, status: 'acquiring' }));

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const timestamp = position.timestamp;

        setGpsState({
          status: 'locked',
          latitude,
          longitude,
          accuracy: Math.round(accuracy),
          timestamp,
        });

        // Notify parent component
        onLocationUpdate(latitude, longitude, Math.round(accuracy));
      },
      (error) => {
        const errorMessage = (() => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              return 'Location permission denied';
            case error.POSITION_UNAVAILABLE:
              return 'Location information unavailable';
            case error.TIMEOUT:
              return 'Location request timed out';
            default:
              return 'An unknown location error occurred';
          }
        })();

        setGpsState((prev) => ({
          ...prev,
          status: 'error',
        }));

        onError?.(errorMessage);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );

    // Poll for updates at specified interval
    const pollInterval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setGpsState({
            status: 'locked',
            latitude,
            longitude,
            accuracy: Math.round(accuracy),
            timestamp: position.timestamp,
          });
          onLocationUpdate(latitude, longitude, Math.round(accuracy));
        },
        () => {
          // Silent fail for polls - let watchPosition handle errors
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
        }
      );
    }, pollingInterval);

    return () => {
      navigator.geolocation.clearWatch(watchId);
      clearInterval(pollInterval);
    };
  }, [onLocationUpdate, onError, pollingInterval]);

  // Render signal indicator
  const signalStrength = getSignalStrength(gpsState.accuracy);

  return (
    <div className="inline-flex items-center gap-3 bg-bg-tertiary rounded-lg px-4 py-3 border border-border-subtle">
      {/* Signal bars */}
      <div className="signal-bars">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`signal-bar ${
              gpsState.status === 'locked' && i <= signalStrength ? 'active' : ''
            }`}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>

      {/* Status text */}
      <div className="flex flex-col">
        <span className="text-text-muted text-xs uppercase tracking-wider">
          GPS Signal
        </span>
        <span
          className={`text-xs font-medium ${
            gpsState.status === 'locked'
              ? 'text-accent-gold'
              : gpsState.status === 'error'
              ? 'text-red-400'
              : gpsState.status === 'unavailable'
              ? 'text-red-400'
              : 'text-text-muted'
          }`}
        >
          {gpsState.status === 'locked'
            ? gpsState.accuracy
              ? `±${gpsState.accuracy}m`
              : 'Acquired'
            : gpsState.status === 'error'
            ? 'Error'
            : gpsState.status === 'unavailable'
            ? 'Unavailable'
            : 'Acquiring...'}
        </span>
      </div>
    </div>
  );
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(lat: number, lng: number): string {
  return `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`;
}

/**
 * Calculate distance preview (client-side only)
 */
export function getDistancePreview(
  targetLat: number,
  targetLng: number,
  userLat: number,
  userLng: number
): string {
  const toRadians = (deg: number) => deg * (Math.PI / 180);
  const R = 6371;
  const dLat = toRadians(targetLat - userLat);
  const dLon = toRadians(targetLng - userLng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) *
    Math.cos(toRadians(userLat)) *
    Math.cos(toRadians(targetLat));
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceM = Math.round(R * c * 1000);
  return distanceM < 1000 ? `${distanceM}m` : `${(distanceM / 1000).toFixed(1)}km`;
}
