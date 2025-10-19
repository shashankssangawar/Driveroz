'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouting } from '@/hooks/useRouting';
import { ArrowUpDown, NavigationIcon, SwapIcon } from 'lucide-react';
import MapContainerComponent from './map-container';
import LocationInput from '../ui/location-input';

const RIDE_TYPES = [
  { id: 'mini', name: 'Mini', price: 10, eta: 5 },
  { id: 'sedan', name: 'Sedan', price: 15, eta: 3 },
  { id: 'suv', name: 'SUV', price: 20, eta: 7 }
];

export default function RideBooking() {
  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [selectedRide, setSelectedRide] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [locationLoading, setLocationLoading] = useState({
    pickup: false,
    destination: false
  });
  const [routeError, setRouteError] = useState(null);

  const { route, loading: routeLoading, calculateRoute, clearRoute, error: routeErrorInternal } = useRouting();

  // Set route error from hook
  useEffect(() => {
    setRouteError(routeErrorInternal);
  }, [routeErrorInternal]);

  // Get user's current location on component mount
  useEffect(() => {
    getCurrentLocation('pickup');
  }, []);

  const getCurrentLocation = async (type = 'pickup') => {
    setLocationLoading(prev => ({ ...prev, [type]: true }));
    setRouteError(null);

    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        setLocationLoading(prev => ({ ...prev, [type]: false }));
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = [latitude, longitude];

          try {
            const address = await reverseGeocode(newLocation);

            if (type === 'pickup') {
              setUserLocation(newLocation);
              setPickupAddress(address);
            } else if (type === 'destination') {
              setDestination(newLocation);
              setDestinationAddress(address);
            }

            resolve(newLocation);
          } catch (error) {
            console.error('Geocoding error:', error);
            // Still set location even if geocoding fails
            if (type === 'pickup') {
              setUserLocation(newLocation);
              setPickupAddress('Current Location');
            } else if (type === 'destination') {
              setDestination(newLocation);
              setDestinationAddress('Current Location');
            }
            resolve(newLocation);
          } finally {
            setLocationLoading(prev => ({ ...prev, [type]: false }));
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationLoading(prev => ({ ...prev, [type]: false }));

          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert('Location access denied. Please enable location permissions in your browser settings.');
              break;
            case error.POSITION_UNAVAILABLE:
              alert('Location information unavailable. Please check your GPS connection.');
              break;
            case error.TIMEOUT:
              alert('Location request timed out. Please try again.');
              break;
            default:
              alert('An unknown error occurred while getting location.');
              break;
          }
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000
        }
      );
    });
  };

  // Reverse geocode coordinates to get address
  const reverseGeocode = async (coordinates) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates[0]}&lon=${coordinates[1]}&zoom=18&addressdetails=1`
      );

      if (response.ok) {
        const data = await response.json();
        return data.display_name || 'Address not found';
      }
      return 'Current Location';
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return 'Current Location';
    }
  };

  // Handle pickup location selection from search
  const handlePickupLocationSelect = (coordinates) => {
    setUserLocation(coordinates);
    setRouteError(null);
  };

  // Handle destination location selection from search
  const handleDestinationLocationSelect = (coordinates) => {
    setDestination(coordinates);
    setRouteError(null);
  };

  // Handle manual address input changes
  const handlePickupAddressChange = (address) => {
    setPickupAddress(address);
    setRouteError(null);
  };

  const handleDestinationAddressChange = (address) => {
    setDestinationAddress(address);
    setRouteError(null);
  };

  // Simulate nearby drivers
  useEffect(() => {
    if (userLocation) {
      const simulatedDrivers = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        location: [
          userLocation[0] + (Math.random() - 0.5) * 0.02,
          userLocation[1] + (Math.random() - 0.5) * 0.02
        ],
        available: true
      }));
      setDrivers(simulatedDrivers);
    }
  }, [userLocation]);

  const handleMapClick = (coordinates) => {
    setDestination(coordinates);
    reverseGeocode(coordinates).then(address => {
      setDestinationAddress(address);
    });
    setRouteError(null);
  };

  const handleUseCurrentLocationAsPickup = async () => {
    await getCurrentLocation('pickup');
  };

  const handleUseCurrentLocationAsDestination = async () => {
    await getCurrentLocation('destination');
  };

  const handleSwapLocations = () => {
    if (userLocation && destination) {
      const tempLocation = userLocation;
      const tempAddress = pickupAddress;

      setUserLocation(destination);
      setDestination(tempLocation);
      setPickupAddress(destinationAddress);
      setDestinationAddress(tempAddress);

      // Clear existing route when swapping
      clearRoute();
      setRouteError(null);
    }
  };

  const handleCalculateRoute = async () => {
    if (!userLocation || !destination) {
      setRouteError('Please set both pickup and destination locations');
      return;
    }

    setRouteError(null);
    await calculateRoute(
      { lat: userLocation[0], lng: userLocation[1] },
      { lat: destination[0], lng: destination[1] }
    );
  };

  const handleBookRide = () => {
    if (!selectedRide) {
      alert('Please select a ride type');
      return;
    }

    if (!route) {
      alert('Please calculate the route first');
      return;
    }

    const baseFare = 2.00; // Base fare
    const distanceFare = selectedRide.price * (route.distance / 1000) * 0.1;
    const totalFare = (baseFare + distanceFare).toFixed(2);

    // Simulate ride booking
    alert(`🚗 Ride Booked Successfully!

