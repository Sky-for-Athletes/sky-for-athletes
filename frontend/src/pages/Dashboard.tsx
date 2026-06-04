import { useState, useCallback } from "react";
import NavbarAuthenticated from "../components/NavbarAuthenticated";
import SportSelector from "../components/SportSelector";
import WeatherCard from "../components/WeatherCard";
import WeatherMap from "../components/WeatherMap";
import LocationPicker from "../components/LocationPicker";
import FavoriteLocations from "../components/FavoriteLocations";
import { useWeather } from "../hooks/useWeather";
import { useFavorites } from "../hooks/useFavorites";
import { useLocationPicker } from "../hooks/useLocationPicker";

export default function Dashboard() {
  const { data, loading, error, evaluate, reset } = useWeather();
  const { favorites, loading: favLoading, addFavorite } = useFavorites();
  const { location, resolving, selectLocation, reset: resetLocation } = useLocationPicker();

  const [activity, setActivity] = useState("");
  const [customName, setCustomName] = useState("");

  const handleEvaluate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!location || !activity) return;
      await evaluate(location.lat, location.lon, activity);
    },
    [location, activity, evaluate]
  );

  const handleSelectFavorite = useCallback(
    (lat: number, lon: number, name: string) => {
      selectLocation(lat, lon);
      setCustomName(name);
      if (activity) {
        evaluate(lat, lon, activity);
      }
    },
    [activity, evaluate, selectLocation]
  );

  const handleSaveFavorite = useCallback(async () => {
    if (!location) return;
    await addFavorite({
      name: customName || location.city || `Local (${location.lat}, ${location.lon})`,
      coordinates: {
        type: "Point",
        coordinates: [location.lon, location.lat],
      },
    });
  }, [location, customName, addFavorite]);

  const canEvaluate = !!location && !!activity;

  return (
    <div className="min-h-screen bg-dark-bg">
      <NavbarAuthenticated />

      <main className="max-w-6xl mx-auto px-6 pt-24 pb-12">
        <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <form
              onSubmit={handleEvaluate}
              className="bg-surface border border-gray-700 rounded-xl p-6 space-y-4"
            >
              <h2 className="text-white font-semibold">Avaliar Condições</h2>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">
                  Selecione o local no mapa
                </label>
                <LocationPicker
                  onLocationSelect={selectLocation}
                  selectedLat={location?.lat}
                  selectedLon={location?.lon}
                />
                {location && (
                  <p className="text-gray-400 text-xs mt-2">
                    {location.city} — {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                    {resolving && " (obtendo nome do local...)"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">
                  Nome do local (opcional)
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder={location?.city || "Praia do Futuro"}
                  className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-signal/50 focus:border-green-signal"
                />
              </div>

              <SportSelector value={activity} onChange={setActivity} />

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={!canEvaluate || loading}
                  className="bg-green-signal text-dark-bg font-bold px-6 py-2.5 rounded-lg hover:bg-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Avaliando..." : "Avaliar"}
                </button>

                {data && (
                  <button
                    type="button"
                    onClick={handleSaveFavorite}
                    className="bg-surface border border-gray-600 text-gray-300 font-medium px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-all text-sm"
                  >
                    Salvar Local
                  </button>
                )}

                {data && (
                  <button
                    type="button"
                    onClick={() => { reset(); resetLocation(); }}
                    className="text-gray-500 hover:text-white transition-colors text-sm px-2"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </form>

            {error && (
              <div className="bg-red-signal/10 border border-red-signal/30 text-red-signal text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            {data && <WeatherCard data={data} />}

            {location && (
              <WeatherMap
                latitude={location.lat}
                longitude={location.lon}
                verdict={data?.verdict}
              />
            )}
          </div>

          <div className="space-y-6">
            <FavoriteLocations
              favorites={favorites}
              loading={favLoading}
              onSelect={handleSelectFavorite}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
