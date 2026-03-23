'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, LatLngExpression } from 'leaflet';

// Custom pulsing marker icon
const createPulsingIcon = () => {
  const div = document.createElement('div');
  div.className = 'gps-marker-container';
  div.innerHTML = `
    <div class="gps-marker-ring" style="width: 40px; height: 40px;"></div>
    <div class="gps-marker-center"></div>
  `;

  return new Icon({
    html: div.innerHTML,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
    className: 'leaflet-pulsing-marker',
  });
};

// Default marker icon (gold pin)
const goldMarkerIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#c9a962" stroke="#1a1a1a" stroke-width="1">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface MapClickHandlerProps {
  onMarkerPlace: (lat: number, lng: number) => void;
}

function MapClickHandler({ onMarkerPlace }: MapClickHandlerProps) {
  useMapEvents({
    click: (e) => {
      onMarkerPlace(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  onMarkerPlace?: (lat: number, lng: number) => void;
  giftCoordinates?: { lat: number; lng: number; radiusMeters?: number };
  showUserLocation?: boolean;
  interactive?: boolean;
  userLocation?: [number, number] | null;
}

export default function MapView({
  center = [40.7128, -74.006], // Default to NYC
  zoom = 13,
  onMarkerPlace,
  giftCoordinates,
  showUserLocation = false,
  interactive = true,
  userLocation = null,
}: MapViewProps) {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<LatLngExpression | null>(null);

  useEffect(() => {
    setIsMapLoaded(true);
  }, []);

  // Update marker position when gift coordinates are provided
  useEffect(() => {
    if (giftCoordinates) {
      setMarkerPosition([giftCoordinates.lat, giftCoordinates.lng]);
    }
  }, [giftCoordinates]);

  // Handle marker placement from click
  const handleMarkerPlace = (lat: number, lng: number) => {
    setMarkerPosition([lat, lng]);
    onMarkerPlace?.(lat, lng);
  };

  // Radius circle center
  const radiusCircleCenter = giftCoordinates
    ? [giftCoordinates.lat, giftCoordinates.lng] as LatLngExpression
    : undefined;

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
        zoomControl={true}
        attributionControl={true}
        className="w-full h-full leaflet-monochrome"
        style={{ borderRadius: 'inherit' }}
      >
        {/* OpenStreetMap tiles - free, no API key required */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        {/* Click handler for creator mode */}
        {interactive && onMarkerPlace && (
          <MapClickHandler onMarkerPlace={handleMarkerPlace} />
        )}

        {/* Gift marker */}
        {markerPosition && (
          <Marker
            position={markerPosition}
            icon={giftCoordinates ? goldMarkerIcon : createPulsingIcon()}
          >
            <Popup>
              {'Gift Location'}
            </Popup>
          </Marker>
        )}

        {/* Radius circle */}
        {giftCoordinates && radiusCircleCenter && (
          <CircleMarker
            center={radiusCircleCenter}
            radius={giftCoordinates.radiusMeters || 50}
            pathOptions={{
              color: '#c9a962',
              fillColor: '#c9a962',
              fillOpacity: 0.1,
              weight: 2,
              dashArray: '4, 4',
            }}
          />
        )}

        {/* User location marker */}
        {showUserLocation && userLocation && (
          <CircleMarker
            center={userLocation}
            radius={10}
            pathOptions={{
              color: '#3b82f6',
              fillColor: '#3b82f6',
              fillOpacity: 0.3,
              weight: 2,
            }}
          />
        )}
      </MapContainer>

      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg-secondary/80 backdrop-blur-sm z-10">
          <div className="text-text-secondary text-sm">Loading map...</div>
        </div>
      )}
    </div>
  );
}
