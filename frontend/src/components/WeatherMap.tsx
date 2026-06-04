import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
  latitude: number;
  longitude: number;
  verdict?: string;
}

function getMarkerColor(verdict?: string): string {
  switch (verdict) {
    case "EXCELLENT":
    case "GOOD":
      return "#22c55e";
    case "MODERATE":
      return "#eab308";
    case "POOR":
      return "#ef4444";
    default:
      return "#3b82f6";
  }
}

export default function WeatherMap({ latitude, longitude, verdict }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && !instanceRef.current) {
      const map = L.map(mapRef.current).setView([latitude, longitude], 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const color = getMarkerColor(verdict);
      L.circleMarker([latitude, longitude], {
        radius: 12,
        fillColor: color,
        color: "#fff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      }).addTo(map);

      instanceRef.current = map;
    }

    return () => {
      if (instanceRef.current) {
        instanceRef.current.remove();
        instanceRef.current = null;
      }
    };
  }, [latitude, longitude, verdict]);

  return <div ref={mapRef} className="w-full h-64 rounded-xl border border-gray-700 z-0" />;
}
