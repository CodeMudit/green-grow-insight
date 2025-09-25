import { useState, useEffect } from 'react';
import { detectLocationFromIP, reverseGeocode } from '@/lib/api';

interface LocationData {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  district: string | null;
  state: string | null;
  country: string | null;
  accuracy?: number;
}

interface LocationHook {
  location: LocationData;
  loading: boolean;
  error: string | null;
  detectLocation: () => Promise<void>;
  hasLocation: boolean;
}

export const useLocation = (): LocationHook => {
  const [location, setLocation] = useState<LocationData>({
    latitude: null,
    longitude: null,
    city: null,
    district: null,
    state: null,
    country: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("🔍 Starting location detection...");
      // First try browser geolocation
      if (navigator.geolocation) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            { 
              enableHighAccuracy: true, 
              timeout: 10000, 
              maximumAge: 300000 
            }
          );
        });
        console.log("📍 GPS Location obtained:", position);

        const { latitude, longitude, accuracy } = position.coords;
        console.log("📊 Coordinates:", { latitude, longitude, accuracy });
        
        // Get location details from coordinates
        try {
          const locationDetails = await reverseGeocode(latitude, longitude);
          console.log("🗺️ Reverse geocoding result:", locationDetails);
          setLocation({
            latitude,
            longitude,
            city: locationDetails.city,
            district: locationDetails.district,
            state: locationDetails.state,
            country: locationDetails.country,
            accuracy
          });
          console.log("✅ Location set successfully");
        } catch (geocodeError) {
          console.error("❌ Reverse geocoding failed:", geocodeError);
          // If reverse geocoding fails, still use coordinates
          setLocation({
            latitude,
            longitude,
            city: null,
            district: null,
            state: null,
            country: null,
            accuracy
          });
        }
      } else {
        throw new Error('Geolocation not supported');
      }
    } catch (geoError) {
      console.warn("⚠️ GPS failed, trying IP fallback:", geoError);
      // Fallback to IP-based location
      try {
        const ipLocation = await detectLocationFromIP();
        console.log("🌐 IP location result:", ipLocation);
        setLocation({
          latitude: ipLocation.latitude || ipLocation.lat,
          longitude: ipLocation.longitude || ipLocation.lon,
          city: ipLocation.city || ipLocation.locality,
          district: ipLocation.district || ipLocation.region,
          state: ipLocation.state || ipLocation.region,
          country: ipLocation.country
        });
        console.log("✅ IP location set successfully");
      } catch (ipError) {
        console.error("❌ Both GPS and IP location failed:", ipError);
        setError('Unable to detect location. Please enable location services or check your internet connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto-detect location on mount if not already detected
  useEffect(() => {
    const savedLocation = localStorage.getItem('user_location');
    console.log("Location from storage", savedLocation)
    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation);
        setLocation(parsed);
      } catch {
        // If saved location is invalid, detect new location
        detectLocation();
      }
    } else {
      detectLocation();
    }
  }, []);

  // Save location to localStorage when it changes
  useEffect(() => {
    if (location.latitude && location.longitude) {
      localStorage.setItem('user_location', JSON.stringify(location));
    }
  }, [location]);

  const hasLocation = !!(location.latitude && location.longitude);

  return {
    location,
    loading,
    error,
    detectLocation,
    hasLocation
  };
};
