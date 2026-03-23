'use client';

import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-bg-tertiary rounded-lg flex items-center justify-center border border-border-medium">
      <div className="w-6 h-6 border-2 border-accent-gold border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});
import GiftCard from './GiftCard';

interface CreatorFormProps {
  onSubmit: (data: {
    recipientName: string;
    message: string;
    lat: number;
    lng: number;
    radiusMeters: number;
    locationName: string;
    mediaFile?: File;
  }) => Promise<void>;
}

export default function CreatorForm({ onSubmit }: CreatorFormProps) {
  const [formData, setFormData] = useState({
    recipientName: '',
    message: '',
    locationName: '',
    radiusMeters: 50,
  });
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMarkerPlace = (lat: number, lng: number) => {
    setSelectedCoords({ lat, lng });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setMediaPreview(objectUrl);
    }
  };

  const handleRemoveMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCoords) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        lat: selectedCoords.lat,
        lng: selectedCoords.lng,
        mediaFile: mediaFile || undefined,
      });
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-3 h-3 rounded-full border-2 ${
              s <= step
                ? 'bg-accent-gold border-accent-gold'
                : 'bg-bg-tertiary border-border-medium'
            }`}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Recipient & Message */}
        {step === 1 && (
          <GiftCard>
            <div className="space-y-4">
              <h2 className="editorial text-xl text-text-primary">
                Who is this gift for?
              </h2>

              <div>
                <label className="block text-text-secondary text-sm mb-2">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) =>
                    setFormData({ ...formData, recipientName: e.target.value })
                  }
                  className="w-full bg-bg-tertiary border border-border-subtle rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-gold"
                  placeholder="Enter recipient's name"
                  required
                />
              </div>

              <div>
                <label className="block text-text-secondary text-sm mb-2">
                  Your Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full bg-bg-tertiary border border-border-subtle rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-gold resize-none"
                  rows={4}
                  placeholder="Write a heartfelt message..."
                  required
                />
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-3d w-full py-3 px-4 bg-accent-gold text-bg-primary font-semibold rounded-lg shadow-3d-hard-sm"
              >
                Next: Set Location
              </button>
            </div>
          </GiftCard>
        )}

        {/* Step 2: Location Selection */}
        {step === 2 && (
          <GiftCard>
            <div className="space-y-4">
              <h2 className="editorial text-xl text-text-primary">
                Choose the gift location
              </h2>
              <p className="text-text-muted text-sm">
                Click on the map to place the gift pin
              </p>

              {/* Map container */}
              <div className="h-64 rounded-lg overflow-hidden border border-border-medium">
                <MapView
                  interactive
                  onMarkerPlace={handleMarkerPlace}
                  giftCoordinates={selectedCoords ? {
                    lat: selectedCoords.lat,
                    lng: selectedCoords.lng,
                    radiusMeters: formData.radiusMeters,
                  } : undefined}
                />
              </div>

              {selectedCoords && (
                <div className="bg-bg-tertiary rounded-lg p-3 border border-border-subtle">
                  <p className="text-text-secondary text-xs font-mono">
                    {selectedCoords.lat.toFixed(6)}, {selectedCoords.lng.toFixed(6)}
                  </p>
                </div>
              )}

              {/* Radius slider */}
              <div>
                <label className="block text-text-secondary text-sm mb-2">
                  Reveal Radius: {formData.radiusMeters}m
                </label>
                <input
                  type="range"
                  min="10"
                  max="500"
                  value={formData.radiusMeters}
                  onChange={(e) =>
                    setFormData({ ...formData, radiusMeters: parseInt(e.target.value) })
                  }
                  className="w-full accent-accent-gold"
                />
                <div className="flex justify-between text-text-muted text-xs mt-1">
                  <span>10m</span>
                  <span>500m</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 px-4 bg-bg-tertiary text-text-primary font-medium rounded-lg border border-border-medium"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!selectedCoords}
                  className="flex-1 btn-3d py-3 px-4 bg-accent-gold text-bg-primary font-semibold rounded-lg shadow-3d-hard-sm disabled:opacity-50"
                >
                  Next: Add Media
                </button>
              </div>
            </div>
          </GiftCard>
        )}

        {/* Step 3: Media Upload */}
        {step === 3 && (
          <GiftCard>
            <div className="space-y-4">
              <h2 className="editorial text-xl text-text-primary">
                Add a photo or video
              </h2>
              <p className="text-text-muted text-sm">
                Optional: Include a memory to accompany your message
              </p>

              {/* File upload */}
              <div className="border-2 border-dashed border-border-medium rounded-lg p-6 text-center">
                {mediaPreview ? (
                  <div className="relative">
                    {mediaFile?.type.startsWith('video') ? (
                      <video src={mediaPreview} className="max-h-48 mx-auto rounded-lg" />
                    ) : (
                      <img src={mediaPreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                    )}
                    <button
                      type="button"
                      onClick={handleRemoveMedia}
                      className="absolute top-2 right-2 bg-bg-primary text-text-primary rounded-full p-2 border border-border-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <svg
                      className="w-12 h-12 mx-auto text-text-muted mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012 2l-6 6m-2-5V5a2 2 0 012-2h6a2 2 0 012 2v6m-2 2h-2"
                      />
                    </svg>
                    <p className="text-text-secondary text-sm mb-2">
                      Drop an image or video here, or click to browse
                    </p>
                    <p className="text-text-muted text-xs">
                      Max size: 50MB (JPG, PNG, GIF, MP4, MOV)
                    </p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {!mediaPreview && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-3 py-2 px-4 bg-bg-tertiary text-text-secondary text-sm rounded-lg border border-border-medium hover:border-accent-gold"
                  >
                    Choose File
                  </button>
                )}
              </div>

              {/* Location name (optional) */}
              <div>
                <label className="block text-text-secondary text-sm mb-2">
                  Location Name (optional)
                </label>
                <input
                  type="text"
                  value={formData.locationName}
                  onChange={(e) =>
                    setFormData({ ...formData, locationName: e.target.value })
                  }
                  className="w-full bg-bg-tertiary border border-border-subtle rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-gold"
                  placeholder="e.g., Sunrise Park, Our Special Spot"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 px-4 bg-bg-tertiary text-text-primary font-medium rounded-lg border border-border-medium"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedCoords}
                  className="flex-1 btn-3d py-3 px-4 bg-accent-gold text-bg-primary font-semibold rounded-lg shadow-3d-hard-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Gift'}
                </button>
              </div>
            </div>
          </GiftCard>
        )}
      </form>
    </div>
  );
}
