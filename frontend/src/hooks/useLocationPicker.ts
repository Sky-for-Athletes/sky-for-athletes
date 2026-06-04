import { useState, useCallback } from "react";

interface LocationState {
  lat: number;
  lon: number;
  city: string;
}

export function useLocationPicker() {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [resolving, setResolving] = useState(false);

  const selectLocation = useCallback(async (lat: number, lon: number, cityName?: string) => {
    if (cityName) {
      setLocation({ lat, lon, city: cityName });
      return;
    }
    setLocation({ lat, lon, city: `${lat.toFixed(4)}, ${lon.toFixed(4)}` });
    setResolving(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
        { headers: { "Accept-Language": "pt" } }
      );
      if (!res.ok) return;
      const data = await res.json();
      const addr = data.address;
      const city =
        addr.city ||
        addr.town ||
        addr.village ||
        addr.municipality ||
        addr.county ||
        addr.state ||
        "";
      if (city) {
        setLocation((prev) => (prev ? { ...prev, city } : prev));
      }
    } catch {
      // reverse geocode falhou, mantém coordenadas como nome
    } finally {
      setResolving(false);
    }
  }, []);

  const reset = useCallback(() => setLocation(null), []);

  return { location, resolving, selectLocation, reset };
}