📍 From: ${pickupAddress}
🎯 To: ${destinationAddress}
🚘 Vehicle: ${selectedRide.name}
💰 Total Fare: $${totalFare}
📏 Distance: ${(route.distance / 1000).toFixed(2)} km
⏱️ Duration: ${Math.ceil(route.duration / 60)} minutes

Your driver will arrive in approximately ${selectedRide.eta} minutes!`);
  };

  const canCalculateRoute = userLocation && destination && !routeLoading;
  const canBookRide = selectedRide && route && !routeLoading;

  return (
    <div className="h-screen flex flex-col md:flex-row">
      {/* Map Section */}
      <div className="flex-1 relative">
        <MapContainerComponent
          userLocation={userLocation}
          driverLocation={drivers[0]?.location}
          destination={destination}
          route={route}
          onLocationSelect={handleMapClick}
        />
      </div>

      {/* Booking Panel */}
      <div className="w-full md:w-96 bg-white shadow-lg p-6 overflow-y-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <NavigationIcon className="h-6 w-6 text-blue-600" />
              Book a Ride
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Pickup Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center justify-between">
                <span>Pickup Location</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUseCurrentLocationAsPickup}
                  disabled={locationLoading.pickup}
                  className="h-6 text-xs text-blue-600 hover:text-blue-700"
                >
                  {locationLoading.pickup ? '📍 Getting...' : '📍 Use Current'}
                </Button>
              </label>
              <LocationInput
                value={pickupAddress}
                onChange={handlePickupAddressChange}
                onLocationSelect={handlePickupLocationSelect}
                onUseCurrentLocation={handleUseCurrentLocationAsPickup}
                placeholder="Enter pickup location"
                type="pickup"
              />
            </div>

            {/* Swap Locations Button */}
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSwapLocations}
                disabled={!userLocation || !destination}
                className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-all"
                title="Swap locations"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>

            {/* Destination Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center justify-between">
                <span>Destination</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUseCurrentLocationAsDestination}
                  disabled={locationLoading.destination}
                  className="h-6 text-xs text-blue-600 hover:text-blue-700"
                >
                  {locationLoading.destination ? '📍 Getting...' : '📍 Use Current'}
                </Button>
              </label>
              <LocationInput
                value={destinationAddress}
                onChange={handleDestinationAddressChange}
                onLocationSelect={handleDestinationLocationSelect}
                onUseCurrentLocation={handleUseCurrentLocationAsDestination}
                placeholder="Enter destination"
                type="destination"
              />
            </div>

            {/* Error Display */}
            {routeError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="text-sm text-red-800 flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{routeError}</span>
                </div>
              </div>
            )}

            {/* Route Info */}
            {route && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <NavigationIcon className="h-4 w-4" />
                    Route Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-blue-700">Distance</div>
                      <div className="text-blue-900 font-semibold">{(route.distance / 1000).toFixed(2)} km</div>
                    </div>
                    <div>
                      <div className="font-medium text-blue-700">Duration</div>
                      <div className="text-blue-900 font-semibold">{Math.ceil(route.duration / 60)} mins</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ride Options */}
            <div>
              <label className="text-sm font-medium block mb-3">Choose Your Ride</label>
              <div className="space-y-3">
                {RIDE_TYPES.map((ride) => (
                  <div
                    key={ride.id}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${selectedRide?.id === ride.id
                      ? 'border-blue-500 bg-blue-50 shadow-md scale-[1.02]'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    onClick={() => setSelectedRide(ride)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-900">{ride.name}</span>
                      <span className="text-blue-600 font-bold">${ride.price}/km</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">ETA: {ride.eta} mins</span>
                      {route && (
                        <span className="font-semibold text-green-600">
                          ${(2 + ride.price * (route.distance / 1000) * 0.1).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all"
                onClick={handleCalculateRoute}
                disabled={!canCalculateRoute}
              >
                {routeLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Calculating Route...
                  </div>
                ) : (
                  `📏 Show Route & Calculate Fare`
                )}
              </Button>

              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl text-lg transition-all shadow-lg"
                onClick={handleBookRide}
                disabled={!canBookRide}
              >
                {canBookRide ? (
                  <div className="flex items-center gap-2">
                    <NavigationIcon className="h-5 w-5" />
                    Book {selectedRide.name} - ${(2 + selectedRide.price * (route.distance / 1000) * 0.1).toFixed(2)}
                  </div>
                ) : (
                  'Select Ride & Route to Book'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
