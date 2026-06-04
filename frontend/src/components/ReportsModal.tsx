import { useState } from "react";
import * as reportService from "../services/report.service";

interface Props {
  open: boolean;
  onClose: () => void;
}

const reportTypes = [
  { value: "weekly-report", label: "Relatório Semanal" },
  { value: "monthly-report", label: "Relatório Mensal" },
  { value: "custom-report", label: "Relatório Personalizado" },
] as const;

export default function ReportsModal({ open, onClose }: Props) {
  const [type, setType] = useState<string>("weekly-report");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");
  const [reports, setReports] = useState<reportService.GenerateReportResponse["report"][]>([]);

  if (!open) return null;

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
      const msg = err.response?.data?.error || err.message || "Erro ao gerar relatório";
      setMessage(msg);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface border border-gray-700 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Relatórios</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-lg">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">Tipo</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-green-signal/50"
              >
                {reportTypes.map((rt) => (
                  <option key={rt.value} value={rt.value}>{rt.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">Data Início</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-green-signal/50"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">Data Fim</label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-green-signal/50"
                />
              </div>
            </div>

            {message && (
              <div className={`text-sm rounded-lg px-4 py-3 ${
                message.includes("sucesso")
                  ? "bg-green-signal/10 border border-green-signal/30 text-green-signal"
                  : "bg-red-signal/10 border border-red-signal/30 text-red-signal"
              }`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={generating}
              className="w-full bg-green-signal text-dark-bg font-bold py-2.5 rounded-lg hover:bg-green-500 transition-all disabled:opacity-50"
            >
              {generating ? "Gerando..." : "Gerar Relatório"}
            </button>
          </form>

          {reports.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-white font-semibold">Gerados</h3>
              {reports.map((r) => (
                <div key={r._id} className="bg-dark-bg rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <p className="text-white text-sm font-medium">{r.type}</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(r.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <span className="bg-green-signal/20 text-green-signal text-xs font-bold px-3 py-1 rounded-full">
                    Gerado
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
