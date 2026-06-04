import type { SportPreference } from "../services/user.service";

interface Props {
  sport: SportPreference;
  index: number;
  onChange: (index: number, field: string, value: number) => void;
}

const fieldLabels: Record<string, string> = {
  temperatureMin: "Temp. Mín (°C)",
  temperatureMax: "Temp. Máx (°C)",
  humidityMax: "Umidade Máx (%)",
  windMax: "Vento Máx (km/h)",
  uvMax: "UV Máx",
};

export default function PreferenceForm({ sport, index, onChange }: Props) {
  return (
    <div className="bg-surface border border-gray-700 rounded-xl p-5 space-y-4">
      <h3 className="text-white font-semibold capitalize">{sport.name}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {Object.entries(fieldLabels).map(([field, label]) => (
          <div key={field}>
            <label className="block text-gray-400 text-xs mb-1">{label}</label>
            <input
              type="number"
              step="any"
              value={(sport as any)[field] ?? ""}
              onChange={(e) =>
                onChange(index, field, Number(e.target.value))
              }
              className="w-full bg-dark-bg border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-signal/50 focus:border-green-signal"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
