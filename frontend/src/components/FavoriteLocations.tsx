import type { FavoriteLocation } from "../services/location.service";

interface Props {
  favorites: FavoriteLocation[];
  loading: boolean;
  onSelect: (lat: number, lon: number, name: string) => void;
}

export default function FavoriteLocations({ favorites, loading, onSelect }: Props) {
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
          const [lon, lat] = fav.coordinates.coordinates;
          return (
            <button
              key={fav._id}
              onClick={() => onSelect(lat, lon, fav.name)}
              className="w-full text-left bg-dark-bg hover:bg-gray-700/50 rounded-lg px-3 py-2 transition-colors"
            >
              <p className="text-white text-sm font-medium">{fav.name}</p>
              {fav.city && (
                <p className="text-gray-400 text-xs">{fav.city}</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
