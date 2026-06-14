import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ACTIVITIES, SPORT_DEFAULTS, type ISportPreference } from "../types/weather";

const stepLabels = ["Conta", "Esportes", "Preferências", "Favoritos"];

const activityLabels: Record<string, string> = {
  running: "Corrida",
  cycling: "Ciclismo",
  calisthenics: "Calistenia",
  surf: "Surfe",
  kitesurf: "Kitesurfe",
};

const fieldLabels: Record<string, string> = {
  temperatureMin: "Temp. Mín (°C)",
  temperatureMax: "Temp. Máx (°C)",
  humidityMax: "Umidade Máx (%)",
  windMax: "Vento Máx (km/h)",
  uvMax: "UV Máx",
};

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [preferencesMode, setPreferencesMode] = useState<"default" | "custom">("default");
  const [customThresholds, setCustomThresholds] = useState<ISportPreference[]>([]);
  const [favoriteLocations, setFavoriteLocations] = useState<string[]>([]);
  const [locationInput, setLocationInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function toggleSport(sport: string) {
    setSelectedSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  }

  function handleThresholdChange(name: string, field: string, value: number) {
    setCustomThresholds((prev) =>
      prev.map((t) => (t.name === name ? { ...t, [field]: value } : t))
    );
  }

  function addLocation() {
    const name = locationInput.trim();
    if (name && !favoriteLocations.includes(name)) {
      setFavoriteLocations((prev) => [...prev, name]);
      setLocationInput("");
    }
  }

  function removeLocation(name: string) {
    setFavoriteLocations((prev) => prev.filter((l) => l !== name));
  }

  function canGoNext(): boolean {
    switch (step) {
      case 0:
        return !!email && !!username && password.length >= 6 && password === confirmPassword;
      case 1:
        return selectedSports.length > 0;
      case 2:
        return true;
      default:
        return true;
    }
  }

  function handleNext() {
    if (step === 0 && password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }
    setError("");

    if (step === 1) {
      setCustomThresholds(
        selectedSports.map((s) => ({
          name: s,
          ...SPORT_DEFAULTS[s],
        }))
      );
    }

    setStep((s) => Math.min(s + 1, 3));
  }

  function handleBack() {
    setError("");
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (selectedSports.length === 0) {
      setError("Selecione pelo menos um esporte");
      return;
    }

    setLoading(true);
    try {
      await register({
        email,
        username,
        password,
        sports: selectedSports,
        preferencesMode,
        customThresholds: preferencesMode === "custom" ? customThresholds : undefined,
        favoriteLocations: favoriteLocations.length > 0
          ? favoriteLocations.map((name) => ({ name }))
          : undefined,
      });
      navigate("/dashboard");
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "Erro ao cadastrar";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-1 text-center">Cadastrar-se</h1>
        <p className="text-gray-400 mb-6 text-center text-sm">Crie sua conta do SkyRunner Analytics</p>

        {/* Steps indicator */}
        <div className="flex justify-center gap-2 mb-6">
          {stepLabels.map((label, i) => (
            <div key={i} className="flex items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  i === step
                    ? "bg-green-signal text-dark-bg"
                    : i < step
                      ? "bg-green-signal/30 text-green-signal"
                      : "bg-gray-700 text-gray-500"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`text-xs hidden sm:inline ${i === step ? "text-green-signal" : "text-gray-500"}`}>
                {label}
              </span>
              {i < stepLabels.length - 1 && <span className="text-gray-600 text-xs mx-1">→</span>}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-signal/10 border border-red-signal/30 text-red-signal text-sm rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
          {/* Step 0: Account */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-1.5">Email</label>
                <input id="email" type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-signal/50 focus:border-green-signal"
                  placeholder="seu@email.com" />
              </div>
              <div>
                <label htmlFor="username" className="block text-gray-300 text-sm font-medium mb-1.5">Nome de usuário</label>
                <input id="username" type="text" required value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-signal/50 focus:border-green-signal"
                  placeholder="seunome" />
              </div>
              <div>
                <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-1.5">Senha</label>
                <input id="password" type="password" required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-signal/50 focus:border-green-signal"
                  placeholder="Mínimo 6 caracteres" />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-gray-300 text-sm font-medium mb-1.5">Confirmar senha</label>
                <input id="confirmPassword" type="password" required value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-signal/50 focus:border-green-signal"
                  placeholder="Repita a senha" />
              </div>
            </div>
          )}

          {/* Step 1: Sports */}
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-gray-400 text-sm">Quais esportes você pratica?</p>
              {ACTIVITIES.map((act) => {
                const active = selectedSports.includes(act);
                return (
                  <button key={act} type="button" onClick={() => toggleSport(act)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                      active
                        ? "bg-green-signal/10 border-green-signal text-white"
                        : "bg-surface border-gray-700 text-gray-400 hover:border-gray-600"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      active ? "border-green-signal bg-green-signal" : "border-gray-600"
                    }`}>
                      {active && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                    </div>
                    <span className="font-medium capitalize">{activityLabels[act]}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Step 2: Preferences */}
          {step === 2 && (
            <div className="space-y-5">
              <p className="text-gray-400 text-sm">Configurações de conforto climático</p>
              <div className="flex gap-2">
                <button type="button" onClick={() => setPreferencesMode("default")}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                    preferencesMode === "default"
                      ? "bg-green-signal text-dark-bg"
                      : "bg-surface border border-gray-700 text-gray-400"
                  }`}>Usar padrões</button>
                <button type="button" onClick={() => setPreferencesMode("custom")}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                    preferencesMode === "custom"
                      ? "bg-green-signal text-dark-bg"
                      : "bg-surface border border-gray-700 text-gray-400"
                  }`}>Personalizar</button>
              </div>

              {preferencesMode === "custom" && (
                <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
                  {selectedSports.map((sport) => {
                    const thresholds = customThresholds.find((t) => t.name === sport) || SPORT_DEFAULTS[sport];
                    return (
                      <div key={sport} className="bg-surface rounded-xl p-4 space-y-2">
                        <h3 className="text-white font-semibold text-sm capitalize">{activityLabels[sport]}</h3>
                        <div className="grid grid-cols-5 gap-2">
                          {Object.entries(fieldLabels).map(([field, label]) => (
                            <div key={field}>
                              <label className="block text-gray-500 text-xs mb-0.5">{label}</label>
                              <input type="number" step="any"
                                value={(thresholds as any)[field] ?? ""}
                                onChange={(e) => handleThresholdChange(sport, field, Number(e.target.value))}
                                className="w-full bg-dark-bg border border-gray-700 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-green-signal/50" />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {preferencesMode === "default" && (
                <div className="bg-surface rounded-xl p-4">
                  <p className="text-gray-400 text-sm">Serão usados valores recomendados para cada esporte.</p>
                  <div className="mt-3 space-y-2">
                    {selectedSports.map((sport) => {
                      const d = SPORT_DEFAULTS[sport];
                      return (
                        <div key={sport} className="flex justify-between text-sm">
                          <span className="text-white capitalize">{activityLabels[sport]}</span>
                          <span className="text-gray-500">{d.temperatureMin}°–{d.temperatureMax}°C · Vento ≤{d.windMax} km/h</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Favorite Places (optional) */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">Adicione locais favoritos <span className="text-gray-600">(opcional)</span></p>
              <div className="flex gap-2">
                <input type="text" value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addLocation(); } }}
                  placeholder="Digite o nome de uma cidade..."
                  className="flex-1 bg-surface border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-green-signal/50" />
                <button type="button" onClick={addLocation}
                  className="bg-gray-700 text-gray-300 px-3 py-2 rounded-lg text-sm hover:bg-gray-600 transition-colors">Adicionar</button>
              </div>
              {favoriteLocations.length > 0 && (
                <div className="space-y-2">
                  {favoriteLocations.map((name) => (
                    <div key={name} className="flex items-center justify-between bg-surface rounded-lg px-4 py-2.5">
                      <span className="text-white text-sm">{name}</span>
                      <button type="button" onClick={() => removeLocation(name)}
                        className="text-gray-500 hover:text-red-signal text-sm transition-colors">Remover</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <button type="button" onClick={handleBack}
                className="flex-1 bg-gray-700 text-gray-300 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-600 transition-all">
                Voltar
              </button>
            )}
            {step < 3 ? (
              <button type="submit" disabled={!canGoNext()}
                className={`flex-1 bg-green-signal text-dark-bg font-bold py-2.5 rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  step > 0 ? "" : "w-full"
                }`}>
                Próximo
              </button>
            ) : (
              <button type="submit" disabled={loading}
                className="flex-1 bg-green-signal text-dark-bg font-bold py-2.5 rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Cadastrando..." : "Criar Conta"}
              </button>
            )}
          </div>
        </form>

        <p className="text-gray-500 text-sm text-center mt-6">
          Já tem conta?{" "}
          <Link to="/login" className="text-green-signal hover:underline">Entrar</Link>
        </p>
        <p className="text-gray-600 text-xs text-center mt-3">
          <Link to="/" className="hover:underline">Voltar para página inicial</Link>
        </p>
      </div>
    </div>
  );
}
