import type { GenerateReportResponse } from "../services/report.service";

interface Props {
  report: GenerateReportResponse["report"];
}

const typeLabels: Record<string, string> = {
  "weekly-report": "Relatório Semanal",
  "monthly-report": "Relatório Mensal",
  "custom-report": "Relatório Personalizado",
};

export default function ReportCard({ report }: Props) {
  return (
    <div className="bg-surface border border-gray-700 rounded-xl p-4 flex items-center justify-between">
      <div>
        <p className="text-white font-semibold">
          {typeLabels[report.type] || report.type}
        </p>
        <p className="text-gray-400 text-xs mt-1">
          {new Date(report.createdAt).toLocaleDateString("pt-BR")}
        </p>
        <p className="text-gray-500 text-xs">
          {new Date(report.metadata.periodStart).toLocaleDateString("pt-BR")} —{" "}
          {new Date(report.metadata.periodEnd).toLocaleDateString("pt-BR")}
        </p>
      </div>
      <span className="bg-green-signal/20 text-green-signal text-xs font-bold px-3 py-1 rounded-full">
        Gerado
      </span>
    </div>
  );
}
