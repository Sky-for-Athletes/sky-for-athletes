import { useState, useCallback } from "react";
import ModeToggle from "../components/ModeToggle";
import LocationSearch from "../components/LocationSearch";
import LocationPicker from "../components/LocationPicker";
import RoutePlanner from "../components/RoutePlanner";
import WeatherCard from "../components/WeatherCard";
import WeatherMap from "../components/WeatherMap";
import RouteResult from "../components/RouteResult";
import SportSelector from "../components/SportSelector";
import FavoriteLocations from "../components/FavoriteLocations";
import SettingsModal from "../components/SettingsModal";
import ReportsModal from "../components/ReportsModal";
import { useWeather } from "../hooks/useWeather";
import { useFavorites } from "../hooks/useFavorites";
import { useLocationPicker } from "../hooks/useLocationPicker";
import type { RouteEvaluation } from "../services/weather.service";

type Mode = "point" | "route";

export default function Dashboard() {
  const { data, routeData, loading, error, evaluate, evaluateRoute, reset } = useWeather();
  const { favorites, loading: favLoading, addFavorite } = useFavorites();
  const { location, resolving, selectLocation, reset: resetLocation } = useLocationPicker();

  const [mode, setMode] = useState<Mode>("point");
  const [activity, setActivity] = useState("");
  const [customName, setCustomName] = useState("");
  const [routeWaypoints, setRouteWaypoints] = useState<[number, number][]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showPanel, setShowPanel] = useState(true);

  const handleSearchSelect = useCallback((lat: number, lon: number, city: string) => {
    setMode("point");
    selectLocation(lat, lon, city);
  }, [selectLocation]);

  const handleEvaluate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!activity) return;
      if (mode === "point" && location) {
        await evaluate(location.lat, location.lon, activity);
      } else if (mode === "route" && routeWaypoints.length >= 2) {
        await evaluateRoute(routeWaypoints, activity);
      }
    },
    [mode, location, routeWaypoints, activity, evaluate, evaluateRoute]
  );

  const handleSelectFavorite = useCallback(
    (lat: number, lon: number, name: string) => {
      setMode("point");
      selectLocation(lat, lon);
      setCustomName(name);
      if (activity) evaluate(lat, lon, activity);
    },
    [activity, evaluate, selectLocation]
  );

  const handleSaveFavorite = useCallback(async () => {
    if (mode === "point" && location) {
      await addFavorite({
        name: customName || location.city || `Local (${location.lat}, ${location.lon})`,
        coordinates: { type: "Point", coordinates: [location.lon, location.lat] },
      });
    }
  }, [mode, location, customName, addFavorite]);

  const canEvaluate = mode === "point"
    ? !!location && !!activity
    : routeWaypoints.length >= 2 && !!activity;

  return (
    <div className="h-screen bg-dark-bg flex flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-gray-800 bg-surface/80 backdrop-blur-md shrink-0">
        <h1 className="text-xl font-bold text-white tracking-tight mr-2">SkyRunner</h1>
        <div className="flex-1 max-w-md">
          <LocationSearch onSelect={handleSearchSelect} />
        </div>
        <ModeToggle value={mode} onChange={setMode} />
        <button
          onClick={() => setShowSettings(true)}
          className="text-gray-400 hover:text-white transition-colors p-2"
          title="Preferências"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </button>
        <button
          onClick={() => setShowReports(true)}
          className="text-gray-400 hover:text-white transition-colors p-2"
          title="Relatórios"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Map */}
        <div className={`flex-1 relative ${showPanel ? "" : "w-full"}`}>
          {mode === "point" ? (
            <div className="absolute inset-0">
              <div className="relative w-full h-full p-4">
                <LocationPicker
                  onLocationSelect={(lat, lon) => selectLocation(lat, lon)}
                  selectedLat={location?.lat}
                  selectedLon={location?.lon}
                />
              </div>
              {data && location && (
                <div className="absolute inset-0 p-4 pointer-events-none">
                  <div className="relative w-full h-full pointer-events-auto">
                    <WeatherMap
                      latitude={location.lat}
                      longitude={location.lon}
                      verdict={data?.verdict}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="absolute inset-0 p-4">
              {routeData && routeWaypoints.length >= 2 ? (
                <RouteResult data={routeData} waypoints={routeWaypoints} />
              ) : (
                <RoutePlanner
                  onRouteChange={setRouteWaypoints}
                  waypoints={routeWaypoints}
                />
              )}
            </div>
          )}

          {/* Toggle panel button */}
          <button
            onClick={() => setShowPanel(!showPanel)}
            className="absolute top-4 right-4 z-10 bg-surface/80 border border-gray-700 rounded-lg p-2 text-gray-400 hover:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {showPanel ? (
                <path d="M15 3l-7 9 7 9" />
              ) : (
                <path d="M9 3l7 9-7 9" />
              )}
            </svg>
          </button>
        </div>

        {/* Panel */}
        {showPanel && (
          <div className="w-80 border-l border-gray-800 bg-surface/50 overflow-y-auto shrink-0">
            <div className="p-4 space-y-5">
              {/* Favorites */}
              <FavoriteLocations
                favorites={favorites}
                loading={favLoading}
                onSelect={handleSelectFavorite}
              />

              {/* Evaluate form */}
              <form onSubmit={handleEvaluate} className="space-y-3">
                <h3 className="text-white font-semibold text-sm">
                  {mode === "point" ? "Avaliar Local" : "Avaliar Rota"}
                </h3>

                {mode === "point" && location && (
                  <div className="bg-dark-bg rounded-lg p-3 text-sm">
                    <p className="text-white font-medium">{location.city}</p>
                    <p className="text-gray-500 text-xs">
                      {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                      {resolving && " (obtendo nome...)"}
                    </p>
                  </div>
                )}

                {mode === "route" && routeWaypoints.length >= 2 && (
                  <div className="bg-dark-bg rounded-lg p-3 text-sm">
                    <p className="text-white font-medium">Rota definida</p>
                    <p className="text-gray-500 text-xs">
                      {routeWaypoints.length} pontos · {routeWaypoints[0][0].toFixed(4)},{routeWaypoints[0][1].toFixed(4)} → {routeWaypoints[routeWaypoints.length-1][0].toFixed(4)},{routeWaypoints[routeWaypoints.length-1][1].toFixed(4)}
                    </p>
                  </div>
                )}

                {mode === "point" && location && (
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder={location.city || "Nome do local"}
                    className="w-full bg-dark-bg border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-signal/50"
                  />
                )}

                <SportSelector value={activity} onChange={setActivity} />

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={!canEvaluate || loading}
                    className="flex-1 bg-green-signal text-dark-bg font-bold py-2 rounded-lg text-sm hover:bg-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Avaliando..." : "Avaliar"}
                  </button>

                  {data && (
                    <button
                      type="button"
                      onClick={handleSaveFavorite}
                      className="bg-gray-700 text-gray-300 px-3 py-2 rounded-lg text-sm hover:bg-gray-600"
                      title="Salvar local"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                      </svg>
                    </button>
                  )}
                </div>
              </form>

              {/* Results */}
              {error && (
                <div className="bg-red-signal/10 border border-red-signal/30 text-red-signal text-sm rounded-lg px-4 py-3">
                  {error}
                </div>
              )}

              {data && <WeatherCard data={data} />}

              {routeData && (
                <RouteResultCard data={routeData} />
              )}

              {(data || routeData) && (
                <button
                  onClick={() => { reset(); resetLocation(); setCustomName(""); }}
                  className="text-gray-500 hover:text-white text-sm w-full text-center"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
      <ReportsModal open={showReports} onClose={() => setShowReports(false)} />
    </div>
  );
}

function RouteResultCard({ data }: { data: RouteEvaluation }) {
  const verdictColor = (v: string) => {
    switch (v) {
      case "EXCELLENT": return "text-green-signal";
      case "GOOD": return "text-green-400";
      case "MODERATE": return "text-yellow-signal";
      case "POOR": return "text-red-signal";
      default: return "text-gray-400";
    }
  };

  const verdictBg = (v: string) => {
    switch (v) {
      case "EXCELLENT":
      case "GOOD": return "bg-green-signal/10 border-green-signal/30 text-green-signal";
      case "MODERATE": return "bg-yellow-signal/10 border-yellow-signal/30 text-yellow-signal";
      case "POOR": return "bg-red-signal/10 border-red-signal/30 text-red-signal";
      default: return "bg-gray-700";
    }
  };

  return (
    <div className="bg-surface border border-gray-700 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold text-sm capitalize">{data.activity}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${verdictBg(data.overallVerdict)}`}>
          {data.overallVerdict === "EXCELLENT" ? "RECOMENDADO" :
           data.overallVerdict === "GOOD" ? "FAVORÁVEL" :
           data.overallVerdict === "MODERATE" ? "ATENÇÃO" : "NÃO RECOMENDADO"}
        </span>
      </div>

      <div>
        <p className="text-gray-400 text-xs">Score geral</p>
        <p className={`text-2xl font-bold ${verdictColor(data.overallVerdict)}`}>
          {data.overallScore}/100
        </p>
      </div>

      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all"
          style={{
            width: `${data.overallScore}%`,
            backgroundColor:
              data.overallScore >= 60 ? "#22c55e" :
              data.overallScore >= 40 ? "#eab308" : "#ef4444",
          }}
        />
      </div>

      {data.criticalSegments.length > 0 && (
        <div className="space-y-2">
          <p className="text-red-signal text-xs font-semibold">
            ⚠ {data.criticalSegments.length} trecho(s) crítico(s)
          </p>
          {data.criticalSegments.map((cs, i) => (
            <div key={i} className="bg-red-signal/5 border border-red-signal/20 rounded-lg p-2">
              <p className="text-red-signal text-xs font-medium">{cs.reason}</p>
              <p className="text-gray-500 text-xs">
                Pontos {cs.fromIndex}–{cs.toIndex} · Score médio: {cs.avgScore}/100
              </p>
            </div>
          ))}
        </div>
      )}

      <p className="text-gray-500 text-xs">
        {data.segments.length} pontos avaliados ao longo da rota
      </p>
    </div>
  );
}
