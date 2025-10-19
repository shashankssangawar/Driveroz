'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouting } from '@/hooks/useRouting';
import { CarIcon, WalletIcon, StarIcon, ClockIcon, NavigationIcon, UserIcon } from 'lucide-react';
import MapContainerComponent from '@/components/block/map-container';

// Mock ride requests data
const MOCK_RIDE_REQUESTS = [
  {
    id: 1,
    passenger: 'Alice Johnson',
    rating: 4.9,
    pickup: 'Connaught Place, New Delhi',
    destination: 'India Gate, New Delhi',
    fare: 245,
    distance: 4.2,
    eta: 8
  },
  {
    id: 2,
    passenger: 'Bob Smith',
    rating: 4.7,
    pickup: 'Rajiv Chowk, Delhi',
    destination: 'Lotus Temple, Delhi',
    fare: 320,
    distance: 6.1,
    eta: 12
  },
  {
    id: 3,
    passenger: 'Carol Davis',
    rating: 5.0,
    pickup: 'Chandni Chowk, Delhi',
    destination: 'Red Fort, Delhi',
    fare: 180,
    distance: 2.8,
    eta: 5
  }
];

export default function DriverDashboard() {
  const [driverLocation, setDriverLocation] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [currentRide, setCurrentRide] = useState(null);
  const [rideRequests, setRideRequests] = useState([]);
  const [driverStats, setDriverStats] = useState({
    totalEarnings: 0,
    todayEarnings: 0,
    totalRides: 0,
    rating: 4.8
  });
  const [activeTab, setActiveTab] = useState('dashboard');

  const { route, loading: routeLoading, calculateRoute, clearRoute } = useRouting();

  // Initialize driver location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setDriverLocation([latitude, longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to Delhi if location access denied
          setDriverLocation([28.6139, 77.2090]);
        }
      );
    }
  }, []);

  // Simulate driver location updates when online
  useEffect(() => {
    if (isOnline && driverLocation) {
      const interval = setInterval(() => {
        // Simulate small location changes
        setDriverLocation(prev => [
          prev[0] + (Math.random() - 0.5) * 0.001,
          prev[1] + (Math.random() - 0.5) * 0.001
        ]);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isOnline, driverLocation]);

  // Simulate ride requests when online
  useEffect(() => {
    if (isOnline && !currentRide) {
      const interval = setInterval(() => {
        if (Math.random() > 0.7 && rideRequests.length < 3) { // 30% chance every 10 seconds
          const newRequest = MOCK_RIDE_REQUESTS[Math.floor(Math.random() * MOCK_RIDE_REQUESTS.length)];
          setRideRequests(prev => [...prev, { ...newRequest, id: Date.now() }]);
        }
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [isOnline, currentRide, rideRequests.length]);

  const handleGoOnline = () => {
    setIsOnline(true);
    setRideRequests([]);
  };

  const handleGoOffline = () => {
    setIsOnline(false);
    setRideRequests([]);
    setCurrentRide(null);
    clearRoute();
  };

  const acceptRide = async (ride) => {
    setCurrentRide(ride);
    setRideRequests([]); // Clear all pending requests

    if (driverLocation) {
      // Generate random pickup location near driver
      const pickupLocation = [
        driverLocation[0] + (Math.random() - 0.5) * 0.01,
        driverLocation[1] + (Math.random() - 0.5) * 0.01
      ];

      await calculateRoute(
        { lat: driverLocation[0], lng: driverLocation[1] },
        { lat: pickupLocation[0], lng: pickupLocation[1] }
      );
    }
  };

  const declineRide = (rideId) => {
    setRideRequests(prev => prev.filter(ride => ride.id !== rideId));
  };

  const completeRide = () => {
    if (currentRide) {
      setDriverStats(prev => ({
        ...prev,
        totalEarnings: prev.totalEarnings + currentRide.fare,
        todayEarnings: prev.todayEarnings + currentRide.fare,
        totalRides: prev.totalRides + 1
      }));
    }
    setCurrentRide(null);
    clearRoute();
  };

  const cancelRide = () => {
    setCurrentRide(null);
    clearRoute();
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <CarIcon className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, John!</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant={isOnline ? "default" : "secondary"} className="text-sm">
              {isOnline ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Online
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  Offline
                </div>
              )}
            </Badge>

            <Button
              onClick={isOnline ? handleGoOffline : handleGoOnline}
              variant={isOnline ? "destructive" : "default"}
              className="flex items-center gap-2"
            >
              {isOnline ? 'Go Offline' : 'Go Online'}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Main Map */}
        <div className="flex-1 relative">
          <MapContainerComponent
            userLocation={currentRide ? [28.6139, 77.2090] : null} // Mock pickup location
            driverLocation={driverLocation}
            destination={currentRide ? [28.6129, 77.2295] : null} // Mock destination
            route={route}
          />
        </div>

        {/* Side Panel */}
        <div className="w-96 bg-gray-50 border-l overflow-y-auto">
          {/* Navigation Tabs */}
          <div className="border-b bg-white">
            <div className="flex">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'dashboard'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('rides')}
                className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'rides'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Rides
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <>
                {/* Earnings Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <WalletIcon className="h-5 w-5 text-green-600" />
                      Earnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Today</span>
                      <span className="text-2xl font-bold text-green-600">
                        ${driverStats.todayEarnings}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total</span>
                      <span className="text-xl font-semibold">
                        ${driverStats.totalEarnings}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Stats Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <StarIcon className="h-5 w-5 text-yellow-500" />
                      Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Rides</span>
                      <span className="font-semibold">{driverStats.totalRides}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Rating</span>
                      <div className="flex items-center gap-1">
                        <StarIcon className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-semibold">{driverStats.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Current Status */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ClockIcon className="h-5 w-5 text-blue-600" />
                      Current Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {currentRide ? (
                      <div className="space-y-3">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="font-semibold text-blue-800">Active Ride</div>
                          <div className="text-sm text-blue-600">
                            Taking {currentRide.passenger} to {currentRide.destination}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={completeRide} className="flex-1 bg-green-600 hover:bg-green-700">
                            Complete Ride
                          </Button>
                          <Button onClick={cancelRide} variant="outline" className="flex-1">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : isOnline ? (
                      <div className="text-center py-4">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-gray-600">Waiting for ride requests...</p>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-600">Go online to start receiving rides</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {/* Rides Tab */}
            {activeTab === 'rides' && (
              <>
                {/* Ride Requests */}
                {isOnline && rideRequests.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-green-600">
                        New Ride Requests ({rideRequests.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {rideRequests.map((ride) => (
                        <div key={ride.id} className="border rounded-lg p-3 bg-white shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <UserIcon className="h-4 w-4 text-gray-600" />
                            <span className="font-semibold">{ride.passenger}</span>
                            <div className="flex items-center gap-1 ml-auto">
                              <StarIcon className="h-3 w-3 text-yellow-500 fill-current" />
                              <span className="text-sm">{ride.rating}</span>
                            </div>
                          </div>

                          <div className="space-y-1 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="truncate">{ride.pickup}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="truncate">{ride.destination}</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center mb-3">
                            <div className="text-sm">
                              <div className="font-semibold">${ride.fare}</div>
                              <div className="text-gray-500">{ride.distance} km • {ride.eta} min</div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={() => acceptRide(ride)}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              size="sm"
                            >
                              Accept
                            </Button>
                            <Button
                              onClick={() => declineRide(ride.id)}
                              variant="outline"
                              className="flex-1"
                              size="sm"
                            >
                              Decline
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Current Ride */}
                {currentRide && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <NavigationIcon className="h-5 w-5 text-blue-600" />
                        Current Ride
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                          <UserIcon className="h-4 w-4 text-blue-600" />
                          <div>
                            <div className="font-semibold">{currentRide.passenger}</div>
                            <div className="text-sm text-blue-600 flex items-center gap-1">
                              <StarIcon className="h-3 w-3 fill-current" />
                              {currentRide.rating}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Pickup:</span>
                            <span className="font-medium">{currentRide.pickup}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Destination:</span>
                            <span className="font-medium">{currentRide.destination}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Fare:</span>
                            <span className="font-semibold text-green-600">${currentRide.fare}</span>
                          </div>
                        </div>

                        {route && (
                          <div className="bg-gray-50 p-2 rounded text-sm">
                            <div className="flex justify-between">
                              <span>ETA to pickup:</span>
                              <span className="font-semibold">{Math.ceil(route.duration / 60)} min</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Distance:</span>
                              <span className="font-semibold">{(route.distance / 1000).toFixed(1)} km</span>
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button onClick={completeRide} className="flex-1 bg-green-600 hover:bg-green-700">
                            Complete Ride
                          </Button>
                          <Button onClick={cancelRide} variant="outline" className="flex-1">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* No Active Rides */}
                {!currentRide && rideRequests.length === 0 && (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-gray-400 mb-2">🚗</div>
                      <p className="text-gray-600">
                        {isOnline
                          ? "Waiting for ride requests..."
                          : "Go online to see ride requests"
                        }
                      </p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
