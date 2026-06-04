type Mode = "point" | "route";

interface Props {
  value: Mode;
  onChange: (mode: Mode) => void;
}

export default function ModeToggle({ value, onChange }: Props) {
  return (
    <div className="flex bg-surface border border-gray-700 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => onChange("point")}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors ${
          value === "point"
            ? "bg-green-signal text-dark-bg"
            : "text-gray-400 hover:text-white"
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
        Ponto
      </button>
      <button
        type="button"
        onClick={() => onChange("route")}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors ${
          value === "route"
            ? "bg-green-signal text-dark-bg"
            : "text-gray-400 hover:text-white"
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 19L19 5" />
          <path d="M5 5l14 14" />
        </svg>
        Rota
      </button>
    </div>
  );
}
