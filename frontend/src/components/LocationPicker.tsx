import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
  onLocationSelect: (lat: number, lon: number) => void;
  selectedLat?: number;
  selectedLon?: number;
}

function createIcon() {
  return L.divIcon({
    className: "",
    html: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#22c55e" stroke="white" stroke-width="1.5"/>
    </svg>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
  });
}

const defaultCenter: [number, number] = [-3.717, -38.504];

export default function LocationPicker({ onLocationSelect, selectedLat, selectedLon }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (mapRef.current && !instanceRef.current) {
      const hasSelection = selectedLat !== undefined && selectedLon !== undefined;
      const center: [number, number] = hasSelection
        ? [selectedLat!, selectedLon!]
        : defaultCenter;

      const map = L.map(mapRef.current, {
        center,
        zoom: hasSelection ? 12 : 4,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      if (hasSelection) {
        const marker = L.marker([selectedLat!, selectedLon!], {
          icon: createIcon(),
          draggable: true,
        }).addTo(map);

        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          onLocationSelect(pos.lat, pos.lng);
        });

        markerRef.current = marker;
      }

      map.on("click", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          const marker = L.marker([lat, lng], {
            icon: createIcon(),
            draggable: true,
          }).addTo(map);

          marker.on("dragend", () => {
            const pos = marker.getLatLng();
            onLocationSelect(pos.lat, pos.lng);
          });

          markerRef.current = marker;
        }

        onLocationSelect(lat, lng);
      });

      instanceRef.current = map;
    }

    return () => {
      if (instanceRef.current) {
        instanceRef.current.remove();
        instanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (
      instanceRef.current &&
      selectedLat !== undefined &&
      selectedLon !== undefined
    ) {
      const map = instanceRef.current;

      if (markerRef.current) {
        markerRef.current.setLatLng([selectedLat, selectedLon]);
      } else {
        const marker = L.marker([selectedLat, selectedLon], {
          icon: createIcon(),
          draggable: true,
        }).addTo(map);

        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          onLocationSelect(pos.lat, pos.lng);
        });

        markerRef.current = marker;
      }

      map.setView([selectedLat, selectedLon], Math.max(map.getZoom(), 10));
    }
  }, [selectedLat, selectedLon, onLocationSelect]);

  return (
    <div
      ref={mapRef}
      className="w-full h-64 rounded-xl border border-gray-700 z-0"
    />
  );
}
