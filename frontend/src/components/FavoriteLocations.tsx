import type { FavoriteLocation } from "../services/location.service";

interface Props {
  favorites: FavoriteLocation[];
  loading: boolean;
  onSelect: (lat: number, lon: number, name: string) => void;
  onSelectRoute?: (waypoints: [number, number][], name: string) => void;
  onDelete?: (id: string) => void;
}

function routeDistance(route: [number, number][]): string {
  let total = 0;
  for (let i = 0; i < route.length - 1; i++) {
    const [lon1, lat1] = route[i];
    const [lon2, lat2] = route[i + 1];
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
    total += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  return total.toFixed(1) + " km";
}

export default function FavoriteLocations({ favorites, loading, onSelect, onSelectRoute, onDelete }: Props) {
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
              <div key={fav._id} className="flex items-start gap-1">
                <button
                  onClick={() => onSelectRoute?.(fav.route!, fav.name)}
                  className="flex-1 text-left bg-dark-bg hover:bg-gray-700/50 rounded-lg px-3 py-2 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                      <path d="M5 19L19 5" />
                      <path d="M5 5l14 14" />
                    </svg>
                    <p className="text-white text-sm font-medium">{fav.name}</p>
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5">
                    Rota · {fav.route!.length} pontos · {routeDistance(fav.route!)}
                  </p>
                </button>
                {onDelete && (
                  <button onClick={() => onDelete(fav._id)} className="p-2 text-gray-500 hover:text-red-signal transition-colors" title="Remover">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                )}
              </div>
            );
          }

          const coords = fav.coordinates?.coordinates;
          if (coords) {
            const [lon, lat] = coords;
            return (
              <div key={fav._id} className="flex items-start gap-1">
                <button
                  onClick={() => onSelect(lat, lon, fav.name)}
                  className="flex-1 text-left bg-dark-bg hover:bg-gray-700/50 rounded-lg px-3 py-2 transition-colors"
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
                {onDelete && (
                  <button onClick={() => onDelete(fav._id)} className="p-2 text-gray-500 hover:text-red-signal transition-colors" title="Remover">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                )}
              </div>
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
