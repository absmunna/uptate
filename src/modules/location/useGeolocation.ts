import { useEffect } from 'react';
import { useLocationStore } from './locationStore';

export const useGeolocation = () => {
  const { setLocation, setAutoDetected } = useLocationStore();

  const detectLocation = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // In a real app, you would use reverse geocoding API here
          // For now, we'll mock it based on coordinates or a simple API call
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
  };

  return { detectLocation };
};
