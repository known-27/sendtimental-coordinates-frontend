'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import GiftCard from './GiftCard';

interface QRDisplayProps {
  value: string;
  title?: string;
  subtitle?: string;
  size?: number;
}

/**
 * QR Code Display in Stitch-designed semi-3D framed card
 */
export default function QRDisplay({
  value,
  title = 'Share Gift Link',
  subtitle,
  size = 200,
}: QRDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(value, {
      width: size,
      margin: 2,
      color: {
        dark: '#191a1f',
        light: '#ffffff',
      },
    })
      .then(setQrCodeUrl)
      .catch(console.error);
  }, [value, size]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <GiftCard className="w-full max-w-sm" tiltEffect>
      <div className="space-y-4">
        {/* Title */}
        <div className="text-center">
          <h3 className="editorial text-lg text-text-primary">
            {title}
          </h3>
          {subtitle && (
            <p className="text-text-muted text-sm mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* QR Code */}
        <div className="relative bg-bg-primary rounded-lg p-4 border border-border-medium shadow-inner">
          {qrCodeUrl ? (
            <img
              src={qrCodeUrl}
              alt="QR Code"
              className="w-full aspect-square"
              style={{ maxWidth: size, margin: '0 auto' }}
            />
          ) : (
            <div
              className="w-full aspect-square flex items-center justify-center"
              style={{ maxWidth: size, margin: '0 auto' }}
            >
              <div className="text-text-muted text-xs">Generating...</div>
            </div>
          )}
        </div>

        {/* Share link */}
        <div className="bg-bg-tertiary rounded-lg p-3 border border-border-subtle">
          <p className="text-text-secondary text-xs font-mono break-all mb-2">
            {value}
          </p>
          <button
            onClick={handleCopy}
            className="btn-3d w-full py-2 px-3 bg-accent-gold text-bg-primary text-sm font-semibold rounded shadow-3d-hard-sm"
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>
    </GiftCard>
  );
}
