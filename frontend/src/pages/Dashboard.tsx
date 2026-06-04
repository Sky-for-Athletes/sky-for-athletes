import { useState, useCallback } from "react";
import NavbarAuthenticated from "../components/NavbarAuthenticated";
import SportSelector from "../components/SportSelector";
import WeatherCard from "../components/WeatherCard";
import WeatherMap from "../components/WeatherMap";
import FavoriteLocations from "../components/FavoriteLocations";
import { useWeather } from "../hooks/useWeather";
import { useFavorites } from "../hooks/useFavorites";

export default function Dashboard() {
  const { data, loading, error, evaluate, reset } = useWeather();
  const { favorites, loading: favLoading, addFavorite } = useFavorites();

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [activity, setActivity] = useState("");
  const [cityName, setCityName] = useState("");

  const handleEvaluate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!latitude || !longitude || !activity) return;
      await evaluate(Number(latitude), Number(longitude), activity);
    },
    [latitude, longitude, activity, evaluate]
  );

  const handleSelectFavorite = useCallback(
    (lat: number, lon: number, name: string) => {
      setLatitude(String(lat));
      setLongitude(String(lon));
      setCityName(name);
      if (activity) {
        evaluate(lat, lon, activity);
      }
    },
    [activity, evaluate]
  );

  const handleSaveFavorite = useCallback(async () => {
    if (!latitude || !longitude) return;
    await addFavorite({
      name: cityName || `Local (${latitude}, ${longitude})`,
      coordinates: {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)],
      },
    });
  }, [latitude, longitude, cityName, addFavorite]);

  const canEvaluate = latitude && longitude && activity;

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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-signal/50 focus:border-green-signal"
                    placeholder="-3.717"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-signal/50 focus:border-green-signal"
                    placeholder="-38.504"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">
                  Nome do local (opcional)
                </label>
                <input
                  type="text"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-signal/50 focus:border-green-signal"
                  placeholder="Praia do Futuro"
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
                    onClick={reset}
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

            {latitude && longitude && (
              <WeatherMap
                latitude={Number(latitude)}
                longitude={Number(longitude)}
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
