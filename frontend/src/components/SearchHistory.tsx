import type { SearchHistoryItem } from "../services/location.service";

interface Props {
  history: SearchHistoryItem[];
  loading: boolean;
  onSelect: (lat: number, lon: number, city: string) => void;
}

export default function SearchHistory({ history, loading, onSelect }: Props) {
  if (loading) {
    return (
      <div className="space-y-2">
        <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider">Histórico</h3>
        <p className="text-gray-600 text-xs">Carregando...</p>
      </div>
    );
  }

  if (history.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider">Histórico</h3>
      <div className="space-y-1 max-h-40 overflow-y-auto">
        {history.slice(0, 10).map((item) => {
          const [lon, lat] = item.query.coordinates;
          const city = item.query.city || `${lat.toFixed(3)}, ${lon.toFixed(3)}`;
          const date = new Date(item.searchedAt).toLocaleDateString("pt-BR", {
            day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
          });
          return (
            <button
              key={item._id}
              type="button"
              onClick={() => onSelect(lat, lon, city)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-surface/50 hover:bg-surface text-left transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs truncate">{city}</p>
                <p className="text-gray-600 text-[10px]">{date}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
