import type { FavoriteLocation } from "../services/location.service";

interface Props {
  favorites: FavoriteLocation[];
  loading: boolean;
  onSelect: (lat: number, lon: number, name: string) => void;
  onSelectRoute?: (waypoints: [number, number][], name: string) => void;
}

export default function FavoriteLocations({ favorites, loading, onSelect, onSelectRoute }: Props) {
  if (loading) {
    return (
      <div className="bg-surface border border-gray-700 rounded-xl p-4">
        <p className="text-gray-400 text-sm">Carregando favoritos...</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="bg-surface border border-gray-700 rounded-xl p-4">
        <p className="text-gray-400 text-sm">Nenhum local favorito ainda.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-gray-700 rounded-xl p-4">
      <h3 className="text-white font-semibold mb-3">Locais Favoritos</h3>
      <div className="space-y-2">
        {favorites.map((fav) => {
          const isRoute = !!fav.route && fav.route.length >= 2;

          if (isRoute) {
            return (
              <button
                key={fav._id}
                onClick={() => onSelectRoute?.(fav.route!, fav.name)}
                className="w-full text-left bg-dark-bg hover:bg-gray-700/50 rounded-lg px-3 py-2 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                    <path d="M5 19L19 5" />
                    <path d="M5 5l14 14" />
                  </svg>
                  <p className="text-white text-sm font-medium">{fav.name}</p>
                </div>
                <p className="text-gray-500 text-xs mt-0.5">
                  Rota · {fav.route!.length} pontos
                </p>
              </button>
            );
          }

          const coords = fav.coordinates?.coordinates;
          if (coords) {
            const [lon, lat] = coords;
            return (
              <button
                key={fav._id}
                onClick={() => onSelect(lat, lon, fav.name)}
                className="w-full text-left bg-dark-bg hover:bg-gray-700/50 rounded-lg px-3 py-2 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#22c55e">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  <p className="text-white text-sm font-medium">{fav.name}</p>
                </div>
                {fav.city && (
                  <p className="text-gray-400 text-xs ml-6">{fav.city}</p>
                )}
              </button>
            );
          }

          return (
            <div key={fav._id} className="bg-dark-bg rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                </svg>
                <p className="text-white text-sm font-medium">{fav.name}</p>
              </div>
              {fav.city && (
                <p className="text-gray-500 text-xs ml-6">{fav.city} <span className="text-gray-600">(sem coordenadas)</span></p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
