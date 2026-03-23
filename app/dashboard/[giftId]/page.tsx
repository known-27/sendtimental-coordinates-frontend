'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import QRDisplay from '../../../components/QRDisplay';
import GiftCard from '../../../components/GiftCard';
import { getGiftStatus } from '../../../lib/api';

export default function DashboardPage() {
  const params = useParams();
  const giftId = params.giftId as string;

  const [giftData, setGiftData] = useState<{
    giftId: string;
    recipientName: string;
    coordinates: {
      lat: number;
      lng: number;
      locationName: string;
      radiusMeters: number;
    };
    revealed: boolean;
    revealedAt: string | null;
    revealedFromCoords: { lat: number; lng: number } | null;
    createdAt: string;
    shareableLink: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('creatorToken');
    if (!token) {
      setError('No authentication token found. Please create the gift again.');
      setLoading(false);
      return;
    }

    getGiftStatus(giftId, token)
      .then((data) => {
        setGiftData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [giftId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary text-sm">Loading dashboard...</p>
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
            Dashboard Error
          </h2>
          <p className="text-text-secondary text-sm">
            {error || 'Unable to load gift status'}
          </p>
          <a
            href="/create"
            className="inline-block mt-4 btn-3d py-3 px-6 bg-accent-gold text-bg-primary font-semibold rounded-lg shadow-3d-hard-sm"
          >
            Create New Gift
          </a>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="border-b border-border-subtle bg-bg-secondary/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="editorial text-xl text-text-primary">
            Gift Dashboard
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Track your gift's status
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Status badge */}
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${
              giftData.revealed ? 'bg-green-500' : 'bg-accent-gold'
            } animate-pulse`}
          />
          <span className="text-text-primary font-medium">
            {giftData.revealed
              ? 'Revealed'
              : 'Waiting to be found'}
          </span>
        </div>

        {/* Status card */}
        <GiftCard>
          <div className="space-y-4">
            {/* Recipient */}
            <div>
              <p className="text-text-muted text-xs uppercase tracking-wider mb-1">
                Recipient
              </p>
              <p className="editorial text-lg text-text-primary">
                {giftData.recipientName}
              </p>
            </div>

            {/* Location */}
            <div>
              <p className="text-text-muted text-xs uppercase tracking-wider mb-1">
                Gift Location
              </p>
              <p className="text-text-secondary text-sm">
                {giftData.coordinates.locationName || (
                  <>
                    {giftData.coordinates.lat.toFixed(4)},{' '}
                    {giftData.coordinates.lng.toFixed(4)}
                  </>
                )}
              </p>
              <p className="text-text-muted text-xs mt-1">
                Reveal radius: {giftData.coordinates.radiusMeters}m
              </p>
            </div>

            {/* Reveal status */}
            {giftData.revealed && giftData.revealedAt ? (
              <div className="bg-bg-tertiary rounded-lg p-4 border border-border-subtle">
                <p className="text-accent-gold text-xs uppercase tracking-wider mb-2">
                  Revealed On
                </p>
                <p className="text-text-primary font-medium">
                  {formatDate(giftData.revealedAt)}
                </p>
                {giftData.revealedFromCoords && (
                  <p className="text-text-muted text-xs mt-2 font-mono">
                    Coords: {giftData.revealedFromCoords.lat.toFixed(4)},{' '}
                    {giftData.revealedFromCoords.lng.toFixed(4)}
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-bg-tertiary rounded-lg p-4 border border-border-subtle">
                <p className="text-accent-gold text-xs uppercase tracking-wider mb-2">
                  Created On
                </p>
                <p className="text-text-primary font-medium">
                  {formatDate(giftData.createdAt)}
                </p>
              </div>
            )}
          </div>
        </GiftCard>

        {/* QR Code */}
        <QRDisplay
          value={giftData.shareableLink}
          title="Share Gift Link"
          subtitle="Send this to your recipient"
        />

        {/* Actions */}
        <div className="flex gap-3">
          <a
            href={giftData.shareableLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 btn-3d py-3 px-4 bg-accent-gold text-bg-primary text-center font-semibold rounded-lg shadow-3d-hard-sm"
          >
            View Gift Page
          </a>
          <a
            href="/create"
            className="flex-1 py-3 px-4 bg-bg-tertiary text-text-primary text-center font-medium rounded-lg border border-border-medium hover:border-accent-gold transition-colors"
          >
            Create Another
          </a>
        </div>
      </main>
    </div>
  );
}
