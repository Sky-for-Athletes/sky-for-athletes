import { useState, useEffect, useCallback } from "react";
import NavbarAuthenticated from "../components/NavbarAuthenticated";
import PreferenceForm from "../components/PreferenceForm";
import * as userService from "../services/user.service";
import { ACTIVITIES } from "../types/weather";

interface SportState {
  name: string;
  temperatureMin: number;
  temperatureMax: number;
  humidityMax: number;
  windMax: number;
  uvMax: number;
}

const defaultPreferences: SportState[] = ACTIVITIES.map((act) => ({
  name: act,
  temperatureMin: 18,
  temperatureMax: 28,
  humidityMax: 80,
  windMax: 20,
  uvMax: 8,
}));

export default function Settings() {
  const [sports, setSports] = useState<SportState[]>(defaultPreferences);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        await userService.getProfile();
      } catch {
        // user may not have preferences yet
      }
    }
    load();
  }, []);

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
    } catch (err: any) {
      const msg =
        err.response?.data?.error || err.message || "Erro ao salvar";
      setMessage(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <NavbarAuthenticated />

      <main className="max-w-4xl mx-auto px-6 pt-24 pb-12">
        <h1 className="text-2xl font-bold text-white mb-6">Preferências</h1>

        <form onSubmit={handleSave} className="space-y-6">
          {sports.map((sport, i) => (
            <PreferenceForm
              key={sport.name}
              sport={sport}
              index={i}
              onChange={handleChange}
            />
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
            className="bg-green-signal text-dark-bg font-bold px-6 py-2.5 rounded-lg hover:bg-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Salvando..." : "Salvar Preferências"}
          </button>
        </form>
      </main>
    </div>
  );
}
