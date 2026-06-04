import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type PlannerMode = "draw" | "auto";

interface Props {
  onRouteChange: (waypoints: [number, number][]) => void;
  waypoints?: [number, number][];
}

const defaultCenter: [number, number] = [-3.717, -38.504];

export default function RoutePlanner({ onRouteChange, waypoints }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<L.Map | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const [mode, setMode] = useState<PlannerMode>("draw");
  const [localPoints, setLocalPoints] = useState<[number, number][]>(waypoints || []);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [routing, setRouting] = useState(false);

  const modeRef = useRef(mode);
  modeRef.current = mode;

  const pointsRef = useRef<[number, number][]>(localPoints);
  pointsRef.current = localPoints;

  const commitRoute = useCallback((pts: [number, number][]) => {
    onRouteChange(pts);
  }, [onRouteChange]);

  const updateVisuals = useCallback((map: L.Map, pts: [number, number][]) => {
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    if (pts.length < 2) {
      if (pts.length === 1) {
        const m = L.marker([pts[0][1], pts[0][0]], { draggable: true });
        m.addTo(map);
        m.on("dragend", () => {
          const pos = m.getLatLng();
          const updated: [number, number][] = [[pos.lng, pos.lat]];
          setLocalPoints(updated);
          markersRef.current = [m];
        });
        markersRef.current = [m];
      }
      return;
    }

    const latlngs: [number, number][] = pts.map((p) => [p[1], p[0]]);
    const poly = L.polyline(latlngs, {
      color: "#22c55e",
      weight: 4,
      opacity: 0.8,
    }).addTo(map);
    polylineRef.current = poly;

    const markers = pts.map((p, i) => {
      const m = L.marker([p[1], p[0]], {
        draggable: true,
        icon: L.divIcon({
          className: "",
          html: `<div class="flex items-center justify-center w-6 h-6 rounded-full bg-green-signal text-dark-bg text-xs font-bold">${i + 1}</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        }),
      }).addTo(map);

      m.on("dragend", () => {
        const pos = m.getLatLng();
        const updated = [...pointsRef.current];
        updated[i] = [pos.lng, pos.lat];
        setLocalPoints(updated);
        commitRoute(updated);
      });

      return m;
    });
    markersRef.current = markers;
  }, [commitRoute]);

  useEffect(() => {
    if (mapRef.current && !instanceRef.current) {
      const map = L.map(mapRef.current, {
        center: defaultCenter,
        zoom: 12,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      map.on("click", (e: L.LeafletMouseEvent) => {
        if (modeRef.current !== "draw") return;
        const { lat, lng } = e.latlng;
        const newPoint: [number, number] = [lng, lat];
        const updated = [...pointsRef.current, newPoint];
        setLocalPoints(updated);
        updateVisuals(map, updated);
      });

      instanceRef.current = map;
    }
  }, []);

  useEffect(() => {
    if (!instanceRef.current || waypoints === undefined) return;
    setLocalPoints(waypoints);
    updateVisuals(instanceRef.current, waypoints);
  }, [waypoints]);

  const handleUndo = useCallback(() => {
    const updated = localPoints.slice(0, -1);
    setLocalPoints(updated);
    if (instanceRef.current) {
      updateVisuals(instanceRef.current, updated);
    }
    if (updated.length >= 2) commitRoute(updated);
    else commitRoute([]);
  }, [localPoints, commitRoute]);

  const handleClear = useCallback(() => {
    setLocalPoints([]);
    if (instanceRef.current) {
      updateVisuals(instanceRef.current, []);
    }
    commitRoute([]);
  }, [commitRoute]);

  const handleFinish = useCallback(() => {
    if (localPoints.length >= 2) {
      commitRoute(localPoints);
    }
  }, [localPoints, commitRoute]);

  const handleAutoRoute = useCallback(async () => {
    if (!origin || !destination) return;
    setRouting(true);
    try {
      const geocode = async (q: string) => {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`,
          { headers: { "Accept-Language": "pt" } }
        );
        const data = await res.json();
        if (!data.length) throw new Error(`Local não encontrado: ${q}`);
        return [Number(data[0].lon), Number(data[0].lat)] as [number, number];
      };

      const ogCoords = await geocode(origin.trim());
      const dstCoords = await geocode(destination.trim());

      const osrmRes = await fetch(
        `https://router.project-osrm.org/route/v1/foot/${ogCoords[0]},${ogCoords[1]};${dstCoords[0]},${dstCoords[1]}?geometries=geojson&overview=full`
      );
      const osrmData = await osrmRes.json();
      if (!osrmData.routes?.length) throw new Error("Rota não encontrada");

      const coords = osrmData.routes[0].geometry.coordinates as [number, number][];
      setLocalPoints(coords);
      if (instanceRef.current) {
        const map = instanceRef.current;
        updateVisuals(map, coords);
        map.fitBounds(L.latLngBounds(coords.map((c) => [c[1], c[0]] as [number, number])));
      }
      commitRoute(coords);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setRouting(false);
    }
  }, [origin, destination, commitRoute]);

  useEffect(() => {
    if (instanceRef.current && mode === "draw" && localPoints.length >= 2) {
      const map = instanceRef.current;
      const bounds = L.latLngBounds(localPoints.map((p) => [p[1], p[0]] as [number, number]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [mode]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("draw")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            mode === "draw"
              ? "bg-green-signal text-dark-bg"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Desenhar
        </button>
        <button
          type="button"
          onClick={() => setMode("auto")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            mode === "auto"
              ? "bg-green-signal text-dark-bg"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Origem → Destino
        </button>
      </div>

      {mode === "auto" && (
        <div className="space-y-2">
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="Origem (ex: Praia do Futuro)"
            className="w-full bg-dark-bg border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-signal/50"
          />
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Destino (ex: Ibirapuera)"
            className="w-full bg-dark-bg border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-signal/50"
          />
          <button
            type="button"
            onClick={handleAutoRoute}
            disabled={routing || !origin || !destination}
            className="w-full bg-green-signal text-dark-bg font-bold py-2 rounded-lg text-sm hover:bg-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {routing ? "Calculando rota..." : "Traçar Rota"}
          </button>
        </div>
      )}

      <div ref={mapRef} className="w-full h-64 rounded-xl border border-gray-700 z-0" />

      {mode === "draw" && (
        <div className="flex gap-2 text-xs">
          <span className="text-gray-400">
            {localPoints.length === 0
              ? "Clique no mapa para adicionar pontos"
              : `${localPoints.length} ponto(s) adicionado(s)`}
          </span>
          {localPoints.length > 0 && (
            <>
              <button type="button" onClick={handleUndo} className="text-gray-400 hover:text-white">
                Desfazer
              </button>
              <button type="button" onClick={handleClear} className="text-gray-400 hover:text-red-signal">
                Limpar
              </button>
              {localPoints.length >= 2 && (
                <button type="button" onClick={handleFinish} className="text-green-signal font-medium">
                  Confirmar Rota
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
