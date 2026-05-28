import { useEffect } from 'react';
import { useLocationStore } from './locationStore';

export const useGeolocation = () => {
  const { setLocation, setAutoDetected } = useLocationStore();

  const detectLocation = () => {
    if (typeof window === "undefined" || typeof navigator === "undefined" || !navigator.geolocation) {
      console.warn('Geolocation is not supported by your browser');
      return;
    }

    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
            const data = await response.json();
            
            if (data.city || data.locality) {
              setLocation(data.city || data.locality, latitude, longitude);
              setAutoDetected(true);
            }
          } catch (error) {
            console.error('Error fetching location name:', error);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    } catch (e) {
      console.warn('Geolocation access denied or restricted context:', e);
    }
  };

  return { detectLocation };
};
