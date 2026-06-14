import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import * as userService from "../services/user.service";
import { ACTIVITIES, SPORT_DEFAULTS } from "../types/weather";

interface SportState {
  name: string;
  temperatureMin: number;
  temperatureMax: number;
  humidityMax: number;
  windMax: number;
  uvMax: number;
}

const defaultPreferences: SportState[] = ACTIVITIES.map((act) => ({
  ...SPORT_DEFAULTS[act],
}));

interface Props {
  open: boolean;
  onClose: () => void;
}

const fieldLabels: Record<string, string> = {
  temperatureMin: "Temp. Mín (°C)",
  temperatureMax: "Temp. Máx (°C)",
  humidityMax: "Umidade Máx (%)",
  windMax: "Vento Máx (km/h)",
  uvMax: "UV Máx",
};

export default function SettingsModal({ open, onClose }: Props) {
  const [sports, setSports] = useState<SportState[]>(defaultPreferences);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (open) {
      setMessage("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const handleChange = useCallback(
    (index: number, field: string, value: number) => {
      setSports((prev) =>
        prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
      );
    },
    []
  );

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await userService.updatePreferences({ sports });
      setMessage("Preferências salvas com sucesso!");
      setTimeout(onClose, 1200);
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "Erro ao salvar";
      setMessage(msg);
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-surface border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Preferências</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-2 rounded-lg transition-colors" title="Fechar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          {sports.map((sport, i) => (
            <div key={sport.name} className="bg-dark-bg rounded-xl p-4 space-y-3">
              <h3 className="text-white font-semibold capitalize">{sport.name}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {Object.entries(fieldLabels).map(([field, label]) => (
                  <div key={field}>
                    <label className="block text-gray-400 text-xs mb-1">{label}</label>
                    <input
                      type="number"
                      step="any"
                      value={(sport as any)[field] ?? ""}
                      onChange={(e) => handleChange(i, field, Number(e.target.value))}
                      className="w-full bg-surface border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-signal/50"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {message && (
            <div
              className={`text-sm rounded-lg px-4 py-3 ${
                message.includes("sucesso")
                  ? "bg-green-signal/10 border border-green-signal/30 text-green-signal"
                  : "bg-red-signal/10 border border-red-signal/30 text-red-signal"
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-green-signal text-dark-bg font-bold py-2.5 rounded-lg hover:bg-green-500 transition-all disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar Preferências"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
