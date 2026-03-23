/**
 * API Client Helpers
 * Centralized API calls for the Sentimental Coordinates app
 */

const API_BASE_URL = 'https://sentimental-coordinates-s.onrender.com';

/**
 * Create a gift drop
 */
export async function createGift(formData: FormData) {
  const response = await fetch(`${API_BASE_URL}/api/gifts/create`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create gift');
  }

  return response.json();
}

/**
 * Get gift metadata (locked state - no message/media)
 */
export async function getGift(giftId: string) {
  const response = await fetch(`${API_BASE_URL}/api/gifts/${giftId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Gift not found');
  }

  return response.json();
}

/**
 * Verify user location against gift coordinates
 */
export async function verifyLocation(giftId: string, userLat: number, userLng: number) {
  const response = await fetch(`${API_BASE_URL}/api/gifts/${giftId}/verify-location`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userLat, userLng }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Location verification failed');
  }

  return response.json();
}

/**
 * Get gift status (creator-only, requires JWT)
 */
export async function getGiftStatus(giftId: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/api/gifts/${giftId}/status`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch status');
  }

  return response.json();
}

/**
 * Calculate distance between two coordinates (client-side preview only)
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRadians = (deg: number) => deg * (Math.PI / 180);
  const R = 6371; // Earth radius in km

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) *
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2));

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;

  return Math.round(distanceKm * 1000); // Return meters
}
