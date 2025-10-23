'use client';
import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Navigation,
  Car,
  MapPin,
  LocateFixed,
  User
} from 'lucide-react';
import { Button } from '../ui/button';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom icons with Lucide
const createCustomIcon = (type, label = '') => {
  const config = {
    user: {
      color: '#10b981',
      bgColor: '#10b981',
      icon: 'user',
      size: 32
    },
    driver: {
      color: '#3b82f6',
      bgColor: '#3b82f6',
      icon: 'car',
      size: 36
    },
    destination: {
      color: '#ef4444',
      bgColor: '#ef4444',
      icon: 'map-pin',
      size: 34
    },
    current: {
      color: '#8b5cf6',
      bgColor: '#8b5cf6',
      icon: 'locate-fixed',
      size: 30
    }
  };

  const { color, bgColor, icon, size } = config[type] || config.user;

  // SVG paths for Lucide icons
  const iconPaths = {
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    car: '<path d="M14 16H9m10 0h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1"/><path d="M18 8V8.01"/><path d="M6 8V8.01"/><path d="M8 12h7"/><path d="M7 16h9"/>',
    'map-pin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    'locate-fixed': '<path d="M2 12h3m14 0h3M12 2v3m0 14v3"/><circle cx="12" cy="12" r="7"/>',
    navigation: '<path d="m3 11 19-9-9 19-2-8-8-2z"/>'
  };

  return L.divIcon({
    className: `custom-marker custom-marker-${type}`,
    html: `
      <div style="
        background-color: ${bgColor};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        position: relative;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${iconPaths[icon] || iconPaths.user}
        </svg>
      </div>
      ${label ? `
        <div style="
          position: absolute;
          top: ${size + 4}px;
          left: 50%;
          transform: translateX(-50%);
          background: #FFF;
          color: #000;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          border: 1px solid #e5e7eb;
          z-index: 1000;
        ">${label}</div>
      ` : ''}
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
};

function RouteRenderer({ route }) {
  const map = useMap();

  useEffect(() => {
    if (!route) return;

    const routeLayer = L.geoJSON(route.geometry, {
      style: {
        color: '#3b82f6',
        weight: 6,
        opacity: 0.8,
        dashArray: '10, 10'
      }
    });

    routeLayer.addTo(map);
    map.fitBounds(routeLayer.getBounds(), { padding: [20, 20] });

    return () => {
      map.removeLayer(routeLayer);
    };
  }, [route, map]);

  return null;
}

function LocationMarker({ position, type, label }) {
  if (!position) return null;

  return (
    <Marker
      position={position}
      icon={createCustomIcon(type, label)}
    >
      <Popup>
        <div className="text-center min-w-[120px]">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${type === 'user' ? 'bg-green-500' :
              type === 'driver' ? 'bg-blue-500' :
                type === 'destination' ? 'bg-red-500' :
                  'bg-purple-500'
              }`}></div>
            <strong className="text-sm capitalize">
              {type === 'driver' ? 'Driver' :
                type === 'user' ? 'Your Location' :
                  type === 'current' ? 'Current Location' :
                    'Destination'}
            </strong>
          </div>
          <div className="text-xs p-2 rounded">
            {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </div>
          {type === 'driver' && (
            <div className="mt-2 text-xs text-primary font-medium">
              🕒 Approx. 5 min away
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

function CurrentLocationButton({ onGetLocation, loading }) {
  const map = useMap();

  const handleClick = () => {
    onGetLocation();

    // If we have a location, center the map on it
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 16);
        },
        (error) => {
          console.error('Error centering map:', error);
        }
      );
    }
  };

  return (
    <div className="leaflet-top leaflet-right">
      <div className="leaflet-control">
        <Button
          variant={'secondary'}
          onClick={handleClick}
          disabled={loading}
          style={{ margin: '10px' }}
        >
          {loading ? (
            <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            '📍'
          )}
          Current Location
        </Button>
      </div>
    </div>
  );
}

export default function MapContainerComponent({
  userLocation,
  driverLocation,
  destination,
  route,
  onLocationSelect
}) {
  const mapRef = useRef();

  useEffect(() => {
    if (mapRef.current && userLocation) {
      mapRef.current.setView(userLocation, 15);
    }
  }, [userLocation]);

  const handleMapClick = (e) => {
    if (onLocationSelect) {
      onLocationSelect([e.latlng.lat, e.latlng.lng]);
    }
  };

  const handleGetCurrentLocation = () => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = [latitude, longitude];

          if (mapRef.current) {
            mapRef.current.setView(newLocation, 16);
          }

          // You can also automatically set this as pickup if needed
          if (onLocationSelect) {
            onLocationSelect(newLocation);
          }
        },
        (error) => {
          console.error('Error getting location for map:', error);
        }
      );
    }
  };

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={[28.6139, 77.2090]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        onClick={handleMapClick}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <LocationMarker position={userLocation} type="user" label="You" />
        <LocationMarker position={driverLocation} type="driver" label="Driver" />
        <LocationMarker position={destination} type="destination" label="Destination" />

        {route && <RouteRenderer route={route} />}

        <CurrentLocationButton
          onGetLocation={handleGetCurrentLocation}
          loading={false}
        />
      </MapContainer>
    </div>
  );
}
