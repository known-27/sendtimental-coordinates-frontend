'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CreatorForm from '../../components/CreatorForm';
import QRDisplay from '../../components/QRDisplay';
import { createGift } from '../../lib/api';

interface CreationResult {
  giftId: string;
  shareableLink: string;
  dashboardLink: string;
  creatorToken: string;
}

export default function CreatePage() {
  const router = useRouter();
  const [result, setResult] = useState<CreationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: {
    recipientName: string;
    message: string;
    lat: number;
    lng: number;
    radiusMeters: number;
    locationName: string;
    mediaFile?: File;
  }) => {
    try {
      setError(null);

      const formData = new FormData();
      formData.append('recipientName', data.recipientName);
      formData.append('message', data.message);
      formData.append('lat', data.lat.toString());
      formData.append('lng', data.lng.toString());
      formData.append('radiusMeters', data.radiusMeters.toString());
      formData.append('locationName', data.locationName);
      formData.append('createdBy', `creator-${Date.now()}`); // Anonymous creator ID

      if (data.mediaFile) {
        formData.append('mediaFile', data.mediaFile);
      }

      const response = await createGift(formData);
      setResult({
        giftId: response.giftId,
        shareableLink: response.shareableLink,
        dashboardLink: response.dashboardLink,
        creatorToken: response.creatorToken,
      });

      // Store token for dashboard access
      localStorage.setItem('creatorToken', response.creatorToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create gift');
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="border-b border-border-subtle bg-bg-secondary/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="editorial text-xl text-text-primary">
            Create a Gift Drop
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Set coordinates for a geo-locked gift reveal
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {result ? (
          /* Success state - show QR code */
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-gold rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-bg-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="editorial text-2xl text-text-primary mb-2">
                Gift Created!
              </h2>
              <p className="text-text-secondary">
                Share this link with your recipient
              </p>
            </div>

            <QRDisplay
              value={result.shareableLink}
              title="Gift Link"
              subtitle="Scan to open the gift"
            />

            <div className="flex gap-3">
              <a
                href={result.dashboardLink}
                className="flex-1 py-3 px-4 bg-bg-tertiary text-text-primary text-center font-medium rounded-lg border border-border-medium hover:border-accent-gold transition-colors"
              >
                View Dashboard
              </a>
              <a
                href={result.shareableLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 btn-3d py-3 px-4 bg-accent-gold text-bg-primary text-center font-semibold rounded-lg shadow-3d-hard-sm"
              >
                Open Gift Page
              </a>
            </div>

            <button
              onClick={() => {
                setResult(null);
                router.push('/create');
              }}
              className="w-full py-3 px-4 text-text-muted text-sm hover:text-text-secondary transition-colors"
            >
              Create Another Gift
            </button>
          </div>
        ) : (
          /* Form state */
          <>
            {error && (
              <div className="mb-6 bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-300 text-sm">
                {error}
              </div>
            )}
            <CreatorForm onSubmit={handleSubmit} />
          </>
        )}
      </main>
    </div>
  );
}
