import { useState } from "react";
import NavbarAuthenticated from "../components/NavbarAuthenticated";
import ReportCard from "../components/ReportCard";
import * as reportService from "../services/report.service";

const reportTypes = [
  { value: "weekly-report", label: "Relatório Semanal" },
  { value: "monthly-report", label: "Relatório Mensal" },
  { value: "custom-report", label: "Relatório Personalizado" },
] as const;

export default function Reports() {
  const [type, setType] = useState<string>("weekly-report");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");
  const [reports, setReports] = useState<reportService.GenerateReportResponse["report"][]>([]);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setGenerating(true);
    setMessage("");
    try {
      const data = await reportService.generateReport({
        type: type as any,
        periodStart: startDate,
        periodEnd: endDate,
      });
      setReports((prev) => [data.report, ...prev]);
      setMessage("Relatório gerado com sucesso!");
    } catch (err: any) {
      const msg =
        err.response?.data?.error || err.message || "Erro ao gerar relatório";
      setMessage(msg);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <NavbarAuthenticated />

      <main className="max-w-4xl mx-auto px-6 pt-24 pb-12">
        <h1 className="text-2xl font-bold text-white mb-6">Relatórios</h1>

        <form
          onSubmit={handleGenerate}
          className="bg-surface border border-gray-700 rounded-xl p-6 space-y-4 mb-8"
        >
          <h2 className="text-white font-semibold">Gerar Novo Relatório</h2>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1.5">
              Tipo
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-green-signal/50 focus:border-green-signal"
            >
              {reportTypes.map((rt) => (
                <option key={rt.value} value={rt.value}>
                  {rt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">
                Data Início
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-green-signal/50 focus:border-green-signal"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">
                Data Fim
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-green-signal/50 focus:border-green-signal"
              />
            </div>
          </div>

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
            disabled={generating}
            className="bg-green-signal text-dark-bg font-bold px-6 py-2.5 rounded-lg hover:bg-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? "Gerando..." : "Gerar Relatório"}
          </button>
        </form>

        {reports.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-white font-semibold">Relatórios Gerados</h2>
            {reports.map((r) => (
              <ReportCard key={r._id} report={r} />
            ))}
          </div>
        )}

        {reports.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-8">
            Nenhum relatório gerado ainda.
          </p>
        )}
      </main>
    </div>
  );
}
