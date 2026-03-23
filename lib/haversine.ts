/**
 * Haversine Formula - Client-side distance calculation
 * Used for preview only - server validates for security
 */

const EARTH_RADIUS_KM = 6371;

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate distance between two GPS coordinates
 * @returns Distance in meters
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) *
    Math.cos(lat1Rad) * Math.cos(lat2Rad);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = EARTH_RADIUS_KM * c;

  return Math.round(distanceKm * 1000); // meters
}

/**
 * Check if within radius (client-side preview)
 */
export function isWithinRadius(
  targetLat: number,
  targetLng: number,
  userLat: number,
  userLng: number,
  radiusMeters: number
): { isWithin: boolean; distanceMeters: number } {
  const distance = haversineDistance(targetLat, targetLng, userLat, userLng);
  return {
    isWithin: distance <= radiusMeters,
    distanceMeters: distance,
  };
}
