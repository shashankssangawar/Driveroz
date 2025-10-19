import { useState, useCallback } from 'react';

export const useRouting = () => {
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateRoute = useCallback(async (start, end) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`
      );

      if (!response.ok) {
        throw new Error('Failed to calculate route. Please try again.');
      }

      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const routeData = data.routes[0];
        setRoute({
          geometry: routeData.geometry,
          distance: routeData.distance,
          duration: routeData.duration,
          instructions: routeData.legs?.[0]?.steps || []
        });
        return routeData;
      } else {
        throw new Error('No route found between these locations.');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to calculate route. Please check your locations and try again.';
      setError(errorMessage);
      console.error('Routing error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearRoute = useCallback(() => {
    setRoute(null);
    setError(null);
  }, []);

  return {
    route,
    loading,
    error,
    calculateRoute,
    clearRoute
  };
};
