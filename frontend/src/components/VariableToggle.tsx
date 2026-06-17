import { type VariableKey, VARIABLE_LABELS } from "../types/weather";

const variables: VariableKey[] = [
  "temperature",
  "humidity",
  "windSpeed",
  "heatIndex",
  "windChill",
  "comfortScore",
];

interface Props {
  value: VariableKey;
  onChange: (v: VariableKey) => void;
}

export default function VariableToggle({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-1">
      {variables.map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`px-2 py-1 text-xs rounded font-medium transition-all ${
            value === v
              ? "bg-green-signal text-dark-bg"
              : "bg-gray-700 text-gray-400 hover:text-white"
          }`}
        >
          {VARIABLE_LABELS[v]}
        </button>
      ))}
    </div>
  );
}
