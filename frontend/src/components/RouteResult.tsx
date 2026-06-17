import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { RouteEvaluation } from "../services/weather.service";
import type { VariableKey } from "../types/weather";
import { getVariableColor } from "../utils/colorScale";

interface Props {
  data: RouteEvaluation;
  waypoints: [number, number][];
  variableKey?: VariableKey;
}

function getColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#86ef4c";
  if (score >= 40) return "#eab308";
  return "#ef4444";
}

function segValue(seg: RouteEvaluation["segments"][0], key?: VariableKey): number {
  if (!key) return seg.comfortScore;
  return seg[key] ?? seg.comfortScore;
}

export default function RouteResult({ data, waypoints, variableKey }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<L.Map | null>(null);
  const roRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    if (mapRef.current && !instanceRef.current) {
      const latlngs: [number, number][] = waypoints.map((p) => [p[1], p[0]]);
      const bounds = L.latLngBounds(latlngs);

      const map = L.map(mapRef.current).fitBounds(bounds, { padding: [30, 30] });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      data.segments.forEach((seg, i) => {
        const startIdx = seg.index;
        const endIdx = i < data.segments.length - 1 ? data.segments[i + 1].index : waypoints.length - 1;

        const segLatLngs: [number, number][] = [];
        for (let j = startIdx; j <= endIdx && j < waypoints.length; j++) {
          segLatLngs.push([waypoints[j][1], waypoints[j][0]]);
        }

        const segVal = segValue(seg, variableKey);
        const color = variableKey ? getVariableColor(variableKey, segVal) : getColor(segVal);

        if (segLatLngs.length >= 2) {
          L.polyline(segLatLngs, {
            color,
            weight: 5,
            opacity: 0.9,
          }).addTo(map);
        }

        const midIdx = Math.floor((startIdx + endIdx) / 2);
        if (midIdx < waypoints.length) {
          const mid = waypoints[midIdx];
          L.circleMarker([mid[1], mid[0]], {
            radius: 6,
            fillColor: color,
            color: "#fff",
            weight: 2,
            fillOpacity: 1,
          })
            .addTo(map)
            .bindTooltip(`${segVal}${variableKey === "temperature" || variableKey === "heatIndex" || variableKey === "windChill" ? "°C" : variableKey === "humidity" ? "%" : variableKey === "windSpeed" ? " km/h" : ""}`, { permanent: false, direction: "top" });
        }
      });

      data.criticalSegments.forEach((cs) => {
        const fromWaypoint = waypoints[cs.fromIndex];
        const toWaypoint = waypoints[Math.min(cs.toIndex, waypoints.length - 1)];
        if (fromWaypoint && toWaypoint) {
          L.marker([fromWaypoint[1], fromWaypoint[0]], {
            icon: L.divIcon({
              className: "",
              html: `<div class="flex items-center justify-center w-6 h-6 rounded-full bg-red-signal text-white text-xs font-bold">!</div>`,
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            }),
          })
            .addTo(map)
            .bindPopup(`<b>Trecho crítico</b><br/>${cs.reason}<br/>Score médio: ${cs.avgScore}/100`);
        }
      });

      instanceRef.current = map;

      const ro = new ResizeObserver(() => map.invalidateSize());
      ro.observe(mapRef.current);
      roRef.current = ro;
    }

    return () => {
      roRef.current?.disconnect();
      roRef.current = null;
      if (instanceRef.current) {
        instanceRef.current.remove();
        instanceRef.current = null;
      }
    };
  }, [data, waypoints, variableKey]);

  return <div ref={mapRef} className="w-full h-full rounded-xl border border-gray-700" />;
}
