'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouting } from '@/hooks/useRouting';
import MapContainerComponent from './map-container';

export default function DriverDashboard() {
  const [driverLocation, setDriverLocation] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [currentRide, setCurrentRide] = useState(null);
  const { route, calculateRoute } = useRouting();

  // Simulate driver location updates
  useEffect(() => {
    if (isOnline && navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setDriverLocation([latitude, longitude]);
        },
        (error) => {
          console.error('Error watching location:', error);
        },
        { enableHighAccuracy: true, maximumAge: 10000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isOnline]);

  const simulateRideRequest = () => {
    if (!driverLocation) return;

    const pickupLocation = [
      driverLocation[0] + (Math.random() - 0.5) * 0.01,
      driverLocation[1] + (Math.random() - 0.5) * 0.01
    ];

    const newRide = {
      id: Date.now(),
      pickup: pickupLocation,
      destination: [
        pickupLocation[0] + (Math.random() - 0.5) * 0.02,
        pickupLocation[1] + (Math.random() - 0.5) * 0.02
      ],
      passenger: `Passenger ${Math.floor(Math.random() * 1000)}`,
      fare: (Math.random() * 50 + 10).toFixed(2)
    };

    setCurrentRide(newRide);
  };

  const acceptRide = async () => {
    if (currentRide && driverLocation) {
      await calculateRoute(
        { lat: driverLocation[0], lng: driverLocation[1] },
        { lat: currentRide.pickup[0], lng: currentRide.pickup[1] }
      );
    }
  };

  return (
    <div className="h-screen flex">
      <div className="flex-1">
        <MapContainerComponent
          userLocation={currentRide?.pickup}
          driverLocation={driverLocation}
          destination={currentRide?.destination}
          route={route}
        />
      </div>

      <div className="w-80 bg-white shadow-lg p-6 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Driver Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              className={`w-full ${isOnline ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                }`}
              onClick={() => setIsOnline(!isOnline)}
            >
              {isOnline ? 'Go Offline' : 'Go Online'}
            </Button>
          </CardContent>
        </Card>

        {isOnline && (
          <Card>
            <CardHeader>
              <CardTitle>Ride Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={simulateRideRequest} className="w-full">
                Simulate Ride Request
              </Button>

              {currentRide && (
                <Card className="bg-yellow-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold">New Ride Request</h4>
                    <p>Passenger: {currentRide.passenger}</p>
                    <p>Fare: ${currentRide.fare}</p>
                    <div className="flex space-x-2 mt-2">
                      <Button onClick={acceptRide} className="flex-1">
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setCurrentRide(null)}
                      >
                        Decline
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        )}

        {route && currentRide && (
          <Card>
            <CardHeader>
              <CardTitle>Current Ride</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Distance to pickup:</strong>{' '}
                  {(route.distance / 1000).toFixed(2)} km
                </div>
                <div>
                  <strong>ETA:</strong> {Math.ceil(route.duration / 60)} mins
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
