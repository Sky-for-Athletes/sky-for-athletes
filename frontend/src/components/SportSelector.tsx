import { ACTIVITIES, type Activity } from "../types/weather";

interface Props {
  value: string;
  onChange: (activity: string) => void;
}

const activityLabels: Record<Activity, string> = {
  running: "Corrida",
  cycling: "Ciclismo",
  calisthenics: "Calistenia",
  surf: "Surf",
  kitesurf: "Kitesurf",
};

export default function SportSelector({ value, onChange }: Props) {
  return (
    <div>
      <label className="block text-gray-300 text-sm font-medium mb-1.5">
        Esporte
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-green-signal/50 focus:border-green-signal"
      >
        <option value="">Selecione um esporte</option>
        {ACTIVITIES.map((act) => (
          <option key={act} value={act}>
            {activityLabels[act]}
          </option>
        ))}
      </select>
    </div>
  );
}
