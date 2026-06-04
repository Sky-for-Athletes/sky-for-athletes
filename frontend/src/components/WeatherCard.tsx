import type { WeatherEvaluation } from "../services/weather.service";

interface Props {
  data: WeatherEvaluation;
}

const verdictConfig = {
  EXCELLENT: {
    label: "Recomendado",
    bg: "bg-green-signal text-white",
    border: "border-green-signal/30",
  },
  GOOD: {
    label: "Favorável",
    bg: "bg-green-signal/80 text-white",
    border: "border-green-signal/20",
  },
  MODERATE: {
    label: "Atenção",
    bg: "bg-yellow-signal text-black",
    border: "border-yellow-signal/30",
  },
  POOR: {
    label: "Não Recomendado",
    bg: "bg-red-signal text-white",
    border: "border-red-signal/30",
  },
};

export default function WeatherCard({ data }: Props) {
  const config = verdictConfig[data.verdict];

  return (
    <div className="bg-surface border border-gray-700 rounded-xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-lg font-bold capitalize">
          {data.activity}
        </h2>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${config.bg}`}>
          {config.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Metric label="Temperatura" value={`${data.temperature.toFixed(1)}°C`} />
        <Metric label="Umidade" value={`${data.humidity.toFixed(0)}%`} />
        <Metric label="Vento" value={`${data.windSpeed.toFixed(1)} km/h`} />
        <Metric label="Heat Index" value={`${data.heatIndex.toFixed(1)}°C`} />
        <Metric label="Wind Chill" value={`${data.windChill.toFixed(1)}°C`} />
        <Metric
          label="Conforto"
          value={`${data.comfortScore}/100`}
        />
      </div>

      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div
          className="h-2.5 rounded-full transition-all"
          style={{
            width: `${data.comfortScore}%`,
            backgroundColor:
              data.comfortScore >= 60
                ? "#22c55e"
                : data.comfortScore >= 40
                ? "#eab308"
                : "#ef4444",
          }}
        />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-400 text-xs">{label}</p>
      <p className="text-white text-lg font-semibold">{value}</p>
    </div>
  );
}
